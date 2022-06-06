/**
 * Operator.js
 */

// var constants = sails.config.xtens.constants;

var Operator = {
    tableName: 'operator',
    schema:true,

    attributes: {

        firstName: {
            type: 'string',
            required: true,
            max: 64,
            columnName: 'first_name'
        },

        lastName: {
            type: 'string',
            required: true,
            max: 64,
            columnName: 'last_name'
        },

        birthDate: {
            type: 'datetime',
            columnName: 'birth_date'
        },

        sex: {
            type: 'string',
            enum: ['M', 'F', 'N.A.'],
            columnName: 'sex'
        },

        email: {
            type: 'email',
            required: true,
            columnName: 'email'
        },

        login: {
            type: 'string',
            required: true,
            max: 64
        },

        passports: {
            collection: 'passport',
            via: 'user'
        },

        addressInformation: {
            columnName: 'address_information',
            model: 'addressInformation'
        },

        createdAt: {
            type:'datetime',
            columnName: 'created_at'
        },

        updatedAt: {
            type:'datetime',
            columnName: 'updated_at'
        },

        lastPswdUpdate: {
            type:'datetime',
            columnName: 'last_pswd_update'
        },

        resetPswd: {
            type:'boolean',
            columnName: 'reset_pswd'
        },

        queries: {
            type: "string",
            columnName: "queries"
        },

        groups: {
            collection:'group',
            via:'members'
        }
    }

    /*,
    // Lifecycle Callbacks
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if(err) return next(err);
            values.password = hash;
            next();
        });
    } */

};

module.exports = Operator;
