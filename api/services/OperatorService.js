/**
 *  @module
 *  @name OperatorService
 *  @author Nicolò Zanardi
 */

/* jshint esnext: true */
/* jshint node: true */
/* globals _, sails , GroupService, DataType */

const BluebirdPromise = require('bluebird');

const coroutines = {

    getOwners: BluebirdPromise.coroutine(function *(datum) {

        if (!datum || !datum.type) {
            return [];
        }

        let idProject;
        if (!_.isObject(datum.type)) {
            let dataType = yield DataType.findOne(datum.type);
            idProject = dataType.project;
        }
        else {
            idProject = _.isObject(datum.type.project) ? datum.type.project.id : datum.type.project;
        }

        let groups = yield GroupService.getGroupsByProject(idProject);

        let operators = _.uniq(_.flatten(_.map(groups,'members')));
        return operators;

    })
};



var OperatorService = BluebirdPromise.promisifyAll({

    /**
     * @method
     * @name getOwners
     * @param{object} data object
     * @description find a list of Operators
     * @return {Array} - list of elegible Operators to owner a specific datum
     */
    getOwners: function(datum) {
        return coroutines.getOwners(datum)
        .catch(/* istanbul ignore next */ function(err) {
            sails.log.error(err);
            return err;
        });
    }
});


// Override toJSON instance method
// to remove password value
OperatorService.customToJSON = function() {
    return _.omit(this, ['password']);
};

/**
 * @method
 * @name formatForTokenPayload
 * @description remove personal details from operator entity and set privilege levels.
 *              The result will be used as the payload for the Json Web Token
 * @return{Object} - formatted operator with the following properties:
 *                      1) id - primary key
 *                      2) login[string]
 *                      3) groups [array]
 *                      4) isWheel [boolean]
 *                      5) isAdmin [boolean]
 *                      6) canAccessPersonalData [boolean]
 *                      7) canAccessSensitiveData [boolean]
 */
 OperatorService.formatForTokenPayload = function(operator) {
    var operator = _.pick(this.toObject(), ['id', 'groups', 'lastPswdUpdate', 'resetPswd']);
    var privilegesArray = _.map(operator.groups, 'privilegeLevel');
    operator.isWheel = privilegesArray.indexOf(constants.GroupPrivilegeLevels.WHEEL) > -1;
    operator.isAdmin = operator.isWheel || privilegesArray.indexOf(constants.GroupPrivilegeLevels.ADMIN) > -1;
    operator.adminGroups =  [];
    if (operator.isAdmin) {
        var adminGroups = _.where(operator.groups, {privilegeLevel: constants.GroupPrivilegeLevels.ADMIN});
        operator.adminGroups = !_.isEmpty(adminGroups) ? _.isArray(adminGroups) ? _.map(adminGroups,'id') : [adminGroups.id] : [];
    }
    operator.canAccessPersonalData = _.map(operator.groups, 'canAccessPersonalData').indexOf(true) > -1;
    operator.canAccessSensitiveData = _.map(operator.groups, 'canAccessSensitiveData').indexOf(true) > -1;
    operator.groups = _.map(operator.groups, 'id');
    return operator;
};

module.exports = OperatorService;
