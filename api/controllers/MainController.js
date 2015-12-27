/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
/* jshint esnext: true */
/* jshint node: true */
/* globals _, sails, Data, DataFile, DataService, SubjectService, SampleService, QueryService, TokenService, MigrateService, GeneratedDataService */
"use strict";
let BluebirdPromise = require("bluebird");
let fileSystemManager = BluebirdPromise.promisifyAll(sails.config.xtens.fileSystemManager);
let ControllerOut = require("xtens-utils").ControllerOut;
let execFileAsync = BluebirdPromise.promisify(require("child_process").execFile);
let execAsync = BluebirdPromise.promisify(require("child_process").exec);
let DEFAULT_LOCAL_STORAGE = sails.config.xtens.constants.DEFAULT_LOCAL_STORAGE;

// ES6 Map for customised data management
let customisedDataMap = new Map();
customisedDataMap.set('CGH', '../migrate-utils/createCGH.js');

let MainController = {

    /**
     * @method
     * @name getFileSystemManager
     * @description retrieve the FileSystem coordinates for the client
     */
    getFileSystemStrategy: function(req, res) {
        let conn = sails.config.xtens.fileSystemConnection;
        return res.json(conn);
    },

    /**
     * @method
     * @name downloadFileContent
     * @description download a file from the remote file system
     * @param{integer} - id: the file unique ID
     * TODO move to another controller (?)
     */
    downloadFileContent: function(req, res) {

        let co = new ControllerOut(res);
        let fileId = _.parseInt(req.param('id'));

        DataFile.findOne(fileId).then(function(dataFile) {

            console.log("downloadFileContent - dataFile");
            console.log(dataFile);

            let pathFrags = dataFile.uri.split("/");
            let fileName = pathFrags[pathFrags.length-1];

            // set response headers for file download 
            res.setHeader('Content-Disposition', 'attachment;filename='+fileName);

            return fileSystemManager.downloadFileContentAsync(dataFile.uri, res);

        })
        .then(function() {
            return res.ok(); // res.json() ??
        })
        .catch(function(err) {
            return co.error(err);
        });

    },

    /**
     * @method
     * @name uploadFileContent
     * @description upload a file to the local server storage
     * TODO move to another controller (?)
     */
    uploadFileContent: function(req, res) {

        let dirName, fileName, path = sails.config.xtens.fileSystemConnection.path,
        landingDir = sails.config.xtens.fileSystemConnection.landingDirectory;


        // if the local-fs strategy is not in use, don't allow local file upload
        if (fileSystemManager.type && fileSystemManager.type !== 'local-fs') {
            return res.badRequest('Files cannot be uploaded on server local file system.');
        }

        // if path exists use local fs connection, otherwise use default local storage connection
        dirName = path ? require('path').resolve(path, landingDir) : require('path').resolve(DEFAULT_LOCAL_STORAGE, 'tmp');


        fileName = req.param("fileName") || 'uploaded-file';
        console.log("MainController.uploadFileContent - dirname: " + dirName);
        console.log("MainController.uploadFileContent - filename: " + fileName);
        req.file('uploadFile').upload({
            dirname: dirName,
            saveAs: fileName
        },function whenDone(err, files) {
            if (err) {
                console.log(err);
                return res.negotiate(err);
            }

            if (files.length === 0) {
                return res.badRequest('No file was uploaded');
            }
            console.log("MainController.uploadFileContent - file uploaded: " + files[0]);

            return res.json({
                name: files[0]
            });
        });
    },

    /**
     * @method
     * @test
     * TODO remove this one! Only for testing data population
     */
    populateDB: function(req,res) {
        let num = _.isNaN(_.parseInt(req.param("num"))) ? 1 : num;
        GeneratedDataService.generateAll(1)

        .then(function(result) {
            console.log("MainController.populateDB: created Patients: " + result);
            return res.json(result);
        })

        .catch(function(err) {
            console.log("MainController.populateDB - error caught: " + err.message);
            return res.serverError(err.message);
        });
    },

    /**
     * @method
     * @name migrate
     * TODO remove this one! Only for testing data population
     */
    migrate: function(req, res) {
        console.log(req.allParams());
        let subject = _.parseInt(req.param("idSubj"));
        MigrateService.execute(subject)
        .then(function() {
            return res.ok("Done!");
        })
        .catch(function(err) {
            return res.serverError(err.details || err.message);
        });
    },

    /**
     * @method
     * @name migrateCGH
     * TODO remove this one
     */
    migrateCGH: function(req, res) {
        MigrateService.migrateCGHAsync()
        .then(function() {
            return res.ok();
        })
        .catch(function(err) {
            return res.serverError(err.message);
        });
    },

    /**
     * @method
     * @name excuteCustomDataMangement
     */
    executeCustomDataManagement: function(req, res) {

        let co = new ControllerOut(res);
        let key = req.param('dataType');
        /*
           return execFileAsync(customisedDataMap.get(key))

           .then(function(result) {
           if (result) {
           let cmd = 'rm ' + DEFAULT_LOCAL_STORAGE + '/tmp/*';
           console.log(cmd);
           return execAsync(cmd);
           }
           else
           throw new Error("Some error occurred while storing one or more files, please check log files...");

           })
           .then(function() {
           return res.ok();
           }) 
           .catch(function(err) {
           return co.error(err);
           }); */
        console.log("MainController.executeCustomDataManagement - executing customised function");
        require("child_process").execFile(customisedDataMap.get(key), function(err, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (err) {
                return co.error(err);
            }
            else {
                let cmd = 'rm ' + DEFAULT_LOCAL_STORAGE + '/tmp/*';
                console.log("MainController.executeCustomDataManagement - cmd: " + cmd);
                require("child_process").exec(cmd, function(err, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (err) {
                        return co.error(err);
                    }
                    console.log("MainController.executeCustomDataManagement - all went fine!");
                    return res.ok();
                });
            }
        });

    }

};

module.exports = MainController;

