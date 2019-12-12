/**
 * @author  Massimiliano Izzo
 * @description This file contains the Backbone classes for handling ContactInformation
 *              models, collections and views according to the MIABIS standard
 */
(function (xtens, ContactInformation) {
    // dependencies
    ContactInformation.Views = {};
    var i18n = require('./i18n.js').en;

    // XTENS router alias
    var router = xtens.router;

    ContactInformation.Model = Backbone.Model.extend({
        urlRoot: '/contactInformation'
    });

    ContactInformation.List = Backbone.Collection.extend({
        url: '/contactInformation',
        model: ContactInformation.Model
    });

    ContactInformation.Views.Edit = Backbone.View.extend({

        initialize: function (options) {
            this.template = require("./../../templates/contactinformation-edit.ejs");
        },

        bindings: {
            '#givenName': 'givenName',
            '#surname': 'surname',
            '#phone': 'phone',
            '#email': 'email',
            '#address': 'address',
            '#zip': 'zip',
            '#city': 'city',
            '#country': 'country'
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));
            this.stickit();
            return this;
        }

    });

    ContactInformation.Views.List = Backbone.View.extend({
        // TODO
    });
}(xtens, require('./ContactInformation.js')));
