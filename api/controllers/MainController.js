/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
/* jshint esnext: true */
/* jshint node: true */
/* globals _, sails, DataType, TokenService */
"use strict";

const path = require('path');
const BluebirdPromise = require('bluebird');
const request = BluebirdPromise.promisifyAll(require("request"));
const phenotipsConnParams = global.sails.config.connections.phenotips;
const ControllerOut = require("xtens-utils").ControllerOut;
const DEFAULT_LOCAL_STORAGE = sails.config.xtens.constants.DEFAULT_LOCAL_STORAGE;

const MainController = {

    /**
     *  GET /getPhenotipsPatient
     *  @method
     *  @name getPhenotipsPatient
     *  @description -> get specific of Phenotips Patient by id
     *
     */
    getPhenotipsPatient: function (req, res) {
        const id = req.param('id');
        const co = new ControllerOut(res);
        // var limitParam = '?start=0&number=' + limitPhenotipsPatients;
        request.get(phenotipsConnParams.url + "/" + id,
            {
                'auth': {
                    'user': phenotipsConnParams.username,
                    'pass': phenotipsConnParams.password,
                    'sendImmediately': true
                }
            }, (error, resp, body) => {
                if (error) {
                    sails.log.error("MainController.getPhenotipsPatient: " + error.message);
                    return co.error(error);
                }
                if (resp.statusCode === 404) {
                    return res.json({});
                }
                body = JSON.parse(body);
                return res.json(body);
            });
    },

    /**
     *  GET /getPhenotipsPatientsList
     *  @method
     *  @name getPhenotipsPatientsList
     *  @description -> get list of Phenotips Patients
     *
     */
    getPhenotipsPatientsList: function (req, res) {
        const co = new ControllerOut(res);
        var limitParam = '?start=0&number=' + phenotipsConnParams.limit;
        request.get(phenotipsConnParams.url + limitParam,
            {
                'auth': {
                    'user': phenotipsConnParams.username,
                    'pass': phenotipsConnParams.password,
                    'sendImmediately': true
                }
            }, (error, resp, body) => {
                if (error) {
                    sails.log.error("MainController.getPhenotipsPatientsList: " + error.message);
                    return co.error(error);
                }

                if (resp.statusCode === 404) {
                    return res.json({});
                }

                body = JSON.parse(body);
                // console.log(body.patientSummaries);
                return res.json(body.patientSummaries.map(p => p.id));
                // console.log(body.explanation);
            });
    },

    /**
     * @method
     * @name getFileSystemManager
     * @description retrieve the FileSystem coordinates for the client
     */
    getFileSystemStrategy: function (req, res) {
        let conn = sails.hooks['persistence'].getFileSystem().defaultConnection;
        return res.json(conn);
    },

    /**
     * @method
     * @name getAppUI
     * @description ships the index.html file
     */
    getAppUI: function (req, res) {
        return res.sendfile(path.resolve(__dirname, '..', '..', 'assets', 'bundles', 'index.html'));
    },

    /**
     * @method
     * @name excuteCustomDataMangement
     */
    executeCustomDataManagement: function (req, res) {
        let error = "";
        let co = new ControllerOut(res);
        let key = req.param('dataType');
        let superType = req.param('superType');
        let idProject = req.param('idProject');
        let folder = req.param('folder');
        let vcfData = req.param('vcfData');
        let ngsPatData = req.param('ngsPatData');
        let deafultOwner = req.param('owner');
        const operator = TokenService.getToken(req);
        let obj = { bearerToken: req.headers.authorization.split(' ')[1], idProject: idProject };
        // let summary = {};
        if (key === 'NGSAN') {
            obj.reWritePath = vcfData.reWritePath;
        }

        return DataType.findOne({ superType: superType, project: idProject }).populate('parents').then((dataType) => {
            if (dataType) {
                let parentSubjectDt = _.find(dataType.parents, { model: 'Subject' });
                obj.dataTypeId = dataType.id;
                obj.parentSubjectDtId = parentSubjectDt ? parentSubjectDt.id : null;
            }
            folder = obj.folder = folder && folder != null && folder != "undefined" ? folder : undefined;
            obj.owner = deafultOwner || operator.id;
            obj.executor = operator.id;
            obj.vcfData = vcfData;
            obj.ngsPatData = ngsPatData;
            sails.log("MainController.executeCustomDataManagement - executing customised function");
            const ps = require("child_process").spawn(sails.config.xtens.customisedDataMap.get(key), [JSON.stringify(obj)], { stdio: ['ipc'] });

            // ps.stdout.on('data', (data) => {
            //     console.log(data.toString());
            //     sails.log(`stdout: ${data}`);
            // });

            ps.stderr.on('data', (data) => {
                sails.log(`stderr: ${data}`);
                console.log(data.toString());
                error += data.toString();
            });

            ps.on('message', (results) => {
                sails.log(`results: ${results}`);
                if (results.error && !error) {
                    error = results.error;
                }
                // results.error && !error ?  : results;
            });

            ps.on('close', (code) => {
                sails.log(`child process exited with code ${code}`);
                let lastFolder = folder ? folder + '/' : '*';
                let command = lastFolder ? 'rm -rf ' : 'rm ';
                let cmd = command + DEFAULT_LOCAL_STORAGE + '/tmp/' + lastFolder;
                require("child_process").exec(cmd, function (err, stdout, stderr) {
                    console.log(err);
                    if ((code !== 0 && error)) {
                        sails.log('stderr: ' + stderr);
                        // return co.error(error);
                    }
                    sails.log('stdout: ' + stdout);
                    sails.log("MainController.executeCustomDataManagement - all went fine!");
                    // return res.json(summary);
                });
            });
            return res.json(obj);
        });
    }

};

module.exports = MainController;
