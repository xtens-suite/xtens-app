/**
 * @author  Massimiliano Izzo
 * @description This file contains the Backbone classes for handling Biobank
 *              models, collections and views according to the MIABIS standard
 */
(function (xtens, Biobank) {
    // dependencies
    var i18n = xtens.module("i18n").en;
    var ContactInformation = xtens.module("contactinformation");
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;

    // XTENS router alias
    var router = xtens.router;

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

    Biobank.Model = Backbone.Model.extend({
        urlRoot: '/biobank'
    });

    Biobank.List = Backbone.Collection.extend({
        url: '/biobank',
        model: Biobank.Model
    });

    Biobank.Views.Edit = Backbone.View.extend({

        tagName: 'div',
        className: 'biobank',

        events: {
            'submit #biobank-form': 'saveBiobank',
            'click button.delete': 'deleteBiobank'
        },

        initialize: function (options) {
            $("#main").html(this.el);
            this.template = JST["views/templates/biobank-edit.ejs"];
            this.render();
            this.personalContactView = new ContactInformation.Views.Edit({
                model: new ContactInformation.Model(this.model.get("contactInformation"))
            });
            this.$("#contact-information-cnt").append(this.personalContactView.render().el);
            this.$("form").parsley(parsleyOpts);
        },

        bindings: {
            '#biobankID': 'biobankID',
            '#acronym': 'acronym',
            '#name': 'name',
            '#url': 'url',
            '#juristicPerson': 'juristicPerson',
            '#country': 'country',
            '#description': 'description'
        },

        render: function () {
            this.$el.html(this.template({ __: i18n, biobank: this.model }));
            this.$modal = $(".modal-cnt");
            this.stickit();
            return this;
        },

        saveBiobank: function () {
            var contactInformation = _.clone(this.personalContactView.model.attributes);
            var that = this;

            this.personalContactView.model.save(null, {
                success: function (contactInformation) {
                    that.model.save({ contactInformation: contactInformation.id }, {
                        success: function (biobank) {
                            if (that.modal) {
                                that.modal.hide();
                            }
                            var modal = new ModalDialog({
                                title: i18n('ok'),
                                body: i18n('biobank-correctly-stored-on-server')
                            });
                            that.$modal.append(modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            modal.show();

                            setTimeout(function () { modal.hide(); }, 1200);
                            $('.modal-cnt').one('hidden.bs.modal', function (e) {
                                e.preventDefault();
                                modal.remove();
                                xtens.router.navigate('biobanks', { trigger: true });
                            });
                        },
                        error: function (model, res) {
                            xtens.error(res);
                        } });
                },
                error: function (model, res) {
                    xtens.error(res);
                }
            });
            return false;
        },

        /**
         * @method
         * @name deleteDate
         * TODO - not implemented yet
         */
        deleteBiobank: function (ev) {
            ev.preventDefault();
            var that = this;
            if (this.modal) {
                this.modal.hide();
            }

            var modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-deletion'),
                body: i18n('biobank-will-be-permanently-deleted-are-you-sure'),
                type: i18n("delete")
            });

            this.$modal.append(modal.render().el);
            modal.show();

            $('#confirm').click(function (e) {
                modal.hide();
                that.$modal.one('hidden.bs.modal', function (e) {
                    $('.waiting-modal').modal('show');

                    that.model.destroy({
                        success: function (model, res) {
                            $('.waiting-modal').modal('hide');
                            modal.template = JST["views/templates/dialog-bootstrap.ejs"];
                            modal.title = i18n('ok');
                            modal.body = i18n('biobank-deleted');
                            that.$modal.append(modal.render().el);
                            $('.modal-header').removeClass('alert-danger');
                            $('.modal-header').addClass('alert-success');
                            modal.show();
                            setTimeout(function () { modal.hide(); }, 1200);
                            that.$modal.one('hidden.bs.modal', function (e) {
                                modal.remove();
                                xtens.router.navigate('biobanks', { trigger: true });
                            });
                        },
                        error: function (model, res) {
                            xtens.error(res);
                        }
                    });
                });
                return false;
            });
        }

    });

    Biobank.Views.List = Backbone.View.extend({
        tagName: 'div',
        className: 'biobanks',

        initialize: function (options) {
            $("#main").html(this.el);
            this.template = JST["views/templates/biobank-list.ejs"];
            this.biobanks = options.biobanks;

            this.render();
        },

        render: function (options) {
            this.$el.html(this.template({ __: i18n, biobanks: this.biobanks.models }));

            $('.table').DataTable({
                scrollY: '50vh',
                scrollCollapse: true,
                "searching": true
            });

            return this;
        }
    });
}(xtens, xtens.module("biobank")));
