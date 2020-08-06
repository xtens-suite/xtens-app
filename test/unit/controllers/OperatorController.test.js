
/* jshint node: true */
/* jshint mocha: true */
/* globals _, sails, fixtures */
"use strict";

const expect = require("chai").expect;
const sinon = require("sinon");
const request = require('supertest');
const loginHelper = require('./loginHelper');
const BluebirdPromise = require("bluebird");
const PrivilegesError = require('xtens-utils').Errors.PrivilegesError;
const ValidationError = require('xtens-utils').Errors.ValidationError;

describe('OperatorController', function() {
    let tokenS, tokenSA, tokenRP ;

    before(function(done) {
        loginHelper.loginSuperAdmin(request, function (bearerToken) {
            tokenSA = bearerToken;
            sails.log.debug(`Got token: ${tokenSA}`);


            loginHelper.loginStandardUser(request, function (bearerToken) {
                tokenS = bearerToken;
                sails.log.debug(`Got token: ${tokenS}`);

                loginHelper.loginResetPswdUser(request, function (bearerToken) {
                    tokenS = bearerToken;
                    sails.log.debug(`Got token: ${tokenRP}`);
                    done();
                    return;
                });
            });
        });
    });

    describe('POST /operator', function() {
        it('Should return OK 201', function(done) {
            let expectedOperator = {
                firstName: 'new Operator',
                lastName: 'Operator',
                sex: 'M',
                email: 'operator@domain.com',
                login: 'newoperator'
            };
            request(sails.hooks.http.app)
            .post('/operator')
            .set('Authorization', `Bearer ${tokenSA}`)
            .send({
                firstName: 'new Operator',
                lastName: 'Operator',
                birthDate: '1900-01-01',
                sex: 'M',
                email: 'operator@domain.com',
                login: 'newoperator',
                password: 'Pswdoperator1234!'
            })
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    sails.log.error(expectedOperator);
                    done(err);
                    return;

                }
                let resOperator = res.body;
                expect(resOperator.firstName).to.eql(expectedOperator.firstName);
                expect(resOperator.lastName).to.eql(expectedOperator.lastName);
                expect(resOperator.sex).to.eql(expectedOperator.sex);
                expect(resOperator.email).to.eql(expectedOperator.email);
                expect(resOperator.login).to.eql(expectedOperator.login);
                done();
                return;
            });

        });

        // it('Should return 400, Wrong Model', function(done) {
        //
        //     request(sails.hooks.http.app)
        //     .post('/operator')
        //     .set('Authorization', `Bearer ${tokenSA}`)
        //     .send({
        //         type: 3,
        //         metadata: {},
        //         date: "2015-12-06",
        //         tags: [],
        //         notes: "New operator"
        //     })
        //     .expect(400);
        //     done();
        //     return;
        //
        // });
    });

    describe('PATCH /operator', function() {

        it('Should return 204 No Content, Password Updated', function(done) {

            const demouser = fixtures.operator[2];
            const passport = _.find(fixtures.passport, {
                'user': demouser.id,
                'protocol': 'local'});

            console.log(demouser,passport);

            request(sails.hooks.http.app)
            .patch('/operator')
            // .set('Authorization', `Bearer ${tokenS}`)
            .send({
                username: demouser.login,
                oldPass: passport.password,
                newPass: "NewPassword1234!",
                cnewPass: "NewPassword1234!"
            })
            .expect(204)
            .end(function(err, res) {
                expect(res.body).to.be.empty;
                if (err) {
                    sails.log.error(err);
                    done(err);
                    return;
                }
                done();
                return;
            });
        });
        it('Should return 400 bad Request, Old Password and New Password can not match', function(done) {
            const expectedMessage = 'New Password and Old Password cannot be the same';
            const demouser = fixtures.operator[2];
            const passport = _.find(fixtures.passport, {
                'user': demouser.id,
                'protocol': 'local'});
            console.log(passport);
            request(sails.hooks.http.app)
            .patch('/operator')
            // .set('Authorization', `Bearer ${tokenS}`)
            .send({
                username: demouser.login,
                oldPass: passport.password,
                newPass: passport.password,
                cnewPass: passport.password
            })
            .expect(400)
            .end(function(err, res) {
                expect(res).to.be.error;
                expect(res.body.error.message).to.eql(expectedMessage);

                if (err) {
                    sails.log.error(err);
                    done(err);
                    return;
                }
                done();
                return;
            });
        });

        it('Should return 400 bad Request, Old Password  Wrong', function(done) {

            const expectedMessage = 'Old Password does not match';
            const demouser = fixtures.operator[2];

            request(sails.hooks.http.app)
            .patch('/operator')
            // .set('Authorization', `Bearer ${tokenS}`)
            .send({
                username: demouser.login,
                oldPass: "WrongOldPass",
                newPass: "NewPassword1!",
                cnewPass: "NewPassword1!"
            })
            .expect(400)
            .end(function(err, res) {
                // console.log(res.body);
                expect(res).to.be.error;
                expect(res.body.error.message).to.eql(expectedMessage);

                if (err) {
                    sails.log.error(err);
                    done(err);
                    return;
                }
                done();
                return;
            });
        });

        it('Should return 400 bad Request, New Password and Confirm Confirm New Password do not match', function(done) {

            const expectedMessage = 'New Passwords do not match';
            const demouser = fixtures.operator[2];
            const passport = _.find(fixtures.passport, {
                'user': demouser.id,
                'protocol': 'local'});

            request(sails.hooks.http.app)
            .patch('/operator')
            // .set('Authorization', `Bearer ${tokenS}`)
            .send({
                username: demouser.login,
                oldPass: passport.password,
                newPass: "NewPassword1!",
                cnewPass: "OtherNewPassword1!"
            })
            .expect(400).end(function(err, res) {
                // console.log(res.body);
                expect(res).to.be.error;
                expect(res.body.error.message).to.eql(expectedMessage);

                if (err) {
                    sails.log.error(err);
                    done(err);
                    return;
                }
                done();
                return;
            });
        });
    });

    describe('PATCH /operator/resetPassword', function() {

        // let spyResetPswd;
        //
        // beforeEach(function(done) {
        //     let resetPassword = BluebirdPromise.promisify(global.sails.services.passportservice.protocols.local.resetPassword);
        //     spyResetPswd = sinon.spy(resetPassword);
        //
        //     done();
        // });
        //
        // afterEach(function(done) {
        //     // spyResetPswd.reset();
        //     done();
        // });


        it('Should return OK 200, call resetPassword function with right arguments, and return a new password', function(done) {
            const demouser = fixtures.operator[8];

            request(sails.hooks.http.app)
            .patch('/operator/resetPassword')
            .set('Authorization', `Bearer ${tokenSA}`)
            .send({
                username: demouser.login
            })
            .expect(201)
            .end(function(err, res) {
                if (err) {
                    sails.log.error(err);
                    done(err);
                    return;
                }
                console.log(err,res.body);
                // expect(spyResetPswd.called).to.be.true;
                expect(res.body).to.have.lengthOf(8);

                done();
                return;
            });

        });
    });

    describe('PATCH /operator/patchQueries', function() {

        // let spyPatchQueries;

        // beforeEach(function(done) {
        //     // let PatchQueries = BluebirdPromise.promisify(global.sails.services.passportservice.protocols.local.patchQueries);
        //     spyPatchQueries = sinon.spy(PatchQueries);
        //
        //     done();
        // });
        //
        // afterEach(function(done) {
        //     // spyPatchQueries.reset();
        //     done();
        // });


        it('Should return OK 200 and the operator with the expected queries array', function(done) {
            let user = fixtures.operator[8];
            let expectedQueries = "[{name:'QUERY TEST',project:1,query:'select * from data where type = 1'}]";
            user.queries = expectedQueries;
            request(sails.hooks.http.app)
            .patch('/operator/patchQueries')
            .set('Authorization', `Bearer ${tokenSA}`)
            .send(user)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    sails.log.error(err);
                    done(err);
                    return;
                }

                expect(res.body.queries).to.eql(expectedQueries);

                done();
                return;
            });

        });

        it('Should return ERROR 403, Authenticated user is not allowed to modify operator', function(done) {
            let user = fixtures.operator[0];
            let expectedError = new PrivilegesError("Authenticated user is not allowed to modify operator");

            request(sails.hooks.http.app)
            .patch('/operator/patchQueries')
            .set('Authorization', `Bearer ${tokenS}`)
            .send(user)
            .expect(403)
            .end(function(err, res) {
                if (err) {

                    expect(err).to.eql(expectedError);
                    done();
                    return;
                }

                done();
                return;
            });

        });

        it('Should return ERROR, Queries array object not found', function(done) {
            let user = fixtures.operator[2];
            let expectedError = new ValidationError("Queries array object not found");

            request(sails.hooks.http.app)
            .patch('/operator/patchQueries')
            .set('Authorization', `Bearer ${tokenSA}`)
            .send(user)
            .end(function(err, res) {
                if (err) {
                    expect(err).to.eql(expectedError);
                    done();
                    return;
                }

                done();
                return;
            });

        });
    });



});
