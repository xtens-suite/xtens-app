/* jshint node: true */
/* jshint mocha: true */
/* globals _, sails, fixtures */
"use strict";
const sinon = require('sinon');
const expect = require("chai").expect;
const request = require('supertest');
const loginHelper = require('../controllers/loginHelper');

describe('Policy isAdmin', function() {

    let tokenSA,tokenA, isAdmin;

    var res ={forbidden:function (){return 0;}};
    var spyForb = sinon.spy(res,'forbidden');
    var spy = sinon.spy();

    before(function(done) {

        loginHelper.loginAdminUser(request, function (bearerToken) {
            tokenSA = bearerToken;
            sails.log.debug(`Got token: ${tokenSA}`);
        });

        loginHelper.loginAnotherStandardUser (request, function (bearerToken) {
            tokenA = bearerToken;
            sails.log.debug(`Got token: ${tokenA}`);
            done();
        });

        isAdmin = global.sails.hooks.policies.middleware.isadmin;
    });

    describe('When the policy is invoked', function(done) {
        it('Should pass at next () and not call res forbidden, user is an Admin', function () {

            let headers= {
                authorization: 'Bearer ' + tokenSA
            };
            var req={headers};

            isAdmin(req, res, spy);

            expect(spy.calledOnce).to.be.true;
            expect(spyForb.calledOnce).to.be.false;


        });

        it('Should call res.forbidden, user is not an Admin', function () {

            let headers= {
                authorization: 'Bearer ' + tokenA
            };

            var req={headers};

            isAdmin(req, res, spy);

            expect(spyForb.calledOnce).to.be.true;
        });
    });

});
