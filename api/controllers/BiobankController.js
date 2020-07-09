/**
 * BiobankController
 *
 * @description :: Server-side logic for managing biobanks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 /* jshint node: true */
 /* globals _, sails, Biobank, BiobankService, GroupService, BiobankService, TokenService, Group */


"use strict";

const BluebirdPromise = require('bluebird');
const ControllerOut = require("xtens-utils").ControllerOut;
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const __ = require('lodash');

const coroutines = {

    find: BluebirdPromise.coroutine(function *(req, res) {
        let project = req.param('project');
        const operator = TokenService.getToken(req);
        const result = yield BiobankService.getBiobanksByProject(project);
        // sails.log.info(result);
        res.json(result);
    })
};


module.exports = {


  /**
   * @method
   * @name find
   * @description retrieve an array of biobanks
   */

    find: function(req, res) {
        const co = new ControllerOut(res);
        coroutines.find(req, res)
            .catch(/* istanbul ignore next */ function(err) {
                sails.log.error(err);
                return co.error(err);
            });

    }
};
