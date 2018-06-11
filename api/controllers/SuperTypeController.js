/**
* SuperTypeController
*
* @description :: Server-side logic for managing supertypes
* @help        :: See http://links.sailsjs.org/docs/controllers
*/
/* jshint node: true */
/* globals _, sails, SuperType, SuperTypeService, TokenService, Group, Project */
"use strict";

const ControllerOut = require("xtens-utils").ControllerOut, ValidationError = require('xtens-utils').Errors.ValidationError;
const PrivilegesError = require('xtens-utils').Errors.PrivilegesError;
const crudManager = sails.hooks.persistence.crudManager;
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const BluebirdPromise = require('bluebird');

const coroutines = {

    getMeta: BluebirdPromise.coroutine(function *(req, res) {
        const operator = TokenService.getToken(req);
        const params = req.allParams();
        console.log(`SuperTypeController.getMeta - Params: ${JSON.stringify(params)}`);
        const isMultiProject = yield SuperTypeService.isMultiProject(params.id);
        console.log(`SuperTypeController.getMeta - isMultiProject: ${isMultiProject}`);
        return res.json({
            isMultiProject: isMultiProject
        });
    })

};



const SuperTypeController = {

    getMeta: function(req, res) {
        const co = new ControllerOut(res);
        coroutines.getMeta(req, res)
        .catch(err => {
            sails.log.error(err);
            return co.error(err);
        });
    }


};

module.exports = SuperTypeController;
