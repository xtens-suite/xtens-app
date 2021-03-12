/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!documentation/
 */

module.exports.policies = {

    // Default policy for all controllers and actions
    // (`true` allows public access)
    // TODO change Passport policy for authentication

    '*': ['bearerAuth', 'expiredPassword'],

    'main': {
        '*': true
    },

    'auth': {
        '*': true
    },

    MainController: {
        '*': true,
        'getPhenotipsPatientsList': ['bearerAuth', 'expiredPassword'],
        'getPhenotipsPatient': ['bearerAuth', 'expiredPassword']
    },

    DataController: {
        '*': ['bearerAuth', 'expiredPassword'],
        'getInfoForBarChart': ['bearerAuth', 'expiredPassword', 'isAdmin']
    },

    SampleController: {
        '*': ['bearerAuth', 'expiredPassword'],
        'getInfoForBarChart': ['bearerAuth', 'expiredPassword', 'isAdmin']
    },

    SubjectController: {
        '*': ['bearerAuth', 'expiredPassword'],
        'getInfoForBarChart': ['bearerAuth', 'expiredPassword', 'isAdmin']
    },

    GroupController: {
        '*': ['bearerAuth', 'expiredPassword', 'isWheel'],
        find: ['bearerAuth', 'expiredPassword'],
        findOne: ['bearerAuth', 'expiredPassword']
    },

    ProjectController: {
        '*': ['bearerAuth', 'expiredPassword', 'isWheel'],
        find: ['bearerAuth', 'expiredPassword']
    },

    OperatorController: {
        '*': ['bearerAuth', 'expiredPassword', 'isWheel'],
        'resetPassword': ['bearerAuth', 'expiredPassword', 'isWheel'],
        update: ['bearerAuth', 'expiredPassword'],
        find: ['bearerAuth', 'expiredPassword'],
        findOne: ['bearerAuth', 'expiredPassword'],
        'patchPassword': true,
        'patchQueries': ['bearerAuth', 'expiredPassword']
    },

    DataTypePrivilegesController: {
        '*': ['bearerAuth', 'expiredPassword', 'isWheel'],
        findOne: ['bearerAuth', 'expiredPassword', 'isAdmin'],
        'edit': ['bearerAuth', 'expiredPassword', 'isAdmin'],
        create: ['bearerAuth', 'expiredPassword', 'isAdmin'],
        find: ['bearerAuth', 'expiredPassword']
    },

    DataTypeController: {
        '*': ['bearerAuth', 'expiredPassword', 'isAdmin'],
        find: ['bearerAuth', 'expiredPassword'],
        'edit': ['bearerAuth', 'expiredPassword', 'isAdmin'],
        'getDataForDashboard': ['bearerAuth', 'expiredPassword', 'isAdmin']
    },

    SuperTypeController: {
        '*': ['bearerAuth', 'expiredPassword', 'isAdmin'],
        find: ['bearerAuth', 'expiredPassword'],
        findOne: ['bearerAuth', 'expiredPassword']
    },

    BiobankController: {
        '*': ['bearerAuth', 'expiredPassword', 'isAdmin'],
        find: ['bearerAuth', 'expiredPassword']
    },

    ContactInformationController: {
        '*': ['bearerAuth', 'expiredPassword', 'isAdmin']
    },

    PersonalDetailsController: {
        '*': ['bearerAuth', 'expiredPassword', 'canAccessPersonalData']
    }

    // Here's an example of mapping some policies to run before
    // a controller and its actions
    // RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    // '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy
    // (this overrides `false` above)
    // nurture	: 'isRabbitMother',

    // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
    // before letting any users feed our rabbits
    // feed : ['isNiceToAnimals', 'hasRabbitFood']
    // }
};
