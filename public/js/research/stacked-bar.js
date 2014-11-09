/*
 *
 *  Stacked Bar Graph
 *
 */

Array.prototype.inArray = function(comparer) {
    for(var i=0; i < this.length; i++) {
        if(comparer(this[i])) return true;
    }
    return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};


var stackedBarGraphModule = (function(){

    var xAxisTitle = "";
    var measurementUnits = "";
    var graph_data = [];
    var grouped_data = {};
    var mainKeys = [];
    var innerKeys = [];
    var tickValues = [];

    var publicObject = {};

    var GroupedDataType = function(name, x, y) {
        return {
            name: name,
            x: x,
            y: y
        };
    };

    publicObject.setGraphData = function(jsonData, xTitle, unitOfMeasurement){

        // reset possible previous graphs
        tickValues = [];
        graph_data = [];
        grouped_data = {};
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

        console.log(grouped_data);

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

        console.log(graph_data);

        /*
        var i = 0;
        //$(grouped_data).each(function(key, obj){
        $.each(innerKeys, function (key2, innerKey) {

            var j = 0;
            graph_data[i] = [];
            //$(innerKeys).each(function(key2, innerKey){
            $.each(grouped_data, function (key, obj) {

                var obj2 = 0;
                if(obj[innerKey]){

                    obj2 = obj[innerKey];
                }

                graph_data[i][j] = {
                    name: key,
                    x: j,
                    y: obj2
                };
                j++;
            });
            i++;
        });
        */

        //console.log(graph_data);

        //console.log(grouped_data);


        /*
        for( var i = 0; i < jsonData.length; i++ )
        {
            var j = 0;
            graph_data[i] = [];
            var secondaryData = jsonData[i];
            $.each(secondaryData, function (key, obj) {
                graph_data[i][j] = {
                    name: key,
                    x: j,
                    y: obj.value
                };
                j++;
            });
        }
        /*/
    };

    publicObject.buildGraph = function(){

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

        /*
         var xScale = d3.scale.ordinal()
         .domain(graphData.map(function(d) { return d.name; }))
         .rangeRoundBands([0, graphWidth], .15);
         var yScale = d3.scale.linear()
         .domain([0, d3.max(graphData, function(d) { return d.value; })])
         .rangeRound([graphHeight, 0]);
         */

        //Easy colors accessible via a 20-step ordinal scale
        var colors = d3.scale.category20();

        // get possible colors from keys in first element
        colors.domain(d3.keys(graph_data[0]).filter(function(key) { return key !== "name"; }));

        graph_data.forEach(function(d) {
            var y0 = 0;
            d.groups = colors.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.total = d.groups[d.groups.length - 1].y1;
        });


        //Set up scales
        var xScale = d3.scale.ordinal()
            .domain(graph_data.map(function(d) { return d.name; }))
            .rangeRoundBands([0, graphWidth], 0.15);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(graph_data, function(d) { return d.total; })])
            .range([graphHeight, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        if( tickValues.length > 0 ){

            xAxis.tickValues(tickValues)
        }

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Patients ("+ d.name+"):</strong> <span>" + d.y1 + "</span>";
            });


        //Create SVG element
        var chart = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.call(tip);

        /*
        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + graphHeight + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");
        */
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
            .text(xAxisTitle);

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

        var state = chart.selectAll(".bar")
            .data(graph_data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + xScale(d.name) + ",0)"; });

        state.selectAll("rect")
            .data(function(d) { return d.groups; })
            .enter().append("rect")
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.y1); })
            .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
            .style("fill", function(d) { return colors(d.name); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);;

        var legend = chart.selectAll(".legend")
            .data(colors.domain().slice().reverse())
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




        // Add a group for each row of data
        /*
        var groups = chart.selectAll("g")
            .data(graph_data)
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
            .attr("width", xScale.rangeBand())
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);



        */
        /*
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
        */
    };

    return publicObject;

})();