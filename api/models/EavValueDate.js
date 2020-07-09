/**
* EavValueDate.js
*
* @author Massimiliano Izzo
* @description :: EAV Value Table for Date metadata fields
* @docs        :: 
*/

module.exports = {
    
    tableName: 'eav_value_date',

    attributes: {
        
        entityTable: {
            type: 'string',
            required: true,
            enum: ['subject', 'sample', 'data'],
            columnName: 'entity_table'
        },

        entityId: {
            type: 'integer',
            required: true,
            columnName: 'entity_id'
        },

        attribute: {
            model: 'eavAttribute',
            required: true
        },

        value: {
            type: 'date',
            required: true
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

