(function (xtens, Operator) {
    // dependencies
    var i18n = xtens.module('i18n').en;
    var router = xtens.router;
    // var Group = xtens.module('group');
    var AddressInformation = xtens.module("addressinformation");
    // var GroupsOperator =xtens.module('groupsOperator');
    // var DashBoard =xtens.module('dashboard');
    var sexOptions = xtens.module('xtensconstants').SexOptions;
    var ModalDialog = xtens.module('xtensbootstrap').Views.ModalDialog;

    var parsleyOpts = {
        priorityEnabled: false,
        successClass: "has-success",
        errorClass: "has-error",
        classHandler: function (el) {
            return el.$element.parent();
        },
        errorsWrapper: "<span class='help-block'></span>",
        errorTemplate: "<span></span>"
    };

    // define an Operator
    Operator.Model = Backbone.Model.extend({
        urlRoot: '/operator'
    });

    Operator.List = Backbone.Collection.extend({
        url: '/operator',
        model: Operator.Model
    });

    Operator.Views.Edit = Backbone.View.extend({

        tagName: 'div',
        className: 'operator',

        events: {
            'click button.delete': 'deleteOperator',
            'submit .edit-operator-form': 'saveOperator',
            'click button.password-reset': 'resetPasswordOperator'
        },

        initialize: function (options) {
            $('#main').html(this.el);
            this.template = JST['views/templates/operator-edit.ejs'];
            this.render();

            this.personalAddressView = new AddressInformation.Views.Edit({
                model: new AddressInformation.Model(this.model.get("addressInformation"))
            });
            this.$("#address-information-cnt").append(this.personalAddressView.render().el);
        },

        bindings: {

            '#firstName': {
                observe: 'firstName'
            },

            '#lastName': {
                observe: 'lastName'
            },

            '#sex': {
                observe: 'sex',
                initialize: function ($el) {
                    var data = [];
                    _.each(sexOptions, function (sexOption) {
                        data.push({ id: sexOption, text: sexOption });
                    });
                    $el.select2({
                        placeholder: i18n('please-select'),
                        data: data
                    });
                }
            },

            '#birthDate': {
                observe: 'birthDate',

                // format date on model as ISO (YYYY-MM-DD)
                onSet: function (val, options) {
                    // var dateArray = val.split("/");
                    var momentDate = moment(val, 'L', 'it');
                    // return new Date(dateArray[2] + '-'+ dateArray[1] + '-' + dateArray[0]);
                    return momentDate.format('YYYY-MM-DD');
                },

                // store data in view (from model) as DD/MM/YYYY (European format)
                onGet: function (value, options) {
                    if (value) {
                        /*
                        var dateArray = value instanceof Date ? value.toISOString().split('-') : moment(value).format('L');
                        var dateArray2 = dateArray[2].split('T');
                        dateArray[2] = dateArray2[0];
                        return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]; */
                        return moment(value).lang('it').format('L');
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
            },

            '#email': {
                observe: 'email'
            },

            '#login': 'login'

        },

        render: function () {
            this.$el.html(this.template({ __: i18n, data: this.model, isWheel: xtens.session.get("isWheel") }));
            this.$form = this.$("form");
            this.$form.parsley(parsleyOpts);
            this.$modal = $(".modal-cnt");
            this.stickit();
            return this;
        },

        saveOperator: function (ev) {
            var that = this;
            var addressInformation = _.clone(this.personalAddressView.model.attributes);
            if (!that.model.get('id')) {
                that.model.set('password', $('#password').val());
            }
            this.personalAddressView.model.save(null, {
                success: function (addressInformation) {
                    that.model.save({ addressInformation: addressInformation.id }, {
                        success: function (operator) {
                            if (that.modal) {
                                that.modal.hide();
                            }
                            var modal = new ModalDialog({
                                title: i18n('ok'),
                                body: i18n('operator-correctly-stored-on-server')
                            });
                            that.$modal.append(modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            modal.show();

                            setTimeout(function () { modal.hide(); }, 1200);
                            $('.modal-cnt').one('hidden.bs.modal', function (e) {
                                e.preventDefault();
                                modal.remove();
                                xtens.router.navigate('operators', { trigger: true });
                            });
                        },
                        error: function (model, res) {
                            xtens.error(res);
                        }
                    });
                },
                error: function (model, res) {
                    xtens.error(res);
                }
            });
            return false;
        },

        deleteOperator: function (ev) {
            ev.preventDefault();
            var that = this;
            if (this.modal) {
                this.modal.hide();
            }

            var modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-deletion'),
                body: i18n('operator-will-be-permanently-deleted-are-you-sure'),
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
                            modal.body = i18n('operator-deleted');
                            that.$modal.append(modal.render().el);
                            $('.modal-header').removeClass('alert-danger');
                            $('.modal-header').addClass('alert-success');
                            modal.show();
                            setTimeout(function () { modal.hide(); }, 1200);
                            that.$modal.one('hidden.bs.modal', function (e) {
                                modal.remove();
                                xtens.router.navigate('operators', { trigger: true });
                            });
                        },
                        error: function (model, res) {
                            xtens.error(res);
                        }
                    });
                });
                return false;
            });
        },

        resetPasswordOperator: function (ev) {
            ev.preventDefault();
            var that = this;
            if (this.modal) {
                this.modal.hide();
            }

            var username = this.model.get('login');

            var modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-reset'),
                body: i18n('are-you-sure-reset-password')
            });

            this.$modal.append(modal.render().el);
            $('.modal-header').addClass('alert-warning');
            $('#confirm').removeClass('btn-default').addClass('btn-warning');
            modal.show();

            $('#confirm').click(function (e) {
                modal.hide();
                that.$modal.one('hidden.bs.modal', function (e) {
                    $('.waiting-modal').modal('show');

                    $.ajax({
                        url: '/operator/resetPassword',
                        type: 'PATCH',
                        data: JSON.stringify({
                            username: username
                        }),
                        headers: {
                            'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                        },
                        contentType: 'application/json',

                        error: function (err) {
                            $('.waiting-modal').modal('hide');
                            if (that.modal) { that.modal.hide(); }
                            xtens.error(err);
                        },
                        success: function (model, res) {
                            $('.waiting-modal').modal('hide');
                            modal.template = JST["views/templates/dialog-bootstrap.ejs"];
                            modal.title = i18n('ok');
                            modal.body = i18n('password-reset') + model;
                            that.$modal.append(modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            modal.show();

                            that.$modal.one('hidden.bs.modal', function (e) {
                                modal.remove();
                                xtens.router.navigate('operators', { trigger: true });
                            });
                        }
                    });
                });
                return false;
            });
        }

    });

    Operator.Views.List = Backbone.View.extend({

        tagName: 'div',
        className: 'operator',

        initialize: function (options) {
            $('#main').html(this.el);
            this.template = JST['views/templates/operator-list.ejs'];
            this.operators = options.operators;
            this.render();
        },

        render: function (options) {
            this.$el.html(this.template({ __: i18n, operators: this.operators.models }));

            $('.table').DataTable({
                scrollY: '50vh',
                scrollCollapse: true,
                "searching": true
            });
            return this;
        }
    });

    Operator.Views.Login = Backbone.View.extend({

        tagName: 'div',
        className: 'operator',

        events: {
            'click #login': 'logIn',
            'click #confirm-project': 'confirmProject'

        },

        initialize: function () {
            $('#main').html(this.el);
            this.template = JST['views/templates/login.ejs'];
            this.render();
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));
            this.$modal = $(".modal-cnt");
            this.$('form').parsley(parsleyOpts);
            $(document).bind('keyup', function (e) {
                if (e.which == 13) {
                    $('#login').trigger('click');
                }
            });
            return this;
        },

        logIn: function () {
            var that = this;
            this.$('#loginFailed').hide();
            xtens.session.set("expiredPassword", false);
            var username = this.$('#username').val();
            var password = this.$('#password').val();
            this.landingUrl = 'homepage';
            if (this.$('form').parsley().validate()) {
                $.post('/login', {
                    identifier: username,
                    password: password
                }, function (data, status, jqxhr) {
                    xtens.session.load(data, function () {
                        $(document).unbind('keyup');
                        var projects = xtens.session.get("projects");
                        if (projects.length < 2) {
                            xtens.session.set('activeProject', projects[0].name);
                            var idProject = _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id;
                            if ((xtens.session.get("isAdmin") && _.find(xtens.session.get('adminProjects'), function (p) { return p === idProject; }))) {
                                that.landingUrl = 'dashboard/' + xtens.session.get('activeProject');
                            }
                            router.navigate(that.landingUrl, { trigger: true });
                        } else {
                            var modal = new ModalDialog({
                                title: i18n('project-selection'),
                                template: JST["views/templates/confirm-project-selection.ejs"]
                            });
                            that.$modal.append(modal.render().el);
                            $('.selectpicker').selectpicker();
                            // $('.modal-header').addClass('alert-success');
                            modal.$modal.modal({ backdrop: 'static', keyboard: false });
                            modal.show();

                            $('#project-selector').on('change.bs.select', function (e) {
                                xtens.session.set('activeProject', e.target.value);
                                $('#confirm-project').text(i18n('confirm') + " " + e.target.value);
                                $('#confirm-project').prop('disabled', false);
                                $('#confirm-project').addClass('btn-success');
                                $('#confirm-project').on('click.bs.button', function (e) {
                                    e.preventDefault();
                                    modal.hide();
                                    that.$modal.one('hidden.bs.modal', function (e) {
                                        modal.remove();
                                        var idProject = _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id;
                                        if ((xtens.session.get("isAdmin") && _.find(xtens.session.get('adminProjects'), function (p) { return p === idProject; }))) {
                                            that.landingUrl = 'dashboard/' + xtens.session.get('activeProject');
                                        }
                                        router.navigate(that.landingUrl, { trigger: true });
                                    });
                                });
                            });
                        }
                    });
                })
                    .fail(function (jqxhr) {
                        // alert("Error: " + res.responseJSON.error);
                        console.log('Operator.Views.Login.logIn() - error logging in.');
                        that.$('#loginFailed').show();
                    });
            }
            return false;
        }

    });

    /**
     * @class
     * @name Homepage
     * @description personalised homepage for the operator
     */
    Operator.Views.Homepage = Backbone.View.extend({

        tagName: 'div',
        className: 'operator',

        initialize: function () {
            $('#main').html(this.el);
            this.template = JST['views/templates/homepage.ejs'];
            this.render();
        },

        render: function (options) {
            /*
            var self = this;
            var operators= new Operator.List();
            operators.fetch({
                success: function(operators) {
                    self.$el.html(self.template({__: i18n, operators: operators.models}));
                    return self;
                },
                error: function() {
                    self.$el.html(self.template({__: i18n}));
                    return self;
                }
            });
            */
            this.$el.html(this.template({ __: i18n, login: xtens.session.get('login') }));
            return this;
        }

    });

    Operator.Views.updatePassword = Backbone.View.extend({

        events: {
            'submit .edit-password-form': 'updatePassword'
        },

        initialize: function (options) {
            _.bindAll(this, 'saveOnSuccess');
            $('#main').html(this.el);
            this.template = JST['views/templates/update-password.ejs'];
            this.pswdExpired = xtens.session.get("expiredPassword");
            this.render();
            this.$modal = $('.modal-cnt');
        },

        render: function () {
            this.$el.html(this.template({ __: i18n, expired: this.pswdExpired }));
            if (this.pswdExpired) {
                $('#username').removeAttr('disabled');
            }
            $('#username').val(xtens.session.get('login') ? xtens.session.get('login') : null);

            this.$form = this.$("form");
            this.$form.parsley(parsleyOpts);
            return this;
        },

        updatePassword: function (ev) {
            ev.preventDefault();
            var that = this;
            var username = $('#username').val();
            var oldPass = $('#oldPassword').val();
            var newPass = $('#newPassword').val();
            var cnewPass = $('#confirmNewPass').val();
            $.ajax({
                url: '/operator',
                type: 'PATCH',
                data: JSON.stringify({
                    username: username,
                    oldPass: oldPass,
                    newPass: newPass,
                    cnewPass: cnewPass
                }),
                contentType: 'application/json',

                error: function (err) {
                    if (that.modal) { that.modal.hide(); }
                    xtens.error(err);
                },
                success: this.saveOnSuccess
            });
        },

        saveOnSuccess: function () {
            if (this.modal) {
                this.modal.hide();
            }
            var modal = new ModalDialog({
                title: i18n('ok'),
                body: i18n('password-correctly-changed-on-server')
            });
            this.$modal.append(modal.render().el);
            $('.modal-header').addClass('alert-success');
            modal.show();

            setTimeout(function () { modal.hide(); }, 1200);
            this.$modal.one('hidden.bs.modal', function (e) {
                e.preventDefault();
                modal.remove();
                xtens.session.set("bearerAuth", null);
                xtens.session.set("expiredPassword", false);
                xtens.session.set("accessToken", false);
                xtens.router.navigate('login', { trigger: true });
            });
        }

    });
}(xtens, xtens.module('operator')));
