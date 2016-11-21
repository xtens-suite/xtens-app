/**
* Test environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
 let dbConnectionMap = new Map([
     ['sails-memory', 'xtens-waterline']
 ]);
 let IrodsRestStrategy = require('xtens-fs').IrodsRestStrategy;
 let FileSystemManager = require('xtens-fs').FileSystemManager;
 let databaseManager = require(dbConnectionMap.get('sails-memory'));

 module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

     models: {
         connection: 'test',
         migrate: 'drop'
     },
     
     connections: {
         test: {
             adapter: 'sails-memory'
         }
     },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

     blueprints: {
         action: false,
         rest: true,
         shortcuts: false
     },

     /**
      *  @description XTENS configuration parameters
      */
     xtens: {

         fileSystemManager: new FileSystemManager({}),

         fileSystemConnection: {},

         databaseManager: databaseManager,

         crudManager: new databaseManager.CrudManager(null, databaseManager, {}),

         queryBuilder: new databaseManager.QueryBuilder()

     }

 };
