/**
* OperatorController
*
* @description :: Server-side logic for managing operators
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

/* jshint node: true */
/* globals _, sails, TokenService,  PassportService, Operator, Group  */
'use strict';

const ControllerOut = require('xtens-utils').ControllerOut;
const PrivilegesError = require('xtens-utils').Errors.PrivilegesError;
const ValidationError = require('xtens-utils').Errors.PrivilegesError;
const BluebirdPromise = require('bluebird');
const createUser = BluebirdPromise.promisify(PassportService.protocols.local.createUser);
const updatePassword = BluebirdPromise.promisify(PassportService.protocols.local.updatePassword);
const resetPassword = BluebirdPromise.promisify(PassportService.protocols.local.resetPassword);
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const DbLog = sails.hooks.dblog.log;
const logMessages = sails.hooks.dblog.messages;

const coroutines = {

    update: BluebirdPromise.coroutine(function *(req, res) {
        let params = req.allParams();
        const operator = TokenService.getToken(req);

        let groups = yield Group.find(operator.groups);
        let privilegeLevelGroups = _.uniq(_.flatten(_.map(groups, 'privilegeLevel')));
        if(_.indexOf(privilegeLevelGroups, 'wheel') < 0 && operator.id != params.id){
            throw new PrivilegesError(`Authenticated user has not edit privileges on the operator ${params.id}`);
        }
        let query = Operator.findOne(params.id);
        query = actionUtil.populateRequest(query, req);
        let prevData = yield BluebirdPromise.resolve(query);

        const updatedData = yield Operator.update({id: params.id}, params);

        let qUpdate = Operator.findOne(params.id);
        qUpdate = actionUtil.populateRequest(qUpdate, req);
        let upData = yield BluebirdPromise.resolve(qUpdate);

        DbLog(logMessages.UPDATE, 'Operator', updatedData.id, null, null, operator.id, {prevData: prevData, upData: upData});
        return res.json(upData);
    }),

    patchQueries: BluebirdPromise.coroutine(function *(req, res) {
        let params = req.allParams();
        const operator = TokenService.getToken(req);

        if (operator.id != params.id && !operator.isWheel) {
            throw new PrivilegesError("Authenticated user is not allowed to modify operator");
        }

        if (!params.queries) {
            throw new ValidationError("Queries array object not found");
        }

        // let query = Operator.findOne(params.id);
        // query = actionUtil.populateRequest(query, req);
        // let prevData = yield BluebirdPromise.resolve(query);

        const updatedData = yield Operator.update({id: params.id}, {queries: params.queries});

        let qUpdate = Operator.findOne(params.id);
        qUpdate = actionUtil.populateRequest(qUpdate, req);
        let upData = yield BluebirdPromise.resolve(qUpdate);

        return res.json(upData);
    })

};

var OperatorController = {

    create: function(req, res) {
        const co = new ControllerOut(res);
        sails.log(req.allParams());
        return createUser(req.allParams())

        .then(function(operator) {

            // set a password field (for Backbone)
            operator.password = true;

            sails.log(operator);
            return res.json(201, operator);

        }).catch(/* istanbul ignore next */ function(error) {
            sails.log(error.message);
            return co.error(error);
        });

    },

    /**
     *  PUT /operator/:id
     *  @method
     *  @name update
     *  @description  -> update an existing Operator Instance; transaction-safe implementation
     *
     */
    update: function(req, res) {
        const co = new ControllerOut(res);
        coroutines.update(req, res, co)
          .catch(function(error) {
              sails.log.error(error);
              return co.error(error);
          });
    },

    /**
     * @method
     * @name patchPassword
     * @description given a correct old password and a new password (with confirmation)
     *              updates the local stored password
     */
    patchPassword: function(req, res) {
        const co = new ControllerOut(res);

        return updatePassword(req.allParams())

            .then(function() {
                return res.json(204, null);
            }).catch(/* istanbul ignore next */ function(error) {
                sails.log(error.message);
                return co.error(error);
            });

    },

    /**
     * @method
     * @name resetPassword
     * @description given a correct old password and a new password (with confirmation)
     *              updates the local stored password
     */
    resetPassword: function(req, res) {
        const co = new ControllerOut(res);
        return resetPassword(req.allParams())
            .then(function(result) {
                return res.json(201, result);
            }).catch(/* istanbul ignore next */ function(error) {
                sails.log(error.message);
                return co.error(error);
            });

    },

    /**
     * @method
     * @name patchQueries
     * @description given a correct old password and a new password (with confirmation)
     *              updates the local stored password
     */
    patchQueries: function(req, res) {
        const co = new ControllerOut(res);

        return coroutines.patchQueries(req, res)
        .catch(function(error) {
            sails.log.error(error);
            return co.error(error);
        });

    }
};

module.exports = OperatorController;
