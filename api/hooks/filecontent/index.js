/* jshint esnext: true */
/* jshint node: true */
/* globals _, sails, DataFile, DataTypeService, TokenService */
"use strict";

// lib/hooks/myhook.js
module.exports = function filecontent (sails) {
    // private methods and variables
    let BluebirdPromise = require("bluebird");
    let path = require("path");
    let ControllerOut = require("xtens-utils").ControllerOut;
    const xtensConf = global.sails.config.xtens;
    const PrivilegesError = require('xtens-utils').Errors.PrivilegesError;
    let DEFAULT_LOCAL_STORAGE = xtensConf.constants.DEFAULT_LOCAL_STORAGE;
    const DOWNLOAD = xtensConf.constants.DataTypePrivilegeLevels.DOWNLOAD;
    const EDIT = xtensConf.constants.DataTypePrivilegeLevels.EDIT;

    return {
        defaults: {

        },

        fileSystem: null,

        upload: null,

        downlaod: null,

        configure: function () {
            this.download = function downloadFileContent (req, res) {
                let dataFile, idDataType;
                let co = new ControllerOut(res);
                let fileId = _.parseInt(req.param('id'));
                let fileSystem = BluebirdPromise.promisifyAll(sails.hooks['persistence'].getFileSystem().manager);
                const operator = TokenService.getToken(req);

                DataFile.findOne(fileId).populate('data').populate('samples').then(result => {
                    dataFile = result;
                    dataFile.data[0] ? idDataType = dataFile.data[0].type
                        : dataFile.samples[0] ? idDataType = dataFile.samples[0].type : undefined;
                    return DataTypeService.getDataTypePrivilegeLevel(operator.groups, idDataType);
                })
                    .then(dataTypePrivilege => {
                        if (!dataTypePrivilege || (dataTypePrivilege.privilegeLevel !== DOWNLOAD && dataTypePrivilege.privilegeLevel !== EDIT)) {
                            throw new PrivilegesError(`Authenticated user has not download privileges on the data type ${dataFile.data.id}`);
                        }

                        sails.log.info("downloadFileContent - dataFile");
                        sails.log.info(dataFile);

                        let pathFrags = dataFile.uri.split("/");
                        let fileName = pathFrags[pathFrags.length - 1];

                        // set response headers for file download
                        res.setHeader('Content-Disposition', `attachment;filename=${fileName}`);

                        return fileSystem.downloadFileContentAsync(dataFile.uri, res);
                    })
                    .then(() => {
                        return res.ok(); // res.json() ??
                    })
                    .catch(/* istanbul ignore next */ function (err) {
                        return co.error(err);
                    });
            };

            this.deleteFile = function deleteFileContent (req, res) {
                let dataFile; let idDataType; let toDelete = false;
                let co = new ControllerOut(res);
                let fileId = _.parseInt(req.param('file'));
                let idData = _.parseInt(req.param('id'));
                let fileSystem = BluebirdPromise.promisifyAll(sails.hooks['persistence'].getFileSystem().manager);
                const operator = TokenService.getToken(req);

                DataFile.findOne(fileId).populate('data').populate('samples').then(result => {
                    dataFile = result;
                    let model = "Data";
                    if (dataFile.data[0]) {
                        idDataType = dataFile.data[0].type;
                        dataFile.data = _.filter(dataFile.data, (d) => { return d.id != idData; });
                    } else if (dataFile.samples[0]) {
                        idDataType = dataFile.samples[0].type;
                        dataFile.samples = _.filter(dataFile.samples, (d) => { return d.id != idData; });
                        model = "Sample";
                    }
                    // check if the file has other associations, if not it can be deleted
                    if (model === "Data" && dataFile.data.length == 0 && dataFile.data.length == 0) {
                        toDelete = true;
                    } else if (model === "Sample" && dataFile.samples.length == 0 && dataFile.samples.length == 0) {
                        toDelete = true;
                    }

                    return DataTypeService.getDataTypePrivilegeLevel(operator.groups, idDataType);
                })
                    .then(dataTypePrivilege => {
                        if (!dataTypePrivilege || dataTypePrivilege.privilegeLevel !== EDIT) {
                            throw new PrivilegesError(`Authenticated user has not edit privileges on the data type ${idData}`);
                        }

                        sails.log.info("deleteFileContent - dataFile");
                        sails.log.info(dataFile);

                        let pathFrags = dataFile.uri.split("/");
                        let fileName = pathFrags[pathFrags.length - 1];

                        // set response headers for file delete
                        res.setHeader('Content-Disposition', `attachment;filename=${fileName}`);

                        return fileSystem.deleteFileContentAsync(dataFile.uri);
                    })
                    .then(() => {
                        DataFile.update(dataFile.id, { data: dataFile.data, samples: dataFile.samples }).then(() => {
                            if (toDelete) {
                                DataFile.destroy(dataFile.id).then(() => {
                                    return res.status(204).send(); // res.json() ??
                                });
                            } else {
                                return res.status(204).send(); // res.json() ??
                            }
                        });
                    })
                    .catch(/* istanbul ignore next */ function (err) {
                        return co.error(err);
                    });
            };

            this.upload = function uploadFileContent (req, res) {
                let dirName; let fsPath = sails.hooks['persistence'].getFileSystem().defaultConnection.path;
                let landingDir = sails.hooks['persistence'].getFileSystem().defaultConnection.landingDirectory;
                // if the local-fs strategy is not in use, don't allow local file upload
                // if (this.fileSystemManager.type && this.fileSystemManager.type !== 'local-fs') {
                //     return res.badRequest('Files cannot be uploaded on server local file system.');
                // }

                // if path exists use local fs connection, otherwise use default local storage connection
                dirName = fsPath ? path.resolve(fsPath, landingDir) : path.resolve(DEFAULT_LOCAL_STORAGE, 'tmp');
                let folder = req.param('folder');
                dirName = folder ? dirName + '/' + folder : dirName;
                // fileName = req.param("fileName") || req.param('filename') || 'uploaded-file';
                sails.log.info("filecontent.uploadFileContent - dirname: " + dirName);
                // sails.log.info("filecontent.uploadFileContent - filename: " + fileName);
                req.file('uploadFile').upload({
                    maxBytes: 2048000000,
                    dirname: dirName,
                    saveAs: function (__newFileStream, cb) {
                        sails.log.debug(__newFileStream);
                        sails.log.debug(__newFileStream.filename);
                        cb(null, path.basename(__newFileStream.filename));
                    }
                }, function whenDone (err, files) {
                    /* istanbul ignore if */
                    if (err) {
                        sails.log.error(err);
                        return res.negotiate(err);
                    }

                    if (files.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }
                    sails.log.info("filecontent.uploadFileContent - file uploaded: " + files[0]);

                    return res.json({
                        name: files[0],
                        folder: folder || undefined
                    });
                });
            };
        },

        //  optional route: attribute to set functionality
        //  before and after controller action
        // route: {
        //     before: {
        //         '/routeA': function(req,res,next) {
        //  // execute for route /route BEFORE
        //  // executing the controller action
        //         }
        //     },
        //     after: {
        //         '/*': function(req, res, next) {
        //  // execute for ALL routes AFTER
        //  // executing the controller action
        //  // e.g. set some 'res' parameters
        //         }
        //     }
        // },

        // initialize is not required, but if included
        // it must return cb();
        initialize: function (cb) {
            let upload = this.upload;
            let download = this.download;
            let deleteFile = this.deleteFile;
            let routePath = '/fileContent';

            sails.after('hook:persistence:loaded', function () {
                let fileSystem = BluebirdPromise.promisifyAll(sails.hooks['persistence'].getFileSystem());
                // sails.log.info(fileSystem.defaultConnection.type);

                // if (fileSystem.manager.type && this.fileSystem.manager.type !== 'local-fs') {
                // if (fileSystem.defaultConnection.type && fileSystem.defaultConnection.type === 'local-fs') {
                //     return cb();
                // }
                sails.on('router:before', function () {
                    sails.router.bind(routePath, upload, 'POST', {});
                    sails.router.bind(routePath, download, 'GET', {});
                    sails.router.bind(routePath, deleteFile, 'DELETE', {});

                    sails.emit('hook:filecontent:done');
                });
            });
            return cb();
        }
    };
};
