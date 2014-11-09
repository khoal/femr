/*
 *
 *  Scatterplot Graph
 *
 */

var scatterGraphModule = (function(){

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

        var localGraphData = [];
        if( jsonData.graphData.length > 0 ){

            //only need primaryDataset
            localGraphData = jsonData.graphData[0];
        }
        $.each(localGraphData, function (key, obj) {

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

        $("#graph").show();
        $("#table-container").hide();

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


        var xScale = d3.scale.linear()
            .domain([d3.min(graph_data, function(d) { return parseInt(d.name); })-1, d3.max(graph_data, function(d) { return parseInt(d.name); })+1])
            .range([0, graphWidth]);

        var yScale = d3.scale.linear()
            .domain([d3.min(graph_data, function(d) { return d.value; })-1, d3.max(graph_data, function(d) { return d.value; })+1])
            .range([graphHeight, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return '<span class="name">' + d.name + ' '+measurementUnits+'</span> <span class="val"><strong>Patients: </strong>' + d.value + '</span>';
            });

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

        chart.call(tip);

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

        chart.selectAll(".dot")
            .data(graph_data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4.5)
            .attr("cx", function(d){ return xScale(d.name)})
            .attr("cy", function(d){ return yScale(d.value)})
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    };

    return publicObject;

})();
