/* globals, sails, TokenService */

/**
 * isWheel
 *
 * @module      :: Policy
 * @description :: Check if user password is expired or not 6 months
 *
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    var payload = TokenService.getToken(req);

    console.log("Called canAccessPersonalData Policy", payload);
    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    var startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); //3 MONTHS
    if (startDate.toISOString() <= payload.lastPswdUpdate) {
        return next();
    }

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)

    // return next();
    return res.unauthorized("Expired Password");

};
