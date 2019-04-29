       module.exports = {

        port: process.env.PORT || 1337,

        environment: process.env.NODE_ENV || 'development',

        connections: {

            'default': 'postgresql',            //your default database connection

            postgresql: {                       //your database connection

                adapter: 'sails-postgresql',    //sails adapter
                host: '127.0.0.1',              //ip host
                port: '5432',                   //db port (postgresql default port 5432)
                user: 'xtenspg',                   //db user
                password: 'xtenspg',           //db user password
                database: 'xtensdb',      //db name
                schema: true
            },
        },

        fileSystemConnections: {

            'default': 'localConnection',

            localConnection: {
                type: 'local',             
                path: '/filesystem/home/path/',   // your fs home path
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
                email: 'email@domain.com',
                login: 'defaultAdmin',
                password: 'password',
                groups: [1]                      //operator "defaultAdmin" is associated with group "admin"
            }, {
                firstName: 'default user',
                lastName: 'demo user',
                birthDate: '1970-01-01',
                sex: 'N.A.',
                email: 'email@domain.com',
                login: 'demouser',
                password: 'password',
                groups: [2]                     //operator "demouser" is associated with group "public"
            }
        ]
};
