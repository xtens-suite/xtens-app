/**
 * Data.js
 *
 * @author      :: Massimiliano Izzo
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var Data = {

    attributes: {
        // type one-way association to DataType
        type: {
            model: 'dataType'
            // required: true
        },
        date: {
            type: 'string',
            date: true,
            columnName: 'acquisition_date'
        },
        tags: {
            type: 'json',
            columnName: 'tags',
            array: true
        },
        notes: {
            type: 'text',
            columnName: 'notes'
        },
        metadata: {
            type: 'json',
            required: true,
            columnName: 'metadata'
        },
        // associated data files
        files: {
            collection: 'dataFile',
            via: 'data',
            dominant: true
        },
        // if the parent is a patient
        parentSubject: {
            collection:'subject',
            via: 'childrenData'
        },
        // if the "parent" is a sample
        parentSample: {
            collection:'sample',
            via: 'childrenData'
        },
        // if the "parent" is a generic data
        parentData: {
            collection:'data',
            via: 'childrenData'
        },

        childrenData: {
            collection:'data',
            via: 'parentData'
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
module.exports = Data;
