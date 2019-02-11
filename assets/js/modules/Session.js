/**
 * @author Massimiliano Izzo
 * @description Backbone client-side module for storing Session details (using stateless API)
 */

(function(xtens, Session) {

    var i18n = xtens.module("i18n").en;
    var GroupPrivilegeLevels = xtens.module("xtensconstants").GroupPrivilegeLevels;
    var Project = xtens.module("project");
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;

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

        initialize: function(options) {
            this.load(options);
        },

        load: function(options, callback) {
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

            var mapPrivProject = {"admin":[],"standard":[]};
            // TODO: creare variabile di sessione con gruppi - settare variabile di sessione con currentLevelByProject in base al progetto selezionato
            _.forEach(options.user.groups, function (group) {
                if (group.privilegeLevel === "wheel") {
                    mapPrivProject["admin"].push(_.map(group.projects,'id'));
                }else {

                    mapPrivProject[group.privilegeLevel].push(_.map(group.projects,'id'));
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
            var projects= new Project.List();
            projects.fetch({
                data: $.param({sort:'id ASC',populate:'groups'}),
                success: function(results) {

                    that.set("projects", results.toJSON());
                    return callback();
                },
                error: function(collection, response) {
                    return xtens.error(response, "Edit");
                }
            });

        },

        reset: function() {
            this.clear().set(this.defaults);
            $('.navbar-cnt').empty();
            $('.sidebar-cnt').empty();
        },

        isAuthenticated: function() {
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

        initialize : function(){
            _.bindAll(this);
            this.sideTemplate = JST['views/templates/menu-sidebar.ejs'];
            this.navTemplate = JST['views/templates/menu-navbar.ejs'];

            if (xtens.session.get('activeProject') !== 'all') {
                var idProject = _.find(xtens.session.get('projects'),function (p) { return p.name === xtens.session.get('activeProject'); }).id;
                var isAdminProject = _.find(xtens.session.get("adminProjects") , function(pr){ return pr == idProject;});
                xtens.session.set("isAdmin", isAdminProject ? true : false);
            }
            this.projects = xtens.session.get("projects");

            this.render();
        },

        render: function() {
            this.renderMenuBar();
            if (this.projects.length == 1) {
                $('#p-project-selector').hide();
            }
            else if (this.projects.length > 1) {
                this.initializeProjectSelectorModal();
            }

            $('#p-edit-operator').tooltip({ trigger : 'hover' });
            $('#logout').tooltip({ trigger : 'hover' });
            $('#show-hide-bar').tooltip({ trigger : 'hover' });

            return this;
        },

        renderMenuBar: function () {
            var that = this;
            $('.sidebar-cnt').html(this.sideTemplate({
                __:i18n,
                session: xtens.session,
                currentProject: xtens.session.get('activeProject'),
                login: xtens.session.get('login'),
                operatorId: xtens.session.get('userId')
            }));

            $('.navbar-cnt').html(this.navTemplate({
                __:i18n,
                session: xtens.session,
                currentProject: xtens.session.get('activeProject'),
                login: xtens.session.get('login')
            }));

            this.ToggleTitleMenu();

            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
                that.ToggleTitleMenu();
                $(this).toggleClass('active');
            });
        },

        ToggleTitleMenu : function () {
            if ($('#sidebar').hasClass( "active" )) {
                $('.title-menu-cnt').fadeOut( "slow", "linear");
            } else {
                $('.title-menu-cnt').fadeIn( "slow", "linear");
            }
        },

        initializeProjectSelectorModal: function () {
            this.$modalProjectSelector = $(".modal-cnt");

            var that = this;

            $('#p-project-selector').tooltip();


            //change project initializiation
            $('#p-project-selector').click( function (ev) {
                ev.stopPropagation();

                var projects = xtens.session.get("projects");

                if (that.modal) {
                    that.modal.hide();
                }
                var modal = new ModalDialog({
                    title: i18n('project-selection'),
                    template: JST["views/templates/project-modal.ejs"],
                    data: { __: i18n, projects: projects}
                });
                $('#project-selector').selectpicker('hide');

                that.$modalProjectSelector.append(modal.render().el);
                modal.show();

                $("#checkbox").change(function() {
                    if(this.checked) {
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
                                if (location.href.includes("/#query/%7B%22queryArgs")) {
                                    location.href = location.href.split("/%7B%22queryArgs")[0];
                                }
                                location.reload();
                            });
                        });

                        $('.modal-cnt').one('hidden.bs.modal', function (e) {
                            modal.remove();
                            $('.modal-backdrop').remove();
                        });
                    }
                    else {
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


        initialize : function(){
            _.bindAll(this);
            this.template = JST['views/templates/menu-navbar-login.ejs'];
            this.render();
        },

        render: function() {
            $('.navbar-cnt').html(this.template({ __:i18n }));
            return this;
        }

    });



} (xtens, xtens.module("session")));
