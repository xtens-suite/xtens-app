(function (xtens, Query) {
    // io.sails.autoConnect = false;
    var i18n = xtens.module("i18n").en;

    // TODO: retrieve this info FROM DATABASE ideally or from the server-side anyway
    var useFormattedNames = xtens.module("xtensconstants").useFormattedMetadataFieldNames;
    var Constants = xtens.module("xtensconstants").Constants;
    var FieldTypes = xtens.module("xtensconstants").FieldTypes;
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;
    // var QueryStrategy = xtens.module("querystrategy");
    // var Data = xtens.module("data");
    var DataType = xtens.module("datatype");
    var SuperType = xtens.module("supertype");
    var DataTypeClasses = xtens.module("xtensconstants").DataTypeClasses;
    var sexOptions = xtens.module("xtensconstants").SexOptions;
    var XtensTable = xtens.module("xtenstable");
    // var replaceUnderscoreAndCapitalize = xtens.module("utils").replaceUnderscoreAndCapitalize;
    var Privileges = xtens.module("xtensconstants").DataTypePrivilegeLevels;
    var VIEW_OVERVIEW = Privileges.VIEW_OVERVIEW;
    // constant to define the field-value HTML element
    var FIELD_VALUE = 'field-value';

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

    // var checkboxTemplate = _.template("<div class='checkbox'><input type='checkbox'></div>");

    // Factory method class to create specialized query views
    function QueryViewFactory () {
        this.createModelQueryView = function (dataTypeModel, specializedFieldsObj) {
            switch (dataTypeModel) {
                case DataTypeClasses.SUBJECT:
                    return new Query.Views.Subject({ model: new Query.SubjectModel(specializedFieldsObj) });
                case DataTypeClasses.SAMPLE:
                    return new Query.Views.Sample({ model: new Query.SampleModel(specializedFieldsObj), biobanks: arguments[2] });
            }
        };
    }

    var factory = new QueryViewFactory();

    Query.Model = Backbone.Model.extend({
        urlRoot: 'query'
    });

    // TODO: refactor this class together with MetadataComponent class
    /**
     * @class
     * @name Query.Views.Component
     * @extends Backbone.View
     * @description the abstract class for a generic query view component
     */
    Query.Views.Component = Backbone.View.extend({

        add: function (child) {
            this.nestedViews.push(child);
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
        },

        getChild: function (i) {
            if (this.nestedViews) {
                return this.nestedViews[i];
            }
            return null;
        },

        clearMe: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.clear(false);
        },

        serialize: function (leafSearch) {
            var res = _.clone(this.model.attributes);
            if (res.comparator) {
                res.comparator = this.correctComparator(res.comparator);
            }
            if (_.isArray(this.nestedViews)) {
                res.content = [];
                if (res.label) {
                    var leaf = {
                        label: res.label.replace(/[_]/g, " ").replace(/(^|\s)\S/g, function (l) { return l.toUpperCase(); }),
                        getMetadata: res.getMetadata,
                        superType: res.superType,
                        junction: res.junction
                    };
                    leafSearch.push(leaf);
                }
                for (var i = 0, len = this.nestedViews.length; i < len; i++) {
                    var result = this.nestedViews[i].serialize(leafSearch);
                    var serialized = result.leafSearch ? result.res : result;
                    // personalDetails, subjectComparator, sampleComparator, fieldComparator, root, nestedDatatype
                    if (this.IsValidContent(serialized)) {
                        res.content.push(serialized);
                    }
                }
                if (res.content && res.content.length > 0 && !_.isEmpty(res.content[0])) {
                    res.content = _.flatten(res.content, true);
                } else {
                    delete res['content'];
                }
            }
            return { res: res, leafSearch: leafSearch };
        },

        correctComparator: function (comparator) {
            switch (comparator) {
                case 'LIKES':
                case 'LIKEE':
                    comparator = 'LIKE';
                    break;
                case 'ILIKES':
                case 'ILIKEE':
                    comparator = 'ILIKE';
                    break;
                default:
                    break;
            }
            return comparator;
            // { id: 'LIKE', text: 'CONTAINS' }, { id: 'NOT LIKE', text: 'NOT CONTAINS' },
            // { id: 'LIKES', text: 'STARTS WITH' }, { id: 'LIKEE', text: 'ENDS WITH' },
            // { id: 'ILIKE', text: 'ICONTAINS' }, { id: 'NOT ILIKE', text: 'INOT CONTAINS' }, { id: 'ILIKES', text: 'ISTARTS WITH' },
            // { id: 'ILIKEE', text: 'IENDS WITH' }];
        },

        IsValidContent: function (serialized) {
            // se undefined oppure oggetto/array vuoto non valido
            if (!serialized || _.isEmpty(serialized)) {
                return false;
            } else if (this.isValidPersonalDetailsContent(serialized)) {
                return true;
            } else if (this.isValidSubjectComparatorContent(serialized)) {
                return true;
            } else if (this.isValidSampleComparatorContent(serialized)) {
                return true;
            } else if (this.isValidFieldComparatorContent(serialized)) {
                return true;
            } else if (this.isValidDatatypeContent(serialized)) {
                return true;
            }
            return false;
        },

        isValidDatatypeContent: function (serialized) {
            return serialized.hasOwnProperty("dataType") &&
                serialized.hasOwnProperty("getMetadata") &&
                serialized.hasOwnProperty("label") &&
                serialized.hasOwnProperty("model") &&
                serialized.hasOwnProperty("superType") &&
                serialized.hasOwnProperty("title");
        },

        isValidFieldComparatorContent: function (serialized) {
            return serialized.hasOwnProperty("caseInsensitive") &&
                serialized.hasOwnProperty("comparator") &&
                serialized.hasOwnProperty("fieldName") &&
                serialized.hasOwnProperty("fieldType") &&
                ((['IS NULL', 'IS NOT NULL'].indexOf(serialized.comparator) > -1) || serialized.hasOwnProperty("fieldValue")) &&
                serialized.hasOwnProperty("isInLoop") &&
                serialized.hasOwnProperty("isList");
        },

        isValidSampleComparatorContent: function (serialized) {
            return _.isArray(serialized) && serialized.length == 2 &&
                serialized[0].hasOwnProperty("specializedQuery") &&
                serialized[0].hasOwnProperty("biobankComparator") &&
                serialized[1].hasOwnProperty("biobankCodeComparator") &&
                serialized[1].hasOwnProperty("specializedQuery");
        },

        isValidSubjectComparatorContent: function (serialized) {
            return _.isArray(serialized) && serialized.length == 2 &&
                serialized[0].hasOwnProperty("codeComparator") &&
                serialized[0].hasOwnProperty("specializedQuery") &&
                serialized[1].hasOwnProperty("specializedQuery") &&
                serialized[1].hasOwnProperty("sexComparator");
        },

        isValidPersonalDetailsContent: function (serialized) {
            return serialized.hasOwnProperty("birthDateComparator") &&
                serialized.hasOwnProperty("givenNameComparator") &&
                serialized.hasOwnProperty("personalDetails") &&
                serialized.hasOwnProperty("surnameComparator");
        }

    });

    Query.PersonalInfoModel = Backbone.Model.extend({
        defaults: {
            "personalDetails": true
        }
    });

    Query.SubjectModel = Backbone.Model.extend({
        defaults: {
            "specializedQuery": DataTypeClasses.SUBJECT
        }
    });

    Query.SampleModel = Backbone.Model.extend({
        defaults: {
            "specializedQuery": DataTypeClasses.SAMPLE
        }
    });

    /**
     * @class
     * @name Query.RowModel
     * @extends Backbone.Model
     * @description the Backbone model for a leaf element in the query builder
     *              Each leaf element contains the following attributes
     *              - fieldName - [string]
     *              - fieldType - [allowed options: TEXT/INTEGER/FLOAT/DATE/BOOLEAN]
     *              - comparator - [one of the allowed comparators]
     *              - junctor - [allowed options: AND(default)/OR]
     *              - fieldValue - one or more values to feed the query
     */
    Query.RowModel = Backbone.Model.extend({});

    Query.LoopModel = Backbone.Model.extend({});

    /**
     * @class
     * @name Query.Views.Row
     * @extends Backbone.View
     * @extends Query.Views.Component
     * @description a row element in the query builder interface. Each row represents a metadata field that is not within a loop
     *              each row contains the elements bound to the attributes of Query.RowModel
     */
    Query.Views.Row = Query.Views.Component.fullExtend({
        events: {
            'change [name="field-value"]': 'onFieldValueChange',
            'click [name="field-value"]': 'onFieldValueClick',
            'change [name=comparator]': 'onComparisonValueChange'
        },

        className: 'form-group',

        bindings: {
            '[name="field-name"]': {
                observe: 'fieldName',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n("please-select") });
                },
                selectOptions: {
                    collection: function () {
                        return this.fieldList.map(function (field) {
                            // pick up formatted or unformatted name
                            var fieldName = useFormattedNames ? field.formattedName : field.name;
                            return { value: fieldName, label: field.name };
                        });
                    },
                    defaultOption: {
                        label: "",
                        value: null
                    }
                }

            }
        },

        initialize: function (options) {
            this.template = JST['views/templates/query-generic-row.ejs'];
            this.templateUnit = JST['views/templates/query-generic-row-unit.ejs'];
            this.fieldList = options.fieldList;
            this.listenTo(this.model, 'change:fieldName', this.fieldNameOnChange);
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));
            this.$el.addClass("query-row");
            this.stickit();
            this.$comparator = this.$("input[name=comparator]");
            this.$unitCnt = this.$(".query-unit-div");
            this.$junction = this.$("input[name=junction]");
            if (this.model.get("fieldName")) {
                this.selectedField = this.generateStatementOptions(this.model, this.model.get("fieldName"));
                this.$fieldValue = this.$("input[name='" + FIELD_VALUE + "']");
                this.setValidationOptions();
                $("#query-form").parsley(parsleyOpts);
            }
            return this;
        },

        setValidationOptions: function () {
            this.$fieldValue.prop('required', true);
            this.$comparator.prop('required', true);

            switch (this.selectedField.fieldType) {
                case FieldTypes.INTEGER:
                    this.$fieldValue.attr("data-parsley-type", "integer");
                    break;
                case FieldTypes.FLOAT:
                    this.$fieldValue.attr("data-parsley-type", "number");
                    break;
                case FieldTypes.DATE:
                    this.initDatepicker();
                    this.$fieldValue.attr("placeholder", "DD/MM/YYYY");

                    break;
            }
            if (this.selectedField.hasRange) {
                this.$fieldValue.attr("min", this.selectedField.min);
                this.$fieldValue.attr("max", this.selectedField.max);
            }
            if (this.selectedField.hasUnit && this.selectedField.possibleUnits) {
                this.$unit.prop('required', true);
            }
            if (['IS NULL', 'IS NOT NULL'].indexOf(this.model.get('comparator')) > -1) {
                this.$fieldValue.prop('required', false);
                this.$fieldValue.addClass('hidden');
                this.$('[name=field-value]').val("");
            }
        },

        initDatepicker: function () {
            var picker = new Pikaday({
                field: this.$fieldValue[0],
                format: 'DD/MM/YYYY',
                yearRange: [1900, new Date().getYear()],
                maxDate: new Date()
            });
        },

        fieldNameOnChange: function (model, fieldName) {
            // unset all the attributes but field name for the current model (FIX issue #1)
            _.forEach(model.attributes, function (value, key) {
                if (key !== 'fieldName') {
                    model.unset(key);
                }
            });
            this.selectedField = this.generateStatementOptions(model, fieldName);
            this.$fieldValue = this.$("input[name='" + FIELD_VALUE + "']");
            this.setValidationOptions(this.selectedField);
            $("#query-form").parsley(parsleyOpts);
        },

        onComparisonValueChange: function (ev) {
            ev.preventDefault();
            if (this.$fieldValue) {
                var currentComparison = this.$('[name=comparator]').select2('data');
                switch (currentComparison.text) {
                    case 'IS NULL':
                    case 'IS NOT NULL':
                        this.$fieldValue.prop('required', false);
                        this.$fieldValue.addClass('hidden');
                        this.$('[name=field-value]').val("");
                        break;

                    default:
                        this.$fieldValue.prop('required', true);
                        this.$fieldValue.removeClass('hidden');
                        break;
                }
                this.onFieldValueChange(ev);
            }
        },

        onFieldValueChange: function (ev) {
            ev.preventDefault();
            // togliere tutte le %
            if (this.$('[name=field-value]').length > 0 && this.$('[name=field-value]').val() !== "") {
                var currentFieldValue = this.$('[name=field-value]').val();
                currentFieldValue = currentFieldValue.split('%').join('');
                var currentComparison = this.$('[name=comparator]').select2('data');
                switch (currentComparison.text) {
                    case '=':
                    case '≠':
                        break;
                    case 'NOT CONTAINS':
                    case 'INOT CONTAINS':
                    case 'CONTAINS':
                    case 'ICONTAINS':
                        currentFieldValue = '%' + currentFieldValue + '%';
                        break;
                    case 'STARTS WITH':
                    case 'ISTARTS WITH':
                        currentFieldValue = currentFieldValue + '%';
                        break;
                    case 'ENDS WITH':
                    case 'IENDS WITH':
                        currentFieldValue = '%' + currentFieldValue;
                        break;

                    default:
                        break;
                }
                this.$('[name=field-value]').val(currentFieldValue);
            }
        },

        onFieldValueClick: function (ev) {
            ev.preventDefault();
            // togliere tutte le %
            var currentFieldValue = this.$('[name=field-value]').val();
            currentFieldValue = currentFieldValue.split('%').join('');
            this.$('[name=field-value]').val(currentFieldValue);
        },

        generateStatementOptions: function (model, fieldName) {
            this.$("input[type=text]").select2('destroy');
            this.$("input[type=text]").addClass('hidden');
            this.$("input[type=text]").attr('required', false);
            this.$unitCnt.empty();
            // set match criteria on formatted or unformatted names depending of the application usage
            var matchCriteria = useFormattedNames ? { "formattedName": fieldName } : { "name": fieldName };

            var selectedField = _.find(this.fieldList, matchCriteria);
            this.model.set("fieldType", selectedField.fieldType.toLowerCase());
            this.model.set("isList", selectedField.isList);
            this.model.set("caseInsensitive", selectedField.caseInsensitive);
            this.model.set("isInLoop", selectedField._loop);
            this.generateComparisonItem(selectedField);
            this.generateComparedValueItem(selectedField);
            if (selectedField.hasUnit && selectedField.possibleUnits) {
                var dataUnit = selectedField.possibleUnits.map(function (unit) {
                    return { id: unit, text: unit };
                });
                this.$unitCnt.append(this.templateUnit({ __: i18n, data: dataUnit }));
                this.$unit = this.$("select[name=unit]");
                this.generateComparedUnitItem(dataUnit);
            }
            this.generateJunctionItem();
            return selectedField;
        },

        generateComparisonItem: function (metadataField) {
            var data = []; var fieldType = metadataField.fieldType;
            if (fieldType === FieldTypes.BOOLEAN) {
                data = [{ id: '=', text: '=' },
                    { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
            } else if (metadataField.isList) {
                if (metadataField._loop) {
                    data = [{ id: '?&', text: 'MATCH ALL' }, { id: '?|', text: 'MATCH ANY' },
                        { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
                } else {
                    data = [{ id: 'IN', text: '=' }, { id: 'NOT IN', text: '≠' },
                        { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
                }
            } else if (fieldType === FieldTypes.INTEGER || fieldType === FieldTypes.FLOAT || fieldType === FieldTypes.DATE) {
                data = [{ id: '=', text: '=' }, { id: '<=', text: '≤' },
                    { id: '>=', text: '≥' }, { id: '<', text: '<' },
                    { id: '>', text: '>' }, { id: '<>', text: '≠' },
                    { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
            } else if (fieldType === FieldTypes.TEXT) {
                data = [{ id: '=', text: '=' }, { id: '<>', text: '≠' },
                    { id: 'LIKE', text: 'CONTAINS' }, { id: 'NOT LIKE', text: 'NOT CONTAINS' },
                    { id: 'LIKES', text: 'STARTS WITH' }, { id: 'LIKEE', text: 'ENDS WITH' },
                    { id: 'ILIKE', text: 'ICONTAINS' }, { id: 'NOT ILIKE', text: 'INOT CONTAINS' }, { id: 'ILIKES', text: 'ISTARTS WITH' },
                    { id: 'ILIKEE', text: 'IENDS WITH' },
                    { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
            } else {
                data = [{ id: '=', text: '=' }, { id: '<>', text: '≠' }],
                { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' };
            }
            this.addBinding(null, 'input[name=comparator]', {
                observe: 'comparator',
                initialize: function ($el) {
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('comparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                    $el.removeClass('hidden');
                    $el.change(function () {
                        $el.trigger('input');
                    });
                }
            });
        },

        generateComparedValueItem: function (metadataField) {
            var data = []; var fieldType = metadataField.fieldType;
            if (fieldType === FieldTypes.BOOLEAN) {
                this.appendComparedBoolean();
            } else if (metadataField.isList) {
                this.appendComparedValueList(metadataField.possibleValues);
            } else {
                this.appendTextInput();
            }
        },

        appendComparedBoolean: function () {
            var $container = this.$("[name='query-value-div']").empty().removeClass().addClass("query-value-div");
            var selector = document.createElement("input");
            selector.type = 'text';
            selector.className = 'form-control hidden';
            selector.name = FIELD_VALUE;
            $container.append(selector);
            this.addBinding(null, "input[name='" + FIELD_VALUE + "']", {
                observe: 'fieldValue',
                initialize: function ($el) {
                    $el.select2({
                        data: [{ id: true, text: i18n('yes') }, { id: false, text: i18n('no') }]
                    });
                    $el.removeClass('hidden');
                    $el.change(function () {
                        $el.trigger('input');
                    });
                }
            });
        },

        appendComparedValueList: function (list) {
            var $container = this.$("[name='query-value-div']").empty().removeClass().addClass("query-value-div");
            var selector = document.createElement("input");
            selector.type = 'text';
            selector.name = FIELD_VALUE;
            selector.className = 'form-control hidden';
            var data = list.map(function (elem) { return { "id": elem, "text": elem }; });
            $container.append(selector);
            this.addBinding(null, "input[name='" + FIELD_VALUE + "']", {
                observe: 'fieldValue',
                initialize: function ($el) {
                    $el.select2({
                        multiple: true,
                        data: data,
                        placeholder: i18n("please-select")
                    });
                    $el.removeClass('hidden');
                    $el.change(function () {
                        $el.trigger('input');
                    });
                },
                getVal: function ($el) {
                    return $el.val().split(",");
                }

            });
        },

        appendTextInput: function (validationOpts) {
            var $container = this.$("[name='query-value-div']").empty().removeClass().addClass("query-value-div");
            var textField = document.createElement("input");
            textField.type = 'text';
            textField.name = FIELD_VALUE;
            textField.className = 'form-control';
            $container.append(textField);
            this.addBinding(null, "input[name='" + FIELD_VALUE + "']", {
                observe: 'fieldValue'
            });
        },

        generateComparedUnitItem: function (data) {
            this.$unit.selectpicker('hide');

            this.addBinding(null, "select[name='unit']", {
                observe: 'fieldUnit',
                initialize: function ($el) {
                    $el.selectpicker({
                        placeholder: i18n("please-select"),
                        width: "100%"
                    });
                    $el.selectpicker('show');
                    if (this.model.get('fieldUnit') && this.model.get('fieldUnit').length > 0) {
                        $el.selectpicker('val', this.model.get('fieldUnit'));
                    }
                    $el.removeClass('hidden');
                    $el.change(function () {
                        $el.trigger('input');
                    });
                    $el.selectpicker('refresh');
                },
                getVal: function ($el) {
                    return $el.val();
                }

            });
        },

        generateJunctionItem: function () {
            var data = [{ id: 'AND', text: 'AND' }, { id: 'OR', text: 'OR' }];
            this.$junction.select2({
                data: data
            });
        }

    });

    /**
     * @name Query.Views.PersonalInfo
     * @extends Backbone.View
     * @extends Query.Views.Component
     * @description a leaf element for the query builder, containing all the specialized parameters pertaining to PersonalInfo
     *              (i.e. givenName, surname, birthDate)
     */
    Query.Views.PersonalInfo = Query.Views.Component.fullExtend({

        className: 'query-personalinfo',

        bindings: {

            '[name="surname-comparator"]': {
                observe: 'surnameComparator',
                initialize: function ($el) {
                    var data = [{ id: '=', text: '=' }, { id: '<>', text: '≠' },
                        { id: 'LIKE', text: 'LIKE' }, { id: 'NOT LIKE', text: 'NOT LIKE' },
                        { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('surnameComparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                }
            },
            '[name="surname"]': {
                observe: 'surname'
            },
            '[name="given-name-comparator"]': {
                observe: 'givenNameComparator',
                initialize: function ($el) {
                    var data = [{ id: '=', text: '=' }, { id: '<>', text: '≠' },
                        { id: 'LIKE', text: 'LIKE' }, { id: 'NOT LIKE', text: 'NOT LIKE' },
                        { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('givenNameComparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                }
            },
            '[name="given-name"]': {
                observe: 'givenName'
            },
            '[name="birth-date-comparator"]': {
                observe: 'birthDateComparator',
                initialize: function ($el) {
                    var data = [{ id: '=', text: '=' }, { id: '<>', text: '≠' },
                        { id: '<=', text: '≤' }, { id: '>=', text: '≥' },
                        { id: '<', text: '<' }, { id: '>', text: '>' },
                        { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('birthDateComparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                }
            },
            '[name="birth-date"]': {
                observe: 'birthDate',
                onSet: function (val, options) {
                    if (!val || val == "") {
                        return null;
                    }
                    var momentDate = moment(val, 'L', 'it');
                    return momentDate.format('YYYY-MM-DD');
                },

                // store data in view (from model) as DD/MM/YYYY (European format)
                onGet: function (value, options) {
                    if (value) {
                        return moment(value).lang("it").format('L');
                    }
                },
                initialize: function ($el, model) {
                    new Pikaday({
                        field: $el[0],
                        // lang: 'it',
                        format: moment.localeData('it')._longDateFormat.L,
                        minDate: moment('1900-01-01').toDate(),
                        maxDate: new Date()
                    });
                }
            }

        },

        events: {
            'input [name="surname"]': 'upper',
            'input [name="given-name"]': 'upper'
        },

        initialize: function (options) {
            this.template = JST['views/templates/query-personalinfo-fields.ejs'];
        },

        render: function () {
            this.$el.html(this.template({ __: i18n })); // TODO implement canViewPersonalInfo policy (server side)
            this.stickit();
            return this;
        },

        upper: function (ev) {
            ev.target.value = ev.target.value.toUpperCase();
        }

    });

    /**
     * @name Query.Views.Subject
     * @extends Backbone.View
     * @extends Query.Views.Component
     * @description a leaf element for the query builder, containing all the specialized parameters pertaining to Subject (i.e. code, sex)
     */
    Query.Views.Subject = Query.Views.Component.fullExtend({

        className: 'query-subject',

        bindings: {
            '[name="code-comparator"]': {
                observe: 'codeComparator',
                initialize: function ($el) {
                    var data = [{ id: 'LIKE', text: '=' }, { id: 'NOT LIKE', text: '≠' }];
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('codeComparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                }
            },
            '[name="code"]': {
                observe: 'code'
            },
            '[name="sex-comparator"]': {
                observe: 'sexComparator',
                initialize: function ($el) {
                    var data = [{ id: 'IN', text: '=' }, { id: 'NOT IN', text: '≠' }];
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('sexComparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                }
            },
            '[name="sex"]': {
                observe: 'sex',
                initialize: function ($el) {
                    var data = [];
                    _.each(sexOptions, function (sexOption) {
                        data.push({ id: sexOption, text: sexOption });
                    });
                    $el.select2({
                        multiple: true,
                        placeholder: i18n("please-select"),
                        data: data
                    });
                },
                getVal: function ($el) {
                    return $el.val().split(",");
                }
            }
        },

        initialize: function (options) {
            this.template = JST['views/templates/query-subject-fields.ejs'];
        },

        render: function () {
            this.$el.html(this.template({ __: i18n })); // TODO implement canViewPersonalInfo policy (server side)
            // this.$el.addClass("query-row");
            this.stickit();
            return this;
        },

        serialize: function () {
            var serialized = [];
            _.each(Constants.SUBJECT_PROPERTIES, function (property) {
                serialized.push(_.pick(_.clone(this.model.attributes), [property, property + 'Comparator', 'specializedQuery']));
            }, this);
            return serialized;
        }
    });

    /**
     * @name Query.Views.Sample
     * @extends Backbone.View
     * @extends Query.Views.Component
     * @description a leaf element for the query builder, containing all the specialized parameters pertaining to Sample (i.e. biobank code)
     */
    Query.Views.Sample = Query.Views.Component.fullExtend({

        className: 'query-sample',

        bindings: {
            '[name="biobank-comparator"]': {
                observe: 'biobankComparator',
                initialize: function ($el) {
                    var data = [{ id: '=', text: '=' }, { id: '<>', text: '≠' },
                        { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('biobankComparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                }
            },

            '[name="biobank"]': {
                observe: 'biobank',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n('please-select') });
                },
                selectOptions: {
                    collection: function () {
                        return this.biobanks.map(function (biobank) {
                            return {
                                label: biobank.get("acronym"),
                                value: biobank.id
                            };
                        });
                    },
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                getVal: function ($el, ev, options) {
                    return parseInt($el.val());
                },
                onGet: function (val) {
                    return val;
                }
            },

            '[name="biobank-code-comparator"]': {
                observe: 'biobankCodeComparator',
                initialize: function ($el) {
                    var data = [{ id: 'LIKE', text: '=' }, { id: 'NOT LIKE', text: '≠' },
                        { id: 'IS NULL', text: 'IS NULL' }, { id: 'IS NOT NULL', text: 'IS NOT NULL' }];
                    $el.select2({
                        data: data
                    });
                    if (!this.model.get('biobankCodeComparator')) {
                        $el.val(data[0].id).trigger('change');
                    }
                }
            },
            '[name="biobank-code"]': {
                observe: 'biobankCode'
            }
        },

        initialize: function (options) {
            this.template = JST['views/templates/query-sample-fields.ejs'];
            this.biobanks = options.biobanks;
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));
            this.stickit();
            return this;
        },

        serialize: function () {
            var serialized = [];
            _.each(Constants.SAMPLE_PROPERTIES, function (property) {
                serialized.push(_.pick(_.clone(this.model.attributes), [property, property + 'Comparator', 'specializedQuery']));
            }, this);
            return serialized;
        }

    });

    /**
     * @deprecated
     * @class
     * @name Query.Views.Loop
     * @extends Backbone.View
     * @extends Query.Views.Component
     * @description another possible leaf of the query builder, this one (instead of Query.Views.Rows) describes metadata fields contained within a loop
     *
     *
    Query.Views.Loop = Query.Views.Component.fullExtend({

        className: 'query-loop',

        initialize: function(options) {
            this.template = JST['views/templates/query-builder-loop.ejs'];
            this.loopList = options.loopList;
            this.nestedViews = [];
            this.listenTo(this.model, 'change:loopName', this.loopNameOnChange);
        },

        render: function() {
            this.$el.html(this.template({ __: i18n}));
            this.stickit();
            this.$loopBody = this.$(".query-loop-body");
            return this;
        },

        bindings: {
            '[name="loop-name"]': {
                observe: 'loopName',
                initialize: function($el) {
                    $el.select2({placeholder: i18n("please-select")});
                },
                selectOptions: {
                    collection: 'this.loopList',
                    labelPath: 'name',
                    valuePath: 'name',
                    defaultOption: {
                        label: "",
                        value: null
                    }
                }

            }
        },

        loopNameOnChange: function() {
            var selectedLoop = _.find(this.loopList, {name: this.model.get('loopName')});
            var childView;
            for (var i=0, len=selectedLoop.content.length; i<len; i++) {
                childView = new Query.Views.Row({fieldList: [selectedLoop.content[i]],
                                                model: new Query.RowModel({fieldName: selectedLoop.content[i].name})});
                                                this.$loopBody.append(childView.render().el);
                                                this.add(childView);
            }
        }
    }); */

    /**
     * @class
     * @name Query.Views.Composite
     * @extends Backbone.View
     * @extends Query.Views.Component
     * @description the composite query view, containing various (nested) leaves (i.e. Query.Views.Rows)
     *
     */
    Query.Views.Composite = Query.Views.Component.fullExtend({

        className: 'query-composite',

        bindings: {
            '[name="pivot-data-type"]': {
                observe: 'dataType',
                initialize: function ($el) {
                    $el.select2({ placeholder: i18n('please-select') });
                },
                selectOptions: {
                    collection: function () {
                        return this.dataTypes.models.map(function (dataType) {
                            return {
                                label: dataType.get("name"),
                                value: dataType.id
                            };
                        });
                    },
                    defaultOption: {
                        label: "",
                        value: null
                    }
                },
                getVal: function ($el, ev, options) {
                    return parseInt($el.val());
                },
                onGet: function (val) {
                    return val;
                }
            },
            '[name="junction"]': {
                observe: 'junction',
                initialize: function ($el) {
                    $el.select2();
                },
                selectOptions: {
                    collection: function () {
                        return [{ value: 'AND', label: i18n("all-conditions") }, { value: 'OR', label: i18n("any-of-the-conditions") }];
                    },
                    getVal: function ($el, ev, options) {
                        return $el.val();
                    },
                    onGet: function (val) {
                        return val;
                    }
                }
            }

        },

        initialize: function (options) {
            this.template = JST["views/templates/query-composite.ejs"];
            this.nestedViews = [];
            this.biobanks = options.biobanks || [];
            this.dataTypes = options.dataTypes || [];
            this.isFirst = options.isFirst;
            if (this.isFirst) {
                if (_.isEmpty(options.model.attributes)) {
                    this.model.set('multiProject', false);
                } else {
                    this.model = options.model;
                }
                if (options.queryBuiderView) {
                    this.queryBuiderView = options.queryBuiderView;
                }
            } else {
                if (_.isEmpty(options.model.attributes)) {
                    this.model.set('getMetadata', false);
                    this.model.set('label', "");
                } else {
                    this.model = options.model;
                }
            }
            this.model.set('junction', 'AND');

            this.dataTypesComplete = options.dataTypesComplete || [];
            this.dataTypePrivileges = options.dataTypePrivileges || [];
            this.bind("reset", this.destroyView);
            // this.listenTo(this.model, 'change:dataType', this.dataTypeOnChange);
        },

        events: {
            'click [name="add-field"]': 'addQueryRow',
            // 'click [name="add-loop"]': 'addLoopQuery',
            'click [name="add-nested"]': 'nestedQueryBtnOnClick',
            'click [name="multi-search"]': 'multiQueryBtnOnClick',
            'click [name="get-metadata"]': 'getMetadataBtnOnClick',
            'click .remove-me-field': 'closeMeField',
            'click .clear-me': 'clearMe'
        },
        destroyView: function (options) {
            // COMPLETELY UNBIND THE VIEW
            this.undelegateEvents();

            this.$el.removeData().unbind();

            // Remove view from DOM
            this.remove();
            Backbone.View.prototype.remove.call(this);
        },

        addQueryRow: function (ev) {
            ev.stopPropagation();
            var superType = new SuperType.Model(this.dataTypes.get(this.model.get('dataType')).get('superType'));
            var childView = new Query.Views.Row({
                fieldList: superType.getFlattenedFields(),
                model: new Query.RowModel()
            });
            this.$el.append(childView.render().el);
            this.add(childView);
        },

        closeMeField: function (ev) {
            ev.preventDefault();
            var that = this;
            $($(ev.currentTarget).closest('.query-row')).remove();
            _.forEach(this.nestedViews, function (val, i) {
                if (_.isEqual(val.$el, $($(ev.currentTarget).closest('.query-row')))) {
                    that.nestedViews.splice(i, 1);
                }
            });
        },

        nestedQueryBtnOnClick: function (ev) {
            ev.stopPropagation();
            this.addNestedQuery();
        },

        multiQueryBtnOnClick: function (ev) {
            ev.preventDefault();
            // ev.stopPropagation();
            this.$clearMe.addClass('hidden');
            $('div.query-composite', this.el).remove();
            this.nestedViews = _.filter(this.nestedViews, function (view) {
                if (_.find(view.el.classList, function (classes) { return classes !== "query-composite"; })) {
                    return view;
                }
            });
            if (this.model.get('multiProject') === false) {
                this.$multiSearchButton.removeClass('btn-danger').addClass('btn-success');
                this.model.set('multiProject', true);
                this.setDataTypeChildren(function () { });
            } else if (this.model.get('multiProject') === true) {
                this.$multiSearchButton.removeClass('btn-success').addClass('btn-danger');
                this.model.set('multiProject', false);
                if (this.childrenDataTypes.length === 0) {
                    this.$addNestedButton.prop('disabled', true);
                } else {
                    this.$addNestedButton.prop('disabled', false);
                }
            }
            ev.stopPropagation();
        },

        getMetadataBtnOnClick: function (ev) {
            ev.stopPropagation();
            if (this.model.get('getMetadata') == false) {
                this.$getMetadataButton.children('.fa-check').css("opacity", 1);
                this.model.set('getMetadata', true);
            } else if (this.model.get('getMetadata') == true) {
                this.$getMetadataButton.children('.fa-check').css("opacity", 0.15);
                this.model.set('getMetadata', false);
            }
        },

        /**
         * @method
         * @name addNestedQuery
         * @description add a nested query element to the current composite view
         *
         */
        addNestedQuery: function (queryObj) {
            if (this.childrenDataTypes.length !== 0) {
                // create composite subview
                var childView = new Query.Views.Composite({
                    isFirst: false,
                    biobanks: this.biobanks,
                    dataTypes: this.model.get('multiProject') && this.filteredChildren ? this.filteredChildren : this.childrenDataTypes,
                    dataTypesComplete: this.dataTypesComplete,
                    dataTypePrivileges: this.dataTypePrivileges,
                    model: new Query.Model(queryObj)
                });
                this.$el.append(childView.render({}).el);
                this.add(childView);
                if (childView.model.get("getMetadata")) {
                    childView.$getMetadataButton.children('.fa-check').css("opacity", 1);
                }
                this.$clearMe.removeClass('hidden');
                childView.rendered = true;
            }
        },

        /**
         * @method
         * @name setDataTypeChildren
         * @description check if current DataType selected has children to handle addNestedQueryButton correctly
         *
         */
        setDataTypeChildren: function (callback) {
            var that = this;
            var childrenIds = _.map(this.selectedDataType.get("children"), 'id');
            this.childrenDataTypes = new DataType.List(_.filter(this.dataTypesComplete.models, function (dataType) {
                return childrenIds.indexOf(dataType.id) > -1;
            }));
            if (this.childrenDataTypes.length === 0) {
                this.$addNestedButton.prop('disabled', true);
                callback();
                return;
            }
            if (this.model.get('multiProject')) {
                this.fetchDataTypesMultiProject(this.childrenDataTypes, this.selectedDataType.get("superType").id, function (filteredChildren) {
                    if (filteredChildren.length === 0) {
                        that.$addNestedButton.prop('disabled', true);
                    } else {
                        that.$addNestedButton.prop('disabled', false);
                        that.filteredChildren = filteredChildren;
                    }
                    callback();
                });
            } else {
                this.$addNestedButton.prop('disabled', false);
                callback();
            }
        },

        /**
         * @method
         * @name fetchDataTypesMultiProject
         * @param{Array} dataTypes - list of all possible children dataTypes
         * @param{integer} superTypeSelected - the superType ID of the selected Data Type
         * @description fetch all possibily children dataTypes based on selected SuperType project(s)
         *
         */
        fetchDataTypesMultiProject: function (dataTypes, superTypeSelected, callback) {
            var dtsSuperTypeFetch = new DataType.List();
            var dtsDefferred = dtsSuperTypeFetch.fetch({
                data: $.param({ superType: superTypeSelected })
            });

            $.when(dtsDefferred).then(function (dtsResults) {
                var projectParents = _.map(dtsResults, 'project');
                var requests = [];
                var dtsFetch = new DataType.List();
                for (var i = 0; i < dataTypes.length; i++) {
                    requests.push(dtsFetch.fetch({
                        data: $.param({ superType: dataTypes.models[i].get('superType').id })
                    }));
                }
                $.when.apply($, requests).then(function () {
                    var results = new DataType.List();
                    $.map(arguments, function (arg, i) {
                        var toBeIncluded = true;
                        _.forEach(arg[0], function (dt) {
                            if (projectParents.indexOf(dt.project) === -1) {
                                toBeIncluded = false;
                            }
                        });
                        if (arg[0].length > 1 && toBeIncluded) {
                            results.add(dataTypes.models[i]);
                        }
                    });
                    callback(results);
                });
            });
        },

        /**
         * @method
         * @name dataTypeOnChange
         * @param{DataType.Model} model - the Backbone current model, not used in the function
         * @param{integer} idDataType - the ID of the selected Data Type
         */
        dataTypeOnChange: function (model, idDataType) {
            this.clear(true);
            var that = this;
            if (!idDataType) {
                this.$multiSearchButton.addClass('hidden');
                this.$addFieldButton.addClass('hidden');
                this.$addLoopButton.addClass('hidden');
                this.selectedDataType = null;
                this.model.set("model", null);
                this.model.set("junction", 'AND');
            } else {
                if (this.isFirst) {
                    $("select.query-selector").val('default');
                    $("select.query-selector").selectpicker("refresh");
                    $('.delete-query').prop('disabled', true);
                    this.model = new Query.Model({
                        dataType: idDataType,
                        multiProject: false,
                        junction: 'AND'
                    });
                    this.createDataTypeRow(idDataType, function () {
                        that.setMultiProjectButton(false, false, function () {
                            $('input#search').prop('disabled', false);
                        });
                    });
                } else {
                    this.createDataTypeRow(idDataType, function () {

                    });
                }
            }
        },

        /**
         * @method
         * @name setMultiProjectButton
         * @param{boolean} isYetMulti - it suggests if the query is or not a multi Project query
         * @param{boolean} triggedSearch - it suggests if the query is triggered or not
         * @description check if current query is triggered and/or is multi Project to handle multiSearchButton correctly
         *
         */
        setMultiProjectButton: function (isYetMulti, triggedSearch, callback) {
            this.$multiSearchButton.removeClass('btn-success').addClass('btn-danger');

            if (!isYetMulti) {
                var that = this;
                var superTypeSelected = _.isObject(this.selectedDataType.get('superType')) ? this.selectedDataType.get('superType').id : this.selectedDataType.get('superType');
                var dataTypes = new DataType.List();

                var dataTypesDeferred = dataTypes.fetch({
                    data: $.param({ superType: superTypeSelected })
                });
                $.when(dataTypesDeferred).then(function (dataTypesRes) {
                    if (dataTypesRes.length > 1) {
                        that.$multiSearchButton.removeClass('hidden');
                    } else {
                        that.$multiSearchButton.addClass('hidden');
                    }
                    callback();
                });
            } else if (isYetMulti && triggedSearch) {
                // setTimeout(function () {
                this.$multiSearchButton.removeClass('btn-danger').addClass('btn-success').removeClass('hidden');
                callback();
                // }, 750);
            } else {
                callback();
            }
        },

        /**
         * @method
         * @name createDataTypeRow
         * @param{integer} idDataType
         */
        createDataTypeRow: function (idDataType, next) {
            var personalInfoQueryView; var modelQueryView; var childView; var queryContent = this.model.get("content"); var that = this;
            this.selectedDataType = this.dataTypes.get(idDataType);
            this.selectedPrivilege = this.dataTypePrivileges.findWhere({ 'dataType': idDataType });
            this.model.set("model", this.selectedDataType.get("model"));
            if (!this.isFirst) {
                var label = this.selectedDataType.get("name").toLowerCase().replace(/[||\-*/,=<>~!^()\ ]/g, "_");
                this.model.set("label", label);
                this.model.set("title", this.selectedDataType.get("name"));
                this.model.set("superType", this.selectedDataType.get("superType").id);
            }
            if (this.model.get("model") === DataTypeClasses.SUBJECT && xtens.session.get('canAccessPersonalData')) {
                personalInfoQueryView = new Query.Views.PersonalInfo({
                    model: new Query.PersonalInfoModel(_.find(queryContent, { personalDetails: true }))
                });
                this.addSubqueryView(personalInfoQueryView);
            }
            var specializedFieldsArr = _.where(queryContent, { specializedQuery: this.model.get("model") });
            // compress al the elements in the specialized query in a single object
            var specializedFieldsObj = _.reduce(specializedFieldsArr, function (obj, elem) {
                return _.merge(obj, elem);
            }, {});
            modelQueryView = factory.createModelQueryView(this.model.get("model"), specializedFieldsObj, this.biobanks);
            if (modelQueryView) {
                this.addSubqueryView(modelQueryView);
            }
            if (xtens.session.get("isWheel") || this.selectedPrivilege.get('privilegeLevel') !== VIEW_OVERVIEW) {
                this.$addFieldButton.removeClass('hidden');
                if (!this.isFirst) {
                    this.$getMetadataButton.removeClass('hidden');
                }
            } else if (this.selectedPrivilege.get('privilegeLevel') === VIEW_OVERVIEW) {
                this.$addFieldButton.addClass('hidden');
            }

            var selectedSuperType = new SuperType.Model(this.selectedDataType.get("superType"));
            var flattenedFields = selectedSuperType.getFlattenedFields();
            if (!xtens.session.get('canAccessSensitiveData') && this.selectedPrivilege.get('privilegeLevel') !== VIEW_OVERVIEW) {
                flattenedFields = _.filter(flattenedFields, function (field) { return !field.sensitive; });
            }

            this.setDataTypeChildren(function () {
                if ((that.filteredChildren && that.filteredChildren.length > 0) || that.childrenDataTypes.length !== 0) {
                    that.$addNestedButton.removeClass('hidden');
                }
                if (_.isArray(queryContent) && queryContent.length > 0) {
                    _.each(queryContent, function (queryElem) {
                        // it is a nested a nested composite element
                        if (queryElem.specializedQuery || queryElem.personalDetails) {
                            return true; // continue to next iteration
                        } else if (queryElem.dataType) {
                            that.addNestedQuery(queryElem);
                        }
                        // it is a leaf query element
                        else {
                            if (that.selectedPrivilege.get('privilegeLevel') !== VIEW_OVERVIEW) {
                                childView = new Query.Views.Row({
                                    fieldList: flattenedFields,
                                    model: new Query.RowModel(queryElem)
                                });
                                that.addSubqueryView(childView);
                            }
                        }
                    });
                    next();
                } else {
                    if (xtens.session.get("isWheel") || that.selectedPrivilege.get('privilegeLevel') !== VIEW_OVERVIEW) {
                        childView = new Query.Views.Row({ fieldList: flattenedFields, model: new Query.RowModel() });
                        that.$el.append(childView.render().el);
                        that.add(childView);
                    }
                    next();
                }
            });
        },

        /**
         * @method
         * @name addSubqueryView
         * @description add a subquery view to the composite view
         * @param{Query.View.Component} subqueryView
         */
        addSubqueryView: function (subqueryView) {
            this.$el.append(subqueryView.render().el);
            this.add(subqueryView);
        },

        /**
         * @method
         * @name clear
         * @description removes all the nested subviews, if present
         */
        clear: function (initialization) {
            var len = this.nestedViews.length;
            if (initialization) {
                for (var i = len - 1; i >= 0; i--) {
                    this.removeChild(this.nestedViews[i]);
                }
                xtens.router.navigate('/query/', { trigger: false });
                this.model.set("content", []);
            } else {
                this.nestedViews = _.filter(this.nestedViews, function (view) {
                    if (_.find(view.el.classList, function (classes) { return classes !== "query-composite"; })) {
                        return view;
                    } else {
                        view.remove();
                    }
                });
                this.$clearMe.addClass('hidden');
            }
        },

        /**
         * @method
         * @name render
         * @extends Backbone.View.render
         */
        render: function (options) {
            var that = this;
            if (options.id) { } // load an existing query TODO
            else {
                this.$el.html(this.template({ __: i18n, isFirst: this.isFirst }));
                this.stickit();
            }
            this.$addFieldButton = this.$("[name='add-field']");
            if (this.isFirst) {
                this.$multiSearchButton = this.$("[name='multi-search']");
            } else {
                this.$getMetadataButton = this.$("[name='get-metadata']");
            }
            this.$addLoopButton = this.$("[name='add-loop']");
            this.$addNestedButton = this.$("[name='add-nested']");
            this.$clearMe = this.$("[name='clear-me']");
            if (this.model.get("dataType")) {
                this.createDataTypeRow(this.model.get("dataType"), function () {
                    if (that.isFirst) {
                        that.setMultiProjectButton(that.model.get('multiProject'), true, function () {
                            // TODO: wait async nestedviews rendering and then trigger
                            if (that.queryBuiderView) {
                                that.queryBuiderView.trigger('search');
                            }
                        });
                    }
                });
            }
            this.listenTo(this.model, 'change:dataType', this.dataTypeOnChange);
            return this;
        }

    });

    /**
     * @class
     * @name Query.Views.Builder
     * @extends Backbone.View
     * @description the main container for the query builder form
     *
     */
    Query.Views.Builder = Backbone.View.extend({
        events: {
            'submit #query-form': 'sendQuery',
            'click .query-reset-all': 'resetQueryComposite'
        },

        className: 'query',

        /**
         * @method
         * @name initialize
         * @extends Backbone.View.initialize
         * @param{Object} - options, which contains the following properties:
         *                  - dataTypes - a list/array of available DataTypes
         *                  - queryObj - a (possibly nested) query object, as the one sent to server side requests
         */
        initialize: function (options) {
            _.bindAll(this, ['initializeDataTable', 'queryOnError']);
            this.template = JST["views/templates/query-builder.ejs"];
            $('#main').html(this.el);
            this.biobanks = options.biobanks || [];
            options.dataTypes.comparator = 'id';
            options.dataTypes.sort();
            this.dataTypes = options.dataTypes || [];
            this.operator = options.operator;
            this.dataTypePrivileges = options.dataTypePrivileges || [];
            this.render(options);
            // xtens.session.set('multiProject', options.queryObj ? options.queryObj.multiProject : false);
            this.queryView = new Query.Views.Composite({
                isFirst: true,
                biobanks: this.biobanks,
                dataTypes: this.dataTypes,
                dataTypesComplete: this.dataTypes,
                dataTypePrivileges: this.dataTypePrivileges,
                model: new Query.Model(options.queryObj),
                queryBuiderView: this
            });
            this.querySelectorView = new Query.Views.Selector({
                operator: this.operator,
                queryBuilder: this
            });
            this.$tableCnt = this.$("#result-table-cnt");
            this.$querySelectorCnt = this.$(".query-selector-cnt");
            this.$queryModal = $(".modal-cnt");
            this.$queryNoResultCnt = this.$("#queryNoResultCnt");
            this.$queryErrorCnt = this.$("#queryErrorCnt");
            this.tableView = null;
            this.$form = this.$("#query-form");
            this.$('#buttonbardiv').before(this.queryView.render({}).el);
            this.listenToOnce(this, 'search', this.sendQuery);
            // if a query object exists trigger a server-side search
            if (!options.queryObj) {
                this.$('input#search').prop('disabled', true);
            }
        },

        render: function () {
            this.$el.html(this.template({ __: i18n }));

            return this;
        },

        resetQueryComposite: function (ev) {
            ev.preventDefault();
            this.queryView.trigger("reset");
            this.queryView = new Query.Views.Composite({
                isFirst: true,
                biobanks: this.queryView.biobanks,
                dataTypes: this.queryView.dataTypes,
                dataTypesComplete: this.queryView.dataTypes,
                dataTypePrivileges: this.queryView.dataTypePrivileges,
                model: new Query.Model({})
            });
            $('#buttonbardiv').before(this.queryView.render({}).el);
            $("select.query-selector").val('default');
            $("select.query-selector").selectpicker("refresh");
            xtens.router.navigate('/query', { trigger: false });
            this.$('input#search').prop('disabled', true);
        },

        /**
         * @method
         * @name sendQuery
         * @description compose the object with query parameters and send it through AJAX request to the server for executing a (sanitised) query
         * @return{boolean} false
         */
        sendQuery: function () {
            var that = this;
            var isStream = !!(xtens.infoBrowser[0] === "Chrome" && xtens.infoBrowser[1] >= 54);
            // extend queryArgs with flags to retrieve subject and personal informations and if retrieve data in stream mode
            var serialized = this.queryView.serialize([]);

            var leafSearch = _.find(serialized.leafSearch, function (obj) {
                return obj.getMetadata === true;
            });

            this.leafSearch = {
                isLeafSearch: !!(leafSearch && leafSearch.getMetadata),
                info: serialized.leafSearch
            };
            this.multiProject = this.queryView.model.get('multiProject');
            var queryArgs = _.extend(serialized.res, {
                multiProject: this.multiProject,
                wantsSubject: true,
                leafSearch: this.leafSearch.isLeafSearch,
                wantsPersonalInfo: xtens.session.get('canAccessPersonalData')
            });

            var queryParameters = JSON.stringify({ queryArgs: queryArgs });
            // console.log(this.queryView.serialize());
            var path = '/query/' + encodeURIComponent(queryParameters);
            xtens.router.navigate(path, { trigger: false });
            if (isStream) {
                fetch('/query/dataSearch', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + xtens.session.get("accessToken"),
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: 'queryArgs=' + JSON.stringify(queryArgs) + '&isStream=' + JSON.stringify(isStream)
                })
                    .then(function (res) {
                        that.buffer = [], that.optStream = {}, that.tableInitialized = false;
                        return that.pumpStream(res.body.getReader(), queryArgs);
                    })
                    .catch(function (ex) {
                        // console.log('parsing failed', ex);
                        that.queryOnError();
                    });
            } else {
                $.ajax({
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                    },
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    url: '/query/dataSearch',
                    data: 'queryArgs=' + JSON.stringify(queryArgs) + '&isStream=' + JSON.stringify(isStream),
                    success: function (results) {
                        that.initializeDataTable(results, queryArgs);
                    },
                    error: this.queryOnError
                });
            }

            this.modal = new ModalDialog({
                title: i18n('please-wait-for-query-to-complete'),
                body: JST["views/templates/progressbar.ejs"]({ valuemin: 0, valuemax: 100, valuenow: 100 })
            });
            this.$queryModal.append(this.modal.render().el);
            $('.modal-cnt .modal').modal({ backdrop: 'static', keyboard: false });
            $('.modal-cnt button').addClass('hidden');
            this.modal.show();
            return false;
        },

        /**
         * @method
         * @name pumpStream
         * @description Receive and decode json stream and initialize dataTable
         * @param{Readable Stream}
           @return{function} recursivly itself until stream end
         */
        pumpStream: function (reader, queryArgs) {
            var that = this;
            this.bufferInitMinLenght = 1000;
            return reader.read().then(function (result) {
                // if stream end and table is initialized
                if (result.done && that.tableInitialized) {
                    // if more data to be rendered
                    if (that.buffer.length !== 0) {
                        that.tableView.addRowsDataTable(that.buffer);
                    }
                    that.buffer = [];
                    if (that.tableView) {
                        that.$(".query-hidden").hide();
                    }
                    that.hideProgressbar();
                    return reader.cancel();
                }

                var chunk = result.value;
                var decoded = new TextDecoder().decode(chunk);
                decoded = decoded.split(/\r?\n/);

                // If temp exist, it was found a corrupted json in previous cycle
                // It must be concatenated with next decoded data and then parsed again
                if (that.temp) {
                    decoded[0] = that.temp.concat(decoded[0]);
                    that.temp = "";
                }
                // each data string must be parsed and pushed in the buffer
                decoded.forEach(function (data) {
                    // try to parse data string if pass
                    // object is pushed in buffer or in options object if it is dataType or dataPrivilege obj
                    try {
                        var parsed = JSON.parse(data);
                        parsed.dataTypes ? that.optStream.dataTypes = parsed.dataTypes
                            : parsed.dataTypePrivileges ? that.optStream.dataTypePrivileges = parsed.dataTypePrivileges
                                : parsed.error ? that.optStream.error = parsed.error
                                    : !_.isEmpty(parsed) ? that.buffer.push(parsed) : null;
                    } catch (e) {
                        that.temp = data;
                    } finally {
                        parsed = null;
                    }
                });

                if (that.optStream.error) {
                    that.queryOnError(that.optStream.error);
                    return reader.cancel();
                }

                if (!that.tableInitialized && ((that.optStream.dataTypes && that.optStream.dataTypePrivileges && that.buffer.length >= that.bufferInitMinLenght) || (result.done && that.buffer.length >= 0))) {
                    var jsonParsed = { data: [] };
                    jsonParsed.dataTypes = that.optStream.dataTypes;
                    jsonParsed.dataTypePrivileges = that.optStream.dataTypePrivileges;
                    jsonParsed.data = that.buffer;
                    that.tableInitialized = true;
                    that.buffer = [];
                    that.initializeDataTable(jsonParsed, queryArgs, true);
                    that.modal.hide();
                } else if (that.tableInitialized && that.buffer.length >= that.bufferInitMinLenght) {
                    that.tableView.addRowsDataTable(that.buffer);
                    that.buffer = [];
                }

                return that.pumpStream(reader, queryArgs);
            });
        },

        /**
         * @method
         * @name initializeDataTable
         */
        initializeDataTable: function (result, queryArgs, isStream) {
            if (this.tableView) {
                this.tableView.destroy();
            }
            if (!isStream) {
                this.hideProgressbar();
            }
            if (!result) this.queryOnError(null, null, "Missing result object");

            if (_.isEmpty(result.data)) {
                this.tableView = null;
                this.$queryNoResultCnt.show();
                return;
            }
            this.tableView = new XtensTable.Views.DataTable({ result: result, leafSearch: this.leafSearch, multiProject: this.multiProject, queryArgs: queryArgs });
            this.$tableCnt.append(this.tableView.render().el);
            $('.popover').popover('hide');
            this.tableView.displayDataTable();
            $(document).scrollTop($("#result-table-cnt").offset().top);
        },

        /**
         * @method
         * @name queryOnError
         * @description
         */
        queryOnError: function (jqXHR, textStatus, err) {
            this.$(".query-hidden").hide();
            this.modal && this.modal.hide();
            if (this.tableView) {
                this.tableView.destroy();
            }
            this.$queryErrorCnt.show();
        },

        /**
         * @method
         * @name hideProgressbar
         * @description
         */
        hideProgressbar: function () {
            this.modal && this.modal.hide();
        }

    });

    Query.Views.Selector = Backbone.View.extend({
        events: {
            'change select.query-selector': 'loadQuery',
            'click .save-query': 'saveQuery',
            'click .delete-query': 'deleteQuery'
        },

        /**
         * @method
         * @name initialize
         * @extends Backbone.View.initialize
         * @param{Object} - options, which contains the following properties:
         *                  - dataTypes - a list/array of available DataTypes
         *                  - queryObj - a (possibly nested) query object, as the one sent to server side requests
         */
        initialize: function (options) {
            this.operator = options.operator;
            this.queryBuilder = options.queryBuilder;
            this.template = JST["views/templates/query-selector.ejs"];
            this.$querySelectorCnt = $(".query-selector-cnt");
            this.setElement(this.$querySelectorCnt);
            this.$queryModal = $(".modal-cnt");

            this.myQueries = JSON.parse(this.operator.get('queries'));
            if (xtens.session.get('activeProject') !== 'all') {
                var idProject = _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id;
                this.myQueries = _.filter(JSON.parse(this.operator.get('queries')), function (q) { return q.project == idProject; });
            }
            this.render();
        },

        render: function () {
            this.$querySelectorCnt.append(this.template({ __: i18n, queries: this.myQueries }));
            $('select.query-selector').selectpicker();
            if (this.myQueries.length == 0) {
                $('select.query-selector').prop('disabled', true);
            }

            $('.delete-query').prop('disabled', true);
            $('[data-toggle="tooltip"]').tooltip();
            $('select.query-selector').on('change', function (ev) {
                if (ev.currentTarget.value != "") {
                    $('.delete-query').prop('disabled', false);
                }
            });
            return this;
        },

        /**
         * @method
         * @name loadQuery
         * @description load a stored query into queryBuilder
         * @return{boolean} false
         */
        loadQuery: function (ev) {
            ev.preventDefault();
            var queryObj = JSON.parse($('select.query-selector').val());
            var queryParameters = JSON.stringify({ queryArgs: queryObj });
            var path = '/query/' + encodeURIComponent(queryParameters);
            xtens.router.navigate(path, { trigger: false });

            this.queryBuilder.queryView.trigger("reset");
            this.queryBuilder.queryView = new Query.Views.Composite({
                isFirst: true,
                biobanks: this.queryBuilder.queryView.biobanks,
                dataTypes: this.queryBuilder.queryView.dataTypes,
                dataTypesComplete: this.queryBuilder.queryView.dataTypes,
                dataTypePrivileges: this.queryBuilder.queryView.dataTypePrivileges,
                model: new Query.Model(queryObj)
            });
            $('#buttonbardiv').before(this.queryBuilder.queryView.render({}).el);
            $('input#search').prop('disabled', false);

            return false;
        },

        /**
         * @method
         * @name sendQuery
         * @description compose the object with query parameters and send it through AJAX request to the server for executing a (sanitised) query
         * @return{boolean} false
         */
        saveQuery: function () {
            var that = this;

            var serialized = this.queryBuilder.queryView.serialize([]);
            if (!serialized.res.dataType) {
                return;
            }
            var leafSearch = _.find(serialized.leafSearch, function (obj) {
                return obj.getMetadata === true;
            });
            this.leafSearch = {
                isLeafSearch: !!(leafSearch && leafSearch.getMetadata),
                info: serialized.leafSearch
            };
            this.multiProject = this.queryBuilder.queryView.model.get('multiProject');
            var queryArgs = _.extend(serialized.res, {
                multiProject: this.queryBuilder.queryView.multiProject,
                wantsSubject: true,
                leafSearch: this.leafSearch.isLeafSearch,
                wantsPersonalInfo: xtens.session.get('canAccessPersonalData')
            });
            var idProject = xtens.session.get('activeProject') !== 'all' ? _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id : 0;
            var currentSelectedQueryName = $('select.query-selector option:selected').text();
            var myQueryTmpl = {
                name: currentSelectedQueryName != i18n('select-a-query') ? currentSelectedQueryName : "",
                project: idProject,
                query: JSON.stringify(queryArgs)
            };

            this.modal = new ModalDialog({
                title: i18n('save-query'),
                template: JST["views/templates/query-save-modal.ejs"],
                data: { __: i18n }
            });
            this.$queryModal.append(this.modal.render().el);
            if (currentSelectedQueryName != "" && currentSelectedQueryName != i18n('select-a-query')) {
                $('input.query-name').val(currentSelectedQueryName);
                $('.query-confirm-save').prop('disabled', false);
                $('#inputHelpBlock').prop('hidden', false);
            }
            this.modal.show();

            $('input.query-name').on('keyup', function (ev) {
                ev.preventDefault();
                if (ev.currentTarget.value != "") {
                    myQueryTmpl.name = ev.currentTarget.value;
                    if (_.find(that.myQueries, function (o) { return o.name.toLowerCase() === ev.currentTarget.value.toLowerCase(); })) {
                        // $('.query-confirm-save').prop('disabled',true);
                        $('#inputHelpBlock').prop('hidden', false);
                    } else {
                        $('.query-confirm-save').prop('disabled', false);
                        $('#inputHelpBlock').prop('hidden', true);
                    }
                } else {
                    $('.query-confirm-save').prop('disabled', true);
                }
            });

            $('.query-confirm-save').on('click', function (ev) {
                that.myQueries = _.filter(JSON.parse(that.operator.get('queries')), function (o) {
                    return o.name.toLowerCase() !== $('input.query-name').val().toLowerCase();
                });
                that.myQueries.push(myQueryTmpl);

                that.operator.set("queries", JSON.stringify(that.myQueries));

                that.modal.hide();

                that.$queryModal.one('hidden.bs.modal', function (e) {
                    $.ajax({
                        url: '/operator/patchQueries',
                        type: 'PATCH',
                        data: JSON.stringify(that.operator),
                        headers: {
                            'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                        },
                        contentType: 'application/json',

                        success: function (operator) {
                            if (that.modal) {
                                that.modal.hide();
                            }
                            that.modal = new ModalDialog({
                                title: i18n('ok'),
                                body: i18n('query-correctly-stored-on-server')
                            });
                            that.$queryModal.append(that.modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            that.modal.show();

                            setTimeout(function () { that.modal.hide(); }, 1200);
                            that.$queryModal.one('hidden.bs.modal', function (e) {
                                that.modal.remove();
                                that.$querySelectorCnt.empty();
                                that.myQueries = JSON.parse(that.operator.get('queries'));
                                if (xtens.session.get('activeProject') !== 'all') {
                                    var idProject = _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id;
                                    that.myQueries = _.filter(JSON.parse(that.operator.get('queries')), function (q) { return q.project == idProject; });
                                }
                                that.render(JSON.stringify(queryArgs));
                            });
                        },
                        error: function (model, res) {
                            xtens.error(res);
                        }
                    });
                });
            });
        },

        deleteQuery: function () {
            var that = this;

            this.modal = new ModalDialog({
                template: JST["views/templates/confirm-dialog-bootstrap.ejs"],
                title: i18n('confirm-deletion'),
                body: i18n('query-will-be-permanently-deleted-are-you-sure'),
                type: i18n("delete")
            });
            this.$queryModal.append(this.modal.render().el);
            this.modal.show();

            $('#confirm').on('click', function (ev) {
                var queries = _.filter(JSON.parse(that.operator.get('queries')), function (o) {
                    return o.name.toLowerCase() !== $('select.query-selector option:selected').text().toLowerCase();
                });

                that.operator.set("queries", JSON.stringify(queries));
                that.modal.hide();

                that.$queryModal.one('hidden.bs.modal', function (e) {
                    $.ajax({
                        url: '/operator/patchQueries',
                        type: 'PATCH',
                        data: JSON.stringify(that.operator),
                        headers: {
                            'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                        },
                        contentType: 'application/json',

                        success: function (operator) {
                            if (that.modal) {
                                that.modal.hide();
                            }
                            that.modal = new ModalDialog({
                                title: i18n('ok'),
                                body: i18n('query-deleted')
                            });
                            that.$queryModal.append(that.modal.render().el);
                            $('.modal-header').addClass('alert-success');
                            that.modal.show();

                            setTimeout(function () { that.modal.hide(); }, 1200);
                            that.$queryModal.one('hidden.bs.modal', function (e) {
                                that.modal.remove();
                                that.$querySelectorCnt.empty();
                                that.myQueries = JSON.parse(that.operator.get('queries'));
                                if (xtens.session.get('activeProject') !== 'all') {
                                    var idProject = _.find(xtens.session.get('projects'), { 'name': xtens.session.get('activeProject') }).id;
                                    that.myQueries = _.filter(JSON.parse(that.operator.get('queries')), function (q) { return q.project == idProject; });
                                }
                                that.render();
                            });
                        },
                        error: function (model, res) {
                            xtens.error(res);
                        }
                    });
                });
            });
        }

    });
}(xtens, xtens.module("query")));
