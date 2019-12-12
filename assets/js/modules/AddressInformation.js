/**
 * @author  Massimiliano Izzo
 * @description This file contains the Backbone classes for handling AddressInformation
 *              models, collections and views according to the MIABIS standard
 */
(function (xtens, AddressInformation) {
    AddressInformation.Views = {};
    var i18n = require('./i18n.js').en;

    // XTENS router alias
    var router = xtens.router;

    AddressInformation.Model = Backbone.Model.extend({
        urlRoot: '/addressInformation'
    });

    AddressInformation.List = Backbone.Collection.extend({
        url: '/addressInformation',
        model: AddressInformation.Model
    });

    AddressInformation.Views.Edit = Backbone.View.extend({

        initialize: function (options) {
            this.template = require("./../../templates/addressinformation-edit.ejs");
        },

        bindings: {
            '#office': 'office',
            '#phone': 'phone',
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

    AddressInformation.Views.List = Backbone.View.extend({
        // TODO
    });
}(xtens, require('./AddressInformation.js')));
