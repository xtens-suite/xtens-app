/**
 * @module
 * @author Massimiliano Izzo
 *
 */
function renderDatatablesBoolean (data) {
    if (data) {
        return 'true';
    }
    return 'false';
}

function renderDatatablesDate (data, type) {
    function pad (s) { return (s < 10) ? '0' + s : s; }

    if (!_.isEmpty(data)) {
        var d = new Date(data);
        if (type === 'display' || type === 'filter' || type === 'export') {
            return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
        } else return new Date(data);
    }
    return "";
}

(function (xtens, XtensTable) {
    var i18n = xtens.module("i18n").en;
    var useFormattedNames = xtens.module("xtensconstants").useFormattedMetadataFieldNames;
    var Classes = xtens.module("xtensconstants").DataTypeClasses;
    var Privileges = xtens.module("xtensconstants").DataTypePrivilegeLevels;
    // var replaceUnderscoreAndCapitalize = xtens.module("utils").replaceUnderscoreAndCapitalize;
    var DataType = xtens.module("datatype");
    var Data = xtens.module("data");
    var SuperType = xtens.module("supertype");
    var Sample = xtens.module("sample");
    var DataFile = xtens.module("datafile");
    var Operator = xtens.module("operator");
    var VIEW_OVERVIEW = Privileges.VIEW_OVERVIEW;
    // var VIEW_DETAILS = Privileges.VIEW_DETAILS;
    // var EDIT = Privileges.EDIT;
    // var DOWNLOAD = Privileges.DOWNLOAD;
    var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;

    /**
     * @class
     * @name Views.Datatable
     */
    XtensTable.Views.DataTable = Backbone.View.extend({

        events: {
            "click .xtenstable-details": "showDetailsView",
            "click .xtenstable-edit": "showEditView",
            "mouseover .xtenstable-files": "showFileList",
            "click .xtenstable-derivedsubjects": "showDerivedSubjectsList",
            "click .xtenstable-derivedsamples": "showDerivedSampleList",
            "click .xtenstable-deriveddata": "showDerivedDataList",
            "click .xtenstable-subjectgraph": "showSubjectGraph",
            "mouseover td.project-owner": "showTooltipOwner",
            "click td.project-owner": "showPopoverOwner"

        },

        tagName: 'table',
        className: 'query-table',

        initialize: function (options) {
            // var that = this;
            if (!options || !options.result.dataTypes) {
                throw new Error("Missing required options: dataTypes");
            }
            // this.multiProject = _.isArray(options.result.dataTypes) ? true : false;
            this.multiProject = options.multiProject;
            this.dataTypes = _.isArray(options.result.dataTypes) ? new DataType.List(options.result.dataTypes) : new DataType.Model(options.result.dataTypes);
            this.dataTypePrivileges = options.result.dataTypePrivileges;
            // console.log(options.result.data);
            this.isLeafSearch = options.leafSearch.isLeafSearch;
            this.leafInfo = options.leafSearch.info;
            this.queryArgs = options.queryArgs;

            var results = this.getCurrentTypeAndPrivileges(options.queryArgs.dataType);
            this.rootDataType = results.dt;

            this.data = options.result.data;
            if (this.isLeafSearch) {
                this.plainData = this.buildPlainData(this.data);
            }
            this.$modal = $(".modal-cnt");
            this.prepareDataForRenderingJSON(results.dtps, results.dts, this.queryArgs);
            // this.render();
        },

        buildPlainData: function (data) {
            var plainData = [];
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].parents.length; j++) {
                    var obj = _.omit(data[i], 'parents');
                    if (j === 0) {
                        obj.showRow = true;
                    } else {
                        obj.showRow = false;
                    }
                    plainData.push(_.merge(data[i].parents[j], obj));
                }
            }
            return plainData;
        },

        getCurrentTypeAndPrivileges: function (dataType) {
            var currentDT = this.isLeafSearch || this.multiProject ? _.find(this.dataTypes.models, function (dt) {
                return dt.id === dataType;
            }) : this.dataTypes;
            var currentMDT = this.isLeafSearch || this.multiProject ? _.filter(this.dataTypes.models, function (dt) {
                return dt.get('superType').id === currentDT.get('superType').id;
            }) : this.dataTypes;
            var idDts = _.map(currentMDT, 'id');
            // var currentMDTP = [];
            var currentMDTP = this.isLeafSearch || this.multiProject ? this.dataTypePrivileges.filter(function (dtp) {
                return idDts.indexOf(dtp.dataType) !== -1;
            }) : this.dataTypePrivileges;
            return { dt: currentDT, dts: currentMDT, dtps: currentMDTP };
        },

        /**
         * @method
         * @name render
         */
        render: function () {
            return this;
        },

        /**
         * @method
         * @name destroy
         */
        destroy: function () {
            if (this.table) {
                this.table.destroy(true);
                this.table = null;
                this.$el.empty();
            }
            // Remove view from DOM
            this.remove();
        },

        /**
         * @method
         * @name addRowsDataTable
         */
        addRowsDataTable: function (data) {
            if (data) {
                this.data = this.data.concat(data);
                if (this.isLeafSearch) {
                    var plainData = this.buildPlainData(data);
                    this.plainData = this.plainData.concat(plainData);
                }
                this.addLinks(this.optLinks);
                // TODO: disabilitare le actions per i multi projects
                this.table.rows.add(plainData);
                var currentPage = this.table.page();
                this.table.page(currentPage).draw(false);
            }
        },

        showTooltipOwner: function (ev) {
            ev.stopPropagation();
            $(ev.currentTarget).tooltip({
                position: {
                    my: 'right center',
                    at: 'left-10 center'
                },
                container: 'body',
                title: i18n("click-to-show-owner-contacts")
            }).tooltip('show');
        },

        showPopoverOwner: function (ev) {
            ev.stopPropagation();
            var that = this;
            var data = this.table.row($(ev.currentTarget).parents('tr')).data();
            var projects = xtens.session.get("projects");
            var project = _.find(projects, function (pr) {
                var dt = that.multiProject ? _.find(that.dataTypes.models, { 'id': data.type }) : that.dataTypes;
                return pr.id === dt.get('project');
            });

            var owner = new Operator.Model({ id: data.owner });
            var ownerDeferred = owner.fetch({
                data: $.param({ populate: ['addressInformation'] })
            });

            $.when(ownerDeferred).then(function (ownerRes) {
                if (that.modal) {
                    that.modal.hide();
                }
                var modal = new ModalDialog({
                    template: JST["views/templates/address-modal.ejs"],
                    data: { __: i18n, project: project, data: data, owner: ownerRes, address: ownerRes.addressInformation }
                });

                that.$modal.append(modal.render().el);
                modal.show();

                $('.modal-cnt').one('hidden.bs.modal', function (e) {
                    e.preventDefault();
                    modal.remove();
                    $('.modal-backdrop').remove();
                });
            });
        },

        /**
         * @method
         * @name displayDataTable
         * @description show the datatable given the option object
         */
        displayDataTable: function () {
            var that = this;

            this.tableOpts = {
                data: !this.isLeafSearch ? this.data : this.plainData,
                columns: this.columns,
                info: true,
                scrollX: true,
                scrollY: "500px",
                scrollCollapse: true,
                paging: true,
                autoWidth: false,
                deferRender: true,
                columnDefs: [
                    { "className": "dt-center", "targets": "_all" }
                ],
                pagingType: "full_numbers" // DOES NOT WORK!!
            };

            if (this.checkNGSProject()) {
                this.tableOpts.columnDefs.push({
                    orderable: false,
                    className: 'select-checkbox',
                    targets: 0
                });
                this.tableOpts.select = {
                    style: 'os',
                    selector: 'td:not(:last-child)'
                };
                this.tableOpts.order = [
                    [1, 'asc']
                ];
            }

            if (this.tableOpts && !_.isEmpty(this.tableOpts.data)) {
                $.fn.dataTable.ext.search.pop();

                this.table = this.$el.DataTable(this.tableOpts);
                if (this.tableOpts.columns.length > 9) {
                    new $.fn.dataTable.FixedColumns(this.table, {
                        leftColumns: !this.isLeafSearch ? this.numLeft : 0,
                        rightColumns: this.multiProject || this.isLeafSearch ? 0 : 1 // for multiProject search no available actions
                    });
                } else {
                    this.tableOpts.fixedColumns = false;
                }
                var filterColumn = ':visible';
                if (this.isLeafSearch) {
                    this.childrenRowsHandler();
                    $.fn.dataTable.ext.search.push(
                        function (settings, searchData, index, rowData) {
                            return rowData.showRow;
                        }
                    );

                    this.table.on('column-visibility.dt', function (e, settings, column, state) {
                        if (!that.childColumns.find(function (c) { return that.table.column(column).header().className.indexOf(c.className.replace(/ /g, "_").toLowerCase()) >= 0; })) {
                            $(that.table.column(column).header()).toggleClass('notexport');
                        }
                    });

                    filterColumn = ':not(.notexport)'; // not export actions column
                }

                var buttons = [
                    {
                        extend: 'colvis',
                        postfixButtons: ['colvisRestore']
                    },
                    {
                        extend: 'copyHtml5',
                        exportOptions: {
                            orthogonal: 'export', // to export source data and not rendered data
                            columns: filterColumn + ':not(.actions):not(.details-control)' // not export actions and details column
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        title: null,
                        filename: 'XTENS_' + moment().format("YYYY_MM_DD_hh_mm_ss"),
                        exportOptions: {
                            orthogonal: 'export', // to export source data and not rendered data
                            columns: filterColumn + ':not(.actions):not(.details-control)' // not export actions and details column
                        }
                    }
                ];

                if (this.checkVCF()) {
                    buttons.push({
                        extend: 'csvHtml5',
                        text: 'Export as VCF',
                        exportOptions: {
                            orthogonal: 'export', // to export source data and not rendered data
                            columns: '.vcf', // export only vcf columns
                            format: {
                                header: function (data, column) {
                                    return data === "CHR" ? "#CHROM" : data;
                                }
                            }
                        },
                        customize: function (csv) {
                            return "##fileformat=VCFv4.1\n" + csv;
                        },
                        fieldSeparator: '\t',
                        filename: 'VCF_' + moment().format("YYYY_MM_DD_hh_mm_ss"),
                        extension: ".vcf"
                        // title:'##fileformat=VCFv4.1'
                    });
                } else if (this.checkNGSProject()) {
                    // this.table.on("click", "th.select-checkbox", function () {
                    //     if ($("th.select-checkbox").hasClass("selected")) {
                    //         that.table.rows().deselect();
                    //         $("th.select-checkbox").removeClass("selected");
                    //     } else {
                    //         that.table.rows().select();
                    //         $("th.select-checkbox").addClass("selected");
                    //     }
                    // }).on("select deselect", function () {
                    //     // ("Some selection or deselection going on");
                    //     if (that.table.rows({
                    //         selected: true
                    //     }).count() !== that.table.rows().count()) {
                    //         $("th.select-checkbox").removeClass("selected");
                    //     } else {
                    //         $("th.select-checkbox").addClass("selected");
                    //     }
                    // });
                    // $('th.select-checkbox').append('<input type="checkbox" class="selectAll" name="selectAll" value="all">');
                    buttons.push({
                        text: "Select/Deselect all",
                        className: "selectAllButton",
                        action: function (e, dt, button, config) {
                            if ($("td.select-checkbox").hasClass("selected")) {
                                that.table.rows().deselect();
                                $("td.select-checkbox").removeClass("selected");
                            } else {
                                that.table.rows().select();
                                $("td.select-checkbox").addClass("selected");
                            }
                        }
                    },
                    {
                        extend: 'selected',
                        text: 'SnakeMake',
                        action: function (e, dt, node, config) {
                            var rows = dt.rows({ selected: true });

                            // alert('There are ' + rows.count() + '(s) selected in the table');
                            that.table.buttons('.ngsSnakeMake').trigger();
                            // that.table.button('8').trigger();
                            // that.table.button('9').trigger();
                            // that.table.button('10').trigger();
                        }
                    },
                    {
                        extend: 'csvHtml5',
                        className: "ngsSnakeMake",
                        text: 'NGS Units',
                        exportOptions: {
                            orthogonal: 'export', // to export source data and not rendered data
                            columns: [] // export only vcf columns

                        },
                        customize: function (csv) {
                            return that.buildCsvInfoNGSUnits();
                        },
                        fieldSeparator: '\t',
                        filename: 'units',
                        extension: ".tsv"
                        // title:'##fileformat=VCFv4.1'
                    },
                    {
                        extend: 'csvHtml5',
                        className: "ngsSnakeMake",
                        text: 'NGS Samples',
                        exportOptions: {
                            orthogonal: 'export', // to export source data and not rendered data
                            columns: [] // export only vcf columns

                        },
                        customize: function (csv) {
                            return that.buildCsvInfoNGSSamples();
                        },
                        fieldSeparator: '\t',
                        filename: 'samples',
                        extension: ".tsv"
                        // title:'##fileformat=VCFv4.1'
                    },
                    {
                        extend: 'csvHtml5',
                        className: "ngsSnakeMake",
                        text: 'NGS sets',
                        exportOptions: {
                            orthogonal: 'export', // to export source data and not rendered data
                            columns: [] // export only vcf columns

                        },
                        customize: function (csv) {
                            return that.buildCsvInfoNGSSets();
                        },
                        fieldSeparator: '\t',
                        filename: 'sets',
                        extension: ".tsv"
                        // title:'##fileformat=VCFv4.1'
                    },
                    {
                        extend: 'csvHtml5',
                        className: "ngsSnakeMake",
                        text: 'NGS samples ped',
                        exportOptions: {
                            orthogonal: 'export', // to export source data and not rendered data
                            columns: [] // export only vcf columns

                        },
                        customize: function (csv) {
                            return that.buildCsvInfoNGSSamplesPed();
                        },
                        fieldSeparator: '\t',
                        filename: 'samples',
                        extension: ".ped"
                        // title:'##fileformat=VCFv4.1'
                    });
                    this.getCsvInfoNGSCore();
                }
                // buttons = buttons.concat(excelPlainData);
                this.colvisButtons.push(buttons);
                this.colvisButtons = _.flatten(this.colvisButtons);
                new $.fn.dataTable.Buttons(this.table, {
                    buttons: this.colvisButtons
                });
                this.table.buttons().container().appendTo($('.col-sm-6:eq(0)', this.table.table().container()));

                $('.ngsSnakeMake').addClass('hidden');
            } else {
                // the returned dataset is empty
                this.remove();
            }
        },

        childrenRowsHandler: function (row) {
            var that = this;
            $(this.$el).on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = that.table.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    var cl = 'child-table-' + row.index();
                    var leafKey = _.find(_.keys(that.data[0]), function (k) { return k.indexOf("_id") > 0; });
                    var data = _.find(that.data, function (d) {
                        return d[leafKey] === row.data()[leafKey];
                    });
                    var maxWidth = $('.query').width() + 'px';
                    var html = '<div class="row" style="max-width:' + maxWidth + ';"><div class="col-sm-12"><table class="' + cl + ' query-table"></table></div></div>';
                    var tableOptsChild = {
                        data: data.parents,
                        columns: that.childColumns,
                        info: false,
                        searching: false,
                        scrollX: true,
                        scrollY: "500px",
                        scrollCollapse: true,
                        paging: false,
                        deferRender: true,
                        columnDefs: [
                            { "className": "dt-center", "targets": "_all" }
                        ]
                    };
                    row.child(html).show();
                    tr.addClass('shown');
                    var tableSelector = '.' + cl;
                    $(tableSelector).DataTable(tableOptsChild);

                    if (tableOptsChild.columns.length > 9) {
                        new $.fn.dataTable.FixedColumns($(tableSelector), {
                            leftColumns: that.childNumLeft,
                            rightColumns: 0
                        });
                    } else {
                        tableOptsChild.fixedColumns = false;
                    }
                }
            });
        },

        checkVCF: function () {
            var fieldsVCF = ["chr", "pos", "id", "qual", "ref", "alt", "filter"];
            var fieldsVCF2 = ["chrom", "pos", "id", "qual", "ref", "alt", "filter"];
            var found = 0; var found2 = 0;
            var fieldsNames = [];
            var schemaBody;
            if (this.dataTypes.models) {
                schemaBody = _.flatten(_.map(this.dataTypes.models, 'attributes.superType.schema.body'));
            } else {
                schemaBody = this.dataTypes.get('superType').schema.body;
            }
            fieldsNames = _.map(_.flatten(_.map(schemaBody, 'content')), 'formattedName');
            fieldsNames.forEach(function (name) {
                if (fieldsVCF.find(function (n) { return n === name; })) {
                    found = found + 1;
                }
                if (fieldsVCF2.find(function (n) { return n === name; })) {
                    found2 = found2 + 1;
                }
            });

            if (found == 7 || found2 == 7) {
                return true;
            } else {
                return false;
            }
        },

        checkNGSProject: function () {
            // abilita selezione
            this.rowSelection = true;
            return xtens.session.get('activeProject') === 'NGSCore';
        },

        getCsvInfoNGSCore: function () {
            var that = this;
            return $.ajax({
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                url: '/query/dataSearch',
                data: 'queryArgs={"dataType":210,"model":"Subject","content":[{"personalDetails":true,"surnameComparator":"=","givenNameComparator":"=","birthDateComparator":"="},{"codeComparator":"LIKE","specializedQuery":"Subject"},{"sexComparator":"IN","specializedQuery":"Subject"},{"getMetadata":true,"label":"tissue","dataType":211,"content":[{"biobankComparator":"=","specializedQuery":"Sample"},{"biobankCodeComparator":"LIKE","specializedQuery":"Sample"},{"getMetadata":true,"label":"ngs_analysis","dataType":212,"model":"Data","title":"NGS Analysis","superType":114}],"model":"Sample","title":"Tissue","superType":113}],"wantsSubject":true,"leafSearch":true,"wantsPersonalInfo":true}&isStream=false',
                success: function (results) {
                    that.sourceNGS = that.buildPlainData(results.data);
                    // that.sourceNGS = _.filter(that.buildPlainData(results.data), function (sourcerow) {
                    //     return sourcerow && sourcerow.tissue_biobank_code && sourcerow.ngs_analysis && sourcerow.ngs_analysis.flow_cell && sourcerow.ngs_analysis.flow_cell.values && sourcerow.ngs_analysis.flow_cell.values[0] &&
                    //     sourcerow.ngs_analysis.flow_cell && sourcerow.ngs_analysis.flow_cell.values && sourcerow.ngs_analysis.flow_cell.values[0] &&
                    //     sourcerow.ngs_analysis.lane && sourcerow.ngs_analysis.lane.values && sourcerow.ngs_analysis.lane.values[0] &&
                    //     sourcerow.ngs_analysis.fastq_file_path_r1 && sourcerow.ngs_analysis.fastq_file_path_r1.values && sourcerow.ngs_analysis.fastq_file_path_r1.values[0] &&
                    //     sourcerow.ngs_analysis.fastq_file_path_r2 && sourcerow.ngs_analysis.fastq_file_path_r2.values && sourcerow.ngs_analysis.fastq_file_path_r2.values[0];
                    // });
                }
            });
        },

        buildCsvInfoNGSUnits: function () {
            var that = this;
            var csvContent = "sample\tunit\tfq1\tfq2\r\n";
            _.forEach(this.table.rows({ selected: true }).data(), function (d) {
                var sourcerow = _.find(that.sourceNGS, function (s) {
                    return s.code === d.code;
                });
                if (sourcerow && sourcerow.tissue_biobank_code && sourcerow.ngs_analysis && sourcerow.ngs_analysis.flow_cell && sourcerow.ngs_analysis.flow_cell.values && sourcerow.ngs_analysis.flow_cell.values[0] &&
                            sourcerow.ngs_analysis.flow_cell && sourcerow.ngs_analysis.flow_cell.values && sourcerow.ngs_analysis.flow_cell.values[0] &&
                            sourcerow.ngs_analysis.lane && sourcerow.ngs_analysis.lane.values && sourcerow.ngs_analysis.lane.values[0] &&
                            sourcerow.ngs_analysis.fastq_file_path_r1 && sourcerow.ngs_analysis.fastq_file_path_r1.values && sourcerow.ngs_analysis.fastq_file_path_r1.values[0] &&
                            sourcerow.ngs_analysis.fastq_file_path_r2 && sourcerow.ngs_analysis.fastq_file_path_r2.values && sourcerow.ngs_analysis.fastq_file_path_r2.values[0]) {
                    for (let index = 0; index < sourcerow.ngs_analysis.flow_cell.values.length; index++) {
                        csvContent = csvContent + sourcerow.tissue_biobank_code + '\t' +
                            sourcerow.ngs_analysis.flow_cell.values[index] + '.' + sourcerow.ngs_analysis.lane.values[index] + '.' + sourcerow.tissue_biobank_code + '\t' +
                             sourcerow.ngs_analysis.fastq_file_path_r1.values[index] + '\t' +
                             sourcerow.ngs_analysis.fastq_file_path_r2.values[index] + '\r\n';
                    }
                    // csvContent = csvContent + sourcerow.tissue_biobank_code + '\t' +
                    //         sourcerow.ngs_analysis.flow_cell.values[0] + '.' + sourcerow.ngs_analysis.lane.values[0] + '.' + sourcerow.tissue_biobank_code + '\t' +
                    //          sourcerow.ngs_analysis.fastq_file_path_r1.values[0] + '\t' +
                    //          sourcerow.ngs_analysis.fastq_file_path_r2.values[0] + '\r\n';
                }
            });
            return csvContent;
        },

        buildCsvInfoNGSSamples: function () {
            var that = this;
            var csvContent = "sample\tunits\tkit\r\n";
            _.forEach(this.table.rows({ selected: true }).data(), function (d) {
                var sourcerow = _.find(that.sourceNGS, function (s) {
                    return s.code === d.code;
                });
                if (sourcerow && sourcerow.tissue_biobank_code && sourcerow.ngs_analysis && sourcerow.ngs_analysis.flow_cell && sourcerow.ngs_analysis.flow_cell.values && sourcerow.ngs_analysis.flow_cell.values[0] &&
                            sourcerow.ngs_analysis.flow_cell && sourcerow.ngs_analysis.flow_cell.values && sourcerow.ngs_analysis.flow_cell.values[0] &&
                            sourcerow.ngs_analysis.lane && sourcerow.ngs_analysis.lane.values && sourcerow.ngs_analysis.lane.values[0] &&
                            sourcerow.ngs_analysis.target_details && sourcerow.ngs_analysis.target_details.value) {
                    var units = '';
                    for (let index = 0; index < sourcerow.ngs_analysis.flow_cell.values.length; index++) {
                        units = units + sourcerow.ngs_analysis.flow_cell.values[index] + '.' + sourcerow.ngs_analysis.lane.values[index] + '.' + sourcerow.tissue_biobank_code + ',';
                    }
                    csvContent = csvContent +
                            sourcerow.tissue_biobank_code + '\t' +
                            units + '\t' +
                            sourcerow.ngs_analysis.target_details.value + '\r\n';
                }
            });
            return csvContent;
        },

        buildCsvInfoNGSSets: function () {
            var that = this;
            var csvContent = " \t \r\n";
            _.forEach(this.table.rows({ selected: true }).data(), function (d) {
                var sourcerow = _.find(that.sourceNGS, function (s) {
                    return s.code === d.code;
                });
                if (sourcerow) {
                    var sourcefamily = _.filter(that.sourceNGS, function (s) {
                        return s.metadata.family_id.value === sourcerow.metadata.family_id.value;
                    });
                    if (csvContent.indexOf(sourcerow.metadata.family_id.value) < 0) {
                        csvContent = csvContent + sourcerow.metadata.family_id.value + '\t' +
                        sourcefamily.map(function (s) { return s.tissue_biobank_code; }).join(',') + '\r\n';
                    }
                }
            });
            return csvContent;
        },

        buildCsvInfoNGSSamplesPed: function () {
            var that = this;
            var csvContent = '';
            _.forEach(this.table.rows({ selected: true }).data(), function (d) {
                var sourcerow = _.find(that.sourceNGS, function (s) {
                    return s.code === d.code;
                });
                if (sourcerow) {
                    var sourcefamily = _.filter(that.sourceNGS, function (s) {
                        return s.metadata.family_id.value === sourcerow.metadata.family_id.value;
                    });

                    if (csvContent.indexOf(sourcerow.metadata.family_id.value) < 0) {
                        // csvContent = csvContent + sourcerow.metadata.family_id.value + '\t' +
                        // sourcefamily.map(function (s) { return s.tissue_biobank_code; }).join(',') + '\r\n';
                        var mother = _.find(sourcefamily, function (s) { return s.metadata.status.value == 'MOTHER'; });
                        var father = _.find(sourcefamily, function (s) { return s.metadata.status.value == 'FATHER'; });
                        let familytxt = '';
                        _.forEach(sourcefamily, function (subj) {
                            var sex = subj.sex == 'M' ? '1' : subj.sex == 'F' ? '2' : '0';
                            var affected = subj.metadata.affected.value ? '2' : '1';
                            var motherTissueCode = subj.metadata.status.value == 'PROBAND' && mother && mother.tissue_biobank_code ? mother.tissue_biobank_code : '0';
                            var fatherTissueCode = subj.metadata.status.value == 'PROBAND' && father && father.tissue_biobank_code ? father.tissue_biobank_code : '0';
                            familytxt = familytxt + subj.metadata.family_id.value + '\t' +
                        subj.tissue_biobank_code + '\t' +
                        motherTissueCode + '\t' +
                        fatherTissueCode + '\t' +
                        sex + '\t' +
                        affected + '\r\n';
                        });
                        csvContent = csvContent + familytxt;
                    }
                }
            });
            return csvContent;
        },
        /**
         * @method
         * @name prepareDataForRenderingJSON
         * @description Format the data according to the dataType schema and prepare data for visualization through DataTables
         */
        prepareDataForRenderingJSON: function (dataTypePrivileges, dataTypes, queryArgs) {
            var that = this;
            this.colvisButtons = [];
            this.columns = [];
            this.childColumns = [];

            var model = this.multiProject || this.isLeafSearch ? dataTypes[0].get("model") : dataTypes.get("model");

            if (this.checkNGSProject) {
                this.columns.push(
                    {
                        "className": 'select-checkbox',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    }
                );
            }

            if (this.isLeafSearch) {
                this.columns.push(
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<i style="cursor:pointer; color:#337ab7;" class="fa fa-plus-circle"></i>'
                    }
                );
                this.childColumns.push(this.insertModelSpecificColumnsNoLeaf(model, xtens.session.get('canAccessPersonalData')));
                this.childColumns = _.flatten(this.childColumns);
            } else {
                this.columns.push(this.insertModelSpecificColumnsNoLeaf(model, xtens.session.get('canAccessPersonalData')));
                this.columns = _.flatten(this.columns);
            }
            if (this.multiProject) {
                this.columns.push({
                    "title": i18n("project-owner"),
                    "data": function (data) {
                        var projects = xtens.session.get("projects");
                        var project = _.filter(projects, function (pr) {
                            var dt = that.multiProject || that.isLeafSearch ? _.find(that.dataTypes.models, { 'id': data.type }) : that.dataTypes;
                            return pr.id === dt.get('project');
                        });
                        return project.length > 0 ? project[0].name : "No project";
                    },
                    "className": "project-owner"
                });
            }

            this.childNumLeft = this.childColumns.length;
            this.numLeft = this.columns.length;

            var fileUpload = !this.multiProject ? this.isLeafSearch ? dataTypes[0].get("superType").schema.header.fileUpload : dataTypes.get("superType").schema.header.fileUpload : false;
            var hasDataChildren = false; var hasSampleChildren = false; var showSubjectDashButton = false;
            var dataTypeChildren = !this.multiProject ? _.where(this.isLeafSearch ? dataTypes[0].get("children") : dataTypes.get("children"), { "model": Classes.DATA }) : [];
            var sampleTypeChildren = !this.multiProject ? _.where(this.isLeafSearch ? dataTypes[0].get("children") : dataTypes.get("children"), { "model": Classes.SAMPLE }) : [];
            var dataTypeModel = this.multiProject || this.isLeafSearch ? dataTypes[0].get("model") : dataTypes.get("model");
            if (dataTypeModel === "Subject" || this.data[0].code) {
                showSubjectDashButton = true;
            }
            if (dataTypeChildren.length > 0) {
                hasDataChildren = true;
            }
            if (sampleTypeChildren.length > 0) {
                hasSampleChildren = true;
            }
            this.optLinks = { dataTypes: dataTypes, dataTypePrivileges: dataTypePrivileges, hasDataSensitive: false, fileUpload: fileUpload, hasDataChildren: hasDataChildren, hasSampleChildren: hasSampleChildren, showSubjectDashButton: showSubjectDashButton, dataTypeModel: dataTypeModel };

            this.prepareDataForRenderingJSONLeaf(dataTypePrivileges, dataTypes, queryArgs, queryArgs.dataType, this.isLeafSearch, true);

            if (!this.multiProject) {
                this.addLinks(this.optLinks);
            }
        },
        // _.has(that.data[0], content.label);

        /**
         * @method
         * @name prepareDataForRenderingJSONLeaf
         * @description Format the data according to the dataType schema and prepare data for visualization through DataTables
         */
        prepareDataForRenderingJSONLeaf: function (dataTypePrivileges, dataTypes, queryArgs, idDataType, nested, isRoot) {
            var that = this;
            if (queryArgs.getMetadata || idDataType) {
                var fieldsToShow = [];

                var selectedDataType = this.multiProject || this.isLeafSearch ? dataTypes[0] : dataTypes;

                var selectedSuperType = new SuperType.Model(selectedDataType.get("superType"));
                var flattenedFields = selectedSuperType.getFlattenedFields(); // get the names of all the madatafields but those within loops;

                var dtpOverview = this.multiProject || this.isLeafSearch ? _.filter(dataTypePrivileges, function (dtp) { return dtp.privilegeLevel === VIEW_OVERVIEW; }) : !!(dataTypePrivileges && dataTypePrivileges.privilegeLevel === VIEW_OVERVIEW);
                if (!dtpOverview || !dtpOverview.length || (this.multiProject && dtpOverview.length !== dataTypePrivileges.length)) {
                    if (!isRoot) {
                        _.forEach(this.insertModelSpecificColumnsLeaf(selectedDataType.get('model'), xtens.session.get('canAccessPersonalData'), selectedDataType.get('name')), function (col) {
                            if (_.findIndex(that.columns, function (c) { return c.title === col.title; }) < 0) {
                                that.columns.push(col);
                            }
                        });
                        this.columns = _.flatten(this.columns);
                    }

                    flattenedFields.forEach(function (field) {
                        if (field.sensitive && idDataType) { that.optLinks.hasDataSensitive = true; }
                        if (!field.sensitive || xtens.session.get('canAccessSensitiveData')) {
                            fieldsToShow.push(field);
                        }
                    });
                }
                var className = "deafult-label";
                className = idDataType ? this.rootDataType.get('name').toLowerCase().replace(/[||\-*/,=<>~!^()\ ]/g, "_") : queryArgs.label;

                // set up colvis buttons for any leafs
                if (this.isLeafSearch) {
                    var colvisButton = {
                        extend: 'colvisGroup',
                        text: 'Show only '
                    };
                    colvisButton.text = +idDataType ? this.rootDataType.get('name') : queryArgs.title;
                    colvisButton.show = '.' + className; // not(.actions)
                    colvisButton.hide = ':not(.' + className + '):not(.header):not(.actions):not(.project-owner)';
                    this.colvisButtons.push(colvisButton);
                }

                _.each(fieldsToShow, function (field) {
                    var colTitle = field.name;
                    var fieldName = useFormattedNames ? field.formattedName : field.name;
                    var columnOpts = {
                        "title": colTitle,
                        "data": function (row, type, val, meta) {
                            if (idDataType) {
                                return row.metadata[fieldName] && row.metadata[fieldName].value ? row.metadata[fieldName].value : "";
                            } else {
                                return row[queryArgs.label][fieldName] && row[queryArgs.label][fieldName].value ? row[queryArgs.label][fieldName].value : "";
                            }
                        },
                        "visible": field.visible,
                        "defaultContent": "",
                        "className": className
                    };

                    if (colTitle.toLowerCase() === "chr" || colTitle.toLowerCase() === "pos" || colTitle.toLowerCase() === "id" ||
                        colTitle.toLowerCase() === "qual" || colTitle.toLowerCase() === "ref" || colTitle.toLowerCase() === "alt" || colTitle.toLowerCase() === "filter") {
                        columnOpts.className = columnOpts.className + " vcf";
                    }
                    // if field is loop retrieve multiple values
                    if (field._loop) {
                        columnOpts.data = idDataType ? "metadata." + fieldName + ".values" : queryArgs.label + "." + fieldName + ".values";
                        columnOpts.render = function (data, type, row) {
                            var priv = this.multiProject || this.isLeafSearch ? _.findWhere(dataTypePrivileges, { 'dataType': row.type }) : dataTypePrivileges;
                            if (priv && priv.privilegeLevel !== VIEW_OVERVIEW) {
                                return data && type === 'export' ? data.join() : data ? data.length > 2 ? '<span>List on Details button</span>' : data.join() : null;
                            } else {
                                return null;
                            }
                        };
                    } else {
                        switch (field.fieldType) {
                            case "Date": // if the column has dates render them in the desired format
                                columnOpts.render = function (data, type, row) {
                                    var priv = this.multiProject || this.isLeafSearch ? _.findWhere(dataTypePrivileges, { 'dataType': row.type }) : dataTypePrivileges;
                                    if (priv && priv.privilegeLevel !== VIEW_OVERVIEW) {
                                        return renderDatatablesDate(data, type);
                                    } else {
                                        return null;
                                    }
                                };
                                break;
                            case "Boolean": // if the column has booleans render them in the desired format
                                columnOpts.render = function (data, type, row) {
                                    var priv = this.multiProject || this.isLeafSearch ? _.findWhere(dataTypePrivileges, { 'dataType': row.type }) : dataTypePrivileges;
                                    if (priv && priv.privilegeLevel !== VIEW_OVERVIEW) {
                                        return renderDatatablesBoolean(data);
                                    } else {
                                        return null;
                                    }
                                };
                                break;
                            case "Link": // if the column has links render them in the desired format
                                columnOpts.render = function (data, type, row) {
                                    var priv = this.multiProject || this.isLeafSearch ? _.findWhere(dataTypePrivileges, { 'dataType': row.type }) : dataTypePrivileges;
                                    if (priv && priv.privilegeLevel !== VIEW_OVERVIEW) {
                                        data = '<a href="' + data + '" target="_blank">' + data + '</a>';
                                        return data;
                                    } else {
                                        return null;
                                    }
                                };
                                break;
                            default: // if the column has numbers, texts, floats render them in the default format
                                columnOpts.render = function (data, type, row) {
                                    var priv = this.multiProject || this.isLeafSearch ? _.findWhere(dataTypePrivileges, { 'dataType': row.type }) : dataTypePrivileges;
                                    if (priv && priv.privilegeLevel !== VIEW_OVERVIEW) {
                                        return data;
                                    } else {
                                        return null;
                                    }
                                };
                                break;
                        }
                    }

                    var tempOptCol = Object.assign({}, columnOpts);
                    if (nested) {
                        this.childColumns.push(columnOpts);
                        tempOptCol.visible = false;
                    }
                    this.columns.push(tempOptCol);

                    if (field.hasUnit) {
                        columnOpts = {
                            "title": colTitle + " Unit",
                            "data": idDataType ? "metadata." + fieldName + ".unit" : queryArgs.label + "." + fieldName + ".unit",
                            "visible": field.visible,
                            "defaultContent": "",
                            "className": className
                        };

                        // if field is loop retrieve multiple units
                        if (field._loop) {
                            columnOpts.data = idDataType ? "metadata." + fieldName + ".units" : queryArgs.label + "." + fieldName + ".units";
                        }

                        var tempOptColUn = Object.assign({}, columnOpts);
                        if (nested) {
                            this.childColumns.push(columnOpts);
                            tempOptColUn.visible = false;
                        }
                        this.columns.push(tempOptColUn);
                    }
                }, this);
            } else {
                this.setLeafIdColumns(queryArgs, nested);
            }
            // handle leafs
            if (this.isLeafSearch) {
                var contents = queryArgs.content ? queryArgs.content : [];
                _.forEach(contents, function (content) {
                    if (content.dataType) {
                        // get right dataTypes and privileges of nested content
                        var results = that.getCurrentTypeAndPrivileges(content.dataType);
                        var isLast = !_.find(content.content, function (c) { return c.dataType; });
                        that.prepareDataForRenderingJSONLeaf(results.dtps, results.dts, content, undefined, !_.has(that.data[0], content.label) && !isLast, false);
                    }
                });
            }
        },

        setLeafIdColumns: function (content, nested) {
            var columnOpts = {
                "title": content.title,
                "data": content.label + "_id",
                "visible": true,
                "defaultContent": "",
                "className": content.label
            };
            var tempOptCol = Object.assign({}, columnOpts);
            if (nested) {
                this.childColumns.push(columnOpts);
                tempOptCol.visible = false;
            }
            this.columns.push(tempOptCol);
        },

        /**
         * @method
         * @name prepareDataForRenderingHTML
         * @description Format the data according to the dataType schema and prepare data for visualization through DataTables
         */

        // prepareDataForRenderingHtml: function(data, dataType, headers) {
        //     if (!dataType) {
        //         return;
        //     }
        //     dataType = new DataType.Model(dataType);
        //     var fields = dataType.getFlattenedFields(true);
        //     var columns = this.insertModelSpecificColumns(dataType.get("model"), xtens.session.get('canAccessPersonalData'));
        //
        //     var i, j, row = "<thead><tr>", value, unit;
        //
        //     for (i=0; i<fields.length; i++) {
        //         if (fields[i].visible) {
        //             row += "<th>" + fields[i].name + "</th>";
        //
        //             if (fields[i].hasUnit) {
        //                 row += "<th>" + fields[i].name + " Unit</th>";
        //             }
        //         }
        //     }
        //
        //     row += "</tr></thead>";
        //     this.$el.append(row);
        //
        //     for (i=0; i<data.length; i++) {
        //         row = "<tr>";
        //         for (j=0; j<fields.length; j++) {
        //
        //             if (fields[j].visible) {
        //                 value = data[i].metadata[fields[j].name] && data[i].metadata[fields[j].name].value;
        //                 row += "<td>" + (value || "") + "</td>";
        //
        //                 if (fields[j].hasUnit) {
        //                     unit = data[i].metadata[fields[j].name] && data[i].metadata[fields[j].name].unit;
        //                     row += "<td>" + (unit || "") + "</td>";
        //                 }
        //             }
        //
        //         }
        //         row += "</tr>";
        //         this.$el.append(row);
        //     }
        //
        // },

        insertModelSpecificColumnsNoLeaf: function (model, canViewPersonalInfo) {
            var cols = [];
            if (canViewPersonalInfo) { // if you are allowed to see the Personal Details
                cols = cols.concat(this.insertPersonalDetailsColumnsNoLeaf());
            }
            switch (model) {
                case Classes.SUBJECT || Classes.DATA:
                    cols = cols.concat(this.insertSubjectColumnsNoLeaf());
                    break;
                case Classes.DATA:
                    cols = cols.concat(this.insertSubjectColumnsNoLeaf());
                    break;
                case Classes.SAMPLE:
                    cols = cols.concat(this.insertSampleColumnsNoLeaf());
                    break;
            }
            return cols;
        },

        insertPersonalDetailsColumnsNoLeaf: function () {
            return [
                {
                    "title": i18n("surname"),
                    "data": function (data) {
                        return data.surname ? data.surname : "";
                    },
                    "className": "header"
                },
                {
                    "title": i18n("given-name"),
                    "data": function (data) {
                        return data.given_name ? data.given_name : "";
                    },
                    "className": "header"
                },
                {
                    "title": i18n("birth-date"),
                    "data": function (data) {
                        return data.birth_date ? data.birth_date : "";
                    },
                    "render": renderDatatablesDate,
                    "className": "header"
                }
            ];
        },

        insertSubjectColumnsNoLeaf: function () {
            return [
                {
                    "title": i18n("code"),
                    "data": function (data) {
                        return data.code ? data.code : "";
                    },
                    "className": "header"
                },
                {
                    "title": i18n("sex"),
                    "data": function (data) {
                        return data.sex ? data.sex : "";
                    },
                    "className": "header"
                }
            ];
        },

        insertSampleColumnsNoLeaf: function () {
            return [
                {
                    "title": i18n("biobank-code"),
                    "data": function (data) {
                        return data.biobank_code ? data.biobank_code : "";
                    },
                    "className": "header"
                }, {
                    "title": i18n("biobank"),
                    "data": function (data) {
                        return data.biobank_acronym ? data.biobank_acronym : "";
                    },
                    "className": "header"
                }
            ];
        },

        insertModelSpecificColumnsLeaf: function (model, canViewPersonalInfo, nameLeaf) {
            var cols = [];
            if (canViewPersonalInfo) { // if you are allowed to see the Personal Details
                cols = cols.concat(this.insertPersonalDetailsColumnsLeaf(nameLeaf));
            }
            switch (model) {
                case Classes.SUBJECT || Classes.DATA:
                    cols = cols.concat(this.insertSubjectColumnsLeaf(nameLeaf));
                    break;
                case Classes.DATA:
                    cols = cols.concat(this.insertSubjectColumnsLeaf(nameLeaf));
                    break;
                case Classes.SAMPLE:
                    cols = cols.concat(this.insertSampleColumnsLeaf(nameLeaf));
                    break;
            }
            return cols;
        },

        insertPersonalDetailsColumnsLeaf: function (nameLeaf) {
            return [
                {
                    "title": i18n("surname"),
                    "data": function (data) {
                        return data[this.fieldName] ? data[this.fieldName] : "";
                    }.bind({ fieldName: nameLeaf.toLowerCase() + "_surname" }),
                    "className": "header"
                },
                {
                    "title": i18n("given-name"),
                    "data": function (data) {
                        return data[this.fieldName] ? data[this.fieldName] : "";
                    }.bind({ fieldName: nameLeaf.toLowerCase() + "_given-name" }),
                    "className": "header"
                },
                {
                    "title": i18n("birth-date"),
                    "data": function (data) {
                        return data[this.fieldName] ? data[this.fieldName] : "";
                    }.bind({ fieldName: nameLeaf.toLowerCase() + "_birth-date" }),
                    "render": renderDatatablesDate,
                    "className": "header"
                }
            ];
        },

        insertSubjectColumnsLeaf: function (nameLeaf) {
            return [
                {
                    "title": i18n("code"),
                    "data": function (data) {
                        return data[this.fieldName] ? data[this.fieldName] : "";
                    }.bind({ fieldName: nameLeaf.toLowerCase() + "_code" }),
                    "className": "header"
                },
                {
                    "title": i18n("sex"),
                    "data": function (data) {
                        return data[this.fieldName] ? data[this.fieldName] : "";
                    }.bind({ fieldName: nameLeaf.toLowerCase() + "_sex" }),
                    "className": "header"
                }
            ];
        },

        insertSampleColumnsLeaf: function (nameLeaf) {
            return [
                {
                    "title": nameLeaf + " " + i18n("biobank-code"),
                    "data": function (data) {
                        return data[this.fieldName] ? data[this.fieldName] : "";
                    }.bind({ fieldName: nameLeaf.toLowerCase() + "_biobank_code" }),
                    "className": "header"
                }

            ];
        },

        /**
         * @method
         * @name addLinks
         * @description add the proper links to each row in the table given the dataType Model
         */
        addLinks: function (options) {
            var btnGroupTemplate = JST["views/templates/xtenstable-buttongroup.ejs"];
            // var that = this;
            var privilege = this.multiProject || this.isLeafSearch ? _.find(options.dataTypePrivileges, { 'dataType': this.data[0].type }) : options.dataTypePrivileges;
            _.each(!this.isLeafSearch ? this.data : this.plainData, function (datum) {
                datum._links = btnGroupTemplate({
                    __: i18n,
                    dataTypeModel: options.dataTypeModel,
                    privilegeLevel: privilege ? privilege.privilegeLevel : undefined,
                    hasDataSensitive: options.hasDataSensitive,
                    fileUpload: options.fileUpload,
                    hasDataChildren: options.hasDataChildren,
                    hasSampleChildren: options.hasSampleChildren,
                    showSubjectDashButton: options.showSubjectDashButton
                });
            });

            this.columns.push({
                "data": "_links",
                "title": i18n("actions"),
                "className": "actions"
            });
        },

        /**
         * @method
         * @name showDetailsView
         * @param{Object} ev - the current event
         * @description returns the details view associated to the current item
         */
        showDetailsView: function (ev) {
            var currRow = this.table.row($(ev.currentTarget).parents('tr'));
            var data = currRow.data();

            var dataType = this.multiProject || this.isLeafSearch ? _.find(this.dataTypes.models, { 'id': data.type }) : this.dataTypes;
            var model = dataType.get("model");
            var path = model === Classes.DATA ? model.toLowerCase() : model.toLowerCase() + 's';
            path += "/details/" + data.id;
            xtens.router.navigate(path, { trigger: true });
            return false;
        },

        /**
         * @method
         * @name showEditView
         * @param{Object} ev - the current event
         * @description returns the details view associated to the current item
         */
        showEditView: function (ev) {
            var currRow = this.table.row($(ev.currentTarget).parents('tr'));
            var data = currRow.data();

            // model here is the ENTITY model (a.k.a. the server-side resource)
            var dataType = this.multiProject || this.isLeafSearch ? _.find(this.dataTypes.models, { 'id': data.type }) : this.dataTypes;
            var model = dataType.get("model");
            var path = model === Classes.DATA ? model.toLowerCase() : model.toLowerCase() + 's';
            path += "/edit/" + data.id;
            xtens.router.navigate(path, { trigger: true });
            return false;
        },

        /**
         * @method
         * @name showDerivedDataList
         * @param{Object} ev - the current event
         * @description returns a list of the data stored as children of the given data instance
         */
        showDerivedDataList: function (ev) {
            var currRow = this.table.row($(ev.currentTarget).parents('tr'));
            var data = currRow.data();
            var dataType = this.multiProject || this.isLeafSearch ? _.find(this.dataTypes.models, { 'id': data.type }) : this.dataTypes;
            var model = dataType.get("model");
            var parentProperty = model === Classes.SUBJECT ? 'parentSubject' : model === Classes.SAMPLE ? 'parentSample' : 'parentData';
            var dataId = data.id;
            var path = "data?" + parentProperty + "=" + dataId;

            // TODO change "code" to "subjectCode" for sake of clarity
            path += data.code ? "&donorCode=" + data.code : '';
            path += "&parentDataType=" + dataType.id;

            xtens.router.navigate(path, { trigger: true });
            return false;
        },

        /**
         * @method
         * @name showSubjectGraph
         * @param{Object} ev - the current event
         * @description returns a graph of the subject selected
         */
        showSubjectGraph: function (ev) {
            var currRow = this.table.row($(ev.currentTarget).parents('tr'));
            var data = currRow.data();
            var codePatient = data.code;
            var path = "subjects/dashboard?codePatient=" + codePatient;

            xtens.router.navigate(path, { trigger: true });
            return false;
        },

        /**
         * @method
         * @name showDerivedSubjectsList
         * @param{Object} ev - the current event
         * @description returns a list of the samples stored as children of the given data instance
         *
         */
        showDerivedSubjectsList: function (ev) {
            var currRow = this.table.row($(ev.currentTarget).parents('tr'));
            var data = currRow.data();
            var dataType = this.multiProject || this.isLeafSearch ? _.find(this.dataTypes.models, { 'id': data.type }) : this.dataTypes;
            var model = dataType && dataType.get("model");
            // DATA cannot have sample child
            if (model === Classes.DATA) { return false; }

            var parentProperty = 'parentSubject';
            var dataId = data.id;
            var path = "subjects?" + parentProperty + "=" + dataId;

            // TODO change "code" to "subjectCode" for sake of clarity
            path += data.code ? "&parentSubjectCode=" + data.code : '';
            path += "&parentDataType=" + dataType.id;

            xtens.router.navigate(path, { trigger: true });
            return false;
        },

        /**
         * @method
         * @name showDerivedSampleList
         * @param{Object} ev - the current event
         * @description returns a list of the samples stored as children of the given data instance
         *
         */
        showDerivedSampleList: function (ev) {
            var currRow = this.table.row($(ev.currentTarget).parents('tr'));
            var data = currRow.data();
            var dataType = this.multiProject || this.isLeafSearch ? _.find(this.dataTypes.models, { 'id': data.type }) : this.dataTypes;
            var model = dataType && dataType.get("model");
            // DATA cannot have sample child
            if (model === Classes.DATA) { return false; }

            var parentProperty = model === Classes.SUBJECT ? 'donor' : 'parentSample';
            var dataId = data.id;
            var path = "samples?" + parentProperty + "=" + dataId;

            // TODO change "code" to "subjectCode" for sake of clarity
            path += data.code ? "&donorCode=" + data.code : '';
            path += "&parentDataType=" + dataType.id;

            xtens.router.navigate(path, { trigger: true });
            return false;
        },

        /**
         * @method
         * @name showFileList
         * @param{Object} ev- the current event
         * @description returns the list of files associated to the current data instance
         */
        showFileList: function (ev) {
            // if there is any open popover destroy it
            var that = this;
            var currRow = this.table.row($(ev.currentTarget).parents('tr'));
            var d = currRow.data();
            var id = currRow.data().id;
            var dataType = this.multiProject || this.isLeafSearch ? _.find(this.dataTypes.models, { 'id': d.type }) : this.dataTypes;
            var model = dataType.get("model");
            if (!this[id]) {
                if (model === Classes.SUBJECT) { return false; }

                var data = model === Classes.SAMPLE ? new Sample.Model() : new Data.Model();
                var dataId = currRow.data().id;
                data.set("id", dataId);
                data.fetch({
                    data: $.param({ populate: ['files'] }),
                    success: function (result) {
                        var files = result.get("files");
                        var dataFiles = new DataFile.List(files);
                        var view = new DataFile.Views.List({ collection: dataFiles, datum: id });
                        // that.listenTo(view, 'fileDeleted', that.showFileList);
                        var timer;
                        $(ev.currentTarget).popover({
                            trigger: 'manual',
                            container: '.query',
                            html: true,
                            content: view.render().el,
                            placement: 'auto left'
                        }).hover(function () {
                            var _this = this;
                            timer = setTimeout(function () {
                                $(_this).popover("show");
                            }, 300);
                        }, function () {
                            // if leaves early then clear the timer
                            clearTimeout(timer);
                        }).on("mouseleave", function () {
                            if (!$(".popover:hover").length && !$(".xtenstable-files:hover").length) {
                                $('.popover').popover('hide');
                            }
                        }).popover('show');

                        $(".popover").on("mouseleave", function () {
                            if (!$(".xtenstable-files:hover").length) {
                                $('.popover').popover('hide');
                            }
                        });

                        that.listenTo(view, 'closeMe', that.removeChild);
                        // that.childrenViews.push(view);
                    },
                    error: function (model, err) {
                        // console.log(err);
                    }
                });
                this[id] = true;
            }
            // else {
            //     $(this).popover("show");
            // }
        },

        /**
         * @method
         * @name removeChild
         * @param{Backbone.View} - the child view to be removed
         * @description safely remove a child view (such as a popover) from the table
         */
        removeChild: function (child) {
            for (var i = 0, len = this.childrenViews.length; i < len; i++) {
                if (_.isEqual(this.childrenViews[i], child)) {
                    this.stopListening(child);
                    child.remove();
                    // if contained within a popover remove it
                    $('[data-original-title]').popover('destroy');
                    this.childrenViews.splice(i, 1);
                }
            }
        }

    });
}(xtens, xtens.module("xtenstable")));
