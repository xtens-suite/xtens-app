/* jshint node:true */
/* jshint mocha: true */
/* globals _, sails, fixtures, BiobankService */
"use strict";
var chai = require("chai");
var expect = chai.expect;

describe('BiobankService', function() {

    describe('#get', function() {

        it("should return all biobanks", function(done) {
            var expectedBiobanks = _.cloneDeep(fixtures.biobank);
            var params = {};
            BiobankService.get(params, (err, res) =>{
                expect(res.length).to.eql(expectedBiobanks.length);
                expect(res[0].id).to.eql(expectedBiobanks[0].id);
                done();
                return;
            });
        });

        it("should return the right biobank", function(done) {
            var expectedBiobank = _.cloneDeep(fixtures.biobank[1]);
            var params = {idBiobanks:"2"};
            BiobankService.get(params, (err, res) =>{
                expect(res.length).to.eql(1);
                expect(res[0].id).to.eql(expectedBiobank.id);
                done();
                return;
            });
        });

    });

    describe('#getBiobanksToEditProject', function() {

        it("should return all biobanks not yet associated with specified project", function(done) {
            let projectId = 4;
            let expectedBiobanks = [_.cloneDeep(fixtures.biobank[1])];
            BiobankService.getBiobanksToEditProject(projectId).then((res, err) =>{

                if (err) {
                    done(err);
                    return;
                }
                expect(res.length).to.eql(expectedBiobanks.length);
                expect(res[0].id).to.eql(expectedBiobanks[0].id);
                done();
                return;
            });
        });

    });

    describe('#getBiobanksByProject', function() {

        it("should return all biobanks associated with specified project", function(done) {
            let projectId = 3;
            let expectedBiobanks = _.cloneDeep(fixtures.biobank);
            BiobankService.getBiobanksByProject(projectId).then((res, err) =>{

                if (err) {
                    done(err);
                    return;
                }
                expect(res.length).to.eql(expectedBiobanks.length);
                expect(_.map(res, 'id')).to.eql(_.map(expectedBiobanks, 'id'));
                done();
                return;
            });
        });

        it("should return all biobanks associated with project Id set to null", function(done) {
            let projectId = null;
            let expectedBiobanks = _.cloneDeep(fixtures.biobank);
            BiobankService.getBiobanksByProject(projectId).then((res, err) =>{

                if (err) {
                    done(err);
                    return;
                }
                expect(res.length).to.eql(expectedBiobanks.length);
                expect(_.map(res, 'id')).to.eql(_.map(expectedBiobanks, 'id'));
                done();
                return;
            });
        });

    });

});
