/**
 * @author  Massimiliano Izzo
 * @description This file conatins all the Backbone classes for handling Subjects
 */

(function (xtens, Subject) {
    // TODO: retrieve this info FROM DATABASE ideally or from the server-side anyway
    var useFormattedNames = xtens.module("xtensconstants").useFormattedMetadataFieldNames;
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;
    var i18n = xtens.module("i18n").en;
    var Data = xtens.module("data");
    // var DataTypeModel = xtens.module("datatype").Model;
    // var SuperTypeModel = xtens.module("supertype").Model;
    var PersonalDetails = xtens.module("personaldetails");
    var Classes = xtens.module("xtensconstants").DataTypeClasses;
    var sexOptions = xtens.module("xtensconstants").SexOptions;

    var MISSING_VALUE_ALERT = true;

    /*
       function initializeProjectsField($el, model, option) {
       var data =
       } */

    Subject.Model = Data.Model.fullExtend({
        urlRoot: '/subject',

        defaults: {
            sex: sexOptions.UNKNOWN
            // projects: []
        }
    });

    Subject.List = Backbone.Collection.extend({
        model: Subject.Model,
        url: '/subject'
    });

    Subject.Views.Edit = Data.Views.Edit.fullExtend({

        bindings: {

            '#owner': {
                observe: 'owner',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                },
                selectOptions: {
                    collection: function () {
                        var coll = [];
                        _.each(this.operators, function (op) {
                            coll.push({ label: op.lastName + ' ' + op.firstName, value: op.id });
                        });
                        return coll;
                    },
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function (val) {
                    return val && val.id;
                }
            },

            '#code': {
                observe: 'code'
            },

            '#sex': {
                observe: 'sex',
                initialize: function ($el) {
                    var data = [];
                    _.each(sexOptions, function (sexOption) {
                        data.push({ id: sexOption, text: sexOption });
                    });
                    $el.select2({
                        placeholder: i18n("please-select"),
                        data: data
                    });
                }
            },

            '#tags': {
                observe: 'tags',
                getVal: function ($el, ev, option) {
                    return $el.val().split(",");
                }

            },

            '#notes': {
                observe: 'notes'
            }

        },

        initialize: function (options) {
            // _.bindAll(this, 'fetchSuccess');
            $('#main').html(this.el);
            this.dataTypes = options.dataTypes;
            this.template = JST["views/templates/subject-edit.ejs"];
            this.personalDetailsView = null;
            this.schemaView = null;
            this.savingSubject = false;
            this.operators = options.operators ? options.operators : [];
            if (xtens.session.get('activeProject') !== 'all') {
                this.project = _.parseInt(_.find(xtens.session.get('projects'), { name: xtens.session.get('activeProject') }).id);
                this.dataType = _.find(this.dataTypes, { 'project': this.project });
            }
            if (options.subject) {
                this.model = new Subject.Model(options.subject);
            } else {
                this.model = new Subject.Model();
            }
            this.render();
            if (!options.subject) {
                if (this.dataType) {
                    this.model.set("type", this.dataType.id);
                } else {
                    this.setDataTypeSelection();
                }
            }
            // !options.subject ? this.dataType ? this.model.set("type", this.dataType.id) : this.setDataTypeSelection() : null;
            if (xtens.session.get('canAccessPersonalData')) {
                this.addPersonalDetailsView();
                var that = this;
                $('.personaldetails-input').focusout(function (e) {
                    that.personalDetailsView.setParsleyRequired();
                });
            }
        },

        setDataTypeSelection: function () {
            var $divForm = $('<div>').addClass('form-group metadataform-group');
            var $divInput = $('<div>').addClass('data-input-div');

            var $select = $('<select>').addClass('form-control').attr({
                'id': 'data-type',
                'name': 'data-type'
            });
            $divInput.append($select);
            var $label = $('<label>').addClass('data-label').attr({ 'for': 'data-type' }).text(i18n("data-type"));
            $divForm.append($label).append($divInput);
            $('#metadataform-group-cnt').prepend($divForm);
            this.addBinding(null, '#data-type', {
                observe: 'type',

                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                },
                selectOptions: {
                    collection: function () {
                        var coll = [];
                        _.each(this.dataTypes, function (dt) {
                            var dtProject = _.find(xtens.session.get("projects"), { id: dt.project });
                            if (xtens.session.get("activeProject") === 'all' || (dtProject && dtProject.name === xtens.session.get("activeProject"))) {
                                coll.push({
                                    label: dt.name.toUpperCase() + " - " + dtProject.name.toLowerCase(),
                                    value: dt.id
                                });
                            }
                        });
                        return coll;
                    },
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                getVal: function ($el) {
                    return $el.val() && _.parseInt($el.val());
                },
                onGet: function (val) {
                    return val && _.isObject(val) ? val.id : val;
                }
            });
        },

        // render : function () {
        //     this.$el.html(this.template({__: i18n, data: this.model}));
        //
        //     this.$form = this.$('form');
        //     this.$form.parsley(parsleyOpts);
        //     return this;
        // },

        events: {
            "submit .edit-subject-form": "saveSubject",
            "click button.delete": "deleteSubject"
        },

        /**
         * @method
         * @name saveData
         * @description retrieve all the Subject properties from the form (the metadata value(s)-unit(s) pairs, the files' paths, etc...)
         *              and save the Subject model on the server
         * @param {event} - the form submission event
         * @return {false} - to suppress the HTML form submission
         * @override
         */
        saveSubject: function (ev) {
            this.savingSubject = true;
            this.$modal = $(".modal-cnt");
            var that = this;
            var metadata = this.schemaView && this.schemaView.serialize(useFormattedNames);
            this.model.set("metadata", metadata);
            // this.model.set("type", this.model.get("type").id); // trying to send only the id to permorf POST or PUT
            if (this.personalDetailsView && this.personalDetailsView.model) {
                this.model.set("personalInfo", _.clone(this.personalDetailsView.model.attributes));
                var personalInfo = this.model.get("personalInfo");
                if ((!personalInfo.givenName || personalInfo.givenName == "") && (!personalInfo.surname || personalInfo.surname == "") && (!personalInfo.birthDate || personalInfo.birthDate == "")) {
                    this.model.set("personalInfo", null);
                }
            } else {
                this.model.set("personalInfo", null);
            }

            if (this.model.get("notes") === "") {
                this.model.set("notes", null);
            }
            var ownerBkp = this.model.get("owner");
            if (this.model.get("owner").id) {
                this.model.set("owner", this.model.get("owner").id);
            }
            // this.model.get("notes") === "" ? this.model.set("notes", null) : null;
            // this.model.get("owner").id ? this.model.set("owner", this.model.get("owner").id) : null;

            this.model.save(null, {
                success: function (subject) {
                    if (that.modal) {
                        that.modal.hide();
                    }
                    var modal = new ModalDialog({
                        title: i18n('ok'),
                        body: i18n('subject-correctly-stored-on-server')
                    });
                    that.$modal.append(modal.render().el);
                    $('.modal-header').addClass('alert-success');
                    modal.show();
                    setTimeout(function () { modal.hide(); }, 1200);
                    $('.modal-cnt').one('hidden.bs.modal', function (e) {
                        e.preventDefault();
                        modal.remove();
                        this.savingSubject = false;

                        window.history.back();
                        // xtens.router.navigate('subjects', { trigger: true });
                    });
                },
                error: function (model, res) {
                    that.model.set("owner", ownerBkp);
                    that.savingSubject = false;
                    xtens.error(res);
                }
            });
            return false;
        },

        deleteSubject: function (ev) {
            this.savingSubject = true;
            ev.preventDefault();
            var that = this;
            this.$modal = $(".modal-cnt");
            if (this.modal) {
                this.modal.hide();
            }

            var modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-deletion'),
                body: i18n('subject-will-be-permanently-deleted-are-you-sure'),
                type: i18n("delete")
            });

            this.$modal.append(modal.render().el);
            modal.show();

            $('#confirm').click(function (e) {
                modal.hide();
                that.$modal.one('hidden.bs.modal', function (e) {
                    $('.waiting-modal').modal('show');
                    var targetRoute = $(ev.currentTarget).data('targetRoute') || 'subjects';

                    that.model.destroy({
                        success: function (model, res) {
                            $('.waiting-modal').modal('hide');
                            modal.template = JST["views/templates/dialog-bootstrap.ejs"];
                            modal.title = i18n('ok');
                            modal.body = i18n('subject-deleted');
                            that.$modal.append(modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            modal.show();
                            setTimeout(function () { modal.hide(); }, 1200);
                            that.$modal.one('hidden.bs.modal', function (e) {
                                modal.remove();
                                this.savingSubject = false;
                                window.history.back();
                                // xtens.router.navigate(targetRoute, { trigger: true });
                            });
                        },
                        error: function (model, res) {
                            this.savingSubject = false;
                            xtens.error(res);
                        }
                    });
                });
                return false;
            });
        },

        dataTypeOnChange: function () {
            Data.Views.Edit.prototype.dataTypeOnChange.call(this);
            this.getNextCode();
        },

        getNextCode: function () {
            var that = this;

            var subject = {
                type: this.model.get('type') ? this.model.get('type').id ? this.model.get('type').id : this.model.get('type') : this.dataType.id
                // code: this.model.get('code') ? this.model.get('code') : null
            };

            $.ajax({
                url: '/subject/getNextSubjectCode',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: subject,
                contentType: 'application/json',
                success: function (result) {
                    that.model.set('code', result);
                },
                error: function (err) {
                    xtens.error(err);
                }
            });
        },

        addPersonalDetailsView: function () {
            var model = new PersonalDetails.Model(this.model.get("personalInfo"));
            this.personalDetailsView = new PersonalDetails.Views.Edit({ model: model });
            // var $parent = $(ev.currentTarget).parent();
            this.$('#personal-details').empty();
            this.$('#personal-details').append(this.personalDetailsView.render().el);
        }

    });

    /**
     * @class
     * @name Subject.Views.Details
     * @extends Data.Views.Details
     * @description view containing the details (metadata and files) of a Subject (Subject.Model) instance
     */
    Subject.Views.Details = Data.Views.Details.fullExtend({

        events: {
            'click #moreData': 'loadResults'
        },

        /**
         * @method
         * @name initialize
         */
        initialize: function (options) {
            $("#main").html(this.el);
            this.template = JST["views/templates/subject-details.ejs"];
            this.fields = options.fields;
            this.render();
            if (xtens.session.get('canAccessPersonalData')) {
                this.addPersonalDetailsParam();
            }
        },
        render: function () {
            // var superType = new SuperTypeModel(this.model.get("type").superType);
            // var fields = superType.getFlattenedFields();

            this.$el.html(this.template({
                __: i18n,
                data: this.model,
                fields: this.fields
            }));

            if (MISSING_VALUE_ALERT) {
                this.$('div[name="metadata-value"]').filter(function () {
                    return $(this).text().trim() === '';
                }).addClass("text-warning").html(i18n("missing-value"));
            }
        },
        addPersonalDetailsParam: function () {
            var model = new PersonalDetails.Model(this.model.get("personalInfo"));
            this.personalDetailsView = new PersonalDetails.Views.Details({ model: model });
            this.$('#personal-details').empty();
            this.$('#personal-details').html(this.personalDetailsView.render().el);
        }

    });

    Subject.Views.List = Backbone.View.extend({

        events: {
            'click .pagin': 'changePage',
            'click #moreData': 'loadResults'
        },

        tagName: 'div',
        className: 'subject',

        initialize: function (options) {
            $("#main").html(this.el);
            this.dataTypes = options.dataTypes;
            this.subjects = options.subjects;
            this.listenTo(this.subjects, 'reset', this.render);
            this.headers = options.paginationHeaders;
            this.dataTypePrivileges = options.dataTypePrivileges.models;
            this.params = options.params;
            this.template = JST["views/templates/subject-list.ejs"];
            this.render();
        },

        addLinksToModels: function (subjects) {
            _.each(subjects || this.subjects.models, function (subject) {
                var privilege = _.find(this.dataTypePrivileges, function (model) { return model.get('dataType') === subject.get("type"); });
                if (privilege && privilege.get('privilegeLevel') === "edit") {
                    subject.set("editLink", "#/subjects/edit/" + subject.id);
                }
                if (privilege && privilege.get('privilegeLevel') !== "view_overview") {
                    subject.set("detailsLink", "#/subjects/details/" + subject.id);
                }
                var type = this.dataTypes.get(subject.get("type"));
                if (type && type.get("children") && type.get("children").length > 0) {
                    var sampleTypeChildren = _.where(type.get("children"), { "model": Classes.SAMPLE });
                    if (sampleTypeChildren.length) {
                        var sids = _.map(sampleTypeChildren, 'id').join();
                        subject.set("newSampleLink", "#/samples/new/0?idDataTypes=" + sids + "&donor=" + subject.id);
                    }
                    var dataTypeChildren = _.where(type.get("children"), { "model": Classes.DATA });
                    if (dataTypeChildren.length) {
                        var dids = _.map(dataTypeChildren, 'id').join();
                        subject.set("newDataLink", "#/data/new/0?idDataTypes=" + dids + "&parentSubject=" + subject.id);
                    }
                }
            }, this);
        },

        render: function (options) {
            var that = this;
            this.addLinksToModels();
            this.$el.html(this.template({ __: i18n, subjects: this.subjects.models, dataTypePrivileges: this.dataTypePrivileges, dataTypes: this.dataTypes.models }));
            this.table = this.$('.table').DataTable({
                scrollY: '50vh',
                "paging": false,
                "info": false
            });

            this.filterSubjects(this.params);
            $('#pagination').append(JST["views/templates/pagination-bar.ejs"]({
                __: i18n,
                headers: this.headers,
                rowsLenght: this.subjects.models.length,
                DEFAULT_LIMIT: xtens.module("xtensconstants").DefaultLimit
            }));
            this.setPaginationInfo();
            return this;
        },

        filterSubjects: function (opt) {
            var rex = opt && opt.projects ? new RegExp(opt.projects) : new RegExp(xtens.session.get('activeProject'));

            if (rex === "/all/") { this.clearFilter(); } else {
                $('.content').hide();
                $('.content').filter(function () {
                    return rex.test($(this).text());
                }).show();
            }
            this.headers.notFiltered = $('tr').filter(function () { return $(this).css('display') !== 'none'; }).length - 1;
        },

        clearFilter: function () {
            // $('#project-selector').val('');
            $('.content').show();
        },

        changePage: function (ev) {
            ev.preventDefault();
            var that = this;

            $.ajax({
                url: ev.target.value,
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                contentType: 'application/json',
                beforeSend: function () { $('.loader-gif').css("display", "block"); },
                success: function (results, options, res) {
                    var headers = {
                        'Link': xtens.parseLinkHeader(res.getResponseHeader('Link')),
                        'X-Total-Count': parseInt(res.getResponseHeader('X-Total-Count')),
                        'X-Page-Size': parseInt(res.getResponseHeader('X-Page-Size')),
                        'X-Total-Pages': parseInt(res.getResponseHeader('X-Total-Pages')),
                        'X-Current-Page': parseInt(res.getResponseHeader('X-Current-Page')) + 1
                    };
                    var startRow = (headers['X-Page-Size'] * parseInt(res.getResponseHeader('X-Current-Page'))) + 1;
                    var endRow = headers['X-Page-Size'] * headers['X-Current-Page'];
                    headers['startRow'] = startRow;
                    headers['endRow'] = endRow;
                    that.headers = headers;
                    // var subjects =  new Subject.List(results);
                    // that.addLinksToModels(subjects);
                    $('.loader-gif').css("display", "none");
                    that.subjects.reset(results);
                },
                error: function (err) {
                    xtens.error(err);
                }
            });
        },

        setPaginationInfo: function () {
            var links = this.headers.Link;
            var linkNames = ['previous', 'first', 'next', 'last'];
            _.forEach(linkNames, function (ln) {
                if (links[ln]) {
                    $('#' + ln).removeClass('disabled');
                    $('#' + ln).prop('disabled', false);
                    $('#' + ln).val(links[ln]);
                } else {
                    $('#' + ln).prop('disabled', true);
                    $('#' + ln).addClass('disabled');
                    $('#' + ln).val('');
                }
            });
        }

    });

    Subject.Views.DashBoard = Backbone.View.extend({
        tagName: 'div',
        className: 'subject-dashboard-cnt',

        initialize: function (options) {
            $("#main").html(this.el);
            this.template = JST["views/templates/subject-dashboard.ejs"];
            this.idPatient = options.idPatient || undefined;
            // this.dataTypes = options.dataTypes.models || undefined;
            this.subjects = options.subjects && options.subjects.toJSON();
            this.dataTypes = options.dataTypes;
            this.optionsGraph = options;

            this.render();
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));

            this.$graphCnt = $('.graph-cnt');

            this.GraphView = new Subject.Views.Graph(this.optionsGraph);
            this.$graphCnt.append(this.GraphView.render().el);
            this.GraphView.renderSelectPatient();

            return this;
        }

    });

    Subject.Views.Graph = Backbone.View.extend({

        tagName: 'div',
        className: 'subject-graph',

        events: {

            'change #subject-selector': 'createGraph'
        },

        initialize: function (options) {
            // $("#main").html(this.el);
            this.template = JST["views/templates/subject-graph.ejs"];
            this.idPatient = options.idPatient || undefined;
            // this.dataTypes = options.dataTypes.models || undefined;
            this.subjects = options.subjects && options.subjects.toJSON();
            this.dataTypes = options.dataTypes;
            this.data = [];
            this.itemsVisibility = {};
            // this.render();
        },

        render: function () {
            this.$el.html(this.template({ __: i18n, idPatient: this.idPatient, subjects: this.subjects }));

            if (this.idPatient) {
                this.createGraph();
                this.initRightClick();
            }

            return this;
        },

        renderSelectPatient: function () {
            $('#subject-selector').selectpicker();

            if (this.idPatient) {
                $('#subject-selector').val(this.idPatient);
                $('#subject-selector').selectpicker('refresh');
            }
        },

        createGraph: function () {
            var _this = this;

            if ($('#subject-selector').val()) {
                this.idPatient = $('#subject-selector').val();
            }

            $('.loader-gif').css("display", "block");
            // retrieve all the descendant subjects and data for the given idPatient
            $.ajax({
                url: '/subjectGraph',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: { idPatient: this.idPatient },
                // beforeSend: function () {
                //     $('.loader-gif').css("display", "block");
                // },
                success: function (res) {
                    var that = _this;
                    $('.d3-tip').remove();

                    var path = "subjects/dashboard?idPatient=" + that.idPatient;
                    xtens.router.navigate(path, { trigger: false });
                    // clean the previous graph if present
                    d3.select("#subject-svg-graph").remove();
                    that.data = res.links;

                    // set margins, width and height of the svg container
                    var margin = { top: 40, right: 120, bottom: 40, left: 120 };
                    var width = $('.subject-graph').width() - margin.left - margin.right;
                    var height = $('#content-cnt').height() - $('.navbar-cnt').height() - $('.subject-graph').height() - margin.top - margin.bottom;

                    var uniqueTypes = _.uniq(_.map(that.data, 'type'));
                    var color;

                    if (uniqueTypes.length > 10) {
                        var generatedColors = [];
                        for (var index = 0; index < uniqueTypes.length; index++) {
                            var newColor = Math.floor(Math.random() * 16777215);
                            while (_.find(generatedColors, function (gc) { return Math.abs(gc - newColor) < 100000; }) || newColor < 1000000) {
                                newColor = Math.floor(Math.random() * 16777215);
                            }
                            // newColor = newColor.toString(16);
                            generatedColors.push(newColor);
                        }
                        generatedColors = _.map(generatedColors, function (gc) { return '#' + gc.toString(16); });
                        color = d3.scaleOrdinal().range(_.values(generatedColors));
                    } else {
                        color = d3.scaleOrdinal().range(d3.schemeCategory10);
                    }

                    // generate a data hierarchy tree
                    var tree = d3.tree()
                        .size([width - 200, height])
                        // decrease the separation among nodes dividing the distance by a factor 2 for each level
                        .separation(function (a, b) { return (a.parent === b.parent ? 1 : 2) / a.depth; });

                    // create the svg container
                    var svg = d3.select(".subject-graph").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("id", "subject-svg-graph");
                    var g = svg.append("g")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, -20])
                        .html(function (d) {
                            var content = "";
                            var dato = "";

                            // return "<strong>Value:</strong> <span style='color:#4476b5'>" + d.data.value + "</span> - " + Math.floor(d.data.value / totalData * 100) + "%";
                            if (d.data.metadata !== undefined) {
                                var id = d.data.name.split("_")[1];
                                content = "<b id='tip-subj-title' style='color:" + color(d.data.type) + ";'>&nbsp;" + d.data.type + '&nbsp;</b> <br /><br />';
                                if (d.data.biobankCode) {
                                    content += "Biobank Code: " + d.data.biobankCode;
                                } else {
                                    content += "ID: " + id;
                                }
                                if (d.data.privilege !== 'view_overview') {
                                    var numberOfProperty = _.keys(d.data.metadata).length;
                                    var index = 0;
                                    var added = 0;

                                    var orderedMetadataByKey = {};
                                    Object.keys(d.data.metadata).sort().forEach(function (key) {
                                        orderedMetadataByKey[key] = d.data.metadata[key];
                                    });

                                    _.mapValues(orderedMetadataByKey, function (m, key) {
                                        if (index < 9) {
                                            dato += key.replace("_", " ").toUpperCase() + ": ";
                                            m.values ? dato += m.values.length + " Values" : dato += m.value;
                                            m.unit ? dato += " " + m.unit + "<br />" : dato += "<br />";
                                            added++;
                                        }
                                        index++;
                                    });
                                    if (added !== numberOfProperty) {
                                        dato = dato + "<br /> . . .";
                                    }
                                }
                                content = content + "<br /> <br />" + dato;
                            } else { content = '<b>Patient</b><br />' + "ID: " + that.idPatient; }
                            var rightClicktext = "<br /> <br /> Right Click to Show Option";
                            return content + rightClicktext;
                        });

                    // execute the tip method
                    svg.call(tip);

                    // Create nodes for each unique source and target.
                    that.addDataExtraInfo();

                    // find the root node (Patient)
                    // for (var i = 0; i < that.data.length; i++) {
                    //     if (that.data[i].source.name === 'Patient') {
                    //         index = i;
                    //     }
                    // }
                    var root = _.find(that.data, { source: { name: 'Patient' } }).source;
                    var treeRoot = d3.hierarchy(root);
                    tree(treeRoot);
                    // nodes
                    var nodes = treeRoot.descendants();
                    var links = treeRoot.links();

                    // generate the tree
                    // var nodes = tree.nodes(links[index].source);

                    // add to each node its type and the metadata
                    _.forEach(nodes, function (node) {
                        for (var i = 0; i < that.data.length; i++) {
                            if (node.data.name === that.data[i].target.name) {
                                node.data.type = that.data[i].type;
                                node.data.metadata = that.data[i].metadata;
                                node.data.biobankCode = that.data[i].biobankCode;
                                node.data.privilege = that.data[i].privilege;
                            }
                            if (isNaN(node.x)) {
                                node.x = width / 2;
                            }
                        }
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

                    // draw the links
                    g.selectAll(".link")
                        .data(links)
                        .enter().append("path")
                        .attr("class", "link")
                        .attr("marker-end", "url(#arrowhead)")
                        .attr("d", function (d) {
                            var targetNode = _.find(nodes, function (n) { return n.data.name === d.target.data.name; });
                            var sourceNode = _.find(nodes, function (n) { return n.data.name === d.source.data.name; });
                            var ty = targetNode.y / 2;
                            var sy = sourceNode.y / 2;
                            var tx = targetNode.x * 1.3;
                            var sx = sourceNode.x * 1.3;

                            return "M" + (tx - margin.left) + "," + ty +
                                "C" + (tx - margin.left) + "," + (ty + sy) / 2 +
                                " " + (sx - margin.left) + "," + (ty + sy) / 2 +
                                " " + (sx - margin.left) + "," + sy;
                        });

                    // draw the nodes
                    g.selectAll(".node")
                        .data(nodes)
                        .enter().append("circle")
                        .attr("id", function (d) {
                            if (d.data.metadata !== undefined && !_.isEmpty(d.data.metadata)) {
                                var id = d.data.name.split("_")[1];
                                return id + "_" + d.data.type;
                            } else {
                                return that.idPatient + "_subject";
                            }
                        })
                        .attr("class", "subject-node")
                        .attr("r", function (d) {
                            var currentData = _.find(that.data, function (f) { return d.data.name === f.name; });
                            if (currentData && currentData.type) {
                                return 5; // for the subject use double node size
                            } else {
                                return 10;
                            }
                        })
                        // set the x coordinate of the node centre
                        .attr("cx", function (d) {
                            return d.x * 1.3;
                        })
                        // set the y
                        .attr("cy", function (d) {
                            return d.y / 2;
                        })
                        .attr("transform", "translate(-" + margin.left + ",0)")
                        // set the color
                        .style("stroke", function (d) {
                            var currentData = _.find(that.data, function (f) { return d.data.name === f.name; });
                            if (currentData && currentData.type) {
                                return color(currentData.type);
                            } else {
                                return "black"; // if subject colour it with blue
                            }
                        })
                        .on('mouseover', function (e, t, p) {
                            var rValue = parseInt(this.getAttribute('r')) * 2;
                            this.setAttribute('r', rValue);

                            that.setVisibilityItemsRightMenu(e);
                            tip.show(e);
                        })
                        .on('mouseout', function (e) {
                            var rValue = parseInt(this.getAttribute('r')) / 2;
                            this.setAttribute('r', rValue);

                            tip.hide(e);
                        })
                        .on('click', function (e) {
                            if (e.privilege !== "view_overview") {
                                var splitted = e.data.name.split("_");
                                var model = splitted[0];
                                var id = splitted[1];
                                switch (model) {
                                    case "s":
                                        $('.d3-tip').remove();
                                        xtens.router.navigate('samples/details/' + id, { trigger: true });
                                        break;
                                    case "d":
                                        $('.d3-tip').remove();
                                        xtens.router.navigate('data/details/' + id, { trigger: true });
                                        break;
                                    default:
                                        $('.d3-tip').remove();
                                        var idSubj = $('#subject-selector').val();
                                        xtens.router.navigate('subjects/details/' + idSubj, { trigger: true });
                                        break;
                                }
                            }
                        });

                    // add the colour legend
                    var legend = svg.selectAll(".legend")
                        .data(color.domain())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function (d, i) { return "translate(240," + i * 20 + ")"; });

                    legend.append("rect")
                        .attr("x", width - 18)
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color);

                    legend.append("text")
                        .attr("x", width - 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                        .text(function (d) { return d; });

                    $('.loader-gif').css("display", "none");
                },
                error: function (res) {
                    xtens.error(res);
                }
            });
        },

        initRightClick: function () {
            var that = this;
            $.contextMenu('destroy');
            $.contextMenu({
                selector: '.subject-node',
                delay: 100,
                autoHide: true,
                callback: function (key, options) {
                    var id = options.$trigger.attr('id').split('_')[0];
                    // var type = options.$trigger.attr('id').split('_')[1];
                    var route = _.find(that.data, function (d) {
                        return d.id === id;
                    });
                    var url = route[key];
                    xtens.router.navigate(url, { trigger: true });
                },
                items: {
                    "edit": {
                        name: "Edit",
                        icon: "fa-edit",
                        visible: function (key, opt) {
                            return that.itemsVisibility[key];
                        }
                    },
                    "details": {
                        name: "Details",
                        icon: "fa-file",
                        visible: function (key, opt) {
                            return that.itemsVisibility[key];
                        }
                    },
                    "new_sample": {
                        name: "NewDerivativeSample",
                        icon: "fa-plus-square-o",
                        visible: function (key, opt) {
                            return that.itemsVisibility[key];
                        }
                    },
                    "new_data": {
                        name: "NewDerivativeData",
                        icon: "fa-plus-square",
                        visible: function (key, opt) {
                            return that.itemsVisibility[key];
                        }
                    }
                }
            });
        },

        setVisibilityItemsRightMenu: function (currentNode) {
            this.itemsVisibility = {};
            var datum = this.data.find(function (d) {
                return currentNode.data.name === d.name;
            });

            this.itemsVisibility['edit'] = !!datum["edit"];

            this.itemsVisibility['details'] = !!datum["details"];

            this.itemsVisibility['new_sample'] = !!datum["new_sample"];

            this.itemsVisibility['new_data'] = !!datum["new_data"];
        },

        addDataExtraInfo: function () {
            var that = this;
            var nodesByName = {};
            if (this.data && this.data[0].target != null) {
                _.forEach(this.data, function (datum) {
                    // graphInfo
                    var updated = manageDatum(datum);
                    datum = updated;
                });
                if (this.data[0].source.name !== this.data[0].type) {
                    var newSource = manageDatum(this.data[0].source);
                    this.data.push(newSource);
                }
            } else {
                delete this.data[0].type;
                var node = manageDatum(this.data[0]);
                node.name = node.source.name;
                this.data = [node];
            }

            function nodeByName (name) {
                return nodesByName[name] || (nodesByName[name] = { name: name });
            }

            function manageDatum (datum) {
                var parent = datum.source = nodeByName(datum.source);
                var child = datum.target = nodeByName(datum.target);
                if (parent.children) { parent.children.push(child); } else if (child && child.name) { parent.children = [child]; }

                // rightClick Links
                var dataType;
                var id;
                if (datum.type && datum.type !== 'Patient') {
                    dataType = _.find(that.dataTypes, function (dt) {
                        return datum.type.toLowerCase() === dt.name.toLowerCase();
                    });
                    id = datum.name.split("_")[1];
                } else {
                    dataType = _.find(that.dataTypes, function (dt) {
                        return dt.model.toLowerCase() === 'subject';
                    });
                    id = that.idPatient;
                }
                datum.id = id;
                var model = dataType.model.toLowerCase();
                model = model !== 'data' ? model + 's' : model;
                if (!datum.type || datum.privilege === "edit") {
                    datum["edit"] = "/" + model + "/edit/" + id;
                }
                if (!datum.type || datum.privilege !== "view_overview") {
                    datum["details"] = "/" + model + "/details/" + id;
                }

                if (dataType && dataType.children && dataType.children.length > 0) {
                    var sampleTypeChildren = _.where(dataType.children, { "model": Classes.SAMPLE });
                    if (sampleTypeChildren.length) {
                        var sids = _.map(sampleTypeChildren, 'id').join();
                        datum["new_sample"] = "/samples/new/0?idDataTypes=" + sids + "&donor=" + that.idPatient;
                        if (dataType.model === 'Sample') {
                            datum["new_sample"] += "&parentSample=" + id;
                        }
                    }
                    var dataTypeChildren = _.where(dataType.children, { "model": Classes.DATA });
                    if (dataTypeChildren.length) {
                        var dids = _.map(dataTypeChildren, 'id').join();
                        datum["new_data"] = "/data/new/0?idDataTypes=" + dids + "&parentSubject=" + that.idPatient;
                        if (dataType.model === 'Sample') {
                            datum["new_data"] += "&parentSample=" + id;
                        } else if (dataType.model === 'Data') {
                            datum["new_data"] += "&parentData=" + id;
                        }
                    }
                }
                return datum;
            }
        }

    });
}(xtens, xtens.module("subject")));
