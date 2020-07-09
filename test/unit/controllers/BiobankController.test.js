/* jshint node: true */
/* jshint mocha: true */
/* globals _, sails, fixtures, Passport */
"use strict";

const expect = require("chai").expect;
const request = require('supertest');
const loginHelper = require('./loginHelper');

describe('BiobankController', function() {

    let token;
    before(function(done) {
        loginHelper.loginAnotherStandardUser(request, function (bearerToken) {
            token = bearerToken;
            sails.log.debug(`Got token: ${token}`);
            done();
            return;
        });

    });

    describe('GET /biobanks', function() {
        it('Should return OK 200 with the tright list of biobanks associated with the project', function(done) {
            const projectId = _.cloneDeep(fixtures.project[0]).id;
            const expectedBiobanksId =  _.map(_.cloneDeep(fixtures.biobank), 'id');


            request(sails.hooks.http.app)
            .get('/biobank')
            .set('Authorization', `Bearer ${token}`)
            .send({
                project: projectId
            })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    sails.log.error(err);
                    done(err);
                    return;
                }
                expect(res.body.length).to.eql(expectedBiobanksId.length);
                expect(_.map(res.body,'id')).to.eql(expectedBiobanksId);

                done();
                return;
            });
        });
    });
});
