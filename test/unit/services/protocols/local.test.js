/* jshint node: true */
/* jshint mocha: true */
/* globals _, sails, fixtures, Passport, PassportService */
"use strict";
const sinon = require("sinon");
const expect = require("chai").expect;
const request = require('supertest');
const loginHelper = require("../../controllers/loginHelper");
const ValidationError = require('xtens-utils').Errors.ValidationError;
const BluebirdPromise = require('bluebird');


describe("PassportService protocol Local", function() {

    let token;
    let passport;
    before(function(done) {
        loginHelper.loginStandardUser(request, function (bearerToken) {
            token = bearerToken;
            sails.log.debug(`Got token: ${token}`);
            done();
            return;
        });

    });

    describe("#register", function() {
        it("should fire the connect function", function(done) {

            const spycreateUser = sinon.spy(PassportService.protocols.local,"createUser");
            const operator = _.cloneDeep(fixtures.operator[0]);
            operator.password = "TestPassword1!";
            PassportService.protocols.local.register(operator,function (err,res) {

                if(err){
                    sails.log.error(err);
                    done(err);
                    return;
                }
                sinon.assert.calledWith(spycreateUser,operator);
                spycreateUser.restore();
                done();
                return;
            });
        });
    });

    describe("#createUser", function() {

        it("should create a new operator with a new passport", function(done) {
            const operators = _.cloneDeep(fixtures.operator);
            var expectedId = operators.length;
            const _user ={
                "sex": "N.A.",
                "email": "createuser@createuser.com",
                "login": "createuser",
                "firstName": "default createuser",
                "lastName": "createuser",
                "birthDate": "1970-01-01T00:00:00.000Z",
                "password": "Password1!"
            };
            PassportService.protocols.local.createUser(_user,function (err,operator) {
                console.log(operator);
                if(err){
                    sails.log.error(err);
                    done(err);
                }
                Passport.findOne({user: operator.id}).then(function (passport) {
                    expect(passport.user).to.eql(operator.id);
                    expect(operator.id).to.eql(expectedId + 2);
                    expect(operator.password).to.not.exist;
                });
                done();
                return;
            });
        });

        it("should return ERROR - Error.Passport.Email.Exists", function(done) {
            var expectedErr = new Error('Error.Passport.Email.Exists');
            const _user ={
                "sex": "N.A.",
                "login": "createuser",
                "firstName": "default createuser",
                "lastName": "createuser",
                "birthDate": "1970-01-01T00:00:00.000Z",
                "password": "Password1!"
            };
            PassportService.protocols.local.createUser(_user,function (err,operator) {

                expect(err).to.be.an('error');
                expect(err).to.eql(expectedErr);
                expect(operator).to.be.undefined;
                done();
                return;
            });
        });

        it("should return ERROR - Error.Passport.User.Exists", function(done) {
            var expectedErr = new Error('Error.Passport.User.Exists');
            const _user ={
                "sex": "N.A.",
                "email": "createuser@createuser.com",
                "firstName": "default createuser",
                "lastName": "createuser",
                "birthDate": "1970-01-01T00:00:00.000Z",
                "password": "Password1!"
            };
            PassportService.protocols.local.createUser(_user,function (err,operator) {

                expect(err).to.be.an('error');
                expect(err).to.eql(expectedErr);
                expect(operator).to.be.undefined;
                done();
                return;
            });
        });

        it("should return ERROR - Error.Passport.Password.Invalid", function(done) {
            var expectedErr = new ValidationError('The password does not meet the minimum security requirements. It must contain at least one lower case character, an uppercase character, a number, a special character (!@#$%^&*) and be at least 8 characters long');
            const _user ={
                "sex": "N.A.",
                "email": "createuser@createuser.com",
                "login": "createuser",
                "firstName": "default createuser",
                "lastName": "createuser",
                "birthDate": "1970-01-01T00:00:00.000Z",
                "password": "pswd"
            };
            PassportService.protocols.local.createUser(_user,function (err,operator) {
                expect(err).to.be.an('error');
                expect(err).to.eql(expectedErr);
                expect(operator).to.be.undefined;
                done();
                return;
            });
        });
    });

    describe("#connect", function() {

        it("should return the right user", function(done) {

            const _user ={
                "sex": "N.A.",
                "email": "createuser@createuser.com",
                "login": "createuser",
                "id":7,
                "firstName": "default createuser",
                "lastName": "createuser",
                "birthDate": "1970-01-01T00:00:00.000Z"
            };
            let req = {
                    baseUrl: 'http:/localhost:80',
                    path: '/path',
                    user: _user,
                    params: {
                        password: "Password1!"
                    },
                    headers:{},
                    param: function(par) {
                        return this.params[par];
                    }
                },
                res ={};
            PassportService.protocols.local.connect(req,res,function (err,operator) {

                if(err){
                    sails.log.error(err);
                    done(err);
                }
                expect(operator.id).to.eql(_user.id);
                expect(operator.password).to.not.exist;
                done();
                return;
            });
        });

        it("should return an empty user", function(done) {

            let req = {
                    baseUrl: 'http:/localhost:80',
                    path: '/path',
                    user: {},
                    params: {
                        password: "Password1!"
                    },
                    headers:{},
                    param: function(par) {
                        return this.params[par];
                    }
                },
                res ={};
            PassportService.protocols.local.connect(req,res,function (err,operator) {
                if(err){
                    sails.log.error(err);
                    done(err);
                }
                expect(operator).to.eql({});
                done();
                return;
            });
        });
    });

    describe("#login", function() {

        it("should return the right user logged", function(done) {
            const operator = _.cloneDeep(fixtures.operator[0]);
            const passport = _.cloneDeep(_.find(fixtures.passport,function (ps) {
                return ps.id === operator.id;
            }));
            const identifier = operator.email;
            const password = passport.password;
            const req = {};
            PassportService.protocols.local.login(req,identifier,password,function (err,res) {

                if(err){
                    sails.log.error(err);
                    done(err);
                }
                expect(res.user.id).to.eql(operator.id);
                done();
                return;
            });
        });

        it("should return ERROR - Error.Passport.Email.NotFound", function(done) {
            const operator = _.cloneDeep(fixtures.operator[0]);
            const passport = _.cloneDeep(_.find(fixtures.passport,function (ps) {
                return ps.id === operator.id;
            }));
            const identifier = "wrong@email.it";
            const password = passport.password;
            const req = {};
            let expectedError = new ValidationError('Error.Passport.Email.NotFound');
            expectedError.code = 401;
            PassportService.protocols.local.login(req,identifier,password,function (err,res) {

                expect(err).to.be.an('error');
                expect(err).to.eql(expectedError);
                done();
                return;
            });
        });

        it("should return ERROR - Error.Passport.Username.NotFound", function(done) {
            const operator = _.cloneDeep(fixtures.operator[0]);
            const passport = _.cloneDeep(_.find(fixtures.passport,function (ps) {
                return ps.id === operator.id;
            }));
            const identifier = "wrong_user";
            const password = passport.password;
            const req = {};
            let expectedError = new ValidationError('Error.Passport.Username.NotFound');
            expectedError.code = 401;
            PassportService.protocols.local.login(req,identifier,password,function (err,res) {

                expect(err).to.be.an('error');
                expect(err).to.eql(expectedError);
                done();
                return;
            });
        });

        it("should return ERROR - User Authentication Failed", function(done) {
            const operator = _.cloneDeep(fixtures.operator[0]);
            const passport = _.cloneDeep(_.find(fixtures.passport,function (ps) {
                return ps.id === operator.id;
            }));
            const identifier = operator.email;
            const password = "wrong_password";
            const req = {};
            let expectedError = new ValidationError('User Authentication Failed');
            expectedError.code = 401;
            PassportService.protocols.local.login(req,identifier,password,function (err,res) {

                expect(err).to.be.an('error');
                expect(err).to.eql(expectedError);
                done();
                return;
            });
        });
    });

    describe("#updatePassword", function() {


        var spyFindPassp, spyValPassw, spyUpPassp, expectedError;

        beforeEach(function() {
            spyFindPassp = sinon.spy(Passport,'findOne');
            spyUpPassp = sinon.spy(Passport,'update');
        });

        afterEach(function() {
            Passport.findOne.restore();
            Passport.update.restore();
        });
        it("Should fire Passport.findOne with the correct input parameters", function(done) {

            const demouser =fixtures.operator[0];
            const passportlocal = _.find(fixtures.passport, {
                'user': demouser.id,
                'protocol': 'local'});
            const param ={
                username: demouser.login,
                oldPass: passportlocal.password,
                newPass: "NewPassword1!",
                cnewPass: "NewPassword1!"
            };
            const expectedParam={
                protocol: 'local',
                user: demouser.id};

            // passport.password = param.newPass;

            PassportService.protocols.local.updatePassword(param,function (err,res) {
                if(err){
                    console.log(err);
                    done(err);
                    return;
                }
                console.log("Password updated: " + res);
                sinon.assert.calledWith(spyFindPassp, expectedParam);
                expect(spyFindPassp.called).to.be.true;
                expect(spyUpPassp.called).to.be.true;
                done();
                return;
            });


        });

        it("Should return Validation ERROR - New Password and Old Password cannot be the same", function(done) {

            const demouser =fixtures.operator[0];
            const param ={
                username: demouser.login,
                oldPass: "samepassword",
                newPass: "samepassword",
                cnewPass: "samepassword"
            };
            const expectedError = new ValidationError('New Password and Old Password cannot be the same');

            PassportService.protocols.local.updatePassword(param, function (err,res) {

                expect(err).to.eql(expectedError);
                expect(spyFindPassp.called).to.be.false;
                expect(spyUpPassp.called).to.be.false;
                done();
                return;
            });
        });

        it("Should return Validation ERROR - New Passwords do not match", function(done) {

            const demouser =fixtures.operator[0];
            const passportlocal = _.find(fixtures.passport, {
                'user': demouser.id,
                'protocol': 'local'});
            const param ={
                username: demouser.login,
                oldPass: passportlocal.password,
                newPass: "NewPassword1!",
                cnewPass: "OtherNewPassword"
            };
            const expectedError = new ValidationError('New Passwords do not match');

            PassportService.protocols.local.updatePassword(param, function (err,res) {

                expect(err).to.eql(expectedError);
                expect(spyFindPassp.called).to.be.false;
                expect(spyUpPassp.called).to.be.false;
                done();
                return;
            });
        });

        it("Should return Validation ERROR - Old Password does not match", function(done) {

            const demouser =fixtures.operator[0];
            const passportlocal = _.find(fixtures.passport, {
                'user': demouser.id,
                'protocol': 'local'});
            const param ={
                username: demouser.login,
                oldPass: "wrongPassword",
                newPass: "NewPassword1!",
                cnewPass: "NewPassword1!"
            };
            const expectedError = new ValidationError('Old Password does not match');

            PassportService.protocols.local.updatePassword(param, function (err,res) {

                expect(err).to.eql(expectedError);
                expect(spyFindPassp.called).to.be.true;
                expect(spyUpPassp.called).to.be.false;
                done();
                return;
            });
        });
    });
});
