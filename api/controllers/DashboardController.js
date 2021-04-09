/**
* DashboardController
*
* @description :: Server-side logic for managing Dashboard graphs
* @help        :: See http://links.sailsjs.org/docs/controllers
*/
/* jshint node: true */
/* globals _, sails, DataType, DataTypeService, TokenService, Group, Project, SuperTypeService */
"use strict";
const ControllerOut = require("xtens-utils").ControllerOut; const ValidationError = require('xtens-utils').Errors.ValidationError;
const PrivilegesError = require('xtens-utils').Errors.PrivilegesError;
const crudManager = sails.hooks.persistence.crudManager;
const DbLog = sails.hooks.dblog.log;
const logMessages = sails.hooks.dblog.messages;
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const BluebirdPromise = require('bluebird');

const coroutines = {
        getDataForDashboard: BluebirdPromise.coroutine(function * (req, res, co) {
        const projectId = req.param('projectId');
        // if (!projectId) {
        //     return co.badRequest({message: 'Missing dataType ID on getDataForDashboard request'});
        // }
        const operator = TokenService.getToken(req);
        let adminGroups = yield Group.find(operator.adminGroups).populate('projects');
        const adminProjects = _.uniq(_.flatten(_.map(_.flatten(_.map(adminGroups, 'projects')), 'id')));

        if (!operator.isWheel && !_.find(adminProjects, function (p) { return p === _.parseInt(projectId); })) {
            throw new PrivilegesError('User has not privilege as Admin on this project');
        }
        const results = yield crudManager.getCountsForDashboard(projectId);
        var params = {};
        if (projectId) {
            params = { project: projectId };
        }
        const dataTypeSource = yield DataType.find(params).populate(['superType', 'parents']);
        results.DataTypeSource = dataTypeSource;
        return res.json(results);
    }),

    getInfoForBarChartDatediff: BluebirdPromise.coroutine(function * (req, res) {
        const fromModel = req.param('fromModel');
        const fromDataTypeId = req.param('fromDataType');
        const fromFieldName = req.param('fromFieldName');
        const fromHasSample = req.param('fromHasSample');
        const toModel = req.param('toModel');
        const toDataTypeId = req.param('toDataType');
        const toFieldName = req.param('toFieldName');
        const toHasSample = req.param('toHasSample');
        const period = req.param('period');
        // const operator = TokenService.getToken(req);      
        const results = yield crudManager.getInfoForBarChartDatediff(
            fromModel, fromDataTypeId, fromFieldName, fromHasSample, 
            toModel, toDataTypeId, toFieldName, toHasSample,
            period);

        return res.json(results);
    }),

    getInfoForBarChart: BluebirdPromise.coroutine(function * (req, res) {
        const dataTypeId = req.param('dataType');
        let fieldName = req.param('fieldName');
        const model = req.param('model');
        const period = req.param('period');

        if (!fieldName) {
            fieldName = "created_at";
        }
        // const operator = TokenService.getToken(req);

        const results = yield crudManager.getInfoForBarChart(dataTypeId, fieldName, model, period);

        return res.json(results);
    })
};

const DashboardController = {
    /**
    * GET /dashboard/getDataForDashboard
    *
    * @method
    * @name getDataForDashboard
    * @description Find dataTypes based on criteria
    */
     getDataForDashboard: function (req, res) {
        const co = new ControllerOut(res);
        coroutines.getDataForDashboard(req, res, co)
            .catch(/* istanbul ignore next */ function (err) {
                sails.log.error(err);
                return co.error(err);
            });
    },

    /**
    * GET /dashboard/getInfoForBarChart
    *
    * @method
    * @name getInfoForBarChart
    * @description Find dataTypes based on criteria
    */
    getInfoForBarChart: function (req, res) {
        const co = new ControllerOut(res);
        coroutines.getInfoForBarChart(req, res, co)
            .catch(/* istanbul ignore next */ function (err) {
                sails.log.error(err);
                return co.error(err);
            });
    },

    /**
    * GET /dashboard/getInfoForBarChartDatediff
    *
    * @method
    * @name getInfoForBarChartDatediff
    * @description Find dates interval based on dataTypes
    */
     getInfoForBarChartDatediff: function (req, res) {
        const co = new ControllerOut(res);
        coroutines.getInfoForBarChartDatediff(req, res, co)
            .catch(/* istanbul ignore next */ function (err) {
                sails.log.error(err);
                return co.error(err);
            });
    }
};

module.exports = DashboardController;