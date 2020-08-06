module.exports = {

    bearerToken: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZ3JvdXBzIjpbMV0sImxhc3RQc3dkVXBkYXRlIjoiMjAxOS0wNy0wNVQwOTo0NToxNS4wMDBaIiwicmVzZXRQc3dkIjpmYWxzZSwiaXNXaGVlbCI6dHJ1ZSwiaXNBZG1pbiI6dHJ1ZSwiYWRtaW5Hcm91cHMiOltdLCJjYW5BY2Nlc3NQZXJzb25hbERhdGEiOnRydWUsImNhbkFjY2Vzc1NlbnNpdGl2ZURhdGEiOnRydWV9.zcXfSweWbLcqZk8nDHGOpQdY2_yalS2Ah3wbP2CBisk",

    mysqlLocal: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'xtensMigrate'
        }
    },

    postgresqlLocal: {
        client: 'pg',
        connection: {
            host: 'postgres',
            port: 5432,
            user: 'xtenspg',
            password: 'xtenspg',
            database: 'xtensigg'
        }
    },

    postgresqlLocalAnnotiation: {
        client: 'pg',
        connection: {
            host: 'postgres-anno',
            port: 5432,
            user: 'xtenspg',
            password: 'xtenspg',
            database: 'xtens_genomic_annotation'
        }
    }

};
