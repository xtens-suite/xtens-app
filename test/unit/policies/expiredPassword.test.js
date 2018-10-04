/* jshint node: true */
/* jshint mocha: true */
/* globals _, sails, fixtures, TokenService */
"use strict";
const sinon = require('sinon');
const _chai = require('chai');
const expect = require("chai").expect;
const request = require('supertest');
const loginHelper = require('../controllers/loginHelper');

describe('Policy expiredPassword', function() {

    let expiredPassword;
    let chai = _chai;
    let res ={unauthorized:function (){return 0;}};
    let spyUnauth = sinon.spy(res,'unauthorized');
    let spy = sinon.spy();

    before(function(done) {

        expiredPassword = global.sails.hooks.policies.middleware.expiredpassword;
        done();
    });

    afterEach(function(done) {
        spyUnauth.reset();
        done();
    });

    describe('When the policy is invoked', function() {

        it('Should pass at next () and not call res forbidden', function (done) {

            let payload = {
                "id":7,
                "groups":[1],
                "lastPswdUpdate": new Date(),
                "resetPswd": false,
                "isWheel":true,
                "isAdmin":true,
                "adminGroups":[],
                "canAccessPersonalData":true,
                "canAccessSensitiveData":true
            };
            let token = TokenService.issue(_.isObject(payload) ? JSON.stringify(payload) : payload); // modified by Massi


            let headers= {
                authorization: "Bearer " + token
            };
            let req={headers, canTest: true};

            expiredPassword(req, res, spy);

            expect(spy.calledOnce).to.be.true;
            done();
            return;
        });

        it('Should call res.forbidden, user is not a SuperUserShould pass at next () and not call res forbidden, user password is expired', function (done) {
            let payload = {
                "id":7,
                "groups":[1],
                "lastPswdUpdate":"2015-09-14T11:18:19.892Z",
                "resetPswd":false,
                "isWheel":true,
                "isAdmin":true,
                "adminGroups":[],
                "canAccessPersonalData":true,
                "canAccessSensitiveData":true
            };
            let token = TokenService.issue(_.isObject(payload) ? JSON.stringify(payload) : payload); // modified by Massi


            let headers= {
                authorization: "Bearer " + token
            };
            let req={headers, canTest: true};

            expiredPassword(req, res, spy);

            expect(spyUnauth.calledOnce).to.be.true;
            done();
            return;
        });

        it('Should call res.forbidden, user is not a SuperUserShould pass at next () and not call res forbidden, password Reset', function (done) {
            let payload = {
                "id":7,
                "groups":[1],
                "lastPswdUpdate": new Date(),
                "resetPswd": true,
                "isWheel":true,
                "isAdmin":true,
                "adminGroups":[],
                "canAccessPersonalData":true,
                "canAccessSensitiveData":true
            };
            let token = TokenService.issue(_.isObject(payload) ? JSON.stringify(payload) : payload); // modified by Massi


            let headers= {
                authorization: "Bearer " + token
            };
            let req={headers, canTest: true};

            expiredPassword(req, res, spy);

            expect(spyUnauth.calledOnce).to.be.true;
            done();
            return;
        });
    });

});
