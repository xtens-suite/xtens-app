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

        initialize: function (options) {
            $('#main').html(this.el);
            this.DataTypesCount = options.DataTypes;
            this.DataTypes = options.DataTypeSource;
            this.SamplesCount = options.Samples;
            this.DataCount = options.Data;
            this.dataTypesModelsColors = {
                "Data": "#DB222A", // "#FB3640",//#FF4B3E",
                "Subject": "#0066AA", // green-yellow #baff29
                "Sample": "#0F4C00" // "#1E3F20" //"#44633F"
            };
            this.template = JST["views/templates/dashboard-home.ejs"];
            this.render();
        },

        render: function () {
            var that = this;

            _.forEach(["Subject", "Sample", "Data"], function (model) {
                that.$el.append('<div class="row ' + model + '" >');
                that.renderChartsByModel(model);
            });
            return this;
        },
        renderChartsByModel: function (model) {
            var pieData; var title; var colors; var writeTag = false;
            switch (model) {
                case "Subject":
                    pieData = this.DataTypesCount;
                    title = "DataTypes_Pie";
                    colors = this.dataTypesModelsColors;
                    writeTag = true;
                    break;
                case "Sample":
                    pieData = this.SamplesCount;
                    title = "Samples_Pie";
                    break;
                case "Data":
                    pieData = this.DataCount;
                    title = "Data_Pie";
                    break;
                default:
                    break;
            }
            var viewName = "PieChart" + model;
            this[viewName] = new DashBoard.Views.PieChart({
                data: pieData,
                title: title,
                model: model,
                colors: colors
            });

            $("." + model, this.$el).append(this[viewName].render().el);
            this[viewName].createGraph(writeTag);

            viewName = "BarGraph" + model;
            var filteredDts = this.DataTypes.filter(function (d) {
                return d.model === model;
            });
            this[viewName] = new DashBoard.Views.BarChart({
                DataTypes: filteredDts,
                model: model,
                title: "Time_" + model
            });
            $("." + model, this.$el).append(this[viewName].render().el);
        }
    });

    DashBoard.Views.PieChart = Backbone.View.extend({

        tagName: 'div',
        className: 'dashboard-pie-chart col-md-6 col-sm-12',
        attributes: function () {
            var style = 'border: 3px solid #29406d; ' +
                'text-align: center; ' +
                // 'margin: 1vh; ' +
                'border-radius: 2vh; ' +
                'min-height: 437px; ' +
                'padding: 0px;';
            return {
                'style': style
            };
        },
        events: {
            // 'click #graph':'createGraph'
        },

        initialize: function (options) {
            this.data = options.data;
            this.title = options.title;
            this.model = options.model;
            this.colors = options.colors;
            // $('.dashboard-cnt').append(this.el);
            this.template = JST["views/templates/dashboard-graph.ejs"];
            // this.render();
        },

        render: function () {
            this.$el.html(this.template({
                __: i18n,
                title: this.title
            })); //, dataTypes : dataTypes.models}));
            this.$el.addClass(this.title);
            return this;
        },

        createGraph: function () {
            var that = this;
            var data = this.data;
            var totalData = this.data.reduce((s, f) => {
                return s + parseInt(f.value); // return the sum of the accumulator and the current time, as the the new accumulator
            }, 0);

            var width = 500;
            var height = 280;
            var radius = Math.min(width, height) / 2;
            var colorLength = data.length < 9 ? data.length : 9;
            var color = this.colors ? d3.scaleOrdinal().range(_.values(this.colors))
                : this.model === "Sample" ? d3.scaleOrdinal(d3.schemeGreens[colorLength])
                    : d3.scaleOrdinal().range(data.length < 9 ? d3.schemeReds[colorLength] : d3.schemeCategory10);

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

            var svg = d3.select("." + this.title).append("svg")
                .attr("width", width)
                .attr("height", height + 50)
                .style("margin-top", '5vh')
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
                    handlemouseover(this, d);
                })
                .on('mouseout', function (d) {
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
                    return "translate(-" + 230 + "," + ((i * 20) - 120) + ")";
                });

            legend.append("rect")
                .attr("x", $('.' + that.title).width() - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", $('.' + that.title).width() - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (label) {
                    return label;
                });
        }
    });

    DashBoard.Views.BarChart = Backbone.View.extend({

        tagName: 'div',
        className: 'dashboard-pie-chart col-md-6 col-sm-12',
        attributes: function () {
            var style = 'border: 3px solid #29406d; ' +
                'text-align: center; ' +
                // 'margin: 1vh; ' +
                'border-radius: 2vh; ' +
                'min-height: 437px; ' +
                'padding: 0px;';
            return {
                'style': style
            };
        },
        events: {
            'change #dt-sel': 'onChangeDataType',
            'change #field-sel': 'onChangeField',
            'change #period-sel': 'onChangePeriod'
        },

        initialize: function (options) {
            this.periods = [{
                name: "Last Year",
                value: "year"
            },
            {
                name: "All time",
                value: "allyear"
            },
            {
                name: "Current Year - " + new Date().getFullYear(),
                value: "year-" + new Date().getFullYear()
            },
            {
                name: "Last Month",
                value: "month"
            },
            {
                name: "Last Week",
                value: "week"
            }
            ];

            this.model = options.model;
            this.title = options.title;
            this.DataTypes = options.DataTypes;
            this.selectedDataType = this.DataTypes[0];
            this.selectedPeriod = "year";
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
            this.fetchData();
        },

        fetchData: function () {
            var that = this;

            $.ajax({
                url: '/' + this.model + '/getInfoForBarChart?',
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
                title: this.title,
                dataTypes: this.DataTypes,
                fields: this.dateFields,
                periods: this.periods
            }));
            this.$('#dt-sel').selectpicker();
            this.$('#field-sel').selectpicker();
            this.$('#period-sel').selectpicker();
            this.fetchData();
            this.$el.addClass(this.title);
            return this;
        },

        createGraph: function () {
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

            var totalData = this.data.reduce((s, f) => {
                return s + parseInt(f.value); // return the sum of the accumulator and the current time, as the the new accumulator
            }, 0);

            var xBar = d3.scaleBand().range([0, width - xAxisTraslation]).paddingInner(0.2).paddingOuter(0.25);
            var yBar = d3.scaleLinear().range([height, 0]);
            var xLine = d3.scalePoint().range([0, width - xAxisTraslation]).padding(0.5);
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

            var svg = d3.select("." + this.title).append("svg")
                .data(this.data)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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
                .on('mouseover', tipBar.show)
                .on('mouseout', tipBar.hide);

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
                .on('mouseover', tipPoint.show)
                .on('mouseout', tipPoint.hide);
        }
    });
}(xtens, xtens.module("dashboard")));
