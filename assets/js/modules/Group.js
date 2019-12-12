/**
 * @module Group
 * @author Valentina Tedone
 * @author Massimiliano Izzo
 */

(function (xtens, Group) {
    // dependencies
    Group.Views = {};
    var i18n = require('./i18n.js').en;
    var router = xtens.router;
    var GroupPrivilegeLevels = require('./XtensConstants.js').GroupPrivilegeLevels;
    var Datatype = require('./DataType.js');
    var Operator = require('./Operator.js');
    var ModalDialog = require('./XtensBootstrap.js').Views.ModalDialog;

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

    Group.Model = Backbone.Model.extend({
        urlRoot: '/group'
    });

    Group.List = Backbone.Collection.extend({
        url: '/group',
        model: Group.Model
    });

    /**
     * @class
     * @name Group.Views.Edit
     * @extends Backbone.Views
     */
    Group.Views.Edit = Backbone.View.extend({

        events: {
            'submit .edit-group-form': 'saveGroup',
            'click #delete': 'deleteGroup'
        },

        tagName: 'div',
        className: 'group',

        initialize: function (options) {
            // _.bindAll(this,'fetchSuccess');
            $("#main").html(this.el);
            this.template = require("./../../templates/group-edit.ejs");
            this.render();
        },

        bindings: {
            '#name': 'name',

            '#privilege-level': {
                observe: 'privilegeLevel',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                },

                selectOptions: {
                    defaultOption: {
                        label: "",
                        value: null
                    },
                    collection: function () {
                        var coll = [];
                        _.each(GroupPrivilegeLevels, function (value) {
                            coll.push({
                                label: value.toUpperCase(),
                                value: value
                            });
                        });
                        return coll;
                    }
                }
            },

            "#can-access-personal-data": {
                observe: "canAccessPersonalData",
                getVal: function ($el) {
                    return $el.prop('checked');
                }

            },

            "#can-access-sensitive-data": {
                observe: "canAccessSensitiveData",
                getVal: function ($el) {
                    return $el.prop("checked");
                }
            }

        },

        render: function () {
            this.$el.html(this.template({ __: i18n, group: this.model }));
            this.$modal = $(".modal-cnt");
            this.$form = this.$('form');
            this.$form.parsley(parsleyOpts);
            this.stickit();
            return this;
        },

        saveGroup: function (ev) {
            var that = this;
            this.model.save(null, {
                success: function (group) {
                    if (this.modal) {
                        this.modal.hide();
                    }
                    var modal = new ModalDialog({
                        title: i18n('ok'),
                        body: i18n('group-correctly-stored-on-server')
                    });
                    that.$modal.append(modal.render().el);
                    $('.modal-header').addClass('alert-success');
                    modal.show();

                    setTimeout(function () { modal.hide(); }, 1200);
                    $('.modal-cnt').one('hidden.bs.modal', function (e) {
                        e.preventDefault();
                        modal.remove();
                        xtens.router.navigate('groups', { trigger: true });
                    });
                },
                error: xtens.error
            });

            return false;
        },

        deleteGroup: function (ev) {
            ev.preventDefault();
            var that = this;
            if (this.modal) {
                this.modal.hide();
            }

            var modal = new ModalDialog({
                template: require("./../../templates/confirm-dialog-bootstrap.ejs"),
                title: i18n('confirm-deletion'),
                body: i18n('group-will-be-permanently-deleted-are-you-sure'),
                type: i18n("delete")
            });

            this.$modal.append(modal.render().el);
            modal.show();

            $('#confirm').click(function (e) {
                e.preventDefault();
                modal.hide();
                that.$modal.one('hidden.bs.modal', function (e) {
                    e.preventDefault();
                    $('.waiting-modal').modal('show');
                    var targetRoute = $(ev.currentTarget).data('targetRoute') || 'data';

                    that.model.destroy({
                        success: function (model, res) {
                            $('.waiting-modal').modal('hide');
                            modal.template = require("./../../templates/dialog-bootstrap.ejs");
                            modal.title = i18n('ok');
                            modal.body = i18n('group-deleted');
                            that.$modal.append(modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            modal.show();
                            setTimeout(function () { modal.hide(); }, 1200);
                            that.$modal.one('hidden.bs.modal', function (e) {
                                modal.remove();
                                xtens.router.navigate('groups', { trigger: true });
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

    Group.Views.List = Backbone.View.extend({

        tagName: 'div',
        className: 'group',

        initialize: function (options) {
            $("#main").html(this.el);
            this.template = require("./../../templates/group-list.ejs");
            this.render(options);
        },

        render: function (options) {
            var that = this;
            this.$el.html(that.template({ __: i18n, groups: options.groups }));

            // this.filterGroups(options.queryParams);
            var table = $('.table').DataTable({
                scrollY: '50vh',
                scrollCollapse: true,
                "searching": true
                // "columnDefs": [
                //   { "visible": false, "targets": 1 }
                // ]
            });
            var filter = options.queryParams && options.queryParams.projects ? options.queryParams.projects : xtens.session.get('activeProject');
            if (filter != 'all') {
                filter += " ";
                table.search(filter).draw();
            }
            return this;
        },

        filterGroups: function (opt) {
            var rex = opt && opt.projects ? new RegExp(opt.projects) : new RegExp(xtens.session.get('activeProject'));

            if (rex == "/all/") { this.clearFilter(); } else {
                $('.group_val').hide();
                $('.group_val').filter(function () {
                    return rex.test($(this).text());
                }).show();
            }
        },
        clearFilter: function () {
            // $('#project-selector').val('');
            $('.group_val').show();
        }

    });
}(xtens, require('./Group.js')));
