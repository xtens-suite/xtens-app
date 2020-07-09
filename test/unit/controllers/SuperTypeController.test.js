/* jshint node: true */
/* jshint mocha: true */
/* globals , sails, fixtures */
"use strict";

const expect = require("chai").expect;
const request = require('supertest');
const loginHelper = require('./loginHelper');
const sinon = require('sinon');

describe("SuperTypeController", function() {
    let adminToken, userToken;

    before(function (done) {
        loginHelper.loginAdminUser(request, function (bearerToken) {
            adminToken = bearerToken;
            sails.log.debug(`Got tokenA: ${adminToken}`);

            loginHelper.loginAnotherStandardUserNoDataSens(request, function (bearerToken2) {
                userToken = bearerToken2;
                sails.log.debug(`Got token: ${userToken}`);
                done();
                return;
            });
        });
    });

    describe('GET /superType/meta', function() {
        it('Should return the isMultiProject boolean field in the body', function (done) {
            request(sails.hooks.http.app).get('/superType/meta/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        sails.log.error(err);
                        done(err);
                        return;
                    }
                    expect(res.body.isMultiProject).to.be.false;
                    done();
                });
        });

        it('Should return 403 FORBIDDEN', function (done) {
            request(sails.hooks.http.app).get('/superType/meta/1')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403)
                .end(done);
        });
    });

});
