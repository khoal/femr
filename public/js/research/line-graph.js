
/*
 *
 *  Line Graph
 *
 */

var lineGraphModule = (function(){

    var xAxisTitle = "";
    var measurementUnits = "";
    var graph_data = [];
    var grouped_data = {};

    var publicObject = {};
    publicObject.setGraphData = function(jsonData, xTitle, unitOfMeasurement){

        // reset possible previous graphs
        graph_data = [];
        grouped_data = {};
        xAxisTitle = xTitle;
        measurementUnits = unitOfMeasurement;

        //console.log(jsonData);

        // Group and count the individual patients
        var maxVal = Number.MIN_VALUE;
        var minVal = Number.MAX_VALUE;
        $.each(jsonData.graphData, function (key, obj) {

            var keyStr = "";

            // Keep track of min/max to build scale values
            if( obj.dataSet > maxVal){
                maxVal = obj.dataSet;
            }
            if( obj.dataSet < minVal){
                minVal = obj.dataSet;
            }
            keyStr = obj.dataSet;

            if( !grouped_data[keyStr] ){
                grouped_data[keyStr] = {
                    name: keyStr,
                    value: 0
                };
            }
            grouped_data[keyStr].value += 1;
        });

        console.log(grouped_data);

        //for( var i = 0; i < grouped_data.length; i++ ){
        var i = 0;
        $.each(grouped_data, function (key, obj) {
            graph_data[i] = {
                name: key,
                value: obj.value
            };
            i++;
        });

        console.log(graph_data);
    };

    publicObject.buildGraph = function(){

        // remove any previous graph
        d3.selectAll("svg > *").remove();

        var margin = {top: 20, right: 30, bottom: 50, left: 60};

        // keep 3/2 width/height ratio
        var aspectRatio = 5/3;
        var containerWidth = $(".main").width();
        var containerHeight = containerWidth / aspectRatio;

        // Calculate height/width taking margin into account
        var graphWidth = containerWidth - margin.right - margin.left;
        var graphHeight = containerHeight - margin.top - margin.bottom;


        var xScale = d3.scale.linear()
            .domain(d3.extent(graph_data, function(d) { return parseInt(d.name); }))
            //.nice()
            .range([0, graphWidth]);

        var yScale = d3.scale.linear()
            //.domain(d3.extent(graph_data, function(d) { return d.value; }))
            .domain([0, d3.max(graph_data, function(d) { return d.value; })])
            .range([graphHeight, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return xScale(d.name); })
            .y(function(d) { return yScale(d.value); });

        var chart = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

        chart.append("path")
            .datum(graph_data)
            .attr("class", "line")
            .attr("d", line);

        var focus = chart.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        chart.append("rect")
            .attr("class", "overlay")
            .attr("width", graphWidth)
            .attr("height", graphHeight)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        var bisectValue = d3.bisector(function(d){ return d.name; }).left;

        function mousemove() {

            var x0 = xScale.invert(d3.mouse(this)[0]),
                i = bisectValue(graph_data, x0, 1),
                d0 = graph_data[i - 1],
                d1 = graph_data[i],
                d = x0 - d0.value > d1.value - x0 ? d1 : d0;

            focus.attr("transform", "translate(" + xScale(d.name) + "," + yScale(d.value) + ")");
            focus.select("text").text(d.name+" "+measurementUnits+": "+ d.value+" patients");
        }
    };

    return publicObject;

})();


