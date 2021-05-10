/* eslint-disable backbone/initialize-on-top */
/* eslint-disable backbone/events-on-top */
/**
 * @author  Massimiliano Izzo
 * @description This file contains the Backbone classes for handling DashBoard
 *              models, collections and views
 */
(function (xtens, DashBoard) {
    // dependencies
    var i18n = xtens.module("i18n").en;
    var optionPeriods = [{
        name: "Last Year",
        value: "year",
        graphFormat: "%Y-%m"
    },
    {
        name: "All time",
        value: "allyear",
        graphFormat: "%Y"
    },
    {
        name: "Current Year - " + new Date().getFullYear(),
        value: "year-" + new Date().getFullYear(),
        graphFormat: "%Y-%m"
    },
    {
        name: "Last Month",
        value: "month",
        graphFormat: "%m-%d"
    },
    {
        name: "Last Week",
        value: "week",
        graphFormat: "%m-%d"
    }
    ];
    // var Constants = xtens.module("xtensconstants").Constants;
    // var DataTypeClasses = xtens.module("xtensconstants").DataTypeClasses;
    // var MetadataComponent = xtens.module("metadatacomponent");
    // var MetadataGroup = xtens.module("metadatagroup");
    // var ModalDialog = xtens.module("xtensbootstrap").Views.ModalDialog;

    // XTENS router alias
    // var router = xtens.router;
    // options object for Parsley Validation
    // var parsleyOpts = {
    //     priorityEnabled: false,
    //     successClass: "has-success",
    //     errorClass: "has-error",
    //     classHandler: function(el) {
    //         return el.$element.parent();
    //     },
    //     errorsWrapper: "<span class='help-block'></span>",
    //     errorTemplate: "<span></span>"
    // };

    /**
* @class
* @name DashBoard.Model
*  define a DashBoard model
*/
    DashBoard.Model = Backbone.Model.extend({
        urlRoot: '/dashboard'
    });

    DashBoard.Views.HomePage = Backbone.View.extend({

        tagName: 'div',
        className: 'dashboard-cnt',

        events: {
            'change #subject-selector': 'goToSubjectDashboard'
        },

        initialize: function (options) {
            $('#main').html(this.el);
            this.models = ["Subject", "Sample", "Data"];
            this.SubjectCount = options.DataTypes;
            this.DataTypes = options.DataTypeSource;
            this.SampleCount = options.Samples;
            this.DataCount = options.Data;
            this.subjects = options.subjects && options.subjects.toJSON();
            this.BarGraphParent1 = null;
            this.BarGraphParent2 = null;

            this.dataTypesModelsColors = {
                "Data": "#DB222A", // "#FB3640",//#FF4B3E",
                "Subject": "#0066AA", // green-yellow #baff29
                "Sample": "#0F4C00" // "#1E3F20" //"#44633F"
            };
            this.template = JST["views/templates/dashboard-home.ejs"];
            this.render();
        },

        render: function () {
            $('.loader-gif').css("display", "none");

            var that = this;
            this.$el.html(this.template({
                __: i18n,
                subjects: this.subjects
            }));
            $('#subject-selector').selectpicker();

            _.forEach(this.models, function (model) {
                if (that[model + 'Count'] && that[model + 'Count'].length > 0) {
                    that.renderPieByModel(model);
                }
            });
            this.renderChartsByModel();
            return this;
        },

        goToSubjectDashboard: function () {
            var idPatient = $('#subject-selector').val();
            xtens.router.navigate('#/subjects/dashboard?idPatient=' + idPatient, { trigger: true });
        },

        renderPieByModel: function (model) {
            var pieData; var title; var colors; var writeTag = false;
            switch (model) {
                case "Subject":
                    pieData = this.SubjectCount;
                    title = "DataTypes";
                    colors = this.dataTypesModelsColors;
                    writeTag = true;
                    break;
                case "Sample":
                    pieData = this.SampleCount;
                    title = "Samples";
                    break;
                case "Data":
                    pieData = this.DataCount;
                    title = "Data";
                    break;
                default:
                    break;
            }
            var realTotVals = 0;
            var fakeData = _.filter(pieData, function (data) {
                var valInt = parseInt(data.value);
                if (valInt !== -1) {
                    realTotVals += valInt;
                }
                return valInt === -1;
            });
            var realLength = fakeData ? pieData.length - fakeData.length : 0;
            var fakeVal = realTotVals !== 0 && realLength !== 0 && realTotVals > realLength ? Math.round(realTotVals / realLength) : 1;
            
            pieData = _.map(pieData, function (data) {
                if (parseInt(data.value) === -1) {
                    data.value = fakeVal;
                }
                return data;
            });
            var viewName = "PieChart" + model;
            this[viewName] = new DashBoard.Views.PieChart({
                data: pieData,
                name: title + "_Pie",
                title: title,
                model: model,
                colors: colors
            });

            $("#pies").append(this[viewName].render().el);
            this[viewName].createGraph(writeTag);
        },

        renderChartsByModel: function () {
            this.BarGraphParent1 = new DashBoard.Views.BarChartParent({
                models: this.models,
                dataTypes: this.DataTypes,
                name: 'Time'
            });
            $("#bars").append(this.BarGraphParent1.render().el);
            this.BarGraphParent1.renderBarChartByModel();

            /** */
            this.BarGraphParent2 = new DashBoard.Views.DateDiffBarChart({
                dataTypes: this.DataTypes
            });
            $("#bars").append(this.BarGraphParent2.render().el);
            /**/
        }
    });

    DashBoard.Views.PieChart = Backbone.View.extend({

        tagName: 'div',
        className: 'dashboard-pie-chart col-sm-4',
        attributes: function () {
            var style = 'border: 3px solid #29406d; ' +
                'text-align: center; ' +
                'border-radius: 2vh; ';
            return {
                'style': style
            };
        },
        events: {
            // 'click #graph':'createGraph'
        },

        initialize: function (options) {
            this.data = options.data;
            this.name = options.name;
            this.title = options.title;
            this.model = options.model;
            this.colors = options.colors;
            this.template = JST["views/templates/dashboard-graph.ejs"];
        },

        render: function () {
            this.$el.html(this.template({
                __: i18n,
                title: this.title
            }));
            this.$el.addClass(this.name);
            return this;
        },

        resetTips: function () {
            $('.d3-tip').css('opacity', 0).css('pointer-events', 'none');
        },

        createGraph: function () {
            this.resetTips();
            var that = this;
            var data = this.data;
            var totalData = this.data.reduce(function (s, f) {
                return s + parseInt(f.value); // return the sum of the accumulator and the current time, as the the new accumulator
            }, 0);

            var width = 500;
            var height = 280;
            var radius = (Math.min(width, height) / 2) + 10;
            var colorLength = data.length < 3 ? 3 : data.length < 9 ? data.length : 9;
            var color = this.colors ? d3.scaleOrdinal().range(_.values(this.colors))
                : this.model === "Sample" ? d3.scaleOrdinal(d3.schemeGreens[colorLength])
                    : d3.scaleOrdinal().range(data.length < 9 ? d3.schemeReds[3] : d3.schemeCategory10);

            var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius - 10);

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.value;
                });

            var svgTraslationX = 150;
            var svgTraslationY = (height / 2 + 10);

            var svg = d3.select("." + this.name + " > #content > .row > .graph-cnt").append("svg")
                .attr("viewBox", "-10 -15 " + width + " " + (height + 50))
                .append("g")
                .attr("transform", "translate(" + svgTraslationX + "," + svgTraslationY + ")");

            // tooltip and mouseevent initialization
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<strong>Value:</strong> <span style='color:#4476b5'>" + d.data.value + "</span> - " + Math.floor(d.data.value / totalData * 100) + "%";
                });

            var followselector = 'ipfollowscursor' + this.model;
            svg.append('circle').attr('id', followselector);
            svg.call(tip);

            var handlemouseover = function (path, d) {
                tip.show(d);
                d3.select(path).attr('d', function (es) {
                    return d3.arc()
                        .innerRadius(0)
                        .outerRadius(radius + 10)(es);
                });
            };
            var handlemousemove = function (path, d) {
                var selector = '#' + followselector;
                var target = d3.select(selector)
                    .attr('cx', d3.event.offsetX - svgTraslationX)
                    .attr('cy', d3.event.offsetY - svgTraslationY - 5) // 5 pixels above the cursor
                    .node();
                tip.show(d, target);
            };
            var handlemouseout = function (path, d) {
                tip.hide(d);
                d3.select(path).attr('d', function (es) {
                    return d3.arc().innerRadius(0).outerRadius(radius)(es);
                });
            };

            // archi
            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .style("fill", function (d) {
                    return color(d.data.label);
                }) // set the color for each slice to be chosen from the color function defined above
                .attr("d", arc)
                .on('mouseover', function (d) {
                    that.resetTips();
                    handlemouseover(this, d);
                })
                .on('mouseout', function (d) {
                    that.resetTips();
                    handlemouseout(this, d);
                })
                .on('mousemove', function (d) {
                    handlemousemove(this, d);
                });

            // LEGEND initialization
            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(300," + ((i * 20) - 135) + ")";
                });

            legend.append("rect")
                .attr("x", $('.' + that.name).width() - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", $('.' + that.name).width() - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (label) {
                    return label;
                });
        }
    });

    DashBoard.Views.BarChartParent = Backbone.View.extend({
        tagName: 'div',
        className: 'dashboard-bar-chart-parent col-sm-6',
        events: {
            'change #md-sel': 'onChangeModel'
        },
        attributes: function () {
            var style = 'border: 3px solid #29406d; ' +
                'text-align: center; ' +
                'border-radius: 2vh; ';
            return {
                'style': style
            };
        },

        initialize: function (options) {
            var that = this;
            this.BarChart = null;
            this.models = options.models;
            this.DataTypes = options.dataTypes;
            this.name = options.name;
            this.selectedModel = options.models[0];
            this.DataTypesFiltered = this.DataTypes.filter(function (dt) {
                return dt.model === that.selectedModel;
            });
            this.template = JST["views/templates/dashboard-bargraph-parent.ejs"];
        },

        onChangeModel: function (ev) {
            ev.preventDefault();
            var that = this;
            this.selectedModel = this.models.find(function (md) {
                return md === that.$('#md-sel').val();
            });
            this.DataTypesFiltered = this.DataTypes.filter(function (dt) {
                return dt.model === that.selectedModel;
            });
            this.renderBarChartByModel();
        },

        render: function () {
            this.$el.html(this.template({
                __: i18n,
                models: this.models,
                name: this.name
            }));
            this.$el.addClass(this.name);
            this.$('#md-sel').selectpicker();
            return this;
        },

        renderBarChartByModel: function () {
            if (this.BarChart) {
                this.BarChart = null;
                $("#bargraph-parent-content-" + this.name).empty();
            }

            this.BarChart = new DashBoard.Views.BarChart({
                DataTypes: this.DataTypesFiltered,
                model: this.selectedModel,
                name: this.name + '-' + this.selectedModel
            });
            $("#bargraph-parent-content-" + this.name).append(this.BarChart.render().el);
        }
    });

    DashBoard.Views.BarChart = Backbone.View.extend({

        tagName: 'div',
        className: 'dashboard-bar-chart',
        events: {
            'change #dt-sel': 'onChangeDataType',
            'change #field-sel': 'onChangeField',
            'change #period-sel': 'onChangePeriod'
        },

        initialize: function (options) {
            this.periods = optionPeriods;

            this.model = options.model;
            this.name = 'bar-chart-' + options.name;
            this.DataTypes = options.DataTypes;
            this.selectedDataType = this.DataTypes[0];
            this.selectedPeriod = this.periods[0].value;
            this.selectedFormat = this.periods[0].graphFormat;
            this.setDateFieldsCurrentDataType();

            this.selectedField = "created_at";
            this.template = JST["views/templates/dashboard-bargraph.ejs"];
        },

        setDateFieldsCurrentDataType: function () {
            this.dateFields = _.flatten(this.selectedDataType.superType.schema.body.map(function (b) {
                return b.content.filter(function (c) {
                    return c.fieldType === "Date";
                });
            }));
        },

        onChangeDataType: function (ev) {
            ev.preventDefault();
            var that = this;
            this.selectedDataType = this.DataTypes.find(function (dt) {
                return dt.id === parseInt(that.$('#dt-sel').val());
            });
            this.setDateFieldsCurrentDataType();

            $('option', this.$('#field-sel')).remove();
            var html = '<option selected value= "created_at"> Creation Date </option>';
            _.forEach(this.dateFields, function (field) {
                html = html + '<option value="' + field.formattedName + '">' + field.name + '</option>';
            });
            this.$('#field-sel').html(html);
            this.$('#field-sel').selectpicker('refresh');
            this.selectedField = "created_at";
            this.fetchData();
        },

        onChangeField: function (ev) {
            ev.preventDefault();
            this.selectedField = this.$('#field-sel').val();
            this.fetchData();
        },

        onChangePeriod: function (ev) {
            ev.preventDefault();
            this.selectedPeriod = this.$('#period-sel').val();
            this.selectedFormat = _.findWhere(this.periods, { value: this.selectedPeriod });
            this.fetchData();
        },

        fetchData: function () {
            var that = this;

            $.ajax({
                url: '/dashboard/getInfoForBarChart?',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: {
                    dataType: this.selectedDataType.id,
                    fieldName: this.selectedField,
                    model: this.model,
                    period: this.selectedPeriod
                },
                contentType: 'application/json',
                success: function (results) {
                    that.data = results;
                    that.createGraph();
                },
                error: function (err) {
                    xtens.error(err);
                }
            });
        },

        render: function () {
            this.$el.html(this.template({
                __: i18n,
                dataTypes: this.DataTypes,
                fields: this.dateFields,
                periods: this.periods
            }));
            this.$('#dt-sel').selectpicker();
            this.$('#field-sel').selectpicker();
            this.$('#period-sel').selectpicker();
            this.fetchData();
            this.$el.addClass(this.name);
            return this;
        },

        resetTips: function () {
            $('.d3-tip').css('opacity', 0).css('pointer-events', 'none');
        },

        createGraph: function () {
            this.resetTips();
            $("svg", this.$el).remove();
            var that = this;
            var margin = {
                top: 20,
                right: 35,
                bottom: 70,
                left: 40
            };
            var width = 600 - margin.left - margin.right;
            var height = 300 - margin.top - margin.bottom;
            var xAxisTraslation = 35;

            var totalData = this.data.reduce(function (s, f) {
                return s + parseInt(f.value); // return the sum of the accumulator and the current time, as the the new accumulator
            }, 0);

            // var parseTime = d3.timeParse(this.selectedFormat);
            // var labels = _.map(this.data, 'date');

            // var xTime = d3.scaleTime().domain([
            //     d3.min(labels, function (d) { return parseTime(d); }),
            //     d3.max(labels, function (d) { return parseTime(d); })]).range([0, width - xAxisTraslation]);// .paddingInner(0.2).paddingOuter(0.25);

            var xBar = d3.scaleBand().range([0, width - xAxisTraslation]).paddingInner(0.2).paddingOuter(0.25);
            var yBar = d3.scaleLinear().range([height, 0]);
            var xLine = d3.scalePoint().range([0, width - xAxisTraslation]).padding(0.62);
            var yLine = d3.scaleLinear().range([height, 0]);

            var valueline = d3.line()
                .x(function (d) {
                    return xLine(d.date);
                })
                .y(function (d, currentIndex) {
                    var partialTotal = 0;
                    for (var index = 0; index <= currentIndex; index++) {
                        partialTotal = partialTotal + that.data[index].value;
                    }
                    return yLine(partialTotal);
                });

            var xAxis = d3.axisBottom(xBar);
            var yAxis = d3.axisLeft(yBar);

            var tipBar = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<strong>Value:</strong> <span style='color:orange'>" + d.value + "</span>";
                });
            var tipPoint = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d, currentIndex) {
                    var partialTotal = 0;
                    for (var index = 0; index <= currentIndex; index++) {
                        partialTotal = partialTotal + that.data[index].value;
                    }
                    return "<strong>" + d.date + " total:</strong> <span style='color:steelblue'>" + partialTotal + "</span>";
                });

            var svg = d3.select("." + this.name + " > .row > .graph-cnt").append("svg")
                .data(this.data)
                .attr("viewBox", "-10 -15 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            if (svg._groups[0].length > 0) {
                svg.call(tipBar);
                svg.call(tipPoint);
            }

            this.data.forEach(function (d) {
                // d.date = d.date;
                d.value = +d.value;
            });

            xBar.domain(this.data.map(function (d) {
                return d.date;
            }));

            xLine.domain(this.data.map(function (d) {
                return d.date;
            }));
            yBar.domain([0, d3.max(this.data, function (d) {
                return d.value;
            })]).nice();
            yLine.domain([0, totalData]).nice();

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");
            // .text("Value ($)");
            svg.append("g")
                .attr("class", "axisRed")
                .attr("transform", "translate( " + (width - xAxisTraslation) + ", 0 )")
                .call(d3.axisRight(yLine));

            svg.selectAll("bar")
                .data(this.data)
                .enter().append("rect")
                .attr("class", "bar")
                // .style("margin-left", "1vh")
                .attr("x", function (d) {
                    return xBar(d.date);
                })

                .attr("width", xBar.bandwidth())
                .attr("y", function (d) {
                    return yBar(d.value);
                })
                .attr("height", function (d) {
                    return height - yBar(d.value);
                })
                .on('mouseover',
                    function (d) {
                        that.resetTips();
                        tipBar.show(d);
                    })
                .on('mouseout', function (d) {
                    that.resetTips();
                    tipBar.hide(d);
                });

            svg.append("path")
                .data([this.data])
                .attr("class", "line")
                .style("stroke", "steelblue")
                .attr("d", valueline);

            var points2 = svg.selectAll("circle.point2")
                .data(this.data);

            points2.enter().append("circle")
                .merge(points2)
                .attr("class", "point1")
                .style("stroke", "steelblue")
                .style("fill", "steelblue")
                .attr("cx", function (d) {
                    return xLine(d.date);
                })
                .attr("cy", function (d, currentIndex) {
                    var partialTotal = 0;
                    for (var index = 0; index <= currentIndex; index++) {
                        partialTotal = partialTotal + that.data[index].value;
                    }
                    return yLine(partialTotal);
                })
                .attr("r", function () {
                    return 5;
                })
                .on('mouseover', function (d, i) {
                    that.resetTips();
                    tipPoint.show(d, i);
                })
                .on('mouseout', function (d, i) {
                    that.resetTips();
                    tipPoint.hide(d, i);
                });
        }
    });

    DashBoard.Views.DateDiffBarChart = Backbone.View.extend({

        tagName: 'div',
        className: 'dashboard-datediff-bar-chart col-sm-6',
        events: {
            'change #fd-from-sel': 'onChangeFieldFrom',
            'change #fd-to-sel': 'onChangeFieldTo',
            'change #period-sel': 'onChangePeriod'
        },
        attributes: function () {
            var style = 'border: 3px solid #29406d; ' +
                'text-align: center; ' +
                'border-radius: 2vh; ';
            return {
                'style': style
            };
        },

        initialize: function (options) {
            var that = this;
            this.periods = optionPeriods;
            this.name = 'datediff-bar-chart';
            this.selectedFieldFrom = null;
            this.selectedFieldTo = null;
            this.fieldsDate = [];
            this.filteredDatatypes = options.dataTypes.filter(function (dt) {
                return _.find(dt.parents, function (pt) {
                    return pt.model == 'Subject';
                });
            });
            _.forEach(this.filteredDatatypes, function (dt) {
                dataType = { id: dt.id,
                    name: dt.name,
                    model: dt.model,
                    hasSample: _.find(dt.parents, function (pt) {
                        return pt.model == 'Sample';
                    })
                };
                _.forEach(dt.superType.schema.body, function (bd) {
                    _.forEach(bd.content, function (ct) {
                        if (ct.fieldType == "Date") {
                            field = {
                                id: dataType.model + '-' + dataType.id + '-' + ct.formattedName + '-' + (dataType.hasSample ? 1 : 0),
                                name: dataType.name + ' - ' + ct.name
                            };
                            that.fieldsDate.push(field);
                        }
                    });
                });
            });

            this.selectedPeriod = this.periods[0].value;
            this.selectedFormat = this.periods[0].graphFormat;
            this.template = JST["views/templates/dashboard-bargraph-datediff.ejs"];
        },

        onChangeFieldFrom: function (ev) {
            ev.preventDefault();
            this.manageDateFields(true);
            this.fetchData();
        },

        onChangeFieldTo: function (ev) {
            ev.preventDefault();
            this.manageDateFields(false);
            this.fetchData();
        },

        manageDateFields: function (isFrom) {
            select1 = isFrom ? '#fd-from-sel' : '#fd-to-sel';
            select2 = isFrom ? '#fd-to-sel' : '#fd-from-sel';
            varName = isFrom ? 'selectedFieldFrom' : 'selectedFieldTo';
            this[varName] = this.$(select1).val();
            // ok = this.$(select1).find(':selected');
            // this[varName] = this.$(select1).find(':selected').val();

            // this.$(select2).children('option[value=' + this[varName] + ']')
            //    .attr('disabled', true)
            //    .siblings().removeAttr('disabled');
            // this.$(select2).selectpicker('refresh');
        },

        onChangePeriod: function (ev) {
            ev.preventDefault();
            this.selectedPeriod = this.$('#period-sel').val();
            this.selectedFormat = _.findWhere(this.periods, { value: this.selectedPeriod });
            this.fetchData();
        },

        fetchData: function () {
            var that = this;
            this.fromArray = this.selectedFieldFrom.split("-");
            this.toArray = this.selectedFieldTo.split("-");

            var fromChild = 0;
            _.forEach(this.filteredDatatypes, function (dt) {
                if (dt.id == that.fromArray[1]) {
                    _.forEach(dt.parents, function (pt) {
                        if (pt.model == that.toArray[0] && pt.model != 'Subject') {
                            fromChild = 1;
                            return false;
                        }
                    });
                    return false;
                }
            });
            var toChild = 0;
            _.forEach(this.filteredDatatypes, function (dt) {
                if (dt.id == that.toArray[1]) {
                    _.forEach(dt.parents, function (pt) {
                        if (pt.model == that.fromArray[0] && pt.model != 'Subject') {
                            toChild = 1;
                            return false;
                        }
                    });
                    return false;
                }
            });

            $.ajax({
                url: '/dashboard/getInfoForBarChartDatediff?',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                data: {
                    fromModel: this.fromArray[0],
                    fromDataType: this.fromArray[1],
                    fromFieldName: this.fromArray[2],
                    fromHasSample: this.fromArray[3],
                    fromIsChild: fromChild,
                    toModel: this.toArray[0],
                    toDataType: this.toArray[1],
                    toFieldName: this.toArray[2],
                    toHasSample: this.toArray[3],
                    toIsChild: toChild,
                    period: this.selectedPeriod
                },
                contentType: 'application/json',
                success: function (results) {
                    that.data = results;
                    that.createGraph();
                },
                error: function (err) {
                    xtens.error(err);
                }
            });
        },

        render: function () {
            this.$el.html(this.template({
                __: i18n,
                fieldsDate: this.fieldsDate,
                periods: this.periods
            }));
            if (this.fieldsDate.length == 0) { return this; }
            this.selectedFieldFrom = this.fieldsDate[0].id;
            this.selectedFieldTo = this.fieldsDate[0].id;
            this.$('#fd-from-sel').select2('val', this.fieldsDate[0].id);
            this.$('#fd-to-sel').select2('val', this.fieldsDate[1].id);
            this.manageDateFields(true);
            this.manageDateFields(false);
            this.$('#period-sel').selectpicker();
            this.fetchData();
            this.$el.addClass(this.name);
            return this;
        },

        resetTips: function () {
            $('.d3-tip').css('opacity', 0).css('pointer-events', 'none');
        },

        createGraph: function () {
            this.resetTips();
            $("svg", this.$el).remove();
            var that = this;
            var margin = {
                top: 20,
                right: 50,
                bottom: 70,
                left: 40
            };
            var width = 600 - margin.left - margin.right;
            var height = 300 - margin.top - margin.bottom;
            // var xAxisTraslation = 35;

            // MANAGE DATA FOR DAYS BOX PLOTS
            var dataOutliers = [];
            var dataDays = [];
            var min_days = 0;
            var max_days = 0;
            var quartile = function (arr, q) {
                var sorted = _.sortBy(arr, 'days');
                var pos = (sorted.length - 1) * q;
                var base = Math.floor(pos);
                var rest = pos - base;
                if (sorted[base + 1] !== undefined) {
                    a = sorted[base];
                    b = sorted[base + 1];
                    return sorted[base].days + rest * (sorted[base + 1].days - sorted[base].days);
                } else {
                    return sorted[base].days;
                }
            };
            _.forEach(_.groupBy(this.data.filter(function (o) { return o.todate; }), 'date'), function (group) {
                var field = {};
                field.date = group[0].date;
                _.forEach(group, function (obj) {
                    var to_date = new Date(obj.todate);
                    var from_date = new Date(obj.fromdate);
                    obj.days = Math.round((to_date.getTime() - from_date.getTime()) / (1000 * 60 * 60 * 24));
                    max_days = obj.days > max_days ? obj.days : max_days;
                    min_days = obj.days < min_days ? obj.days : min_days;
                });
                field.qrt1 = quartile(group, 0.25);
                field.median = quartile(group, 0.50);
                field.qrt3 = quartile(group, 0.75);
                var IQR = field.qrt3 - field.qrt1;
                field.uav = field.qrt3;
                field.lav = field.qrt1;
                field.outliers = [];
                field.counter = group.length;
                if (IQR > 0) {
                    var uif = field.qrt3 + (IQR * 1.5);
                    uav_array = group.filter(function (obj) {
                        return obj.days >= field.qrt3 && obj.days <= uif;
                    });
                    if (uav_array.length > 0) {
                        field.uav = Math.max.apply(Math, uav_array.map(function (o) { return o.days; }));
                    }

                    var lif = field.qrt1 - (IQR * 1.5);
                    lav_array = group.filter(function (obj) {
                        return obj.days >= lif && obj.days <= field.qrt1;
                    });
                    if (lav_array.length > 0) {
                        field.lav = Math.min.apply(Math, lav_array.map(function (o) { return o.days; }));
                    }

                    group.map(function (obj) {
                        if (obj.days <= lif || obj.days >= uif) {
                            obj.counter = group.length;
                            dataOutliers.push(obj);
                        }
                    });
                }
                dataDays.push(field);
            });

            // MANAGE DATA FOR OUTLIERS
            _.forEach(dataOutliers, function (obj) {
                obj.perc = obj.counter > 0 ? Math.round((dataOutliers.length / obj.counter) * 100) : 0;
            });

            // MANAGE DATA FOR COUNTER WHEN "TO_DATE" IS NULL
            var dataCount = [];
            var max_count = 0;
            _.forEach(_.groupBy(this.data.filter(function (o) { return !o.todate; }), 'date'), function (group) {
                var field = {};
                field.date = group[0].date;
                field.count = group.length;
                max_count += field.count;
                dataCount.push(field);
            });

            // TIPS DAYS, COUNT, OUTLIERS
            var tipDays = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<b>" + d.date + "</b>" +
                    "<br><b>Count:</b> <span style='color:steelblue'>" + d.counter +
                    "</span><br> <b>Quartile 1:</b> <span style='color:steelblue'>" + d.qrt1 +
                    "</span><br> <b>Median:</b> <span style='color:orange'>" + d.median +
                    "</span><br> <b>Quartile 3:</b> <span style='color:steelblue'>" + d.qrt3 +
                    "</span><br> <b>LAV:</b> <span style='color:steelblue'>" + d.lav +
                    "</span> <b>UAV:</b> <span style='color:steelblue'>" + d.uav + "</span>";
                });
            var tipCount = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d, currentIndex) {
                    var partialTotal = 0;
                    for (var index = 0; index <= currentIndex; index++) {
                        partialTotal = partialTotal + dataCount[index].count;
                    }
                    return "<b>" + d.date + " - No destination date</b>" +
                        "<br><b>current:</b> <span style='color:steelblue'>" + dataCount[currentIndex].count +
                        "</span> <b>total:</b> <span style='color:steelblue'>" + partialTotal + "</span>";
                });
            var tipOutlier = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<b>" + d.date + " - Outlier:</b> <span style='color:steelblue'>" + d.days +
                        "</span> <b>percentage:</b> <span style='color:steelblue'>" + d.perc + "%</span>";
                });

            // CREATE GRAPH
            var svg = d3.select("." + this.name + " > .row > .graph-cnt").append("svg")
                .data(this.data)
                .attr("viewBox", "-10 -15 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            if (svg._groups[0].length > 0) {
                svg.call(tipDays);
                svg.call(tipCount);
                svg.call(tipOutlier);
            }

            // X AXIS FOR BOTH DAYS AND COUNT
            var data_grouped = _.map(_.groupBy(this.data, 'date'), function (d) {
                return d[0].date;
            });
            var xDays = d3.scaleBand()
                .domain(data_grouped)
                .range([ 0, width ])
                .paddingInner(1)
                .paddingOuter(0.5);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xDays));

            // DAYS Y AXIS
            var yMargin = 0;
            var yDays = d3.scaleLinear()
                .domain([min_days < 0 || (min_days - yMargin >= 0) ? min_days - yMargin : 0, max_days + yMargin])
                .range([height, 0]);
            svg.append("g").call(d3.axisLeft(yDays));

            // COUNT Y AXIS
            var yCount = d3.scaleLinear()
                .domain([0, max_count + yMargin])
                .range([height, 0]);
            svg.append("g")
                .attr("class", "axisRed")
                .attr("transform", "translate( " + width + ", 0 )")
                .call(d3.axisRight(yCount));

            // DAYS VERTICAL LINE
            svg.selectAll("vertLines").data(dataDays).enter().append("line")
                .attr("x1", function (d) {
                    return (xDays(d.date));
                })
                .attr("x2", function (d) {
                    return (xDays(d.date));
                })
                .attr("y1", function (d) {
                    return (yDays(d.lav));
                })
                .attr("y2", function (d) {
                    return (yDays(d.uav));
                })
                .attr("stroke", "#29406d");

            // DAYS RECTANGLE QUARTILE RANGE
            var boxWidth = Math.round(width / data_grouped.length);
            var xMargin = Math.round(boxWidth * 20 / 100);
            boxWidth = boxWidth - xMargin;
            svg.selectAll("boxes").data(dataDays).enter().append("rect")
                .attr("x", function (d) {
                    return (xDays(d.date) - boxWidth / 2);
                })
                .attr("y", function (d) {
                    return (yDays(d.qrt3));
                })
                .attr("height", function (d) {
                    var height = yDays(d.qrt1) - yDays(d.qrt3);
                    return (height < 1 ? 3 : height);
                })
                .attr("width", boxWidth)
                .attr("class", "bar")
                .on('mouseover', function (d) {
                    that.resetTips();
                    tipDays.show(d);
                })
                .on('mouseout', function (d) {
                    that.resetTips();
                    tipDays.hide(d);
                });

            // DAYS MEDIAN
            svg.selectAll("medianLines").data(dataDays).enter().append("line")
                .attr("x1", function (d) {
                    return (xDays(d.date) - boxWidth / 2);
                })
                .attr("x2", function (d) {
                    return (xDays(d.date) + boxWidth / 2);
                })
                .attr("y1", function (d) {
                    return (yDays(d.median));
                })
                .attr("y2", function (d) {
                    return (yDays(d.median));
                })
                .attr("stroke", function (d) {
                    return (d.qrt3 - d.qrt1 > 0 ? "#29406d" : "none");
                })
                .style("width", boxWidth)
                .on('mouseover', function (d) {
                    that.resetTips();
                    tipDays.show(d);
                })
                .on('mouseout', function (d) {
                    that.resetTips();
                    tipDays.hide(d);
                });

            // DAYS OUTLIERS
            var jitterWidth = Math.round(boxWidth / 2);
            svg.selectAll("indPoints").data(dataOutliers).enter().append("circle")
                .attr("cx", function (d) { return (xDays(d.date) - jitterWidth / 2 + Math.random() * jitterWidth); })
                .attr("cy", function (d) { return (yDays(d.days)); })
                .attr("r", 3)
                .attr("class", "point1")
                .attr("stroke", "#29406d")
                .style("fill", "white")
                .on('mouseover', function (d) {
                    that.resetTips();
                    tipOutlier.show(d);
                })
                .on('mouseout', function (d) {
                    that.resetTips();
                    tipOutlier.hide(d);
                });

            // COUNT VALUE
            var valueline = d3.line()
                .x(function (d) {
                    return xDays(d.date);
                })
                .y(function (d, currentIndex) {
                    var partialTotal = 0;
                    for (var index = 0; index <= currentIndex; index++) {
                        partialTotal = partialTotal + dataCount[index].count;
                    }
                    return yCount(partialTotal);
                });

            // COUNT LINE
            svg.append("path").data([dataCount])
                .attr("class", "line")
                .style("stroke", "steelblue")
                .attr("d", valueline);

            // COUNT POINT
            var points2 = svg.selectAll("circle.point2").data(dataCount);
            points2.enter().append("circle").merge(points2)
                .attr("class", "point1")
                .style("stroke", "steelblue")
                .style("fill", "steelblue")
                .attr("cx", function (d) {
                    return xDays(d.date);
                })
                .attr("cy", function (d, currentIndex) {
                    var partialTotal = 0;
                    for (var index = 0; index <= currentIndex; index++) {
                        partialTotal = partialTotal + dataCount[index].count;
                    }
                    var part;
                    return yCount(partialTotal);
                })
                .attr("r", 5)
                .on('mouseover', function (d, i) {
                    that.resetTips();
                    tipCount.show(d, i);
                })
                .on('mouseout', function (d, i) {
                    that.resetTips();
                    tipCount.hide(d, i);
                });
        }

    });
}(xtens, xtens.module("dashboard")));
