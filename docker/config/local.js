module.exports = {
        hookTimeout: 30000,
        
        port: process.env.PORT || 1337,

        environment: process.env.NODE_ENV || 'development',

        connections: {

            'default': 'postgresql',            //your default database connection

            postgresql: {                       //your database connection

                adapter: 'sails-postgresql',    //sails adapter
                host: 'postgres',              //ip host
                port: '5432',                   //db port (postgresql default port 5432)
                user: 'xtenspg',                   //db user
                password: 'xtenspg',           //db user password
                database: 'xtensdb',      //db name
                schema: true
            },
            dblog: {

                adapter: 'sails-postgresql',
                host: 'postgres',
                port: 5432,
                user: 'xtenspg',
                password: 'xtenspg',
                database: 'xtens_log',
                pool: true,
                ssl: false,
                schema: true,
                timezone: 'CET',
                tableName: 'winston_log'
                // identity: 'pgigg'
            }
        },

        fileSystemConnections: {

            'default': 'localConnection',

            localConnection: {
                type: 'local',             
                path: '/app/xtens-filesystem/',   // your fs home path
                repoDirectory: 'xtens-repo',   // default Directory name
                landingDirectory: 'landing',   // landing directory name
            }
        },

        defaultGroups: [                        //array of default groups
            {
                name: "admin",
                privilegeLevel: "wheel",
                canAccessPersonalData: true,
                canAccessSensitiveData: true
            }, {
                name: "public",
                privilegeLevel: "standard",
                canAccessPersonalData: false,
                canAccessSensitiveData: false
            }
        ],

        defaultOperators: [                      //array of default users
            {
                firstName: 'default administrator',
                lastName: 'sysadmin',
                birthDate: '1970-01-01',
                sex: 'N.A.',
                email: 'admin@xtens.com',
                login: 'defaultAdmin',
                password: 'Admin1234!',
                groups: [1]                      //operator "defaultAdmin" is associated with group "admin"
            }, {
                firstName: 'default user',
                lastName: 'demo user',
                birthDate: '1970-01-01',
                sex: 'N.A.',
                email: 'demouser@xtens.com',
                login: 'demouser',
                password: 'Demouser1234!',
                groups: [2]                     //operator "demouser" is associated with group "public"
            }
        ]
};
