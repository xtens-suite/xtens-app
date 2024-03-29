/**
 Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {

    // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
    // default view engine) your home page.
    //
    // (Alternatively, remove this and add an `index.html` file in your `assets` directory)

    'GET /': { view: 'home' },
    // Auth Controller
    'POST /login': { controller: 'auth', action: 'login' },
    'POST /logout': { controller: 'auth', action: 'logout' },
    'POST /subjectLogin': { controller: 'auth', action: 'loginSubject' },

    // Biobank Controller

    // ContactInformation Controller

    // Daemon Controller

    //Dashboard Controller
    'GET /dashboard/getDataForDashboard': { controller: 'dashboard', action: 'getDataForDashboard' },
    'GET /dashboard/getInfoForBarChart': { controller: 'dashboard', action: 'getInfoForBarChart' },
    'GET /dashboard/getInfoForBarChartDatediff': { controller: 'dashboard', action: 'getInfoForBarChartDatediff' },  

    // Data Controller
    'GET /data/edit': { controller: 'data', action: 'edit' },

    /*
    'GET /data': {controller: 'data', action: 'find'},
    'POST /data': {controller: 'data', action: 'create'},
    'PUT /data': {controller: 'data', action: 'upadate'},
    */

    // DataFile Controller
    // '/upload-file':{controller:'dataFile',action:'upload'},
    // 'POST /download-file':{controller:'dataFile',action:'download'},

    // DataType Controller
    'GET /dataType/edit': { controller: 'dataType', action: 'edit' },
    'POST /graph': { controller: 'dataType', action: 'buildGraph' },
    // 'GET /graph/buildHierarchy':{controller:'dataType',action:'buildHierarchy'},

    // DataTypePrivileges Controller
    'GET /dataTypePrivileges/edit': { controller: 'dataTypePrivileges', action: 'edit' },

    // Group Controller
    // '/groupOperator/associate':{controller:'group', action:'addOperator'},
    // '/groupOperator/dissociate':{controller:'group', action:'removeOperator'},
    // '/groupDatatype/associate':{controller:'group', action:'addDatatype'},
    // '/groupDatatype/dissociate':{controller:'group',action:'removeDatatype'},

    // Main Controller
    'POST /customisedData': { controller: 'main', action: 'executeCustomDataManagement' },
    'GET /fileManager': { controller: 'main', action: 'getFileSystemStrategy' },
    'GET /getPhenotipsPatientsList': { controller: 'main', action: 'getPhenotipsPatientsList' },
    'GET /getPhenotipsPatient': { controller: 'main', action: 'getPhenotipsPatient' },

    // 'GET /fileContent': {controller: 'main', action: 'downloadFileContent'},
    // 'POST /fileContent': {controller: 'main', action: 'uploadFileContent'},

    // 'POST /populateDB': {controller: 'main', action: 'populateDB'},
    // 'POST /migrate': {controller: 'main', action: 'migrate'},
    // 'POST /migrateCGH': {controller: 'main', action: 'migrateCGH'},
    // 'GET /populateEAV': {controller: 'main', action: 'populateEAV'},

    // Operator Controller
    'PATCH /operator': { controller: 'operator', action: 'patchPassword' },
    'PATCH /operator/resetPassword': { controller: 'operator', action: 'resetPassword' },
    'PATCH /operator/patchQueries': { controller: 'operator', action: 'patchQueries' },

    // PersonalDetails Controller

    // Project Controller
    'GET /project/edit': { controller: 'project', action: 'edit' },

    // Query Controller
    // Advanced Search API
    'POST /query/dataSearch': { controller: 'query', action: 'dataSearch' },

    // Sample Controller
    'GET /sample/edit': { controller: 'sample', action: 'edit' },
    'GET /sample/getNextBiobankCode': { controller: 'sample', action: 'getNextBiobankCode' },
    'GET /sample/findByBiobankCode': { controller: 'sample', action: 'findByBiobankCode' },
    // Subject Controller
    'GET /subject/edit': { controller: 'subject', action: 'edit' },
    'POST /subjectGraph': { controller: 'subject', action: 'createGraph' },
    'POST /subjectGraphSimple': { controller: 'subject', action: 'createGraphSimple' },
    'GET /subject/getNextSubjectCode': { controller: 'subject', action: 'getNextSubjectCode' },

    'GET /app': {
        controller: 'main',
        action: 'getAppUI'
    },

    'GET /superType/meta/:id': { controller: 'superType', action: 'getMeta' }

    // REST API for subject (with personal info)
    // 'GET /subjectWithPersonalDetails': {controller: 'subject', action: 'findWithPersonalDetails'},
    // 'GET /subjectWithPersonalDetails/:id': {controller: 'subject', action: 'findOneWithPersonalDetails'},
    // 'PUT /subjectWithPersonalDetails': {controller: 'subject', action: 'updateWithPersonalDetails'},
    // 'POST /subjectWithPersonalDetails': {controller: 'subject', action: 'createWithPersonalDetails'},
    // 'DELETE /subjectWithPersonalDetails': {controller: 'subject', action: 'deleteWithPersonalDetails'},

    /*,
    'GET /dataType': {controller: 'DataType', action: 'find'}

   '/dataTypes/new': {
        controller: 'dataType',
        action: 'insertnew'
   } */

    // If a request to a URL doesn't match any of the custom routes above,
    // it is matched against Sails route blueprints.  See `config/blueprints.js`
    // for configuration options and examples.

};
