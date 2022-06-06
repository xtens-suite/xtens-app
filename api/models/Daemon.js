var Daemon = {
    tableName: 'daemon',
    schema:true,

    attributes: {

        pid: {
            type: 'integer',
            required: true,
            columnName: 'pid'
        },

        source: {
            type: 'text',
            required: true,
            columnName: 'source'
        },

        status: {
            type: 'string',
            required: true,
            defaultsTo: 'initializing',
            enum: ['initializing', 'error', 'running', 'success'],
            columnName: 'status'
        },

        info: {
            type: 'json',
            required: true,
            columnName: 'info'
        },

        operator: {
            model: 'operator',
            columnName: 'operator'
        },

        createdAt: {
            type:'datetime',
            columnName: 'created_at'
        },

        updatedAt: {
            type:'datetime',
            columnName: 'updated_at'
        }

    }
};
module.exports = Daemon;
