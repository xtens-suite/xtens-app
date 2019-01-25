/**
 * @author  Massimiliano Izzo
 * @description This file conatins all the Backbone classes for handling Samples
 */
(function(xtens, Sample) {
    var useFormattedNames = xtens.module("xtensconstants").useFormattedMetadataFieldNames;
    var Constants = xtens.module("xtensconstants").Constants;
    var i18n = xtens.module("i18n").en;
    // var DataType = xtens.module("datatype");
    var SuperTypeModel = xtens.module("supertype").Model;
    // var DataTypeModel = xtens.module("datatype").Model;
    var Data = xtens.module("data");
    var Subject = xtens.module("subject");
    var Classes = xtens.module("xtensconstants").DataTypeClasses;
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;

    var MISSING_VALUE_ALERT = true;

    var biobankCodeMap = {
        RNA: '01',
        DNA: '02',
        Fluid: '03'
    };


    Sample.Model = Backbone.Model.extend({
        urlRoot: '/sample'
    });

    Sample.List = Backbone.Collection.extend({
        model: Sample.Model,
        url: '/sample'
    });

    Sample.Views.Edit = Data.Views.Edit.fullExtend({

        bindings: {

            '#biobank-code': {
                observe: 'biobankCode'
            },

            '#data-type': {
                observe: 'type',
                selectOptions: {
                    collection: 'this.dataTypes',
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                initialize: function($el) {
                    $el.select2({
                        placeholder: i18n('please-select')
                    });
                },
                getVal: function($el, ev, options) {
                    var value = parseInt($el.val());
                    value ? $('#editDonor').prop('disabled',false) : null;
                    return _.isNaN(value) ? null : value;
          // return _.findWhere(options.view.dataTypes, {id: value });
                },
                onGet: function(val, options) {
          // if you get the whole DataType object you must retrieve the ID
                    if (_.isObject(val)) {
                        return (val && val.id);
                    }
          // otherwise you've already the ID
                    else {
                        return val;
                    }
                }
            },

            '#owner': {
                observe: 'owner',
                initialize: function($el) {
                    $el.select2({placeholder: i18n("please-select") });
                },
                selectOptions: {
                    collection: function() {
                        var coll = [];
                        _.each(this.operators, function(op){
                            coll.push({label:op.lastName + ' ' + op.firstName ,value:op.id});
                        });
                        return coll;
                    },
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function(val) {
                    return val && val.id;
                }
            },

            '#biobank': {
                observe: 'biobank',
                selectOptions: {
                    collection: 'this.biobanks',
                    labelPath: 'acronym',
                    valuePath: 'id',
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                initialize: function($el) {
                    $el.select2({
                        placeholder: i18n('please-select')
                    });
                },
                getVal: function($el, ev, options) {
                    var value = parseInt($el.val());
                    return _.findWhere(options.view.biobanks, {
                        id: value
                    });
                },
                onGet: function(val, options) {
                    return (val && val.id);
                }
            },

            /*
            '#donor': {
                observe: 'donor',
                selectOptions: {
                    collection: function() {
                        return this.subjects.map(function(subj) {
                            return {
                                label: subj.personalInfo.surname + " " +  subj.personalInfo.givenName,
                                value: subj.id
                            };
                        });
                    },
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                initialize: function($el) {
                    $el.select2({placeholder: i18n('please-select')});
                },
                getVal: function($el, ev, options) {
                    var value = parseInt($el.val());
                    return _.findWhere(options.view.subjects, {id: value });
                },
                onGet: function(val, options) {
                    return (val && val.id);
                }
            }, */

            // '#parent-sample': {
            //     observe: 'parentSample',
            //     selectOptions: {
            //         collection: function() {
            //             return this.parentSamples.map(function(sample) {
            //                 return {
            //                     label: sample.biobankCode,
            //                     value: sample.id
            //                 };
            //             });
            //         },
            //         defaultOption: {
            //             label: "",
            //             value: null
            //         }
            //     },
            //     initialize: function($el) {
            //         $el.select2({
            //             placeholder: i18n('please-select')
            //         });
            //     },
            //     getVal: function($el, ev, options) {
            //         var value = parseInt($el.val());
            //         return _.findWhere(options.view.parentSamples, {
            //             id: value
            //         });
            //     },
            //     onGet: function(val, options) {
            //         return (val && val.id);
            //     }
            // },

            '#tags': {
                observe: 'tags',
                getVal: function($el, ev, option) {
                    return $el.val().split(",");
                }
            },

            '#notes': {
                observe: 'notes'
            }

        },

        initialize: function(options) {
            _.bindAll(this, 'fetchDonorsOnSuccess');
            $('#main').html(this.el);
            this.template = JST["views/templates/sample-edit.ejs"];
            this.schemaView = null;
            this.dataTypes = options.dataTypes || [];
            this.biobanks = options.biobanks || [];
            this.subjects = options.subjects || [];
            this.operators = options.operators ? options.operators : [];
            this.savingSample = false;
            if (options.sample) {
                this.model = new Sample.Model(options.sample);
            } else {
                this.model = new Sample.Model({
                    biobank: this.biobanks[0]
                });
            }
            _.each(["donor", "parentSample"], function(parent) {
                if (options[parent]) {
                    this.model.set(parent, _.isArray() ? options[parent] : [options[parent]]);
                }
            }, this);
            this.render();
            if ($('#biobank-code')[0].value && $('#biobank-code')[0].value != "") {
                $("#barcode").JsBarcode($('#biobank-code')[0].value);
            }
            $('#biobank-code').on('input',function (e) {
                $("#barcode").JsBarcode(e.currentTarget.value);
            });

        },

        events: {
            'click #editDonor': 'editDonor',
            "submit .edit-sample-form": "saveSample",
            "click button.delete": "deleteSample",
            "click button.print": "printBarCode"
        },

        /**
         * @method
         * @name saveData
         * @description retrieve all the Sample properties from the form (the metadata value(s)-unit(s) pairs, the files' paths, etc...)
         *              and save the Sample model on the server
         * @param {event} - the form submission event
         * @return {false} - to suppress the HTML form submission
         */
        saveSample: function(ev) {
            this.savingSample = true;
            var targetRoute = $(ev.currentTarget).data('targetRoute') || 'samples';

            if (this.schemaView && this.schemaView.serialize) {
                var that = this;
                this.$modal = this.$(".sample-modal");
                var metadata = this.schemaView.serialize(useFormattedNames);
                this.model.set("metadata", metadata);
                this.model.get("notes") === "" ? this.model.set("notes", null) : null;
                this.retrieveAndSetFiles();
                this.model.get("owner").id ? this.model.set("owner", this.model.get("owner").id) : null;

                this.model.get("donor") && this.model.get("donor").length > 0 ? this.model.set("donor", _.map(this.model.get("donor"), "id")) : null;
                this.model.get("parentSample") && this.model.get("parentSample").length > 0 ? this.model.set("parentSample", _.map(this.model.get("parentSample"), "id")) : null;
                this.model.get("childrenSample") && this.model.get("childrenSample").length > 0 ? this.model.set("childrenSample", _.map(this.model.get("childrenSample"), "id")) : null;
                this.model.get("childrenData") && this.model.get("childrenData").length > 0 ? this.model.set("childrenData", _.map(this.model.get("childrenData"), "id")) : null;

                this.model.save(null, {
                    success: function(data) {

                        if (that.modal) {
                            that.modal.hide();
                        }
                        var modal = new ModalDialog({
                            title: i18n('ok'),
                            body: i18n('sample-correctly-stored-on-server')
                        });
                        that.$modal.append(modal.render().el);
                        $('.modal-header').addClass('alert-success');
                        modal.show();

                        setTimeout(function() {
                            modal.hide();
                        }, 1200);
                        that.$('.sample-modal').on('hidden.bs.modal', function(e) {
                            modal.remove();
                            that.savingSample = false;

                            xtens.router.navigate(targetRoute, {
                                trigger: true
                            });
                        });

                    },
                    error: function(model, res) {
                        that.savingSample = false;
                        xtens.error(res);
                    }
                });
            }
            return false;
        },

        deleteSample: function(ev) {
            this.savingSample = true;

            ev.preventDefault();
            var that = this;
            this.$modal = this.$(".sample-modal");
            if (this.modal) {
                this.modal.hide();
            }

            var modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-deletion'),
                body: i18n('sample-will-be-permanently-deleted-are-you-sure'),
                type: i18n("delete")
            });

            this.$modal.append(modal.render().el);
            modal.show();

            this.$('#confirm').click(function(e) {
                modal.hide();
                that.$modal.one('hidden.bs.modal', function (e) {
                    $('.waiting-modal').modal('show');
                    var targetRoute = $(ev.currentTarget).data('targetRoute') || 'samples';

                    that.model.destroy({
                        success: function(model, res) {
                            $('.waiting-modal').modal('hide');

                            modal.template = JST["views/templates/dialog-bootstrap.ejs"];
                            modal.title = i18n('ok');
                            modal.body = i18n('sample-deleted');
                            that.$modal.append(modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            modal.show();
                            setTimeout(function() {
                                modal.hide();
                            }, 1200);
                            that.$modal.on('hidden.bs.modal', function(e) {
                                this.savingSample = false;
                                modal.remove();
                                xtens.router.navigate(targetRoute, {
                                    trigger: true
                                });
                            });
                        },
                        error: function(model, res) {
                            this.savingSample = false;
                            xtens.error(res);
                        }
                    });
                });
                return false;
            });

        },

      /**
       * @method
       * @name dataTypeOnChange
       */

        dataTypeOnChange: function() {
            if (!this.savingSample) {

                var that = this;
                Data.Views.Edit.prototype.dataTypeOnChange.call(this);
                var typeName = this.$('#data-type :selected').text(),
                    parentSample = this.model.get("parentSample") && this.model.get("parentSample").length > 0 ? this.model.get("parentSample")[0].biobankCode : null,
                    biobank = this.model.get("biobank").id;
                var type = _.find(this.dataTypes, function(dt){ return dt.name === typeName;});
                var params = {
                    sample: {
                        type: type.id,
                        parentSample: parentSample,
                        biobank: biobank
                    },
                    project: type.project
                };
                $.ajax({
                    url: '/sample/getNextBiobankCode',
                    type: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                    },
                    data: params,
                    contentType: 'application/json',
                    success: function(result) {
                        that.model.set('biobankCode', result);
                        $("#barcode").JsBarcode(result);
                    },
                    error: function(err) {
                        xtens.error(err);
                    }
                });

                if (this.subjects.length > 0) {
                    this.fetchDonorsOnSuccess(this.subjects, $('#donor'));
                }
            }

        },

        printBarCode: function () {
            // var newWndw = window.open().document.write('<img src="' + $("#barcode")[0].toDataURL("image/png") + '" />');
            var newWndw = window.open();
            newWndw.document.write('<img src="' + $("#barcode")[0].toDataURL("image/png") + '" />');

            newWndw.print();
            newWndw.close();
        },

      /**
       * @method
       * @name editDonor
       *
       */
        editDonor: function(ev) {
            var donors = new Subject.List(),
                that = this;
            var idProject = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'),function (p) { return p.name === xtens.session.get('activeProject'); }).id : undefined;

            donors.fetch({
                data: $.param({
                    select: JSON.stringify(["id", "code", "personalInfo", "type"]),
                    project: idProject
                }),
                success: function(donors) {
                    that.fetchDonorsOnSuccess(donors, ev.target);
                },
                error: xtens.error
            });
            return false;
        },

        fetchDonorsOnSuccess: function(donors, targetElem) {
            this.subjects = donors.models ? donors.toJSON() : donors;
            var dataTypeSample = _.find(this.dataTypes, {id: _.parseInt($('#data-type').val())});
            if(dataTypeSample){
                this.filteredSubjects = _.filter(this.subjects, function (subj) {
                    return subj.project === dataTypeSample.project;
                });
            }
            var $div = $('<div>').addClass('data-input-div');
            var $select = $('<select>').addClass('form-control').attr({
                'id': 'donor',
                'name': 'donor'
            }).prop('required',true);

            var parent = targetElem.parentNode ? targetElem.parentNode : targetElem.closest('.form-group')[0];

      // remove all subelements but the label
            while (parent.children.length > 1) {
                parent.removeChild(parent.lastChild);
            }

            $div.append($select);

            $(parent).append($div);

            this.addBinding(null, '#donor', {
                observe: 'donor',
                selectOptions: {
                    collection: function() {
                        return this.filteredSubjects.map(function(subj) {
                            var label = subj.given_name && subj.surname ? subj.code + ": " + subj.surname +
                " " + subj.given_name : subj.code;
                            return {
                                label: label,
                                value: subj.id
                            };
                        });
                    },
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                initialize: function($el) {
                    $el.select2({
                        placeholder: i18n('please-select')
                    });
                },
                getVal: function($el, ev, options) {
                    var value = parseInt($el.val());
                    return _.filter(options.view.subjects, {
                        id: value
                    });
                },
                onGet: function(val, options) {
                    return (val && val.id);
                }
            });
            return false;
        }

    });

  /**
   * @class
   * @name Sample.Views.Details
   * @extends Data.Views.Details
   * @description view containing the details (metadata and files) of a Sample (Sample.Model) instance
   */
    Sample.Views.Details = Data.Views.Details.fullExtend({

      /**
       * @method
       * @name initialize
       */
        initialize: function(options) {
            $("#main").html(this.el);
            this.template = JST["views/templates/sample-details.ejs"];
            this.fields = options.fields;
            this.render();
        },

        render: function() {
            // var dataType = new DataTypeModel(this.model.get("type"));
            // var superType = new SuperTypeModel(this.model.get("type").superType);

            // var fields = superType.getFlattenedFields();

            this.$el.html(this.template({
                __: i18n,
                data: this.model,
                fields: this.fields,
                PATH_SEPARATOR: Constants.PATH_SEPARATOR || '/'
            }));

            if (MISSING_VALUE_ALERT) {
                this.$('div[name="metadata-value"]').filter(function() {
                    return $(this).text().trim() === '';
                }).addClass("text-warning").html(i18n("missing-value"));
            }
        }

    });

    Sample.Views.List = Backbone.View.extend({

        tagName: 'div',
        className: 'sample',

        events: {
            'click .pagin': 'changePage',
            'click #moreData': 'loadResults',
            'click #newSample': 'openNewSampleView'
        },

        initialize: function(options) {
            $("#main").html(this.el);
            this.dataTypes = options.dataTypes;
            this.samples = options.samples;
            this.listenTo(this.samples, 'reset', this.render);
            this.headers = options.paginationHeaders;
            this.dataTypePrivileges = options.dataTypePrivileges.models;
            this.template = JST["views/templates/sample-list.ejs"];

            this.params = options.params;
            this.donor = options.params && options.params.donor;
            this.donorCode = options.params && options.params.donorCode;
            this.parentSample = options.params && options.params.parentSample;
            this.parentDataType = options.params && options.params.parentDataType;
            this.render();
        },

        addLinksToModels: function() {
            _.each(this.samples.models, function(sample) {
                var privilege = _.find(this.dataTypePrivileges, function(model) {
                    return model.get('dataType') === sample.get("type");
                });
                if (privilege && privilege.get('privilegeLevel') === "edit") {
                    sample.set("editLink", "#/samples/edit/" + sample.id);
                }
                if(privilege && privilege.get('privilegeLevel') !== "view_overview" ){
                    sample.set("detailsLink", "#/samples/details/" + sample.id);}
                var typeId = sample.get("type");
                var type = this.dataTypes.get(typeId);
                if (type && type.get("children") && type.get("children").length > 0) {
                    var sampleTypeChildren = _.where(type.get("children"), {
                        "model": Classes.SAMPLE
                    });
                    if (sampleTypeChildren.length > 0) {
                        var sids = _.map(sampleTypeChildren, 'id').join();
                        var donor = sample.get('code') && sample.get('code').length > 0 ? "&donorCode=" + sample.get('code') : "";
                        sample.set("newDerivativeLink", "#/samples/new/0?idDataTypes=" + sids + "&parentSample=" + sample.id + donor);
                    }
                    var dataTypeChildren = _.where(type.get("children"), {
                        "model": Classes.DATA
                    });
                    if (dataTypeChildren.length > 0) {
                        var dids = _.map(dataTypeChildren, 'id').join();
                        var parentSubject = sample.get('code') && sample.get('code').length > 0 ? "&parentSubjectCode=" + sample.get('code') : "";
                        sample.set("newDataLink", "#/data/new/0?idDataTypes=" + dids + "&parentSample=" + sample.id + parentSubject);
                    }
                }
            }, this);
        },

        render: function(options) {

            this.addLinksToModels();
            this.$el.html(this.template({
                __: i18n,
                samples: this.samples.models,
                dataTypePrivileges: this.dataTypePrivileges,
                dataTypes: this.dataTypes.models
            }));
            this.table = this.$('.table').DataTable({
                "paging": false,
                "info": false
            });

            this.filterSamples(this.params);

            $('#pagination').append(JST["views/templates/pagination-bar.ejs"]({
                __: i18n,
                headers: this.headers,
                rowsLenght: this.samples.models.length,
                DEFAULT_LIMIT: xtens.module("xtensconstants").DefaultLimit
            }));
            this.setPaginationInfo();
            return this;
        },

        filterSamples: function(opt){
            var rex = opt && opt.projects ? new RegExp(opt.projects) : new RegExp($('#btn-project').val());

            if(rex =="/all/"){this.clearFilter();}else{
                $('.content').hide();
                $('.content').filter(function() {
                    return rex.test($(this).text());
                }).show();
            }
            this.headers.notFiltered = $('tr').filter(function() { return $(this).css('display') !== 'none'; }).length - 1;
        },

        clearFilter: function(){
            // $('#project-selector').val('');
            $('.content').show();
        },
        changePage: function(ev) {
            ev.preventDefault();
            var that = this;

            $.ajax({
                url: ev.target.value,
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data:{
                    populate:'donor'
                },
                contentType: 'application/json',
                beforeSend: function() { $('.loader-gif').css("display","block"); },
                success: function(results, options, res) {
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
                    $('.loader-gif').css("display","none");
                    that.samples.reset(results);
                },
                error: function(err) {
                    xtens.error(err);
                }
            });
        },

        setPaginationInfo: function() {
            var links = this.headers.Link;
            var linkNames = ['previous', 'first', 'next', 'last'];
            _.forEach(linkNames, function(ln) {
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
        },

        openNewSampleView: function(ev) {
            ev.preventDefault();
            var donorQuery = this.donor ? 'donor=' + this.donor : '';
            var donorCodeQuery = this.donorCode ? 'donorCode=' + this.donorCode : '';
            var parentSampleQuery = this.parentSample ? 'parentSample=' + this.parentSample : '';
            var parentDataTypeQuery = this.parentDataType ? 'parentDataType=' + this.parentDataType : '';
      // var queryString = _.trim([donorQuery, donorCodeQuery, parentSampleQuery].join('&'), '&');
            var queryString = _.compact([donorQuery, donorCodeQuery, parentSampleQuery, parentDataTypeQuery]).join('&');
            var route = _.trim(['/samples/new', queryString].join('/0?'));
            xtens.router.navigate(route, {
                trigger: true
            });
            return false;
        }
    });

    /**
     * @class
     * @name Sample.Views.GetFromBarCode
     * @extends Data.Views.GetFromBarCode
     * @description view containing the details (metadata and files) of a Sample (Sample.Model) instance
     */
    Sample.Views.GetFromBarCode = Backbone.View.extend({

        /**
         * @method
         * @name initialize
         */
        initialize: function(options) {
            $("#main").html(this.el);
            this.template = JST["views/templates/sample-get-from-barcode.ejs"];
            this.idProject = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'),function (p) { return p.name === xtens.session.get('activeProject'); }).id : undefined;
            this.render();
        },

        render: function() {

            var disabled = this.idProject ? false : true;

            this.$el.html(this.template({ __: i18n, disabled: disabled}));
            this.initializeBarCodeReader(disabled);

            return this;

        },

        initializeBarCodeReader: function (disable) {
            var that = this ,timer, delay = 500;

            $('#biobank-code').prop('disabled', disable);
            if (disable) {
                $('.error-cnt').removeClass('hidden');
            }

            $('#biobank-code').focus();
            $('#biobank-code').focusin(function (e) {
                e.currentTarget.value = null;
            });
            $('#biobank-code').bind('keydown blur change', function(e) {

                clearTimeout(timer);
                timer = setTimeout(function() {
                    if (e.currentTarget.value && e.currentTarget.value != "") {
                        e.preventDefault();
                        that.getSampleByBiobankCode(e.currentTarget.value);
                    }
                }, delay );
            });
        },

        getSampleByBiobankCode: function (biobankCode) {

            $.ajax({
                url: '/sample/findByBiobankCode',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: {
                    biobankCode: biobankCode,
                    project: this.idProject
                },
                contentType: 'application/json',
                beforeSend: function() { $('.loader-gif').css("display","block"); },
                success: function(sample, options, res) {
                    if (sample && sample.id && sample.id > 0) {
                        $("#bc-mess-succ").fadeIn( 0, function() {
                            $("#bc-mess-succ").fadeOut( 2000,function () {
                                xtens.router.navigate('samples/edit/' + sample.id, {
                                    trigger: true
                                });
                            });
                        });
                    } else {
                        $("#bc-mess-err").fadeIn( 10, function() {
                            $("#bc-mess-err").fadeOut( 4000 );
                        });
                        $('#biobank-code').focus();
                    }
                },
                error: function(err) {
                    xtens.error(err);
                }
            });
        }
    });


}(xtens, xtens.module("sample")));
