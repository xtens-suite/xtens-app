/**
 * @author  Massimiliano Izzo
 * @description This file contains the Backbone classes for handling DataType
 *              models, collections and views
 */
(function (xtens, DataType) {
    // dependencies
    var i18n = xtens.module("i18n").en;
    var Constants = xtens.module("xtensconstants").Constants;
    var DataTypeClasses = xtens.module("xtensconstants").DataTypeClasses;
    var MetadataComponent = xtens.module("metadatacomponent");
    var MetadataGroup = xtens.module("metadatagroup");
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;
    var SuperType = xtens.module("supertype");

    // XTENS router alias
    var router = xtens.router;

    // options object for Parsley Validation
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

    /**
     * @class
     * @name DataType.Model
     *  define a DataType model
     */
    DataType.Model = Backbone.Model.extend({

        // defaults: {
        //     model: DataTypeClasses.DATA
        // },

        urlRoot: '/dataType'

    });

    DataType.List = Backbone.Collection.extend({
        url: '/dataType',
        model: DataType.Model
    });

    /**
     * This is the view to create/edit the DataType
     */

    DataType.Views.Edit = MetadataComponent.Views.Edit.fullExtend({
        events: {
            'submit .edit-datatype-form': 'saveDataType',
            'click .add-metadata-group': 'addMetadataGroupOnClick', // not used yet
            'click button.delete': 'deleteDataType',
            'change select#project': 'getProjectParents'
            // 'change select#super-type': 'superTypeOnChange',
            // "change #schemaBody": "schemaOnChange"
        },

        tagName: 'div',
        className: 'dataType',

        initialize: function (options) {
            // _.bindAll(this, 'fetchSuccess');
            $("#main").html(this.el);
            this.template = JST["views/templates/datatype-edit.ejs"];
            this.nestedViews = [];
            this.idDataType = parseInt(options.params.id) ? parseInt(options.params.id) : parseInt(options.params.duplicate);
            this.duplicate = options.params.duplicate ? options.params.duplicate : false;
            this.existingDataTypes = options.dataTypes;
            this.isMultiProject = options.isMultiProject && options.isMultiProject;
            this.projects = xtens.session.get('projects');
            this.isCreation = true;

            var that = this;
            this.model = this.idDataType ? new DataType.Model(_.find(this.existingDataTypes, function (dt) { return dt.id === that.idDataType; })) : new DataType.Model();
            this.stModel = this.idDataType || this.duplicate ? new SuperType.Model(this.model.get('superType')) : new SuperType.Model();

            // if options.params.duplicate exist unset id and set the right project
            if (this.duplicate) {
                this.model.unset('id');
                var project = _.find(this.projects, { 'id': _.parseInt(options.params.projectDest) });
                this.model.set('project', project);
            }

            this.superTypeView = new SuperType.Views.Edit({
                model: this.stModel
            });

            this.render();
            this.listenTo(this.model, 'invalid', this.handleValidationErrors);
            this.$("#super-type-cnt").append(this.superTypeView.render().el);
            if (this.idDataType) {
                $('#st-name').attr("disabled", true);
                $('#uri').attr("disabled", true);
                $('#model').attr("disabled", true);
                // $('#biobankPrefix').prop("disabled", true);
                // $('#getParentCode').prop("disabled", true);
                if (this.model.get('model') === "Sample") {
                    $('.biobankPrefix-container').removeAttr("hidden");
                }
                if (_.indexOf($('#parents').val().map(Number), this.idDataType) >= 0) {
                    $('.noparent-container').css("display", "");
                }
            }
            $('#parents').on('change', function () {
                if (that.model.get('model') === "Sample") {
                    // var selectedParents = _.filter(that.existingDataTypes, function (d) { return _.indexOf($('#parents').val().map(Number), d.id) >= 0; });
                    if (_.indexOf($('#parents').val().map(Number), that.idDataType) >= 0) {
                        $('.noparent-container').css("display", "");
                    } else {
                        that.model.set('ifParentNoPrefix', false);
                        $('.noparent-container').css("display", "none");
                    }
                } else {
                    that.model.set('ifParentNoPrefix', false);
                }
            });
        },

        bindings: {
            '#name': {
                observe: 'name'
            },

            '#biobankPrefix': {
                observe: 'biobankPrefix'
            },

            '#getParentCode': {
                observe: 'getParentCode'
            },

            '#ifParentNoPrefix': {
                observe: 'ifParentNoPrefix'
            },

            '#model': {
                observe: 'model',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                },
                selectOptions: {
                    collection: function () {
                        var coll = [];
                        _.each(DataTypeClasses, function (value) {
                            coll.push({ label: value.toUpperCase(), value: value });
                        });
                        return coll;
                    },
                    defaultOption: {
                        label: '',
                        value: null
                    }
                }
            },
            '#project': {
                observe: 'project',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                },
                selectOptions: {
                    collection: 'this.projects',
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function (val) {
                    return val && val.id;
                }
            },
            '#parents': {
                observe: 'parents',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                },
                selectOptions: {
                    collection: 'this.existingDataTypes',
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                getVal: function ($el, ev, options) {
                    return $el.val() && $el.val().map(function (value) {
                        return _.find(options.view.existingDataTypes, { id: parseInt(value) });
                    });
                },
                onGet: function (vals) {
                    return (vals && vals.map(function (val) { return val.id; }));
                }
            }
        },

        getProjectParents: function (ev) {
            var selProject = ev ? _.parseInt(ev.target.value) : _.parseInt($('#project').val());
            var filteredValues = []; var newColl = [];

            this.existingDataTypes.forEach(function (dt) {
                if (dt.project.id === selProject) {
                    newColl.push({ label: dt.name, value: dt.id });
                }
            });
            newColl.forEach(function (dt) {
                _.find($('#parents').val(), function (val) {
                    if (dt.value === _.parseInt(val)) {
                        filteredValues.push(val);
                    }
                });
            });
            var options = { selectOptions: { collection: newColl } };
            Backbone.Stickit.getConfiguration($('#parents')).update($('#parents'), filteredValues, {}, options);
            $('#parents').val(filteredValues).trigger("change");
        },

        render: function () {
            var that = this;

            this.$el.html(this.template({ __: i18n, dataType: this.model, isMultiProject: this.isMultiProject }));
            this.$form = this.$("form");
            this.$form.parsley(parsleyOpts);
            this.$modal = $(".modal-cnt");
            this.stickit();

            if (xtens.session.get('activeProject') !== 'all' && !this.duplicate) {
                this.activeProject = _.find(this.projects, function (p) {
                    return p.name === xtens.session.get('activeProject');
                });
                $('#project').val(this.activeProject.id).trigger('change');
                $('#project').prop('disabled', true);
                this.getProjectParents();
            }

            $('#model').on('change', function (event) {
                var currentModel = event.currentTarget.value;
                if (currentModel === "Sample") {
                    $('.biobankPrefix-container').removeAttr("hidden");
                    $('#biobankPrefix').prop("required", true);
                } else {
                    $('.biobankPrefix-container').prop("hidden", true);
                    $('#biobankPrefix').removeAttr("required");
                }
                that.$form.parsley(parsleyOpts);
            });

            if (this.idDataType) {
                this.getProjectParents();
                $('#project').prop('disabled', true);
                this.isCreation = false;
            }

            if (this.model.get("superType") && this.model.get("superType").schema && _.isArray(this.model.get('superType').schema.body)) {
                var body = this.model.get('superType').schema.body;
                for (var i = 0, len = body.length; i < len; i++) {
                    this.add(body[i]);
                }
            }

            // creation
            if (!this.idDataType && !this.duplicate) {
                $("#schema-title-icon").append('<i class="fa fa-unlock-alt fa-lg right"></i>');
                $('#collapse-schema').collapse('show');
                $('.bg-transition').removeClass('bg-transition');
                $('#schema-title').css('cursor', 'default');
            }
            // duplication or edit
            if (this.idDataType) {
                $("#schema-title-icon").append('<i class="fa fa-lock fa-lg right"></i>');
                if (this.duplicate) {
                    $("#model").attr("disabled", true);
                    $("#schemaBody :input").attr("disabled", true);
                    $(".add-metadata-group").attr("disabled", true);
                    $('#collapse-schema').collapse('show');
                } else {
                    // edit
                    if (this.isMultiProject) {
                        $(".panel-heading").on('click', function () {
                            if ($('.fa-unlock-alt').length === 0) {
                                if (that.modal) {
                                    that.modal.hide();
                                }
                                var modal = new ModalDialog({
                                    template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                                    title: i18n('confirm-edit'),
                                    body: i18n('edit-data-type-schema-warning'),
                                    type: i18n("edit")
                                });

                                that.$modal.append(modal.render().el);
                                modal.show();
                                $('#confirm').addClass('btn-warning');

                                $('#confirm').click(function (e) {
                                    e.preventDefault();
                                    modal.hide();
                                    $('.modal-cnt').one('hidden.bs.modal', function (e) {
                                        e.preventDefault();
                                        modal.remove();
                                        $("#schema-title-icon").empty();
                                        $("#schema-title-icon").append('<i class="fa fa-unlock-alt fa-lg right"></i>');
                                        $(".add-metadata-group").attr("disabled", false);
                                        $('.bg-transition').removeClass('bg-transition');
                                        $('#schema-title').css('cursor', 'default');
                                        setTimeout(function () { $('#collapse-schema').collapse('show'); }, 150);
                                    });
                                });
                            }
                        });
                    } else {
                        $("#schema-title-icon").empty();
                        $("#schema-title-icon").append('<i class="fa fa-unlock-alt fa-lg right"></i>');
                        $(".add-metadata-group").attr("disabled", false);
                        $('.bg-transition').removeClass('bg-transition');
                        $('#schema-title').css('cursor', 'default');
                        setTimeout(function () { $('#collapse-schema').collapse('show'); }, 150);
                    }
                }
            }

            $('input[name=name]').on('focusout', function (e) {
                var name = e.currentTarget.value;
                var namesArray = $('input[name=name]').map(function () { return this.value; });
                // var namesArray = _.map(_.flatten(_.map(that.stModel.attributes.schema.body, 'content')),'name');
                if (_.filter(namesArray, function (n) { return n === name; }).length > 1) {
                    e.currentTarget.value = null;
                    $.notify('Invalid Name attibute, name already used', {
                        type: 'danger',
                        delay: 1500,
                        allow_dismiss: false,
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });
                }
            });

            return this;
        },

        /**
         * @description show a list of the validation errors. So far it just alert the first error
         */
        handleValidationErrors: function () {
            alert(this.model.validationError[0].message);
        },

        serialize: function () {
            var metadataBody = [];
            for (var i = 0, len = this.nestedViews.length; i < len; i++) {
                metadataBody.push(this.nestedViews[i].serialize());
            }
            return metadataBody;
        },

        saveDataType: function (ev) {
            ev.preventDefault();
            var id = $('#id').val();
            var header = this.$("#schemaHeader").find("select, input, textarea").serializeObject();
            header.fileUpload = !!header.fileUpload;
            this.model.get("project").id ? header.project = this.model.get("project").id : header.project = this.model.get("project");

            var dataTypeDetails = {
                id: id,
                name: header.name
            };
            this.model.set("parents", _.map(this.model.get("parents"), 'id'));
            if (this.model.get("project").id) {
                this.model.set("project", this.model.get("project").id);
            }

            // if (this.superTypeView && this.superTypeView.model) {
            var body = this.serialize();
            this.stModel.attributes.schema = {
                header: _.omit(header, 'parents', 'biobankPrefix'), // parent-child many-to-many associations are not currently saved in the JSON schema
                body: body
            };
            this.model.set("superType", _.clone(this.stModel.attributes));
            var that = this;

            that.model.save(dataTypeDetails, {
                //  patch: true,
                success: function (dataType) {
                    if (that.modal) {
                        that.modal.hide();
                    }
                    var modal = new ModalDialog({
                        title: i18n('ok'),
                        body: i18n('datatype-correctly-stored-on-server')
                    });
                    that.$modal.append(modal.render().el);
                    $('.modal-header').addClass('alert-success');
                    modal.show();

                    setTimeout(function () { modal.hide(); }, 1200);
                    $('.modal-cnt').one('hidden.bs.modal', function (e) {
                        e.preventDefault();
                        modal.remove();
                        if (xtens.session.get("isWheel") || !that.isCreation) {
                            router.navigate('datatypes', { trigger: true });
                        } else {
                            router.navigate('datatypeprivileges/new/0?dataTypeId=' + dataType.get("id"), { trigger: true });
                        }
                    });
                },
                error: function (_model, res) {
                    xtens.error(res);
                }
            });
            return false;
        },

        deleteDataType: function (ev) {
            ev.preventDefault();
            var that = this;
            if (this.modal) {
                this.modal.hide();
            }

            var modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-deletion'),
                body: i18n('datatype-will-be-permanently-deleted-are-you-sure'),
                type: i18n("delete")
            });

            this.$modal.append(modal.render().el);
            modal.show();

            $('#confirm').click(function () {
                modal.hide();

                that.model.destroy({
                    success: function () {
                        that.$modal.one('hidden.bs.modal', function () {
                            modal.template = JST["views/templates/dialog-bootstrap.ejs"];
                            modal.title = i18n('ok');
                            modal.body = i18n('datatype-deleted');
                            that.$modal.append(modal.render().el);
                            $('.modal-header').removeClass('alert-danger');
                            $('.modal-header').addClass('alert-success');
                            modal.show();
                            setTimeout(function () { modal.hide(); }, 1200);
                            that.$modal.one('hidden.bs.modal', function (e) {
                                modal.remove();
                                xtens.router.navigate('datatypes', { trigger: true });
                            });
                        });
                    },
                    error: function (model, res) {
                        xtens.error(res);
                    }
                });
                return false;
            });
        },

        addMetadataGroupOnClick: function (ev) {
            this.add({ label: Constants.METADATA_GROUP });
            ev.stopPropagation();
        },

        add: function (group) {
            var model = new MetadataGroup.Model();
            model.set(group);
            var view = new MetadataGroup.Views.Edit({ model: model });
            this.$("#schemaBody").append(view.render().el);
            this.listenTo(view, 'closeMe', this.removeChild);
            this.nestedViews.push(view);
        }

    });

    /**
     *  This is the view to show in a table the full list of existing datatypes
     */
    DataType.Views.List = Backbone.View.extend({
        events: {
            'click #duplicate': 'setDuplicationParams'
        },

        tagName: 'div',
        className: 'dataTypes',

        initialize: function (options) {
            $("#main").html(this.el);
            this.dataTypes = options.dataTypes;
            this.projectSource = xtens.session.get('activeProject') != 'all' ? _.find(xtens.session.get('projects'), function (p) { return p.name === xtens.session.get('activeProject'); }).id : null;
            this.template = JST["views/templates/datatype-list.ejs"];
            this.render(options);
        },

        render: function (options) {
            this.$el.html(this.template({ __: i18n, dataTypes: this.dataTypes.models }));
            this.$modal = $(".modal-cnt");
            xtens.session.get("projects").length < 2 ? $('#duplicate').prop('disabled', true) : null;
            var table = $('.table').DataTable({
                scrollY: '50vh',
                scrollCollapse: true,
                "searching": true
                // "columnDefs": [
                //   { "visible": false, "targets": 1 }
                // ]
            });
            // this.filterDataTypes(options.queryParams);
            var filter = options.queryParams && options.queryParams.projects ? options.queryParams.projects : xtens.session.get('activeProject');
            if (filter != 'all') {
                filter += " ";
                table.search(filter).draw();
            }
            return this;
        },

        filterDataTypes: function (opt) {
            var rex = opt && opt.projects ? new RegExp(opt.projects) : new RegExp(xtens.session.get('activeProject'));

            if (rex == "/all/") { this.clearFilter(); } else {
                $('.content').hide();
                $('.content').filter(function () {
                    return rex.test($(this).text());
                }).show();
            }
        },

        clearFilter: function () {
            // $('#project-selector').val('');
            $('.content').show();
        },

        setDuplicationParams: function (ev) {
            ev.preventDefault();
            var that = this;
            // create and render the modal
            var modal = new ModalDialog({
                title: i18n('duplicate-data-type'),
                template: JST["views/templates/datatype-duplicate.ejs"],
                data: { __: i18n, dataTypes: this.dataTypes.toJSON(), projectSource: this.projectSource }
            });
            this.$modal.append(modal.render().el);

            // initalize select forms
            $('#project-source').selectpicker();
            $('#data-type-selector').selectpicker('hide');
            $('#project-dest').selectpicker('hide');

            modal.show();
            if (xtens.session.get("activeProject") != "all") {
                $('#project-source option[value=' + this.projectSource + ']').prop('disabled', true);
                $('#project-source').selectpicker('refresh');
            }

            $('#project-source').on('change.bs.select', function () {
                var projectSource = $('#project-source').val();
                var projectName = $('#project-source option:selected').text();
                $("label[for='data-type']").prop('hidden', false);
                var filteredDatatypes = that.dataTypes.toJSON().filter(function (d) { return d.project.id == parseInt(projectSource); });
                var html = "<optgroup label='" + projectName + "' id=" + projectSource + ">";
                _.forEach(filteredDatatypes, function (dt) {
                    html = html + '<option value=' + dt.id + '>' + dt.name + '</option>';
                });
                html = html + '</optgroup>';
                $('#data-type-selector').html(html);
                $('#data-type-selector').selectpicker('show');
                $('#data-type-selector').selectpicker('refresh');
                $('#project-dest option').removeClass('hidden');
                $('#project-dest option[value=' + projectSource + ']').addClass('hidden');
                $('#project-dest').selectpicker('refresh');

                $('#data-type-selector').on('change.bs.select', function () {
                    var dataTypeSelected = $('#data-type-selector').val();
                    $("label[for='project-dest']").prop('hidden', false);
                    $('#project-dest').selectpicker('show');
                    if (xtens.session.get("activeProject") != "all") {
                        $('#project-dest').selectpicker('val', _.find(xtens.session.get('projects'), function (p) { return p.name === xtens.session.get('activeProject'); }).id);
                        $('#confirm-duplication').prop('disabled', false);
                        $('#confirm-duplication').addClass('btn-success');
                    }
                    $('#project-dest').selectpicker('refresh');

                    // var projectDest = $('#project-dest').val();
                    $('#confirm-duplication').on('click.bs.button', function (e) {
                        e.preventDefault();

                        modal.hide();
                        that.$modal.one('hidden.bs.modal', function (e) {
                            modal.remove();
                            router.navigate('#/datatypes/new?duplicate=' + dataTypeSelected + '&projectDest=' + $('#project-dest').val(), { trigger: true });
                        });
                    });

                    $('#project-dest').on('change.bs.select', function () {
                        // $('#confirm-duplication').text( i18n('confirm') + " " + e.target.value);
                        $('#confirm-duplication').prop('disabled', false);
                        $('#confirm-duplication').addClass('btn-success');
                    });
                });
            });
        }

    });

    DataType.Views.Graph = Backbone.View.extend({

        tagName: 'div',
        className: 'dataTypes',

        events: {
            'click #graph': 'createGraph'
        },

        initialize: function () {
            $('#main').html(this.el);
            this.template = JST["views/templates/datatype-graph.ejs"];
            this.render();
        },

        render: function () {
            var idProject = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'), function (p) { return p.name === xtens.session.get('activeProject'); }).id : undefined;
            var criteria = {
                sort: 'created_at ASC'
            };
            idProject ? criteria.project = idProject : null;

            var that = this;
            var dataTypes = new DataType.List();
            dataTypes.fetch({
                data: $.param(criteria),
                success: function (dataTypes) {
                    that.$el.html(that.template({ __: i18n, dataTypes: dataTypes.models }));
                },
                error: function () {
                    that.$el.html(that.template({ __: i18n }));
                }
            });

            return this;
        },

        createGraph: function () {
            var selectedDatatype = document.getElementById('select1').value.split('-@#@-');
            var idDatatype = selectedDatatype[0];
            var nameDatatype = selectedDatatype[1];
            // retrieve all the descendant samples and data for the given datatype

            $.ajax({
                type: 'POST',
                url: '/graph',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: { idDataType: idDatatype },
                beforeSend: function () { $('.loader-gif').css("display", "block"); },
                success: function (res, textStatus, jqXHR) {
                    // Get parentWidth
                    var parentWidth = d3.select('#main')._groups[0];
                    // clean the previous graph if present
                    d3.select("#data-type-graph")
                        .remove();
                    var graph = jqXHR.responseJSON;

                    var data = graph.links;

                    var maxDepth;
                    function findMaxDepth (arr) {
                        var temp = 0;
                        for (var i = 0, len = arr.length; i < len; i++) {
                            if (arr[i].depth > temp) {
                                temp = arr[i].depth;
                            }
                        }
                        return temp + 0.5;
                    }
                    maxDepth = findMaxDepth(data);
                    // set margins, dynamic width and height of the svg container
                    var margin = { top: 40, right: 120, bottom: 40, left: 120 };
                    var width = parentWidth[0].offsetWidth - margin.left - margin.right;
                    var height = (180 * maxDepth) - margin.top - margin.bottom;

                    // generate a data hierarchy tree
                    var tree = d3.tree()
                        .size([height, width]);

                    // function to draw the slanted arcs
                    // var diagonal = d3.svg.diagonal()
                    //     .projection(function (d) {
                    //         return [d.x, d.y - 39];
                    //     }
                    //     );

                    // create the svg container
                    var svg = d3.select("#main").append("svg")
                        .attr("id", "data-type-graph")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .style("margin-top", "2vh")
                        .attr("overflow-y", "auto");
                    var g = svg.append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

                    var nodesByName = {};

                    // console.log(links);

                    // Create nodes for each unique source and target.
                    data.forEach(function (link) {
                        var parent, child;
                        if (link.target !== null) {
                            parent = link.source = nodeByName(link.source.toUpperCase() + ' ' + link.source_template.toLowerCase());
                            child = link.target = nodeByName(link.target.toUpperCase() + ' ' + link.target_template.toLowerCase());
                        } else {
                            parent = link.source = nodeByName(link.source.toUpperCase() + ' ' + link.source_template.toLowerCase());
                            child = link.target = nodeByName(link.target);
                        }
                        if (parent.children) parent.children.push(child);
                        else parent.children = [child];
                    });

                    // Define countDepth to count nodes for every depth
                    var index, i1;
                    var countDepth = new Array(data.length);

                    // find the root node
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].source.name === nameDatatype) {
                            index = i;
                        }
                        i1 = data[i].depth;
                        countDepth[i] = 0;
                    }

                    // generate the tree
                    // var nodes = tree.nodes(links[0].source);
                    // nodes = _.uniq(nodes, 'name');
                    // console.log(nodes);
                    var treeRoot = d3.hierarchy(data[0].source);
                    tree(treeRoot);
                    // nodes
                    var nodes = treeRoot.descendants();
                    var groupedNodes = _.groupBy(nodes, function (n) { return n.data.name; });
                    var maxDepthNodes = _.map(groupedNodes, function (arr) { return _.max(arr, function (node) { return node.depth; }); });
                    nodes = _.uniq(maxDepthNodes, function (n) {
                        return n.data.name;
                    });
                    // links
                    var links = treeRoot.links();
                    links = _.uniq(links, function (n) {
                        return [n.source.data.name, n.target.data.name].join();
                    });
                    // Count nodes/depth
                    nodes.forEach(function (d) {
                        countDepth[d.depth] = countDepth[d.depth] + 1;
                    });

                    var c = new Array(links.length);
                    // for each node define its position dynamically
                    nodes.forEach(function (d) {
                        d.y = d.depth * 150;
                        if (d.depth === 0) { d.x = width / 2; }
                        if (!isNaN(countDepth[d.depth]) && (countDepth[d.depth] !== 1 || d.x >= width)) {
                            if (isNaN(c[d.depth])) { c[d.depth] = 0; }
                            c[d.depth] = c[d.depth] + 1;
                            d.x = ((c[d.depth] / countDepth[d.depth]) * width - (1 / countDepth[d.depth]) * width / 2);
                        }
                    });
                    function getRandomInt (min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min)) + min; // Il max è escluso e il min è incluso
                    }
                    function getRandomColor () {
                        var letters = 'ABCDEF'.split('');
                        var color = '#';
                        color += letters[Math.round(Math.random() * 5)];
                        letters = '0123456789ABCDEF'.split('');
                        for (var i = 0; i < 5; i++) {
                            color += letters[Math.round(Math.random() * 15)];
                        }
                        return color;
                    }

                    // draw the links
                    var link = g.selectAll(".link")
                        .data(links)
                        .enter().append("path")
                        .attr("class", "link")
                        // .style("stroke-dasharray", function () {
                        //     var value = getRandomInt(5, 10);
                        //     return "" + value + "," + value;
                        // })
                        .style("stroke", function (d) {
                            return getRandomColor();
                        })
                        .attr("marker-end", "url(#arrowhead)")
                        .attr("d", function (d) {
                            var targetNode = _.find(nodes, function (n) { return n.data.name === d.target.data.name; });
                            var sourceNode = _.find(nodes, function (n) { return n.data.name === d.source.data.name; });
                            return "M" + targetNode.x + "," + targetNode.y +
                                "C" + targetNode.x + "," + (targetNode.y + sourceNode.y) / 2 +
                                " " + sourceNode.x + "," + (targetNode.y + sourceNode.y) / 2 +
                                " " + sourceNode.x + "," + sourceNode.y;
                        });

                    // define the links format/appereance
                    // svg.append("svg:defs").selectAll("marker")
                    //     .data(links)
                    //     .enter().append("svg:marker")
                    //     .attr("id", "arrowhead")
                    //     .attr("viewBox", "0 -5 10 10")
                    //     .attr("refX", 10)
                    //     .attr("refY", 1.5)
                    //     .attr("markerWidth", 5)
                    //     .attr("markerHeight", 5)
                    //     .attr("orient", "auto")
                    //     .attr("stroke", "grey")
                    //     .attr("stroke-width", 10)
                    //     .append("path")
                    //     .attr("d", "M0,0L100,100,200,200");

                    // draw the nodes
                    var node = g.selectAll(".node")
                        .data(nodes)
                        .enter()
                        .append("ellipse")
                        .attr("id", function (d) {
                            var arr = d.data.name.split(" ");
                            return arr[arr.length - 1];
                        })
                        .attr("class", function (d) {
                            return "node" +
                                (d.children ? " node--internal" : " node--leaf");
                        })
                        .attr("rx", 54)
                        .attr("ry", 39)
                        .attr("transform", function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    // append the title on the nodes
                    svg.append("g").selectAll("text")
                        .data(nodes)
                        .enter().append("text")
                        .each(function (d) {
                            if (d.data.name !== null) {
                                var arr = d.data.name.split(" ");
                                if (arr !== undefined) {
                                    for (var i = 0; i < arr.length; i++) {
                                        d3.select(this).append("tspan")
                                            .text(arr[i])
                                            .attr("y", function (d) {
                                                if (i === arr.length - 123942) {
                                                    return (d.y - 6 * (arr.length - 1) + (12) * i + 6) + margin.top;
                                                }
                                                return (d.y - 6 * (arr.length - 1) + (12) * i + 3) + margin.top;
                                            })
                                            .attr("x", function (d) {
                                                return d.x + margin.left;
                                            })
                                            .attr("id", function () {
                                                if (i === arr.length - 1) {
                                                    return arr[i];
                                                }
                                            })
                                            .style("font-size", "12px")
                                            .style("font-weight", function () {
                                                if (i !== arr.length - 1) {
                                                    return "bold";
                                                }
                                            })
                                            .attr("text-anchor", "middle")
                                            .attr("class", "tspan" + i);
                                    }
                                }
                            }
                        });

                    $('.loader-gif').css("display", "none");
                    function nodeByName (name) {
                        return nodesByName[name] || (nodesByName[name] = { name: name });
                    }
                }, /* success */
                error: function (jqXHR, textStatus, err) {
                    alert(err);
                }
            });
        }
    });
}(xtens, xtens.module("datatype")));
