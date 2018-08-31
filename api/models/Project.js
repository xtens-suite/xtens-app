/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        name: {
            type: 'string',
            unique: true
        },

        description: {
            type: 'string'
        },

        dataTypes: {
            collection: 'dataType',
            via: 'project'
        },

        groups:{
            collection:'group',
            via:'projects'
        },

        biobanks:{
            collection:'biobank',
            via:'projects'
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
