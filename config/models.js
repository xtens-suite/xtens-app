/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 */

module.exports.models = {

    // Your app's default connection.
    // i.e. the name of one of your app's connections (see `config/connections.js` or `config/local.js`)
    //
    // (defaults to localDiskDbi)
    migrate: 'safe',
    connection: 'postgresql'

};
