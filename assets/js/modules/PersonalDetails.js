(function (xtens, PersonalDetails) {
    PersonalDetails.Views = {};
    var i18n = require('./i18n.js').en;

    var parsleyOpts = {
        priorityEnabled: false,
        // excluded: "select[name='fieldUnit']",
        successClass: "has-success",
        errorClass: "has-error",
        classHandler: function (el) {
            return el.$element.parent();
        },
        errorsWrapper: "<span class='help-block'></span>",
        errorTemplate: "<span></span>"
    };

    PersonalDetails.Model = Backbone.Model.extend({
        urlRoot: '/personaldetails'
    });

    PersonalDetails.List = Backbone.Collection.extend({
        model: PersonalDetails.Model,
        url: '/personaldetails'
    });

    PersonalDetails.Views.Edit = Backbone.View.extend({

        tagName: 'div',
        className: 'personalDetails',

        initialize: function (options) {
            this.template = require("./../../templates/personaldetails-edit.ejs");
        },

        bindings: {

            '#givenName': 'givenName',
            '#surname': 'surname',
            '#birthDate': {
                observe: 'birthDate',

                // format date on model as ISO (YYYY-MM-DD)
                onSet: function (val, options) {
                    var momentDate = moment(val, 'L', 'it');
                    return momentDate.format('YYYY-MM-DD');
                },

                // store data in view (from model) as DD/MM/YYYY (European format)
                onGet: function (value, options) {
                    if (value) {
                        return moment(value).lang("it").format('L');
                    }
                },

                // initialize Pikaday + Moment.js
                initialize: function ($el, model, options) {
                    var picker = new Pikaday({
                        field: $el[0],
                        // lang: 'it',
                        // format: 'DD/MM/YYYY',
                        format: moment.localeData('it')._longDateFormat.L,
                        minDate: moment('1900-01-01').toDate(),
                        maxDate: new Date()
                    });
                }
            }

        },

        setParsleyRequired: function () {
            var name = $('#givenName').val();
            var surname = $('#surname').val();
            var birthDate = $('#birthDate').val();

            if ((name == null || name == "") && (surname == null || surname == "") && (birthDate == null || birthDate == "")) {
                $('form').removeData('Parsley');
                // set required attribute on input to false
                $('.personaldetails-input').attr('data-parsley-required', 'false');
                // reinitialize parsley
                $('form').parsley(parsleyOpts).reset();
            } else {
                $('form').removeData('Parsley');
                $('.personaldetails-input').attr('data-parsley-required', 'true');
                $('form').parsley(parsleyOpts);
            }
        },

        render: function () {
            this.$el.html(this.template({ __: i18n, data: this.model }));
            this.stickit();
            return this;
        }

    });

    PersonalDetails.Views.Details = Backbone.View.extend({
        tagName: 'div',
        className: 'personalDetails',

        /**
         * @extends Backbone.View.initialize
         */
        initialize: function (options) {
            this.template = require("./../../templates/personaldetails-details.ejs");
            // var filename= this.getFileName(this.model);
            //  this.model.set("filename", filename);
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));
            this.stickit();
            return this;
        },

        bindings: {

            '#givenName': 'givenName',
            '#surname': 'surname',
            '#birthDate': {
                observe: 'birthDate',

                // store data in view (from model) as DD/MM/YYYY (European format)
                onGet: function (value, options) {
                    if (value) {
                        /*
                        var dateArray = value instanceof Date ? value.toISOString().split('-') : moment(value).format('L');
                        var dateArray2 = dateArray[2].split('T');
                        dateArray[2] = dateArray2[0];
                        return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]; */
                        return moment(value).lang("it").format('L');
                    }
                }
            }
        }
    });
}(xtens, require('./PersonalDetails.js')));
