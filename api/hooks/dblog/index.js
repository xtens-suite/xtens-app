"use strict";
const winston = require('winston');
const Postgres = require('winston-postgres').Postgres;
const connection = require('./../../../config/local.js').connections.dblog;
const DeepDiff = require('deep-diff');
const BluebirdPromise = require('bluebird');
const coroutines = {
    log: BluebirdPromise.coroutine(function*(message, model, data, owner, type, executor, obj) {
        const logger = sails.hooks.dblog.logger;
        if (!message) {
            return;
        }
        let messageToSend;
        let objToSend = {};

        switch (message) {
            case 'create': {
                messageToSend = message;
                if(model === "DataType"){
                    objToSend = {
                        model: model,
                        dataType: data,
                        project: owner,
                        superType: type,
                        executor: executor
                    };
                }else {
                    objToSend = {
                        model: model,
                        data: data,
                        owner: owner,
                        type: type,
                        executor: executor
                    };
                }

            }
                break;
            case 'delete': {
                messageToSend = message;
                if(model === "DataType"){
                    objToSend = {
                        model: model,
                        dataType: data,
                        project: owner,
                        superType: type,
                        executor: executor,
                        deletedData: obj.deletedData ? obj.deletedData : "{}"
                    };
                }else {
                    objToSend = {
                        model: model,
                        data: data,
                        owner: owner,
                        type: type,
                        executor: executor,
                        deletedData: obj.deletedData ? obj.deletedData : "{}"
                    };
                }
            }
                break;
            case 'find_one': {
                messageToSend = message;
                objToSend = {
                    model: model,
                    data: data,
                    owner: owner,
                    type: type,
                    executor: executor
                };
            }
                break;
            case 'find': {
                messageToSend = message;
                objToSend = {
                    model: model,
                    data: data,
                    owner: owner,
                    type: type,
                    executor: executor
                };
            }
                break;
            case 'download': {
                messageToSend = message;
                objToSend = {
                    model: model,
                    data: data,
                    owner: owner,
                    type: type,
                    executor: executor,
                    file: obj.file ? obj.file : null
                };
            }
                break;
            case 'update': {
                messageToSend = message;
                let updates = null;
                if (obj.prevData && obj.upData) {
                    updates = DeepDiff(obj.prevData, obj.upData);
                }
                if(model === "DataType"){
                    objToSend = {
                        model: model,
                        dataType: data,
                        project: owner,
                        superType: type,
                        executor: executor,
                        updatedData: updates ? JSON.stringify(updates) : "{}"
                    };
                }else {

                    objToSend = {
                        model: model,
                        data: data,
                        owner: owner,
                        type: type,
                        executor: executor,
                        updatedData: updates ? JSON.stringify(updates) : "{}"
                    };
                }
            }
                break;
            case 'query': {
                messageToSend = message;
                objToSend = {
                    model: model,
                    dataType: data,
                    project: owner,
                    superType: type,
                    executor: executor,
                    queryObj: obj.queryObj ? obj.queryObj : null
                };
            }
                break;
            default:
        }

        if(messageToSend)
            logger.dbstore(messageToSend, objToSend);

    })
};

function dblog(sails) {

    this.myCustomLevels = null;
    this.logger = null;
    this.connString = null;
    this.messages = null;
    this.log = null;
    return {

        defaults: {

        },

        configure: function() {

            if (connection) {
                this.myCustomLevels = {
                    levels: {
                        error: 0,
                        warn: 1,
                        info: 2,
                        verbose: 3,
                        dbstore: 4,
                        debug: 5,
                        silly: 6
                    }
                };

                this.messages = {
                    DEFAULT: 'operation',
                    CREATE: 'create',
                    DELETE: 'delete',
                    FINDONE: 'find_one',
                    FIND: 'find',
                    DOWNLOAD: 'download',
                    UPDATE: 'update',
                    QUERY: 'query'
                };

                this.connString = this.getLogdbConnectionString(connection);
                var that = this;
                this.logger = new(winston.Logger)({
                    levels: this.myCustomLevels.levels,
                    transports: [
                        new(Postgres)({
                            level: 'dbstore',
                            ssl: false, // are you sure you want to do this?
                            timestamp: true,
                            connectionString: this.connString, //'postgres://admin:admin@localhost:5432/api',
                            tableName: connection.tableName,
                            ignoreMessage: function(level, message, metadata) {
                                if (level !== 'dbstore' || !metadata || message === that.messages.DEFAULT) {
                                    return true;
                                }
                                return false;
                            }
                        })
                    ]
                });

            }
        },

        getLogdbConnectionString: function(connObj) {
            if (!connObj || !connObj.user || !connObj.password || !connObj.host || !connObj.port || !connObj.tableName || !connObj.database) {
                return false;
            }
            return "postgres://" + connObj.user + ":" + connObj.password + "@" + connObj.host + ":" + connObj.port + "/" + connObj.database;
        },

    /**
     * @method
     * @name log
     * @param{string} type of message to be stored
     * @param{string} data model string
     * @param{intArray} Array or single data id
     * @param{int} owner id
     * @param{intArray} Array or single data type
     * @param{int} executor id
     * @param{int} object data
     * @description build and save a log to Postgres Db
     * @return {void}
     */
        log: function(message, model, data, owner, type, executor, obj) {
            return coroutines.log(message, model, data, owner, type, executor, obj)
        .catch( /* istanbul ignore next */ function(err) {
            sails.log.error(err);
            return err;
        });
        }

    };

}

module.exports = dblog;
