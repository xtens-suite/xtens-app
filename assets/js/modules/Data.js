/**
 * @author  Massimiliano Izzo
 * @description This file conatins all the Backbone classes for handling Data and
 *              metadata instances
 */

(function (xtens, Data) {
    // TODO: retrieve this info FROM DATABASE ideally or from the server-side anyway
    var useFormattedNames = xtens.module("xtensconstants").useFormattedMetadataFieldNames;

    var i18n = xtens.module("i18n").en;
    var Constants = xtens.module("xtensconstants").Constants;
    var FieldTypes = xtens.module("xtensconstants").FieldTypes;
    var Classes = xtens.module("xtensconstants").DataTypeClasses;
    // var MetadataComponent = xtens.module("metadatacomponent");
    // var DataTypeModel = xtens.module("datatype").Model;
    var SuperType = xtens.module("supertype");
    // var DataTypeCollection = xtens.module("datatype").List;
    var FileManager = xtens.module("filemanager");
    var Daemon = xtens.module("daemon");
    var Group = xtens.module("group");
    var replaceUnderscoreAndCapitalize = xtens.module("utils").replaceUnderscoreAndCapitalize;
    // var dateUtil = xtens.module("utils").date;
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;
    var procedures = xtens.module("xtensconstants").Procedures;

    var MISSING_VALUE_ALERT = true;

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

    var parsleyOptsDataManagementParent = {
        priorityEnabled: false,
        // excluded: "select[name='fieldUnit']",
        successClass: "has-success",
        errorClass: "has-error",
        classHandler: function (el) {
            return el.$element.parent();
        },
        errorsWrapper: "<span class='help-block'></span>",
        errorTemplate: "<span></span>",
        excluded: '.exclude-parent-valid-input'
    };

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    /**
     *  @description general purpose function to retrieve the value from a field
     */
    function getFieldValue ($el, ev, options) {
        switch (options.view.component.fieldType) {
            case FieldTypes.INTEGER:
                return parseInt($el.val());

            case FieldTypes.FLOAT:
                return parseFloat($el.val());

            // return the date string in ISO format
            case FieldTypes.DATE:
                var dateArray = $el.val().split("/");
                return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];

            default:
                return $el.val();
        }
    }

    /**
     * @description render a Date from the model to a view
     */
    function renderDateValue (value) {
        if (value) {
            var dateArray = value instanceof Date ? value.toISOString().split('-') : value.split('-');
            return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
        }
    }

    /**
     * @class
     * @name Factory
     * @description Factory Method implementation for the Data.Views.* components
     */

    Data.Factory = function () {
        this.createComponentView = function (component, metadatarecord, groupName, params) {
            var model;
            if (component.label === Constants.METADATA_GROUP) {
                model = new Data.MetadataGroupModel(null, { metadata: metadatarecord, groupName: groupName });
                return new Data.Views.MetadataGroup({ model: model, component: component });
            }
            if (component.label === Constants.METADATA_LOOP) {
                model = new Data.MetadataLoopModel(null, { metadata: metadatarecord, groupName: groupName });
                return new Data.Views.MetadataLoop({ model: model, component: component });
            } else if (component.label === Constants.METADATA_FIELD) {
                model = new Data.MetadataFieldModel(null, { field: component, metadata: metadatarecord, groupName: groupName, loopParams: params });
                if (component.fieldType === FieldTypes.BOOLEAN) {
                    return new Data.Views.MetadataFieldCheckbox({ model: model, component: component });
                }
                if (component.isList) {
                    return new Data.Views.MetadataFieldSelect({ model: model, component: component });
                }
                /* else if (component.hasRange) {
                   return new Data.Views.MetadataFieldRange({model: model, component: component});
                   } */
                return new Data.Views.MetadataFieldInput({ model: model, component: component });
            }
        };
    };

    // local Data.Factory instance - to be used inside the model
    var factory = new Data.Factory();

    /**
     *  @class
     *  @name Data.MetadataFieldModel
     *  @extends Backbone.Model
     *  @description Backbone Model for a metadata field
     */

    Data.MetadataFieldModel = Backbone.Model.extend({
        defaults: {
            name: null,
            value: null,
            unit: null
        },

        /**
         * @extends Backbone.Model.initialize
         * @description initialize a generic MetadataField for editing purposes
         */

        initialize: function (attributes, options) {
            var field = options.field || {};

            this.set("name", field.name);
            this.set("formattedName", field.formattedName);
            this.set("groupName", options.groupName);
            if (options.loopParams) {
                this.set("loop", options.loopParams.name);
                this.set("loopIndex", options.loopParams.index);
            }

            var fieldName = useFormattedNames ? field.formattedName : field.name;

            // it is an existing data instance
            if (options.metadata && options.metadata[fieldName]) {
                var fieldRecord = options.metadata[fieldName];

                // if it is a field from a loop retrieve the value/unit pair from the values & units arrays
                if (options.loopParams) {
                    var index = options.loopParams.index || 0;
                    this.set("value", fieldRecord.values[index]);
                    if (field.hasUnit) {
                        var unitloop = fieldRecord.units[index] ? fieldRecord.units[index] : field.possibleUnits[0];
                        this.set("unit", unitloop);
                    }
                }

                // if it's not from a loop just set the value/unit pair
                else {
                    this.set("value", fieldRecord.value);
                    if (field.hasUnit) {
                        var unit = fieldRecord.unit ? fieldRecord.unit : field.possibleUnits[0];
                        this.set("unit", unit);
                    }
                }
            }

            // it is a new data instance
            else {
                if (field.fieldType === FieldTypes.BOOLEAN) {
                    // initialize new boolean to FALSE
                    this.set("value", false);
                }
                if (field.isList) {
                    this.set("value", field.possibleValues.indexOf(field.customValue) > -1 ? field.customValue : null);
                }
                if (field.hasUnit) {
                    this.set("unit", field.possibleUnits && field.possibleUnits[0]);
                }
            }
        }
    });

    /**
     *  @class
     *  @name Data.MetadataGroupModel
     *  @description Backbone Model for a metadata group
     */
    Data.MetadataGroupModel = Backbone.Model.extend({
        initialize: function (attributes, options) {
            this.set("groupName", options && options.groupName);
            if (options && options.metadata) {
                this.metadata = options.metadata;
            }
        }
    });

    /**
     * @class
     * @name Data.MetadataLoopModel
     * @description Backbone Model for a metadata loop
     */
    Data.MetadataLoopModel = Backbone.Model.extend({
        initialize: function (attributes, options) {
            this.set("name", options && options.name);
            this.set("groupName", options && options.groupName);
            if (options && options.metadata) {
                this.metadata = options.metadata;
            }
        }
    });

    /**
     * @class
     * @name Data.Views.MetadataComponent
     * @description Implements a generic metadata component view according to the Composite pattern
     */

    Data.Views.MetadataComponent = Backbone.View.extend({

        tagName: 'div',
        className: 'metadata',

        initialize: function (options) {
            this.template = options.template;
            this.component = options.component;
            this.nestedViews = [];
        },

        render: function () {
            this.$el.html(this.template({ __: i18n, component: this.component }));
            if (this.model) {
                this.stickit();
            }
            if (this.component) {
                var content = this.component.body || this.component.content;
                var len = content && content.length;
                for (var i = 0; i < len; i++) {
                    var groupName = content[i].label === Constants.METADATA_GROUP ? content[i].name : this.model.get("groupName");
                    this.add(content[i], this.model.metadata, groupName);
                }
            }
            return this;
        },

        /**
         * @method
         * @name add
         * @description add a new subcomponent to the current object
         * @param {Object} subcomponent - the subelement that must be added
         * @param {Object} metadatarecord - the oprional record that must be used to populate the subcomponent fields. This is useful if
         *                 we are updating an existing Data/Metadata record
         * @param {string} groupName - the name of the parent metadataGroup NOTE: this should be moved somewhere else?? Set as a param object?
         */
        add: function (subcomponent, metadatarecord, groupName) {
            var view = factory.createComponentView(subcomponent, metadatarecord, groupName);
            this.$el.children('.metadatacomponent-body').last().append(view.render().el);
            this.nestedViews.push(view);
        },

        /**
         * @method
         * @name removeMe
         * @description remove the current object and all its subcomponents from the DOM tree
         */
        removeMe: function () {
            var len = this.nestedViews || this.nestedViews.length;
            for (var i = 0; i < len; i++) {
                this.nestedViews[i].removeMe();
                delete this.nestedViews[i];
            }
            this.remove();
            return true;
        },

        /**
         * @method
         * @name getChild
         * @description get the i-th child subcomponent
         * @param {integer} - the zero-based index of the child
         * @return {Object} the required subcomponent
         */
        getChild: function (index) {
            return this.nestedViews[index];
        },

        /**
         * @method
         * @name serialize
         * @description iterate the serialize call through all the nested (i.e. children) views.
         * @return {Array} an array containg all the serialized components.
         */
        serialize: function (useFormattedNames) {
            // var json = {name: this.component.name, instances: []};
            var arr = [];
            if (this.nestedViews && this.nestedViews.length) {
                for (var i = 0, len = this.nestedViews.length; i < len; i++) {
                    arr.push(this.nestedViews[i].serialize(useFormattedNames));
                }
            }
            return arr;
        }

    });

    Data.MetadataSchemaModel = Backbone.Model.extend({
        initialize: function (attributes, options) {
            var data = options && options.data;
            if (data) {
                this.metadata = data.get("metadata");
            }
        }
    });

    /**
     * @class
     * @name Data.Views.MetadataSchema
     * @extends Data.Views.MetadataComponent
     * @description the view for the metadata schema - the composite element - of a Data instance
     */
    Data.Views.MetadataSchema = Data.Views.MetadataComponent.fullExtend({

        id: 'metadata-schema',
        className: 'metadataschema',

        initialize: function (options) {
            this.template = JST["views/templates/data-edit-partial.ejs"];
            this.component = options.component;
            this.nestedViews = [];
        },

        /**
         *  @method
         *  @name serialize
         *  @description serialize the metadadata schema to a JSON object
         *  @param{boolean} useFormattedNames - if set to true use name formatted to support JavaScript properties in dot notation (i.e. variable.property)
         *  @return {Object} - an array containing all the metadata name-value-unit properties
         *  @override
         */
        serialize: function (useFormattedNames) {
            var arr = [];
            var i, len;
            if (this.nestedViews && this.nestedViews.length) {
                for (i = 0, len = this.nestedViews.length; i < len; i++) {
                    arr.push(this.nestedViews[i].serialize(useFormattedNames));
                }
            }
            var serialized = _.flatten(arr, true);
            var metadata = {};
            for (i = 0, len = serialized.length; i < len; i++) {
                var unit = serialized[i].unit || undefined;

                // if formattedNames are used select the appropriate fieldName
                var fieldName = useFormattedNames ? serialized[i].formattedName : serialized[i].name;

                // if it's not a field of a loop just store the value/unit pair as an object
                if ((serialized[i].value || !isNaN(serialized[i].value))) {
                    if (!serialized[i].loop) {
                        if (serialized[i].value != null && serialized[i].value !== "") {
                            metadata[fieldName] = { value: serialized[i].value, unit: unit, group: serialized[i].groupName };
                        }
                    }
                    // if it's a field within a loop store the value unit pair within two arrays
                    else {
                        if (!metadata[fieldName]) {
                            var size = serialized[i].loopIndex + 1;
                            var values = []; while (size--) values[size] = null;
                            values[serialized[i].loopIndex] = serialized[i].value;
                            metadata[fieldName] = { values: [serialized[i].value], group: serialized[i].groupName, loop: serialized[i].loop };
                            metadata[fieldName].units = unit ? [unit] : undefined;
                        }
                        // if the loop value/unit arrays already exists push them in the arrays
                        else {
                            if (serialized[i].loopIndex > (metadata[fieldName].values.length - 1)) {
                                var vals = new Array(serialized[i].loopIndex + 1);
                                _.forEach(vals, function (v, i) {
                                    vals[i] = metadata[fieldName].values[i];
                                });
                                vals[serialized[i].loopIndex] = serialized[i].value;
                                metadata[fieldName].values = vals;
                            } else {
                                metadata[fieldName].values[serialized[i].loopIndex] = serialized[i].value;
                            }
                            if (unit && _.isArray(metadata[fieldName].units)) {
                                metadata[fieldName].units.push(serialized[i].unit);
                            }
                        }
                    }
                }
            }
            return metadata;
        }

    });

    Data.Views.MetadataGroup = Data.Views.MetadataComponent.fullExtend({
        className: 'metadatagroup',

        initialize: function (options) {
            this.template = JST["views/templates/metadatagroup-form.ejs"];
            this.component = options.component;
            this.nestedViews = [];
        }
    });

    Data.Views.MetadataLoop = Data.Views.MetadataComponent.fullExtend({
        className: 'metadataloop',

        initialize: function (options) {
            this.template = JST["views/templates/metadataloop-form.ejs"];
            this.component = options.component;
            this.nestedViews = [];
            if (this.model.metadata) {
                var loopInstance = this.model.metadata[this.component.content[0].formattedName];
                this.loopRecords = loopInstance ? loopInstance.values.length : 0;
            } else {
                this.loopRecords = 0;
            }
        },

        /**
         *  overrides the basic Data.Views.MetadataComponent render() method
         */
        render: function () {
            this.$el.html(this.template({ __: i18n, component: this.component }));
            this.$metadataloopBody = this.$(".metadataloop-body");
            if (this.component) {
                var content = this.component.content;
                var i; var len = content && content.length;
                if (this.loopRecords > 0) {
                    for (i = 0; i < this.loopRecords; i++) {
                        this.addLoopBody(i);
                    }
                }
            }
            return this;
        },

        /**
         *  @method
         *  @name add
         *  @description override  the basic Data,Views.MetadataComponent add() method
         */
        add: function (subcomponent, metadatarecord, groupName, loopParams) {
            // create a new field
            var view = factory.createComponentView(subcomponent, metadatarecord, groupName, loopParams);
            // add it to the current loop
            this.$metadataloopBody.children('.metadatacomponent-body').last().append(view.render().el);
            this.nestedViews.push(view);
        },

        events: {
            'click input[type=button]': 'addLoopBody'
        },

        /**
         * @method
         * @name addLoopBody
         * @description add a new body to the Loop view. Each body contains all the fields of the loop
         * @param {integer} the index of the body element, starting from 0
         */
        addLoopBody: function (index) {
            var newLoopbody = '<div class="metadatacomponent-body"></div>';
            this.$metadataloopBody.append(newLoopbody);
            /*
               var $last = this.$el.children('.metadatacomponent-body').last();
               $last.after(newLoopbody); */
            var len = this.component && this.component.content && this.component.content.length;
            if (isNaN(index)) {
                index = this.loopRecords;
                this.loopRecords = this.loopRecords + 1;
            }
            var loopParams = { name: this.component.name, index: index };
            for (var i = 0; i < len; i++) {
                this.add(this.component.content[i], this.model.metadata, this.model.get("groupName"), loopParams);
            }
        }

    });

    Data.Views.MetadataField = Data.Views.MetadataComponent.fullExtend({

        className: 'metadatafield',

        /**
         * @method
         * @name add
         * @description no operation - you can't add subcomponents to a leaf object
         * @override
         */
        add: function () { },

        /**
         * @method
         * @name getChild
         * @description no operation - a leaf has no children
         * @return {null}
         * @override
         */
        getChild: function (i) {
            return null;
        },

        render: function () {
            var that = this;
            this.$el.html(this.template({ __: i18n, component: this.component, format: replaceUnderscoreAndCapitalize }));
            this.stickit();
            if (!_.isEmpty(this.component.possibleUnits)) {
                this.addBinding(null, 'select[name=fieldUnit]', {
                    observe: 'unit',
                    selectOptions: {
                        collection: 'this.component.possibleUnits',
                        labelPath: '',
                        valuePath: ''
                    }
                });
            }
            this.$fieldValue = this.$("[name='fieldValue']");
            if (this.setValidationOptions) {
                this.setValidationOptions();
            }
            if (this.component.description) {
                var btnDescription = JST["views/templates/field-description-button.ejs"]({ __: i18n, component: this.component });
                $(this.el.children).append(btnDescription);

                this.$el.hover(
                    function () { $('.' + that.component.formattedName).popover('show'); },
                    function () { $('.' + that.component.formattedName).popover('hide'); }
                );
            }
            return this;
        },

        /**
         * @method
         * @name serialize
         * @description serialize the metadata field. Being the leaf of our Composite object, this means cloning all its model attributes
         * @return {Object} the model attributes
         * @override
         */

        serialize: function () {
            return _.clone(this.model.attributes);
        }

    });

    Data.Views.MetadataFieldInput = Data.Views.MetadataField.fullExtend({

        bindings: {
            ':text[name=fieldValue]': {
                observe: 'value',
                getVal: getFieldValue,
                onGet: function (value, options) {
                    if (options.view.component && options.view.component.fieldType === FieldTypes.DATE) {
                        return renderDateValue(value);
                    } else {
                        return value;
                    }
                },
                onSet: function (value, options) {
                    if (options.view.component && options.view.component.fieldType === FieldTypes.DATE && _.isNaN(Date.parse(value))) {
                        return null;
                    } else {
                        return value;
                    }
                }
            }
        },

        initialize: function (options) {
            this.template = JST["views/templates/metadatafieldinput-form.ejs"];
            this.component = options.component;
        },

        /**
         * @method
         * @name setValidationOptions
         * @description add HTML5/data tags to the metadata field for client-side validation
         *              with Parsley
         */
        setValidationOptions: function () {
            if (this.component.required) {
                this.$fieldValue.prop('required', true);
            }
            switch (this.component.fieldType) {
                case FieldTypes.INTEGER:
                    this.$fieldValue.attr("data-parsley-type", "integer");
                    break;
                case FieldTypes.FLOAT:
                    this.$fieldValue.attr("data-parsley-type", "number");
                    break;
                case FieldTypes.LINK:
                    this.$fieldValue.attr("data-parsley-type", "url");
                    break;
                case FieldTypes.DATE:
                    this.initDatepicker();
                    break;
            }
            if (this.component.hasRange) {
                this.$fieldValue.attr("min", this.component.min);
                this.$fieldValue.attr("max", this.component.max);
                // TODO add step validation?
            }
        },

        initDatepicker: function () {
            var picker = new Pikaday({
                field: this.$fieldValue[0],
                format: 'DD/MM/YYYY',
                yearRange: [1900, new Date().getYear()],
                maxDate: new Date()
            });
        }

    });

    Data.Views.MetadataFieldCheckbox = Data.Views.MetadataField.fullExtend({

        bindings: {
            ':checkbox[name=fieldValue]': {
                observe: 'value',
                getVal: function ($el, ev, options) {
                    return $el.prop('checked');
                }
            }
        },

        initialize: function (options) {
            this.template = JST["views/templates/metadatafieldcheckbox-form.ejs"];
            this.component = options.component;
        }

    });

    Data.Views.MetadataFieldSelect = Data.Views.MetadataField.fullExtend({
        events: {
            "click .deselect": "clearSelected"
        },
        bindings: {
            'select[name=fieldValue]': {
                observe: 'value',
                selectOptions: {
                    collection: 'this.component.possibleValues',
                    labelPath: '',
                    valuePath: '',
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                }
            }
        },

        /**
         * @method
         * @name setValidationOptions
         * @description add HTML5/data tags to the metadata field for client-side validation
         *              with Parsley
         */
        setValidationOptions: function () {
            if (this.component.required) {
                this.$fieldValue.prop('required', true);
            }
        },

        initialize: function (options) {
            this.template = JST["views/templates/metadatafieldselect-form.ejs"];
            this.component = options.component;
        },

        clearSelected: function () {
            this.$("select[name=fieldValue]").select2("val", "");
            this.model.set('value', null);
        }

    });

    Data.Views.MetadataFieldRange = Data.Views.MetadataField.fullExtend({

        bindings: {
            'input[name=fieldValue]': {
                observe: 'value'
            }
        },

        initialize: function (options) {
            this.template = JST["views/templates/metadatafieldrange-form.ejs"];
            this.component = options.component;
        }

    });

    Data.Model = Backbone.Model.extend({

        defaults: {
            type: null
        },

        urlRoot: '/data'
    });

    Data.List = Backbone.Collection.extend({
        model: Data.Model,
        url: '/data'
    });

    /**
     * @class
     * @name Data.Views.Edit
     * @extends Backbone.View
     * @description backbone edit view for Data instances. This is the main container where all metadata fields will be fit into
     */
    Data.Views.Edit = Backbone.View.extend({

        events: {
            "submit .edit-data-form": "saveData",
            "click button.delete": "deleteData"
        },

        tagName: 'div',
        className: 'data',

        initialize: function (options) {
            // _.bindAll(this, 'fetchSuccess');
            $('#main').html(this.el);
            this.template = JST["views/templates/data-edit.ejs"];
            this.schemaView = null;
            this.dataTypes = options.dataTypes || [];
            this.operators = options.operators ? options.operators : [];
            // _.extend(this, options);
            this.savingData = false;

            if (options.data) {
                this.model = new Data.Model(options.data);
            } else {
                this.model = new Data.Model();
            }
            _.each(["parentSubject", "parentSample", "parentData"], function (parent) {
                if (options[parent]) {
                    this.model.set(parent, _.isArray() ? options[parent] : [options[parent]]);
                }
            }, this);
            this.render();
        },

        render: function () {
            this.$el.html(this.template({ __: i18n, data: this.model }));
            this.$form = this.$('form');
            this.$fileCnt = this.$("#data-header-row");
            this.stickit();
            this.listenTo(this.model, 'change:type', this.dataTypeOnChange);
            this.$('#tags').select2({ tags: [] });
            this.$modal = $(".modal-cnt");
            // initialize Parsley
            this.$form.parsley(parsleyOpts);
            /*
               this.$form.parsley(parsleyOpts);
               this.$form.parsley().subscribe('parsley:field:error', this.showValidationErrorTooltip);
               this.$form.parsley().subscribe('parsley:field:success', this.removeValidationErrorTooltip);
               */
            if (this.model.get("type")) {
                this.renderDataTypeSchema(this.model);
            }
            return this;
        },

        /**
         * @description Backbone.stickit bindings
         */
        bindings: {
            '#data-type': {
                observe: 'type',
                selectOptions: {
                    collection: 'this.dataTypes',
                    labelPath: 'name',
                    valuePath: 'id',
                    defaultOption: {
                        label: i18n("please-select"),
                        value: null
                    }
                },
                getVal: function ($el) {
                    var value = parseInt($el.val());
                    return _.isNaN(value) ? null : value;
                    // return _.find(options.view.dataTypes, {id: value });
                },
                onGet: function (val) {
                    // if you get the whole DataType object you must retrieve the ID
                    if (_.isObject(val)) {
                        return (val && val.id);
                    } else {
                        // otherwise you've already the ID
                        return val;
                    }
                }
            },

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

            '#date': {
                observe: 'date',

                // format date on model as ISO (YYYY-MM-DD)
                onSet: function (val, options) {
                    // var dateArray = val.split("/");
                    if (!val || val == "") {
                        return null;
                    }
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

        /**
         * @method
         * @name saveData
         * @description retrieve all the Data properties from the form (the metadata value(s)-unit(s) pairs, the files' paths, etc...)
         *              and save the Data model on the server
         * @param {event} - the form submission event
         * @return {false} - to suppress the HTML form submission
         */
        saveData: function (ev) {
            this.savingData = true;
            var targetRoute = $(ev.currentTarget).data('targetRoute') || 'data';
            if (this.schemaView && this.schemaView.serialize) {
                var that = this;
                var metadata = this.schemaView.serialize(useFormattedNames);
                this.model.set("metadata", metadata);
                var ownerBkp = this.model.get("owner");
                this.model.get("owner").id ? this.model.set("owner", this.model.get("owner").id) : null;
                this.model.get("notes") === "" ? this.model.set("notes", null) : null;
                this.model.get("parentSubject") && this.model.get("parentSubject").length > 0 ? this.model.set("parentSubject", _.map(this.model.get("parentSubject"), "id")) : null;
                this.model.get("parentSample") && this.model.get("parentSample").length > 0 ? this.model.set("parentSample", _.map(this.model.get("parentSample"), "id")) : null;
                this.model.get("parentData") && this.model.get("parentData").length > 0 ? this.model.set("parentData", _.map(this.model.get("parentData"), "id")) : null;
                this.model.get("childrenData") && this.model.get("childrenData").length > 0 ? this.model.set("childrenData", _.map(this.model.get("childrenData"), "id")) : null;

                this.retrieveAndSetFiles();

                this.model.save(null, {
                    success: function (data) {
                        if (that.modal) {
                            that.modal.hide();
                        }
                        var modal = new ModalDialog({
                            title: i18n('ok'),
                            body: i18n('data-correctly-stored-on-server')
                        });
                        that.$modal.append(modal.render().el);
                        $('.modal-header').addClass('alert-success');
                        modal.show();

                        setTimeout(function () { modal.hide(); }, 1200);
                        $('.modal-cnt').one('hidden.bs.modal', function (e) {
                            e.preventDefault();
                            this.savingData = false;
                            modal.remove();
                            window.history.back();
                            // xtens.router.navigate(targetRoute, {trigger: true});
                        });
                    },
                    error: function (model, res) {
                        that.model.set("owner", ownerBkp);
                        that.savingData = false;
                        xtens.error(res);
                    }
                });
            }
            return false;
        },

        setOwnerList: function () {
            var that = this; var project; var projectId;
            if ($('#data-type').val()) {
                var dataTypeSelected = _.parseInt($('#data-type').val());
                projectId = _.find(this.dataTypes, { id: dataTypeSelected }).project;
                project = _.find(xtens.session.get('projects'), function (p) {
                    return p.id === projectId;
                });
            } else {
                project = _.find(xtens.session.get('projects'), function (p) {
                    return p.name === xtens.session.get('activeProject');
                });
            }
            var groups = new Group.List();

            var groupIds = _.compact(_.map(project.groups, function (g) {
                if ((g.privilegeLevel === "admin")) { // excluding superusers g.privilegeLevel === "wheel"
                    return g.id;
                }
            }));

            var groupsDeferred = groups.fetch({
                data: $.param({ where: { id: groupIds }, sort: 'id ASC', limit: 100, populate: ['members'] })
            });
            $.when(groupsDeferred).then(function (groupRes) {
                that.operators = _.isArray(groupRes) ? _.uniq(_.flatten(_.map(groupRes, 'members')), 'id') : groupRes.members;
                var newColl = [];
                that.operators.forEach(function (op) {
                    newColl.push({ label: op.lastName + ' ' + op.firstName, value: op.id });
                });
                var options = { selectOptions: { collection: newColl } };
                Backbone.Stickit.getConfiguration($('#owner')).update($('#owner'), {}, {}, options);
                $('#owner').select2('val', '').trigger("change");
            });
        },
        /**
         * @method
         * @name deleteDate
         * TODO - not implemented yet
         */
        deleteData: function (ev) {
            this.savingData = true;
            ev.preventDefault();
            var that = this;
            if (this.modal) {
                this.modal.hide();
            }

            var modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-deletion'),
                body: i18n('data-will-be-permanently-deleted-are-you-sure'),
                type: i18n("delete")
            });

            this.$modal.append(modal.render().el);
            modal.show();

            $('#confirm').click(function (e) {
                modal.hide();
                $('.waiting-modal').modal('show');
                that.$modal.one('hidden.bs.modal', function (e) {
                    // var targetRoute = $(ev.currentTarget).data('targetRoute') || 'data';

                    that.model.destroy({
                        success: function (model, res) {
                            $('.waiting-modal').modal('hide');
                            modal.template = JST["views/templates/dialog-bootstrap.ejs"];
                            modal.title = i18n('ok');
                            modal.body = i18n('data-deleted');
                            that.$modal.append(modal.render().el);
                            $('.modal-header').removeClass('alert-danger');
                            $('.modal-header').addClass('alert-success');
                            modal.show();
                            setTimeout(function () { modal.hide(); }, 1200);
                            that.$modal.one('hidden.bs.modal', function (e) {
                                this.savingData = false;
                                modal.remove();
                                window.history.back();
                                // xtens.router.navigate(targetRoute, { trigger: true });
                            });
                        },
                        error: function (model, res) {
                            this.savingData = false;
                            xtens.error(res);
                        }
                    });
                });
                return false;
            });
        },

        getSelectedSchema: function (dataType) {
            var idDataType;
            if (typeof dataType === "object") {
                idDataType = dataType && dataType.id;
            } else {
                idDataType = dataType;
            }
            return _.find(this.dataTypes, { id: idDataType }).schema;
        },

        dataTypeOnChange: function () {
            if (!this.savingData) {
                $('#owner').prop('disabled', false);
                this.setOwnerList();
                this.renderDataTypeSchema();
            }
        },

        /**
         * @method
         * @name renderDataTypeSchema
         * @description render the view for the specific DataType (metadata) schema. If required create the view for file upload
         * @param {Object} data - the Data model to populate the form (e.g. on data update)
         *
         */
        renderDataTypeSchema: function (data) {
            if (this.fileUploadView) {
                this.fileUploadView.remove();
            }
            if (this.schemaView) {
                if (!this.schemaView.removeMe()) {
                    return;
                }
            }
            var type = this.model.get('type');
            if (type) {
                var schema = this.getSelectedSchema(type);
                var schemaModel = new Data.MetadataSchemaModel(null, { data: data });
                this.schemaView = new Data.Views.MetadataSchema({
                    component: schema,
                    model: schemaModel
                });
                this.$("#buttonbardiv").before(this.schemaView.render().el);
                if (schema.header.fileUpload) {
                    this.enableFileUpload();
                }
            } else {
                this.$("#buttonbardiv").before();
            }
            // reinitialize parsley
            this.$form.parsley(parsleyOpts).reset();
        },

        /**
         * @method
         * @name enableFileUpload
         * @description open the view for uploading files to the Distributes File System
         *
         */
        enableFileUpload: function () {
            var _this = this;
            // _this.$fileCnt.empty()
            // var fileManager = new FileManager.Model();
            $.ajax({
                url: '/fileManager',
                type: 'GET',
                contentType: 'application/json',
                success: function (fileSystem) {
                    _this.fileSystem = fileSystem;
                    _this.fileUploadView = new FileManager.Views.Dropzone({
                        files: _this.model.get("files"),
                        fileSystem: fileSystem,
                        datum: _this.model,
                        // added the second condition for the scenarios where the dataType is not populated
                        dataTypeName: _this.model.get("type").name || _.find(_this.dataTypes, { id: _.parseInt(_this.model.get("type")) }).name
                    });
                    _this.$fileCnt.append(_this.fileUploadView.render().el);
                    _this.fileUploadView.initializeDropzone();
                    _this.listenTo(_this.fileUploadView, 'fileDeleted', _this.refreshFileCnt);
                },
                error: xtens.error
            });
        },

        refreshFileCnt: function (fileId) {
            var files = this.model.get("files");
            this.model.set("files", files.filter(function (f) { return f.id != fileId; }));
            this.fileUploadView = new FileManager.Views.Dropzone({
                files: this.model.get("files"),
                fileSystem: this.fileSystem,
                datum: this.model,
                // added the second condition for the scenarios where the dataType is not populated
                dataTypeName: this.model.get("type").name || _.find(this.dataTypes, { id: _.parseInt(this.model.get("type")) }).name
            });
            $('.filemanager').remove();
            this.$fileCnt.append(this.fileUploadView.render().el);
            this.fileUploadView.initializeDropzone();
            this.listenTo(this.fileUploadView, 'fileDeleted', this.refreshFileCnt);
        },

        retrieveAndSetFiles: function () {
            if (this.fileUploadView) {
                var files = this.fileUploadView.fileList.toJSON();
                if (!_.isEmpty(files)) {
                    this.model.set("files", _.compact(files.concat(this.model.get("files"))));
                }
            }
        },

        showValidationErrorTooltip: function (formElement) {
            var messages = ParsleyUI.getErrorsMessages(formElement);
            formElement.$element.tooltip('destroy');
            formElement.$element.tooltip({
                animation: false,
                container: 'body',
                placement: 'right',
                trigger: 'manual',
                title: messages
            }).tooltip('show');
        },

        removeValidationErrorTooltip: function (formElement) {
            formElement.$element.tooltip('destroy');
        }

    });

    /**
     * @class
     * @name Data.Views.Details
     * @extends Backbone.View
     * @description view containing the details (metadata and files) of a Data (Data.Model) instance
     */
    Data.Views.Details = Backbone.View.extend({
        tagName: 'div',
        className: 'data',

        /**
         * @extends Backbone.View.initialize
         */
        initialize: function (options) {
            $("#main").html(this.el);
            this.template = JST["views/templates/data-details.ejs"];
            this.fields = options.fields; //  this.model.set("filename", filename);
            this.render();
        },

        render: function () {
            // var dataType = new DataTypeModel(this.model.get("type"));
            // var superType = new SuperTypeModel(this.model.get("type").superType);
            //
            // var fields = superType.getFlattenedFields();
            // var metadata = this.model.get("metadata");
            this.$el.html(this.template({
                __: i18n,
                data: this.model,
                fields: this.fields,
                PATH_SEPARATOR: Constants.PATH_SEPARATOR || '/'
            }));

            if (MISSING_VALUE_ALERT) {
                this.$('div[name="metadata-value"]').filter(function () {
                    return $(this).text().trim() === '';
                }).addClass("text-warning").html(i18n("missing-value"));
            }
            this.stickit();
            return this;
        },

        bindings: {

            '#date': {
                observe: 'date',

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

            },
            '#tags': {
                observe: 'tags',
                getVal: function ($el, ev, option) {
                    return $el.val().split(", ");
                }
            },

            '#notes': {
                observe: 'notes'
            }

        }

        /*
        ,getFileName:function(model) {
          var filename1;
          var files = model.get('files');
          this.filename = new Array(files.length);
          for(var i = 0; i<files.length;i++){
              filename1 = files[i].uri.split('/');
              this.filename[i] = filename1[filename1.length-1];
          }
          return this.filename;
        } */

    });

    /**
     * @class
     * @name Data.Views.List
     * @extends Backbone.View
     * @description backbone list view for Data.List collection
     */
    Data.Views.List = Backbone.View.extend({

        events: {
            'click .pagin': 'changePage',
            'click #newData': 'openNewDataView'
        },

        tagName: 'div',
        className: 'data',

        /**
         * @extends Backbone.View.initialize
         */
        initialize: function (options) {
            $("#main").html(this.el);
            this.dataTypes = options.dataTypes;
            this.data = options.data;
            this.listenTo(this.data, 'reset', this.render);
            this.headers = options.paginationHeaders;
            this.dataTypePrivileges = options.dataTypePrivileges.models;
            this.template = JST["views/templates/data-list.ejs"];
            this.params = options.params;
            this.parentDataType = options.params && options.params.parentDataType;
            this.parentSubject = options.params && options.params.parentSubject;
            this.parentSubjectCode = options.params && options.params.parentSubjectCode ? options.params.parentSubjectCode : options.params.donorCode ? options.params.donorCode : null;
            this.parentSample = options.params && options.params.parentSample;
            this.parentData = options.params && options.params.parentData;
            this.render();
        },

        addLinksToModels: function () {
            _.each(this.data.models, function (data) {
                var privilege = _.find(this.dataTypePrivileges, function (model) { return model.get('dataType') === data.get("type"); });
                if (privilege && privilege.get('privilegeLevel') === "edit") {
                    data.set("editLink", "#/data/edit/" + data.id);
                }
                if (privilege && privilege.get('privilegeLevel') !== "view_overview") {
                    data.set("detailsLink", "#/data/details/" + data.id);
                }
                var type = this.dataTypes.get(data.get("type"));
                var dataTypeChildren = _.where(type.get("children"), { "model": Classes.DATA });
                if (dataTypeChildren.length > 0) {
                    var dids = _.map(dataTypeChildren, 'id').join();
                    data.set("newDataLink", "#/data/new/0?idDataTypes=" + dids + "&parentData=" + data.id);
                }
            }, this);
        },

        render: function () {
            this.addLinksToModels();
            this.$el.html(this.template({ __: i18n, data: this.data.models, dataTypePrivileges: this.dataTypePrivileges, dataTypes: this.dataTypes.models }));
            this.table = this.$('.table').DataTable({
                scrollY: '50vh',
                "paging": false,
                "info": false
            });

            // this.filterData(this.params);

            $('#pagination').append(JST["views/templates/pagination-bar.ejs"]({
                __: i18n,
                headers: this.headers,
                rowsLenght: this.data.models.length,
                DEFAULT_LIMIT: xtens.module("xtensconstants").DefaultLimit
            }));
            this.setPaginationInfo();
            return this;
        },

        // filterData: function(opt){
        //     var rex = opt && opt.projects ? new RegExp(opt.projects) : new RegExp(xtens.session.get('activeProject'));
        //
        //     if(rex =="/all/"){
        //         this.clearFilter();
        //     }else{
        //         $('.content').hide();
        //         $('.content').filter(function() {
        //             return rex.test($(this).text());
        //         }).show();
        //     }
        //     this.headers.notFiltered = $('tr').filter(function() { return $(this).css('display') !== 'none'; }).length - 1;
        // },
        //
        // clearFilter: function(){
        //     // $('#project-selector').val('');
        //     $('.content').show();
        // },

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
                    $('.loader-gif').css("display", "none");
                    that.data.reset(results);
                    // that.filterData();
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
        },

        openNewDataView: function (ev) {
            ev.preventDefault();
            var parentSubjectQuery = this.parentSubject ? 'parentSubject=' + this.parentSubject : '';
            var parentSubjectCodeQuery = this.parentSubjectCode ? 'parentSubjectCode=' + this.parentSubjectCode : '';
            var parentSampleQuery = this.parentSample ? 'parentSample=' + this.parentSample : '';
            var parentDataQuery = this.parentData ? 'parentData=' + this.parentData : '';
            var parentDataTypeQuery = this.parentDataType ? 'parentDataType=' + this.parentDataType : '';
            var queryString = _.compact([parentSubjectQuery, parentSubjectCodeQuery,
                parentSampleQuery, parentDataQuery, parentDataTypeQuery]).join('&');
            var route = _.trim(['/data/new', queryString].join('/0?'));
            xtens.router.navigate(route, { trigger: true });
            return false;
        }

    });

    /**
     * @class
     * @name Data.Views.DedicatedManagement
     * @extends Backbone.View
     * @description view to automatically upload bulk data (i.e. files) with metadata on the server
     */
    Data.Views.DedicatedManagement = Backbone.View.extend({

        events: {
            'submit .edit-data-form': 'saveCustomisedData',
            'click #by-patient': 'showByPatient',
            'click #bulk': 'hideByPatient',
            'change #data-type': 'showSelector',
            'change #subject-selector': 'getSubjectSamples',
            'click #new-subject': 'goToNewSubject',
            'click #new-sample': 'goToNewSample',
            'change #sample-selector': 'setSampleTypeSelector',
            'click #reloadDaemonsTableButton': 'startReloadingDaemons'
        },

        tagName: 'div',
        className: 'data',

        initialize: function (options) {
            _.bindAll(this, 'saveOnSuccess');
            $("#main").html(this.el);
            this.template = JST["views/templates/dedicated-data-edit.ejs"];
            this.dataTypes = options.dataTypes && options.dataTypes.toJSON();
            this.privileges = options.dataTypePrivileges && options.dataTypePrivileges.toJSON();
            this.tableView = null;
            this.sendVcfByPatient = false;
            this.randomFolder = Math.floor(Math.random() * 20001) + 10000;
            var url = '/fileContent?folder=' + this.randomFolder;
            this.dropzoneOpts = {
                url: url,
                paramName: "uploadFile",
                maxFilesize: 2048, // max 2 GiB
                uploadMultiple: false,
                method: "POST"
            };

            this.render();
            this.$tableCnt = this.$("#daemon-table-cnt");
            this.$modal = $(".modal-cnt");
            this.$daemonNoResultCnt = this.$("#daemonNoResultCnt");
            // this.$aDeamonTableTag = $("#collapse-daemons");
            this.keepCalling = false;
            this.daemons = options.daemons;
            this.initializeDaemonsTable(this.daemons, options.operator);
        },

        render: function () {
            var that = this;
            var textHtml = "";
            this.$el.html(this.template({ __: i18n }));
            _.forEach(procedures, function (procedure) {
                var dt = _.find(that.dataTypes, function (dt) {
                    if (_.isArray(procedure.superType)) {
                        return procedure.superType.indexOf(dt.superType.id) > -1;
                    } else {
                        return dt.superType.id === procedure.superType;
                    }
                });
                if (dt && _.find(that.privileges, { 'dataType': dt.id })) {
                    textHtml = textHtml + '<option value="' + procedure.value + '">' + procedure.label + '</option>';
                }
            });
            $("#data-type").html(textHtml).selectpicker();
            this.$("#save").prop("disabled", true);
            this.$("#save").prop('title', 'Select a specific project to perform a procedure and load at least a file');
            this.$('form').parsley(parsleyOptsDataManagementParent);
            this.dropzone = new Dropzone(this.$(".dropzone")[0], this.dropzoneOpts);

            this.dropzone.on("sending", function (file, xhr, formData) {
                xhr.setRequestHeader("Authorization", "Bearer " + xtens.session.get("accessToken"));
                console.log(file.name);
                formData.append("fileName", file.name);
            });

            this.dropzone.on("success", function (file, xhr, formData) {
                that.$("#save").prop("disabled", false);

                console.log("Data.Views.DedicatedUpload -  file uploaded successfully");
            });

            $("#collapse-button").click(function () {
                $("#collapse-import").collapse('show');
                $(".new-import-btn-cnt").css('display', 'none ');
            });

            xtens.router.on("route", function (route, params) {
                clearInterval(that.interval);
            });

            return this;
        },

        showSelector: function () {
            $('.dropzone').removeClass('hidden');
            $('#save').removeClass('hidden');
            if (this.NGSPatientsImportView) { this.NGSPatientsImportView.remove(); this.NGSPatientsImportView = null; }
            if ($('#data-type').val() === 'VCF') {
                $('#vcfDiv').removeClass('hidden');
                $('#ngsAnalysisdiv').addClass('hidden');
                $('#ngsPatientdiv').addClass('hidden');
            } else if ($('#data-type').val() === 'NGSPAT') {
                if (!this.NGSPatientsImportView) {
                    this.NGSPatientsImportView = new Data.Views.NGSPatientsImport({
                        dataTypes: this.dataTypes,
                        privileges: this.privileges
                        // model: model,
                        // colors: colors
                    });
                }
                $('#ngsPatientdiv').append(this.NGSPatientsImportView.render().el);
                $('#ngsPatientdiv').removeClass('hidden');
                $('#ngsAnalysisdiv').addClass('hidden');
                $('#vcfDiv').addClass('hidden');
                $('#addRowIcon').tooltip();
            } else if ($('#data-type').val() === 'NGSAN') {
                $('#ngsAnalysisdiv').removeClass('hidden');
                $('#vcfDiv').addClass('hidden');
                $('#ngsPatientdiv').addClass('hidden');
                if (this.NGSPatientsImportView) {
                    $('#ngsPatientdiv').empty();
                }
            } else {
                $('#vcfDiv').addClass('hidden');
                $('#ngsAnalysisdiv').addClass('hidden');
                $('#ngsPatientdiv').addClass('hidden');
                if (this.NGSPatientsImportView) {
                    $('#ngsPatientdiv').empty(); [];
                }
            }
        },

        showByPatient: function (params) {
            $('#subject-selector').prop('required', true);
            $('#sample-selector').prop('required', true);
            $('#sample-type-selector').prop('required', true);
            $('#machine-selector').prop('required', true);
            $('#capture-input').prop('required', true);
            $('.selector-cnt').removeClass('hidden');
            $('#bulk').removeClass('btn-success');
            $('#bulk').addClass('btn-default');
            $('#bulk-message').addClass('hidden');
            $('#by-patient').removeClass('btn-default');
            $('#by-patient').addClass('btn-success');
            this.getSubjects();
            this.getSampleTypes();
            this.getMachineTypes();
            this.sendVcfByPatient = true;
        },

        hideByPatient: function (params) {
            $('#subject-selector').prop('required', false);
            $('#sample-selector').prop('required', false);
            $('#sample-type-selector').prop('required', false);
            $('#machine-selector').prop('required', false);
            $('#capture-input').prop('required', false);
            $('.selector-cnt').addClass('hidden');
            $('#bulk').addClass('btn-success');
            $('#bulk').removeClass('btn-default');
            $('#bulk-message').removeClass('hidden');
            $('#by-patient').addClass('btn-default');
            $('#by-patient').removeClass('btn-success');
            $('#by-patient-ngs').removeClass('btn-success');
            this.sendVcfByPatient = false;
        },

        goToNewSubject: function () {
            xtens.router.navigate('#/subjects/new', { trigger: true });
        },

        goToNewSample: function () {
            var idPatient = $('#subject-selector').val().split('#')[0];
            xtens.router.navigate('#/samples/new/0?donor=' + idPatient, { trigger: true });
        },

        setSampleTypeSelector: function () {
            var samplesubtext = $('#sample-selector').find(':selected').data('subtext');
            $('#sample-type-selector').val(samplesubtext);
            $('#sample-type-selector').selectpicker('refresh');
        },

        getSubjects: function () {
            var that = this;
            var textHtml = "";
            var activeProjectId = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id : "";

            $.ajax({
                url: '/subject',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: {
                    project: activeProjectId,
                    limit: 10000,
                    sort: 'created_at ASC'
                },
                contentType: 'application/json',
                success: function (subjects) {
                    _.forEach(subjects, function (subject) {
                        textHtml = textHtml + '<option value=\"' + subject.id + '#' + subject.code + '\">' + subject.code + '</option>';
                    });
                    $("#subject-selector").html(textHtml).selectpicker();
                    $("#sample-selector").selectpicker();
                    that.$("#save").prop("disabled", true);
                    that.$("#save").prop('title', 'Select a patient and sample to perform a procedure and load at least a file');
                    that.$('form').parsley(parsleyOptsDataManagementParent);
                },
                error: function (err) {
                    xtens.error(err);
                }
            });
        },

        getSubjectSamples: function () {
            // var that = this;
            // var activeProjectId = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id : "";
            var textHtml = "";
            var idPatient = $('#subject-selector').val().split('#')[0];

            $.ajax({
                url: '/sample',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: {
                    donor: idPatient,
                    limit: 10000,
                    sort: 'created_at ASC'
                },
                contentType: 'application/json',
                success: function (samples, options, res) {
                    _.forEach(samples, function (sample) {
                        textHtml = textHtml + '<option value=\"' + sample.id + '#' + sample.biobankCode + '\" data-subtext=\"' + sample.metadata.type.value + '\">' + sample.biobankCode + '</option>';
                    });
                    $("#new-sample").prop("disabled", false);
                    $("#sample-selector").prop("disabled", false);
                    $("#sample-selector").html(textHtml).selectpicker('refresh');
                    $('#sample-type-selector').val('');
                    $('#sample-type-selector').selectpicker('refresh');
                    $('#machine-selector').val('');
                    $('#machine-selector').selectpicker('refresh');
                    $('#capture-input').val('');
                    $('#capture-input');
                },
                error: function (err) {
                    xtens.error(err);
                }
            });
            // get samples from subjectsamples table joined with samples
        },

        getSampleTypes: function () {
            // at the moment we set directly into html
            $('#sample-type-selector').selectpicker();
        },

        getMachineTypes: function () {
            // at the moment we set directly into html
            $('#machine-selector').selectpicker();
        },

        saveCustomisedData: function (ev) {
            ev.preventDefault();
            var vcfData = {};
            if ($('#data-type').val() === 'VCF' && this.sendVcfByPatient) {
                vcfData.subjectId = parseInt($('#subject-selector').val().split('#')[0]);
                vcfData.subjectCode = $('#subject-selector').val().split('#')[1];
                vcfData.sampleId = parseInt($('#sample-selector').val().split('#')[0]);
                vcfData.sampleBiobankCode = $('#sample-selector').val().split('#')[1];
                vcfData.sampleType = $('#sample-type-selector').val();
                vcfData.machine = $('#machine-selector').val();
                vcfData.capture = $('#capture-input').val();
            }

            if ($('#data-type').val() === 'NGSAN') {
                vcfData.reWritePath = $('#reWritePath').is(":checked");
            }

            var that = this; var dataType = this.$("select option:selected").val(); var superType = _.find(procedures, { 'value': dataType }).superType; var owner = _.find(procedures, { 'value': dataType }).owner;
            var activeProject = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }) : undefined;
            $.ajax({
                url: '/customisedData',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: JSON.stringify({
                    dataType: dataType,
                    superType: superType,
                    owner: owner,
                    idProject: activeProject && activeProject.id,
                    folder: this.randomFolder,
                    vcfData: vcfData
                }),
                contentType: 'application/json',

                success: this.saveOnSuccess,

                error: function (err) {
                    if (that.modal) {
                        that.modal.hide();
                    }
                    that.$modal.one('hidden.bs.modal', function (e) {
                        e.preventDefault();
                        xtens.error(err);
                        that.dropzone.removeAllFiles(true);
                    });
                }
            });
            return false;
        },

        startReloadingDaemons: function () {
            var that = this;
            this.keepCalling = true;
            var timeleft = 10;

            var refreshTimer = setInterval(function () {
                if (timeleft <= 0) {
                    clearInterval(refreshTimer);
                    $('#refresh-dmn').removeClass('icn-spinner');
                    $('#reloadDaemonsTableButton').prop('disabled', false);
                    $('#reloadDaemonsTableButton').html('<i id="refresh-dmn" class="fa fa-refresh"></i> Check Processes');
                    $("#countdown").text("");
                    that.keepCalling = false;

                    console.log("Kill setInterval ReloadDaemonstable");
                } else {
                    $("#countdown").text(timeleft + "s remaining");
                }
                timeleft -= 1;
            }, 1000);

            $('#reloadDaemonsTableButton').html('<i id="refresh-dmn" class="fa fa-refresh"></i> Checking');
            $('#reloadDaemonsTableButton').prop('disabled', true);
            $('#refresh-dmn').addClass('icn-spinner');

            that.reloadDaemonsTable();
        },

        reloadDaemonsTable: function () {
            var that = this;
            console.log("Calling ReloadDaemonstable");
            this.tableView.refreshDaemonsTable();
            this.interval = setInterval(function () {
                if (!that.keepCalling) {
                    clearTimeout(that.interval);
                    // console.log("stop setInterval ReloadDaemonstable");
                } else {
                    that.tableView.refreshDaemonsTable();
                    // console.log("Calling ReloadDaemonstable");
                }
            }, 2000);
        },

        initializeDaemonsTable: function (results, operator) {
            if (this.tableView) {
                this.tableView.destroy();
            }
            this.tableView = new Daemon.Views.DaemonsTable({ daemons: results, operator: operator });
            this.$tableCnt.append(this.tableView.render().el);
            this.tableView.displayDaemonsTable();
            // this.startReloadingDaemons();
        },

        saveOnSuccess: function (infoObj) {
            var that = this;
            if (this.modal) {
                this.modal.hide();
            }
            this.randomFolder = Math.floor(Math.random() * 20001) + 10000;
            var url = '/fileContent?folder=' + this.randomFolder;
            this.dropzone.options.url = url;
            // this.$modal.one('hidden.bs.modal', function (e) {
            this.modal = new ModalDialog({
                title: i18n('data-correctly-loaded-on-server'),
                body: JST["views/templates/dedicated-data-dialog-bootstrap.ejs"]({ __: i18n })
            });

            this.$modal.append(this.modal.render().el);
            $('.modal-header').addClass('alert-info');
            this.modal.show();

            setTimeout(function () { that.modal.hide(); }, 1500);
            that.$modal.one('hidden.bs.modal', function (e) {
                that.dropzone.removeAllFiles(true);
                that.modal.remove();
                $(".new-import-btn-cnt").css('display', 'block');
                that.startReloadingDaemons();
                $("#collapse-import").collapse('hide');
            });
        }

    });

    /**
     * @class
     * @name Data.Views.NGSPatientsImport
     * @extends Backbone.View
     * @description view to automatically upload bulk data (i.e. files) with metadata on the server
     */
    Data.Views.NGSPatientsImport = Backbone.View.extend({

        serialize: function () {
            var arr = [];
            if (this.nestedViews && this.nestedViews.length) {
                for (var i = 0, len = this.nestedViews.length; i < len; i++) {
                    this.nestedViews[i].model.set('Family ID', this.model.get('Family ID'));
                    arr.push(this.nestedViews[i].model.attributes);
                }
            }
            return arr;
        },

        events: {
            'click #by-patient-ngs': 'showByPatient',
            'click #bulk-ngs': 'showBulk',
            'click #addRowIcon': 'addRow',
            'keyup #familyid-input': 'onChangeFamilyID',
            'submit .ngs-data-form': 'saveNGSFamily'
        },

        tagName: 'div',
        className: 'ngs-analysis-import',

        initialize: function (options) {
            this.template = JST["views/templates/dedicated-data-edit-ngs-patients.ejs"];
            this.templateByPatient = JST["views/templates/dedicated-data-edit-ngs-patients-bypat.ejs"];
            this.dataTypes = options.dataTypes && options.dataTypes;
            this.privileges = options.dataTypePrivileges && options.dataTypePrivileges;
            this.patientFields = new SuperType.Model(_.find(this.dataTypes, { id: 210 }).superType).getFlattenedFields();
            this.sampleFields = new SuperType.Model(_.find(this.dataTypes, { id: 211 }).superType).getFlattenedFields();
            this.analysisFields = new SuperType.Model(_.find(this.dataTypes, { id: 212 }).superType).getFlattenedFields();
            this.model = new Data.NGSPatientModel();
            this.nestedViews = [];
            this.patientStatusAlreadyEntered = [];
        },

        bindings: {
            '#familyid-input': 'Family ID'
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));

            // $('#addRowIcon').prop('disabled', false);
            // this.addRow();

            return this;
        },

        saveNGSFamily: function (ev) {
            ev.preventDefault();
            var that = this;

            this.$modal = $(".modal-cnt");
            var arrayPatients = this.serialize();
            var dataType = $("select#data-type option:selected").val();
            var superType = _.find(procedures, { 'value': dataType }).superType;
            var owner = _.find(procedures, { 'value': dataType }).owner;
            var activeProject = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }) : undefined;
            $.ajax({
                url: '/customisedData',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: JSON.stringify({
                    dataType: dataType,
                    superType: superType,
                    owner: owner,
                    idProject: activeProject && activeProject.id,
                    folder: this.randomFolder,
                    vcfData: {},
                    ngsPatData: arrayPatients
                }),
                contentType: 'application/json',

                success: function (infoObj) {
                    if (that.modal) {
                        that.modal.hide();
                    }

                    $("#reloadDaemonsTableButton").trigger("click");

                    that.modal = new ModalDialog({
                        title: i18n('data-correctly-loaded-on-server'),
                        body: JST["views/templates/dedicated-data-dialog-bootstrap.ejs"]({ __: i18n })
                    });

                    that.$modal.append(that.modal.render().el);
                    $('.modal-header').addClass('alert-info');
                    that.modal.show();

                    setTimeout(function () { that.modal.hide(); }, 1500);
                    that.$modal.one('hidden.bs.modal', function (e) {
                        // that.dropzone.removeAllFiles(true);
                        that.modal.remove();
                        $(".new-import-btn-cnt").css('display', 'block');
                        // that.startReloadingDaemons();
                        $("#collapse-import").collapse('hide');
                    });
                },

                error: function (err) {
                    if (that.modal) {
                        that.modal.hide();
                    }
                    that.$modal.one('hidden.bs.modal', function (e) {
                        e.preventDefault();
                        xtens.error(err);
                        that.dropzone.removeAllFiles(true);
                    });
                }
            });
            return false;
        },

        addRow: function (ev) {
            ev.preventDefault();
            var view = new Data.Views.NGSPatientsFamilyRow({
                patientFields: this.patientFields,
                sampleFields: this.sampleFields,
                analysisFields: this.analysisFields
            });

            $('.patrow-container', this.$el).last().append(view.render().el);

            this.listenTo(view, 'closeMe', this.removeChild);
            this.handleRelationshipsOptions();

            this.$form.parsley(parsleyOpts);

            this.nestedViews.push(view);

            this.handleSaveButton();
        },

        showByPatient: function (params) {
            // $('#subject-selector').prop('required', true);
            // $('#sample-selector').prop('required', true);
            // $('#sample-type-selector').prop('required', true);
            // $('#machine-selector').prop('required', true);
            // $('#capture-input').prop('required', true);
            $('.selector-cnt-ngs').append(this.templateByPatient({ __: i18n, patientFields: this.patientFields, sampleFields: this.sampleFields, analysisFields: this.analysisFields }));
            this.$form = this.$('form .ngs-data-form');

            this.stickit();
            $('.selector-cnt-ngs').removeClass('hidden');
            // $('.exclude-parent-valid-input').removeAttr("data-parsley-excluded");
            // $('form .ngs-data-form').parsley(parsleyOpts).reset();
            $('#bulk-ngs').removeClass('btn-success');
            $('#bulk-ngs').addClass('btn-default');
            // $('#bulk-message').addClass('hidden');
            $('#by-patient-ngs').removeClass('btn-default');
            $('#by-patient-ngs').addClass('btn-success');
            $('.dropzone').addClass('hidden');
            $('#save').addClass('hidden');

            // this.getSampleTypes();
            // this.getMachineTypes();
            // this.sendVcfByPatient = true;
        },

        showBulk: function (params) {
            // $('#subject-selector').prop('required', false);
            // $('#sample-selector').prop('required', false);
            // $('#sample-type-selector').prop('required', false);
            // $('#machine-selector').prop('required', false);
            // $('#capture-input').prop('required', false);
            $('.selector-cnt-ngs').empty();
            this.$form = null;
            $('.selector-cnt-ngs').addClass('hidden');
            // $('.edit-data-form').parsley(parsleyOptsDataManagementParent).reset();
            $('#bulk-ngs').addClass('btn-success');
            $('#bulk-ngs').removeClass('btn-default');
            // $('#bulk-message').removeClass('hidden');
            $('#by-patient-ngs').addClass('btn-default');
            $('#by-patient-ngs').removeClass('btn-success');
            $('.dropzone').removeClass('hidden');
            $('#save').removeClass('hidden');
            // this.sendVcfByPatient = false;
        },

        removeChild: function (child) {
            for (var i = 0, len = this.nestedViews.length; i < len; i++) {
                if (_.isEqual(this.nestedViews[i], child)) {
                    child.remove();
                    if (child.nestedViews) {
                        for (var j = 0, clen = child.nestedViews.length; j < clen; j++) {
                            if (child.nestedViews[j].remove) {
                                child.nestedViews[j].remove();
                            }
                        }
                    }
                    this.nestedViews.splice(i, 1);
                }
            }
            this.handleSaveButton();
        },

        handleSaveButton: function () {
            if (this.nestedViews.length === 0) {
                $('#save-ngs-pat', this.$el).prop('disabled', true);
            } else {
                $('#save-ngs-pat', this.$el).prop('disabled', false);
            }
        },

        onChangeFamilyID: _.debounce(function (ev) {
            ev.preventDefault();
            $('#family-not-entered').addClass('hidden');
            $('#family-entered').addClass('hidden');
            // $('#addRowIcon').prop('disabled', true);

            if (ev.currentTarget.value != "") {
                $('#familyid-input').addClass('hidden');
                $('.checking-familyid').removeClass('hidden');
                var that = this;
                var queryObj = {
                    "dataType": 210,
                    "multiProject": false,
                    "junction": "AND",
                    "model": "Subject",
                    "content": [
                        {
                            "fieldName": "family_id",
                            "fieldType": "text",
                            "isList": false,
                            "caseInsensitive": false,
                            "comparator": "ILIKE",
                            "fieldValue": ev.currentTarget.value
                        }
                    ],
                    "wantsSubject": true,
                    "leafSearch": false,
                    "wantsPersonalInfo": false
                };

                return $.ajax({
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                    },
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    url: '/query/dataSearch',
                    data: 'queryArgs=' + JSON.stringify(queryObj) + '&isStream=false',
                    success: function (results) {
                        $('#familyid-input').removeClass('hidden');
                        $('.checking-familyid').addClass('hidden');
                        // $('#addRowIcon').prop('disabled', false);
                        that.patientStatusAlreadyEntered = [];
                        if (results.data && results.data.length > 0) {
                            $('#familyid-input').val(results.data[0].metadata.family_id.value);
                            that.patientStatusAlreadyEntered = _.map(results.data, function (d) {
                                if (['PROBAND', 'MOTHER', 'FATHER'].indexOf(d.metadata.status.value) > -1) {
                                    return d.metadata.status.value;
                                }
                            });
                            var textValueEntered = [i18n("family-entered"), that.patientStatusAlreadyEntered.join(", "), "."].join("");
                            $('#family-entered').text(textValueEntered);
                            $('#family-entered').removeClass('hidden');
                            $('#family-not-entered').addClass('hidden');
                        } else if (results.data && results.data.length === 0) {
                            $('#family-not-entered').text(i18n("family-not-entered"));
                            $('#family-not-entered').removeClass('hidden');
                            $('#family-entered').addClass('hidden');
                        }
                        that.handleRelationshipsOptions();
                    }
                });
            }
        }, 700),

        handleRelationshipsOptions: function () {
            $('.relationship-type-selector option').attr('disabled', false);
            _.forEach(this.patientStatusAlreadyEntered, function (rel) {
                $('.relationship-type-selector option[value=' + rel + ']').attr('disabled', true);
            });
            $('select.relationship-type-selector').select2({ placeholder: 'Select Relation' });
        }
    });

    Data.NGSPatientModel = Backbone.Model.extend({});

    Data.Views.NGSPatientsFamilyRow = Backbone.View.extend({

        events: {
            'click .remove-me': 'closeMe',
            'keyup #phenotipsid-input': 'getPhenotipsByID',
            'keyup #samplelabid-input': 'checkSampleID'
        },

        tagName: 'li',
        className: 'list-group-item',

        bindings: {
            '#phenotipsid-input': 'PHENOTIPS ID',
            '.relationship-type-selector': {
                observe: 'Relationship',
                initialize: function ($el) {
                    $el.select2({ placeholder: 'Select Relation' });// i18n("please-select") });
                },
                selectOptions: {
                    collection: 'this.relatioshipsArraySource',
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function (val) {
                    return val;
                }
            },
            // '#unit-type-selector': 'Unit',
            '#unit-type-selector': {
                observe: 'Unit',
                initialize: function ($el) {
                    $el.select2({ placeholder: 'Select Unit' });// i18n("please-select") });
                },
                selectOptions: {
                    collection: 'this.unitArraySource',
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function (val) {
                    return val;
                }
            },
            '#affected-type-selector': {
                observe: 'Status',
                initialize: function ($el) {
                    $el.select2({ placeholder: 'Select Status' });// i18n("please-select") });
                },
                selectOptions: {
                    collection: 'this.affectedArraySource',
                    labelPath: 'text',
                    valuePath: 'value',
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function (val) {
                    return val;
                }
            },
            '#sex-type-selector': {
                observe: 'Sex',
                initialize: function ($el) {
                    $el.select2({ placeholder: 'Select Sex' });// i18n("please-select") });
                },
                selectOptions: {
                    collection: 'this.sexArraySource',
                    labelPath: 'text',
                    valuePath: 'value',
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function (val) {
                    return val;
                }
            },
            '#samplelabid-input': 'SAMPLE ID (LAB)',
            '#sampleiitid-input': 'Sample ID (IIT)',
            // '#shipmentdateiit-input': 'IIT Shipment Date',
            '#shipmentdateiit-input': {
                observe: 'IIT Shipment Date',

                // format date on model as ISO (YYYY-MM-DD)
                onSet: function (val, options) {
                    // var dateArray = val.split("/");
                    if (!val || val == "") {
                        return null;
                    }
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
            },
            '#260280-input': '260/280',
            '#totaldna-input': 'Total DNA',
            '#dnaconcentration-input': 'DNA Concentration',
            '#volume-input': 'Volume',
            '#seqtype-selector': {
                observe: 'Seq Type',
                initialize: function ($el) {
                    $el.select2({ placeholder: 'Select Seq Type' });// i18n("please-select") });
                },
                selectOptions: {
                    collection: 'this.analysisTypesArraySource',
                    labelPath: 'text',
                    valuePath: 'value',
                    defaultOption: {
                        label: '',
                        value: null
                    }
                },
                onGet: function (val) {
                    return val;
                }
            }
        },

        initialize: function (options) {
            this.template = JST["views/templates/dedicated-data-edit-ngs-patients-row.ejs"];
            this.dataTypes = options.dataTypes && options.dataTypes;
            this.privileges = options.dataTypePrivileges && options.dataTypePrivileges;
            this.patientFields = options.patientFields;
            this.sampleFields = options.sampleFields;
            this.analysisFields = options.analysisFields;
            this.relatioshipsArraySource = _.find(this.patientFields, { formattedName: "status" }).possibleValues;
            this.unitArraySource = _.find(this.patientFields, { formattedName: "unit" }).possibleValues;
            // this.analysisTypesArraySource = _.find(this.analysisFields, { formattedName: "target" }).possibleValues;
            this.analysisTypesArraySource = [
                {
                    text: 'WHOLE GENOME',
                    value: 'WGS'
                }, {
                    text: 'EXOME',
                    value: 'WES'
                }, {
                    text: 'PANEL',
                    value: 'PANEL'
                }
            ];
            this.affectedArraySource = [
                {
                    text: 'AFFECTED',
                    value: 'AFFECTED'
                }, {
                    text: 'NOT AFFECTED',
                    value: 'NOT AFFECTED'
                }
            ];
            this.sexArraySource = [
                {
                    text: 'M',
                    value: 'M'
                }, {
                    text: 'F',
                    value: 'F'
                }, {
                    text: 'N.A.',
                    value: 'N.A.'
                }
            ];
            this.phenotipsObject = null;
            this.model = new Data.NGSPatientModel();
            this.model.set('Volume', null);

            // this.listenTo(this.parentView, 'disableRelationshipsRows', this.disableRelationships);

            // this.relationshipValues = _.find(this.patientFields, { formattedName: "status" }).possibleValues;
        },

        render: function () {
            // var that = this;
            // var textHtml = "";
            this.$el.html(this.template({
                __: i18n,
                _: _,
                patientFields: this.patientFields,
                sampleFields: this.sampleFields,
                analysisFields: this.analysisFields,
                affectedArraySource: this.affectedArraySource,
                sexArraySource: this.sexArraySource
            }));

            this.stickit();

            // $('.relationship-type-selector', this.$el).selectpicker();
            // $('#affected-type-selector', this.$el).selectpicker();
            // $('#sex-type-selector', this.$el).selectpicker();
            // $('#unit-type-selector', this.$el).selectpicker();
            // $('#seqtype-selector', this.$el).selectpicker();

            // this.trigger('handleRelationshipsOptions', this);

            $('.remove-me', this.$el).tooltip();
            if ($('.ngs-data-form').length > 0) { $('.ngs-data-form').parsley(parsleyOpts).reset(); }

            return this;
        },

        closeMe: function (ev) {
            this.trigger('closeMe', this);
        },

        getPhenotipsByID: _.debounce(function (ev) {
            ev.preventDefault();
            var format = new RegExp(/P[0-9]{7}/);
            if (format.test(ev.currentTarget.value)) {
                $('#phenotipsid-input', this.$el).addClass('hidden');
                $('.checking-phenotipsid', this.$el).removeClass('hidden');
                var that = this;
                var textHtml = "";

                $.ajax({
                    url: '/getPhenotipsPatient?id=' + ev.currentTarget.value,
                    type: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                    },
                    contentType: 'application/json',
                    success: function (phenotipsObj, options, res) {
                        $('#phenotipsid-input').removeClass('hidden');
                        $('.checking-phenotipsid').addClass('hidden');
                        // console.log(phenotipsObj);
                        that.phenotipsObject = phenotipsObj;
                        if (that.phenotipsObject.id) {
                            toastr.success('Phenotips ID: ' + that.model.get('PHENOTIPS ID') + ' FOUND');
                        } else {
                            toastr.warning('Phenotips ID: ' + that.model.get('PHENOTIPS ID') + ' NOT FOUND');
                        }

                        $('#samplelabid-input', that.$el).val(phenotipsObj.external_id);
                        that.checkSampleID({ currentTarget: { value: phenotipsObj.external_id } });
                        if (phenotipsObj.sex) {
                            $("#sex-type-selector", that.$el).val(phenotipsObj.sex).trigger('change');
                        } else {
                            $("#sex-type-selector", that.$el).val(null).trigger('change');
                        }
                        // $("#sex-type-selector", that.$el).select2({ placeholder: 'Select Sex' });
                        // $("#sex-type-selector").selectpicker("refresh");

                        if (phenotipsObj.clinicalStatus) {
                            var value = phenotipsObj.clinicalStatus === 'affected' ? 'AFFECTED' : 'NOT AFFECTED';
                            $("#affected-type-selector", that.$el).val(value).trigger('change');
                        } else {
                            $("#affected-type-selector", that.$el).val(null).trigger('change');
                        }
                        // $("#affected-type-selector", that.$el).select2({ placeholder: 'Select Status' });

                        // $("#affected-type-selector").selectpicker("refresh");
                    },
                    error: function (err) {
                        xtens.error(err);
                    }
                });
            }
        }, 700),

        checkSampleID: _.debounce(function (ev) {
            ev.preventDefault && ev.preventDefault();
            if (ev.currentTarget.value && ev.currentTarget.value != "") {
                $('#samplelabid-input').addClass('hidden');
                $('.checking-samplelabid').removeClass('hidden');
                var currentValue = ev.currentTarget.value;
                var that = this;
                var queryObj = {
                    "dataType": 211,
                    "multiProject": false,
                    "junction": "AND",
                    "model": "Sample",
                    "content": [
                        {
                            "fieldName": "laboratory_id",
                            "fieldType": "text",
                            "isList": false,
                            "caseInsensitive": false,
                            "comparator": "=",
                            "fieldValue": ev.currentTarget.value
                        }
                    ],
                    "wantsSubject": true,
                    "leafSearch": false,
                    "wantsPersonalInfo": false
                };

                return $.ajax({
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                    },
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    url: '/query/dataSearch',
                    data: 'queryArgs=' + JSON.stringify(queryObj) + '&isStream=false',
                    success: function (results) {
                        $('#samplelabid-input').removeClass('hidden');
                        $('.checking-samplelabid').addClass('hidden');
                        if (results.data && results.data.length > 0) {
                            toastr.error('Sample LAB ID: ' + currentValue + ' already entered');
                            that.model.set('SAMPLE ID (LAB)', null);
                            $("#samplelabid-input", that.$el).text("");
                        }
                    }
                });
            }
        }, 700)
    });
}(xtens, xtens.module("data")));
