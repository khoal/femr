/*
 *
 *  Grouped Bar Graph
 *
 */

var groupedBarGraphModule = (function(){

    buildSampleGraph = function(){

        /*
         var sample_data = [
         {Gender: ["Male","Female"]},
         {"0-10": [10,20]},
         {"11-20": [30,40]},
         {"21-30": [25,34]},
         {"31-40": [55,10]},
         {"41-50": [23,43]},
         {"51-60": [74,30]}
         ];
         */

        //var ageNames = ["Male","Female"];

        //var fake_csv = "Gender,Male,Female\n CA,2704659,4499890,2159981,3853788,10604510,8819342,4114496\nTX,2027307,3277946,1420518,2454721,7017731,5656528,2472223\nNY,1208495,2141490,1058031,1999120,5355235,5120254,2607672\nFL,1140516,1938695,925060,1607297,4782119,4746856,3187797\nIL,894368,1558919,725973,1311479,3596343,3239173,1575308\nPA,737462,1345341,679201,1203944,3157759,3414001,1910571";

        // remove any previous graph
        d3.selectAll("svg > *").remove();

        var margin = {top: 20, right: 30, bottom: 50, left: 60};

        // keep 3/2 width/height ratio
        var aspectRatio = 5/2.5;
        var containerWidth = $(".main").width();
        var containerHeight = containerWidth / aspectRatio;

        // Calculate height/width taking margin into account
        var graphWidth = containerWidth - margin.right - margin.left;
        var graphHeight = containerHeight - margin.top - margin.bottom;

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, graphWidth], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([graphHeight, 0]);

        var color = d3.scale.ordinal().range(["#629BF7", "#F49AB5"]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Patients:</strong> <span>" + d.value + "</span>";
            });

        var svg = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        d3.csv("/research/grouped/", function(error, data) {

            console.log(data);

            var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Gender"; });

            data.forEach(function(d) {
                d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
            });

            x0.domain(data.map(function(d) { return d.Gender; }));
            x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
            y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + graphHeight + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Number of Patients");

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x0(d.Gender) + ",0)"; });

            state.selectAll("rect")
                .data(function(d) { return d.ages; })
                .enter().append("rect")
                .attr("width", x1.rangeBand())
                .attr("x", function(d) { return x1(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return graphHeight - y(d.value); })
                .style("fill", function(d) { return color(d.name); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            var legend = svg.selectAll(".legend")
                .data(ageNames.slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", graphWidth - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", graphWidth - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

        });

        /*
         var x0 = d3.scale.ordinal()
         .rangeRoundBands([0, width], .1)
         .domain(data.map(function(d){ return d.State; }));

         var x1 = d3.scale.ordinal();

         var y = d3.scale.linear()
         .range([height, 0]);

         var color = d3.scale.ordinal()
         .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

         var xAxis = d3.svg.axis()
         .scale(x0)
         .orient("bottom");

         var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left")
         .tickFormat(d3.format(".2s"));


         //Create SVG element
         var chart = d3.select(".chart")
         .attr("width", containerWidth)
         .attr("height", containerHeight)
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


         // Add a group for each row of data
         var groups = chart.selectAll("g")
         .data(stackedData)
         .enter()
         .append("g")
         .style("fill", function(d, i) {
         return colors(i);
         });

         // Add a rect for each data value
         var rects = groups.selectAll("rect")
         .data(function(d) { return d; })
         .enter()
         .append("rect")
         .attr("x", function(d, i) {
         return xScale(i);
         })
         .attr("y", function(d) {
         //return  (yScale(d.y0) + yScale(d.y) );
         return -1 * (graphHeight - yScale(d.y0) - yScale(d.y));
         })
         .attr("height", function(d) {
         //return graphHeight - yScale(d.y);
         return graphHeight - yScale(d.y);
         })
         .attr("width", xScale.rangeBand());

         chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + graphHeight + ")")
         .call(xAxis)
         .append("text")
         .attr("class", "title")
         .attr("x", graphWidth / 2 )
         .attr("y",  0 + margin.bottom)
         .style("text-anchor", "middle")
         .attr("dy", "-5px")
         .text("Age Ranges");

         chart.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("class", "title")
         .attr("transform", "rotate(-90)")
         .attr("y", 0 - margin.left)
         .attr("x", 0 - (graphHeight / 2))
         .attr("dy", "1.25em")
         .style("text-anchor", "middle")
         .text("Number of Patients");

         */

    };

    var xAxisTitle = "";
    var measurementUnits = "";
    var graph_data = [];
    var grouped_data = {};
    var mainKeys = [];
    var innerKeys = [];
    var tickValues = [];

    var publicObject = {};
    publicObject.setGraphData = function(jsonData, xTitle, unitOfMeasurement){


        // reset possible previous graphs
        tickValues = [];
        graph_data = [];
        grouped_data = {};
        mainKeys = [];
        innerKeys = [];
        xAxisTitle = xTitle;
        measurementUnits = unitOfMeasurement;

        // Group and count the individual patients
        var maxVal = Number.MIN_VALUE;
        var minVal = Number.MAX_VALUE;

        var localGraphData1 = [];
        var localGraphData2 = [];
        if( jsonData.graphData.length > 1 ){

            localGraphData1 = jsonData.graphData[0];
            localGraphData2 = jsonData.graphData[1];

            // bail out of the dataset sizes aren't the same
            //if( localGraphData1.length != localGraphData2.length )return;
        }

        //console.log(jsonData);

        for(var i = 0; i < localGraphData1.length; i++) {

            var data1Obj = localGraphData1[i];
            var data1Key = "";
            if (filterMenuModule.getPrimaryDataset() == "gender") {

                //console.log(obj.dataSet);
                if (data1Obj.dataSet == 0) {
                    data1Key = "Male";
                }
                else if (data1Obj.dataSet == 1) {
                    data1Key = "Female";
                }
                else {
                    data1Key = "Unknown";
                }

            }
            else {

                // Keep track of min/max to build scale values
                if (data1Obj.dataSet > maxVal) {
                    maxVal = data1Obj.dataSet;
                }
                if (data1Obj.dataSet < minVal) {
                    minVal = data1Obj.dataSet;
                }
                data1Key = data1Obj.dataSet;
            }


            var data2Obj = localGraphData2[i];

            var data2Key = '';
            if (filterMenuModule.getSecondaryDataset() == "gender") {

                //console.log(obj.dataSet);
                if (data2Obj.dataSet == 0) {
                    data2Key = "Male";
                }
                else if (data2Obj.dataSet == 1) {
                    data2Key = "Female";
                }
                else {
                    data2Key = "Unknown";
                }

            }
            else {

                data2Key = data2Obj.dataSet;
            }

            // keep track of inner keys
            innerKeys.pushIfNotExist(data2Key, function(e) {
                return e === data2Key;
            });

            if (!grouped_data[data1Key]) {
                grouped_data[data1Key] = {};

                // add keys as they are needed - used for x-axis
                mainKeys[i] = data1Key;
            }
            if (!grouped_data[data1Key][data2Key]) {
                grouped_data[data1Key][data2Key] = 0;
            }
            grouped_data[data1Key][data2Key] += 1;

        }

        //console.log(grouped_data);

        // tickValues
        // max at 20 ticks
        //*
        mainKeys = Object.keys(grouped_data);
        if( mainKeys.length > 20 ){
            for( var i = minVal; i <= maxVal; i++ ){
                if( i % 5 == 0 ){
                    tickValues.push(i);
                }
            }
        }
        //*/

        var i = 0;
        $.each(grouped_data, function (key, obj) {

            graph_data[i] = {

                name: key
            };
            $.each(innerKeys, function (key2, innerKey) {

                var obj2 = 0;
                if(obj[innerKey]){

                    obj2 = obj[innerKey];
                }

                graph_data[i][innerKey] = obj2;

            });
            i++;
        });

        /*
        for( var i = 0; i < jsonData.length; i++ )
        {
            var j = 0;
            graph_data[i] = [];
            var secondaryData = jsonData[i];
            $.each(secondaryData, function (key, obj) {
                graph_data[i][j] = {
                    name: obj.key,
                    x: j,
                    y: obj.value
                };
                j++;
            });
        }
        */

    };
    publicObject.buildGraph = function(){

        d3.selectAll("svg > *").remove();

        var margin = {top: 20, right: 30, bottom: 50, left: 60};

        // keep 3/2 width/height ratio
        var aspectRatio = 5/2.5;
        var containerWidth = $(".main").width();
        var containerHeight = containerWidth / aspectRatio;

        // Calculate height/width taking margin into account
        var graphWidth = containerWidth - margin.right - margin.left;
        var graphHeight = containerHeight - margin.top - margin.bottom;

        //Easy colors accessible via a 20-step ordinal scale
        var colors = d3.scale.category20();

        // get possible colors from keys in first element
        colors.domain(d3.keys(graph_data[0]).filter(function(key) {
            return key !== "name" && key != "groups";
        }));

        var secondaryKeys = d3.keys(graph_data[0]).filter(function(key) {
            return key !== "name" && key != "groups";
        });

        graph_data.forEach(function(d) {
            d.groups = secondaryKeys.map(function(name) { return {name: name, value: +d[name]}; });
        });

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, graphWidth], .1)
            .domain(graph_data.map(function(d) { return d.name; }));

        var x1 = d3.scale.ordinal()
            .domain(secondaryKeys).rangeRoundBands([0, x0.rangeBand()]);

        var y = d3.scale.linear()
            .range([graphHeight, 0])
            .domain([0, d3.max(graph_data, function(d) {
                return d3.max(d.groups, function(d) {
                    return d.value;
                });
            })]);


        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        if( tickValues.length > 0 ){

            xAxis.tickValues(tickValues)
        }

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Patients:</strong> <span>" + d.value + "</span>";
            });

        var svg = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + graphHeight + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "title")
            .attr("x", graphWidth / 2 )
            .attr("y",  0 + margin.bottom)
            .style("text-anchor", "middle")
            .attr("dy", "-5px")
            .text(xAxisTitle);;

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "title")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (graphHeight / 2))
            .attr("dy", "1.25em")
            .style("text-anchor", "middle")
            .text("Number of Patients");

        var bar = svg.selectAll(".bar")
            .data(graph_data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.name) + ",0)"; });

        bar.selectAll("rect")
            .data(function(d) { return d.groups; })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.name); })
            .attr("y", function(d) {
                console.log(d);
                return y(d.value);
            })
            .attr("height", function(d) {
                console.log(d);
                return graphHeight - y(d.value);
            })
            .style("fill", function(d) { return colors(d.name); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var legend = svg.selectAll(".legend")
            .data(secondaryKeys.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", graphWidth - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colors);

        legend.append("text")
            .attr("x", graphWidth - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

    };

    return publicObject;

})();

