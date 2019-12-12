/**
 * @author  Nicolò Zanardi
 * @description This file contains the Backbone classes for handling Daemon
 *              models, collections and views according to the MIABIS standard
 */
(function (xtens, Daemon) {
    // dependencies
    Daemon.Views = {};
    var ModalDialog = require('./XtensBootstrap.js').Views.ModalDialog;
    var i18n = require('./i18n.js').en;

    // XTENS router alias
    var router = xtens.router;

    Daemon.Model = Backbone.Model.extend({
        urlRoot: '/daemon'
    });

    Daemon.List = Backbone.Collection.extend({
        url: '/daemon',
        model: Daemon.Model
    });

    Daemon.Views.Edit = Backbone.View.extend({

    });

    Daemon.Views.DaemonsTable = Backbone.View.extend({

        tagName: 'table',
        className: 'daemon-table',

        /**
     * @extends Backbone.View.initialize
     */
        initialize: function (options) {
            if (!options) {
                throw new Error("Missing required options");
            }
            this.daemons = options.daemons.toJSON();
            this.operator = options.operator;
            this.$modal = $(".modal-cnt");

            this.render();
        },

        render: function () {
            return this;
        },

        displayDaemonsTable: function () {
            var that = this;
            this.tableOpts = {
                data: this.daemons,
                columns: [{
                    title: i18n("status"),
                    data: "status"
                },
                {
                    title: i18n("file-name"),
                    data: "source"
                },
                {
                    title: i18n("progress"),
                    data: "info.percentage",
                    render: function (data, type, row) {
                        return data + "%";
                    }
                },
                {
                    title: i18n("imported-rows"),
                    data: "info.processedRows"
                },
                {
                    title: i18n("discarded-rows"),
                    data: "info.notProcessedRows",
                    render: function (data, type, row) {
                        return data.length;
                    }
                },
                {
                    title: i18n("total-rows"),
                    data: "info.totalRows"
                },
                {
                    title: i18n("error"),
                    data: "info.error"
                },
                {
                    title: i18n("date"),
                    data: "createdAt",
                    render: function (data, type, row) {
                        return moment(data).format("YYYY-MM-DD HH:mm:ss");
                    }
                },
                {
                    title: "process-id",
                    data: "pid",
                    visible: false
                }
                ],
                createdRow: function (row, data) {
                    switch (data.status) {
                        case "initializing":
                            $('td', row).eq(0).addClass('bg-info').append('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
                            break;
                        case "error":
                            $('td', row).eq(0).addClass('bg-danger');
                            break;
                        case "running":
                            $('td', row).eq(0).addClass('bg-warning').append('<i style="margin-left:5px;" class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
                            break;
                        case "success":
                            $('td', row).eq(0).addClass('bg-success');
                            break;
                        default:
                    }
                    that.renderNotProcessedRows(row, data);
                },
                columnDefs: [{
                    "className": "dt-center",
                    "targets": "_all"
                }],
                info: true,
                scrollCollapse: true,
                autoWidth: true,
                paging: false,
                scrollY: '40em',
                order: [
                    [7, "desc"]
                ]
            };

            this.table = this.$el.DataTable(this.tableOpts);

            var buttons = [{
                text: 'All Processes',
                className: 'filter-button all-processes',
                action: function (e, dt, node, config) {
                    $('.filter-button').removeClass('btn-primary');
                    $(e.currentTarget).addClass('btn-primary');
                    that.table.column(0).search("").draw();
                    that.table.column(6).visible(true);
                }
            },
            {
                text: 'Running',
                className: 'filter-button',
                action: function (e, dt, node, config) {
                    $('.filter-button').removeClass('btn-primary');
                    $(e.currentTarget).addClass('btn-primary');
                    that.table.column(0).search($(e.target).text().toLowerCase()).draw();
                    that.table.column(6).visible(false);
                }
            },
            {
                text: 'Success',
                className: 'filter-button',
                action: function (e, dt, node, config) {
                    $('.filter-button').removeClass('btn-primary');
                    $(e.currentTarget).addClass('btn-primary');
                    that.table.column(0).search($(e.target).text().toLowerCase()).draw();
                    that.table.column(6).visible(false);
                }
            },
            // {
            //     text: 'Initializing',
            //     className: 'filter-button',
            //     action: function ( e, dt, node, config ) {
            //         $('.filter-button').removeClass('btn-primary');
            //         $(e.currentTarget).addClass('btn-primary');
            //         that.table.column( 0 ).search($(e.target).text().toLowerCase()).draw();
            //         that.table.column( 6 ).visible( false );

            //     }
            // },
            {
                text: 'Error',
                className: 'filter-button',
                action: function (e, dt, node, config) {
                    $('.filter-button').removeClass('btn-primary');
                    $(e.currentTarget).addClass('btn-primary');
                    that.table.column(0).search($(e.target).text().toLowerCase()).draw();
                    that.table.column(6).visible(true);
                }
            }
            ];

            new $.fn.dataTable.Buttons(this.table, {
                buttons: buttons
            });
            this.table.buttons().container().appendTo($('.col-sm-6:eq(0)', this.table.table().container()));
            $('.col-sm-6:eq(0)', this.table.table().container()).children().css("float", "left").css('padding', '0.5em');
            $('.col-sm-5:eq(0)', this.table.table().container()).children().css("float", "left");
            $(".all-processes").addClass('btn-primary');
        },

        refreshDaemonsTable: function () {
            var daemons = new Daemon.List();
            var that = this;
            var $daemonsDeferred = daemons.fetch({
                data: $.param({
                    operator: that.operator,
                    sort: 'created_at DESC',
                    limit: 1000
                })
            });
            $.when($daemonsDeferred).then(function (daemonsRes) {
                // var info = that.table.page.info();
                that.table.clear();
                that.table.rows.add(daemonsRes); // Add new daemons
                that.table.columns.adjust();
                that.table.draw(false);
            });
        },

        renderNotProcessedRows: function (row, data) {
            var that = this;
            var notRows = data.info.notProcessedRows;
            if (notRows.length > 0) {
                $('td', row).eq(4).css('cursor', 'pointer');
                $('td', row).eq(4).attr('title', 'Click to show details');
                $('td', row).eq(4).on('click', function (e) {
                    if (that.modal) {
                        that.modal.hide();
                    }
                    that.modal = new ModalDialog({
                        title: i18n('discarded-rows-list'),
                        body: require("./../../templates/dedicated-notprocessedrows-dialog-bootstrap.ejs")({
                            __: i18n,
                            data: notRows,
                            file: data.source
                        })
                    });
                    that.$modal.append(that.modal.render().el);
                    $('.modal-header').addClass('alert-info');
                    that.modal.show();

                    that.$modal.one('hidden.bs.modal', function (e) {
                        e.preventDefault();
                        that.modal.remove();
                    });
                });
            }
        }
    });
}(xtens, require('./Daemon.js')));
