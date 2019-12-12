/**
 * @author Massimiliano Izzo
 * @description Backbone client-side module for storing Session details (using stateless API)
 */

(function (xtens, Session) {
    Session.Views = {};
    var i18n = require('./i18n.js').en;
    var GroupPrivilegeLevels = require('./XtensConstants.js').GroupPrivilegeLevels;
    var Project = require('./Project.js');
    var Utils = require('./Utils.js');
    var ModalDialog = require('./XtensBootstrap.js').Views.ModalDialog;

    /**
     * @class
     * @name Session.Model
     * @extends Backbone.Model
     */
    Session.Model = Backbone.Model.extend({

        defaults: {
            login: null,
            accessToken: null,
            projects: []
        },

        events: {
            '#logout click': 'reset'
        },

        initialize: function (options) {
            this.load(options);
        },

        load: function (options, callback) {
            options = options || {};
            if (!options.user) {
                return;
            }

            this.set("login", options.user && options.user.login);
            this.set("userId", options.user && options.user.id);
            this.set("accessToken", options.token);

            if (_.isEmpty(options.user.groups)) {
                return;
            }
            var privilegeLevelArr = _.map(options.user.groups, 'privilegeLevel');

            var mapPrivProject = { "admin": [], "standard": [] };
            // TODO: creare variabile di sessione con gruppi - settare variabile di sessione con currentLevelByProject in base al progetto selezionato
            _.forEach(options.user.groups, function (group) {
                if (group.privilegeLevel === "wheel") {
                    mapPrivProject["admin"].push(_.map(group.projects, 'id'));
                } else {
                    mapPrivProject[group.privilegeLevel].push(_.map(group.projects, 'id'));
                }
            });
            // this.set("standardProjects", _.uniq(_.flatten(mapPrivProject.standard)));
            this.set("adminProjects", _.uniq(_.flatten(mapPrivProject.admin)));
            this.set("isWheel", privilegeLevelArr.indexOf(GroupPrivilegeLevels.WHEEL) > -1);
            this.set("isAdmin", this.get("isWheel") ? this.get("isWheel") : privilegeLevelArr.indexOf(GroupPrivilegeLevels.ADMIN) > -1);
            this.set("canAccessPersonalData", _.map(options.user.groups, 'canAccessPersonalData').indexOf(true) > -1);
            this.set("canAccessSensitiveData", _.map(options.user.groups, 'canAccessSensitiveData').indexOf(true) > -1);
            // this.set("canAccessSensitiveData", _.map(options.user.groups, 'canAccessSensitiveData').indexOf(true) > -1);
            var that = this;
            var projects = new Project.List();
            projects.fetch({
                data: $.param({ sort: 'id ASC', populate: 'groups' }),
                success: function (results) {
                    that.set("projects", results.toJSON());
                    return callback();
                },
                error: function (collection, response) {
                    return xtens.error(response, "Edit");
                }
            });
        },

        reset: function () {
            this.clear().set(this.defaults);
            $('.navbar-cnt').empty();
            $('.sidebar-cnt').empty();
        },

        isAuthenticated: function () {
            return Boolean(this.get("accessToken"));
        }

    });

    /**
     * @class
     * @name Session.Views.MenuBar
     * @extends Backbone.Views
     * @description session-related menu bar
     */
    Session.Views.MenuBar = Backbone.View.extend({
        // events:{
        //     'change #project-selector': 'setSessionProject'
        // },

        // el: '#menuBarNav',

        initialize: function () {
            _.bindAll(this);
            this.sideTemplate = require('./../../templates/menu-sidebar.ejs');
            this.navTemplate = require('./../../templates/menu-navbar.ejs');

            if (xtens.session.get('activeProject') !== 'all') {
                var idProject = _.find(xtens.session.get('projects'), function (p) { return p.name === xtens.session.get('activeProject'); }).id;
                var isAdminProject = _.find(xtens.session.get("adminProjects"), function (pr) { return pr == idProject; });
                xtens.session.set("isAdmin", !!isAdminProject);
            }
            this.projects = xtens.session.get("projects");

            this.render();
        },

        render: function () {
            this.renderMenuBar();
            if (this.projects.length === 1) {
                $('#p-project-selector').hide();
            } else if (this.projects.length > 1) {
                this.initializeProjectSelectorModal();
            }

            $('#p-edit-operator').tooltip({ trigger: 'hover' });
            $('#logout').tooltip({ trigger: 'hover' });
            $('#show-hide-bar').tooltip({ trigger: 'hover' });

            return this;
        },

        renderMenuBar: function () {
            var that = this;
            var currentProject = _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') });
            if (currentProject) {
                if ((xtens.session.get("isAdmin") && _.find(xtens.session.get('adminProjects'), function (p) { return p === currentProject.id; }))) {
                    var accessDashboard = 'dashboard/' + xtens.session.get('activeProject');
                }
            }
            $('.sidebar-cnt').html(this.sideTemplate({
                __: i18n,
                session: xtens.session,
                currentProject: xtens.session.get('activeProject'),
                login: xtens.session.get('login'),
                operatorId: xtens.session.get('userId'),
                accessDashboard: accessDashboard
            }));

            $('.navbar-cnt').html(this.navTemplate({
                __: i18n,
                session: xtens.session,
                currentProject: xtens.session.get('activeProject'),
                operatorId: xtens.session.get('userId'),
                login: xtens.session.get('login'),
                accessDashboard: accessDashboard
            }));

            this.manageMenuVisibilty();

            // this.ToggleTitleMenu();

            window.onresize = function () {
                that.manageMenuVisibilty();
            };

            $('#sidebarCollapse').on('click', function () {
                if (!$('#sidebar').is(':visible')) {
                    that.showSideBar();
                    that.hideMenuBar();
                } else {
                    that.hideSideBar();
                    that.showMenuBar();
                }
                // that.ToggleTitleMenu();
            });
        },

        manageMenuVisibilty: function () {
            if (window.innerWidth > 1438) {
                /* the viewport is at least 1438 pixels wide */
                $('#sidebarCollapse').addClass('active');

                if (!$('#sidebar').is(':visible')) {
                    this.showSideBar();
                }
                if ($('.menubar-ul-item').has(':visible')) {
                    this.hideMenuBar();
                }
            } else {
                /* the viewport is less than 1438 pixels wide */
                $('#sidebarCollapse').removeClass('active');

                if ($('#sidebar').is(':visible')) {
                    this.hideSideBar();
                }
                if (!$('.menubar-ul-item').has(':visible')) {
                    this.showMenuBar();
                }
            }
        },

        showSideBar: function () {
            Utils.showElement('#sidebar');
            $('#sidebarCollapse').addClass('active');
        },

        showMenuBar: function () {
            $('#menubar-ul-item').attr("style", "display: block !important");
            $('.title-menu-cnt').attr("style", "display: block !important");
        },

        hideSideBar: function () {
            Utils.hideElement('#sidebar');
            $('#sidebarCollapse').removeClass('active');
        },

        hideMenuBar: function () {
            $('#menubar-ul-item').attr("style", "display: none !important");
            $('.title-menu-cnt').attr("style", "display: none !important");
        },

        initializeProjectSelectorModal: function () {
            this.$modalProjectSelector = $(".modal-cnt");

            var that = this;

            $('#p-project-selector').tooltip();

            // change project initializiation
            $('#p-project-selector').click(function (ev) {
                ev.stopPropagation();

                var projects = xtens.session.get("projects");

                if (that.modal) {
                    that.modal.hide();
                }
                var modal = new ModalDialog({
                    title: i18n('project-selection'),
                    template: require("./../../templates/project-modal.ejs"),
                    data: { __: i18n, projects: projects }
                });
                $('#project-selector').selectpicker('hide');

                that.$modalProjectSelector.append(modal.render().el);
                modal.$modal.modal({ backdrop: 'static', keyboard: false });
                modal.show();

                $("#checkbox").change(function () {
                    if (this.checked) {
                        $('#project-selector').selectpicker('show');
                        $('#project-selector').on('change.bs.select', function (e) {
                            e.stopPropagation();
                            $('#confirm-project').prop('disabled', false);
                            $('#confirm-project').addClass('btn-success');
                            $('#confirm-project').one('click.bs.button', function (e) {
                                e.preventDefault();
                                var projectSelected = $('#project-selector').val();
                                modal.hide();

                                xtens.session.set('activeProject', projectSelected);
                                if (location.href.includes("/#query/%7B%22queryArgs") || location.href.includes("/#/query/%7B%22queryArgs")) {
                                    location.href = location.href.split("/%7B%22queryArgs")[0];
                                } else if (location.href.includes("/#dashboard/") || location.href.includes("/#/dashboard/")) {
                                    location.href = location.href.substr(0, location.href.lastIndexOf("/")) + '/' + escape(projectSelected);
                                }
                                location.reload();
                            });
                        });

                        $('.modal-cnt').one('hidden.bs.modal', function (e) {
                            modal.remove();
                            $('.modal-backdrop').remove();
                        });
                    } else {
                        $('#project-selector').selectpicker('hide');
                    }
                });
            });
        }

        // setSessionProject: function (ev) {
        //     ev.preventDefault();
        //
        //     xtens.session.set('activeProject', ev.target.value);
        //     location.reload();
        //
        // }

    });

    Session.Views.MenuBarLogin = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);
            // var template = require('./../../templates/menu-navbar-login.ejs');
            this.template = require('./../../templates/menu-navbar-login.ejs');
            this.render();
        },

        render: function () {
            $('.navbar-cnt').html(this.template({ __: i18n }));
            return this;
        }

    });
}(xtens, require("./Session.js")));
