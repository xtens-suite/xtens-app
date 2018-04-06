/**
 * Sample.js
 * @author      :: Massimiliano Izzo
 * @description :: This is the SAILS model describing a sample stored within a Biobank
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        biobankCode: {
            type: 'string',
            columnName: 'biobank_code',
            required: true
        },

        type: {
            model: 'dataType',
            columnName: 'type'
        },

        biobank: {
            model: 'biobank'
        },

        donor: {
            collection:'subject',
            via: 'samples'
        },

        childrenSample: {
            collection:'sample',
            via: 'parentSample'
        },
        // if the "parent" is a sample
        parentSample: {
            collection:'sample',
            via: 'childrenSample'
        },

        childrenData: {
            collection:'data',
            via: 'parentSample'
        },

        metadata: {
            type: 'json',
            required: true
        },

        tags: {
            type: 'json'
        },

        notes: {
            type: 'text'
        },

        // many-to-many association to files
        files: {
            collection: 'dataFile',
            via: 'samples',
            dominant: true
        },

        owner: {
            model: 'operator',
            columnName: 'owner'
        },

        createdAt: {
            type: 'datetime',
            columnName: 'created_at'
        },

        updatedAt: {
            type: 'datetime',
            columnName: 'updated_at'
        }

    }
};
