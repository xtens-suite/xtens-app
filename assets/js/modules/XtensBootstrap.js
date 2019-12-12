/**
 * @author Massimiliano Izzo
 *
 */
(function (xtens, XtensBootstrap) {
    var i18n = require('./i18n.js').en;
    XtensBootstrap.Views = {};
    /**
     * @class
     * @name XtensBootstrap.Views.ModalDialog
     * @description A class to implement a modal dialog based on Bootstrap Library
     */
    XtensBootstrap.Views.ModalDialog = Backbone.View.extend({

        className: 'xtens-modal',

        events: {
            'hidden.bs.modal div.modal': 'removeMe'
        },

        initialize: function (options) {
            options.template ? this.template = options.template : this.template = require('./../../templates/dialog-bootstrap.ejs');
            this.title = options.title;
            this.body = options.body;
            this.type = options.type && options.type;
            this.data = options.data ? options.data : { __: i18n };
            this.type ? this.data.type = this.type : this.data.type = null;
        },

        render: function () {
            this.$el.html(this.template(this.data));
            this.$modal = this.$("div.modal");
            if (this.title) {
                this.$(".modal-title").html(this.title);
            }
            if (this.body) {
                this.$(".modal-body").html(this.body);
            }
            this.$('.modal-header').addClass(this.type === "Edit" ? "alert-warning" : this.type === "Delete" ? "alert-danger" : "");
            $('#confirm').addClass(this.type === "Edit" ? "btn-warning" : this.type === "Delete" ? "btn-danger" : "");
            // $('#confirm').addClass("btn-warning");
            return this;
        },

        show: function () {
            this.$modal.modal();
        },

        hide: function () {
            this.$modal.modal('hide');
        },

        removeMe: function () {
            console.log("removing XtensDialog");
            this.remove();
        }

    });

    /**
     * @class
     * @name XtensBootstrap.Views.Popover
     */
    // XtensBootstrap.Views.Popover = Backbone.View.extend({

    //     className: 'xtens-popover',

    //     initialize: function (options) {
    //         this.template = require("./../../templates/popover-bootstrap.ejs");
    //     },

    //     render: function () {
    //         return this;
    //     }

    // });
}(xtens, require("./XtensBootstrap.js")));
