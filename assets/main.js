/**
 *  Backbone module according to the pattern detailed here:
 *  http://bocoup.com/weblog/organizing-your-backbone-js-application-with-modules/
 */
global.jQuery = require('jquery');
global.$ = require('jquery');
require('bootstrap');
require('lodash');
require('backbone');
require('backbone.stickit');
require('select2');
require('parsleyjs');
require('moment');
require('pikaday');
require('dropzone');
require('datatables.net');
require('datatables.net-plugins/integration/bootstrap/1/dataTables.bootstrap.js');
require('datatables.net-buttons');
// require('datatables.net-buttons');
require('datatables.net-fixedcolumns');
// require('datatables.net-buttons');
// require('datatables.net-buttons/js/buttons.html5.js');
require('jszip');
global.d3 = require('d3');
global.d3.tip = require('d3-tip').default;
require('sortablejs');
require('jsbarcode');
require('bootstrap-select');
require('bootstrap-notify');
require('context-menu');

// require('./js/modules/MetadataLoop.js');

global.xtens = {
    // create this closure to contain the cached modules
    module: (function () {
        // Internal module cache.
        var modules = {};

        /* Create a new module reference scaffold or load an
         * existing module */
        return function (name) {
            // If this module has already been created return it
            if (modules[name]) {
                return modules[name];
            }

            // Create a module and save it under this name
            modules[name] = { Views: {} };
            return modules[name];
        };
    }()),

    app: _.extend({}, Backbone.Events),

    parseLinkHeader: function (header) {
        if (header.length === 0) {
            return [];
        }

        // Split parts by comma
        var parts = header.split(',');
        var links = {};
        // Parse each part into a named link
        _.each(parts, function (p) {
            var section = p.split(';');
            if (section.length != 2) {
                throw new Error("section could not be split on ';'");
            }
            var url = section[0].replace(/<(.*)>/, '$1').trim();
            var name = section[1].replace(/rel=(.*)/, '$1').trim();
            links[name] = url;
        });

        return links;
    },

    infoBrowser: (function () {
        var ua = navigator.userAgent; var tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M;
    })()

};

// require('./js/modules/i18n.js');
// require('./js/modules/XtensBootstrap.js');
require('./js/application/utils.js');
require('./js/application/Router.js');
// require('./js/modules/XtensConstants.js');
// require('./js/modules/Utils.js');
// require('./js/modules/Session.js');
// require('./js/modules/DataTypePrivileges.js');
// require('./js/modules/AddressInformation.js');
// require('./js/modules/Daemon.js');
// require('./js/modules/MetadataComponent.js');
// require('./js/modules/MetadataField.js');
// require('./js/modules/MetadataLoop.js');
// require('./js/modules/MetadataGroup.js');
// require('./js/modules/DataType.js');
// require('./js/modules/XtensTable.js');
// require('./js/modules/Operator.js');
// require('./js/modules/Group.js');
// require('./js/modules/PersonalDetails.js');
// require('./js/modules/FileManager.js');
// require('./js/modules/ContactInformation.js');
// require('./js/modules/Biobank.js');
// require('./js/modules/Data.js');
// require('./js/modules/DataFile.js');
// require('./js/modules/Subject.js');
// require('./js/modules/Project.js');
// require('./js/modules/Sample.js');
// require('./js/modules/AdminAssociation.js');
// require('./js/modules/SuperType.js');
// require('./js/modules/Query.js');
// require('./js/modules/DashBoard.js');

// Using the jQuery ready event is excellent for ensuring all
// // code has been downloaded and evaluated and is ready to be
// // initialized. Treat this as your single entry point into the
// // application
jQuery(function ($) {
    // create Session object
    var Session = require('./js/modules/Session.js'); var userSession;
    xtens.session = new Session.Model();

    // retrieve user session info from sessionStorage on page reload (if available)
    if (window.sessionStorage.getItem('xtensUserSession')) {
        try {
            userSession = JSON.parse(window.sessionStorage.getItem('xtensUserSession'));
        } catch (err) {
            console.log(err);
        }
    }

    // remove the access token from sessionStorage (to avoid XSS risks)
    window.sessionStorage.removeItem("userSession");

    // set session model with retrieved data
    xtens.session.set(userSession);

    // if the page is refreshed store the user session object (login, accessToken, ...) on the sessionStorage
    window.addEventListener("beforeunload", function (event) {
        console.log("window.onBeforeunload fired!");
        window.sessionStorage.setItem('xtensUserSession', JSON.stringify(xtens.session));
        console.log(window.sessionStorage.getItem('xtensUserSession'));
    });

    // start backbone history
    Backbone.history.start();
});
