/**
* OperatorController
*
* @description :: Server-side logic for managing operators
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

/* jshint node: true */
/* globals _, sails, TokenService,  PassportService */
'use strict';

const ControllerOut = require('xtens-utils').ControllerOut;
const BluebirdPromise = require('bluebird');
const createUser = BluebirdPromise.promisify(PassportService.protocols.local.createUser);
const updatePassword = BluebirdPromise.promisify(PassportService.protocols.local.updatePassword);
const resetPassword = BluebirdPromise.promisify(PassportService.protocols.local.resetPassword);

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
     * @name patchPassword
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

    }
};

module.exports = OperatorController;
