/*
 *
 *  Bar Graph
 *
 */

var barGraphModule = (function(){

    var graph_data = [];

    var publicObject = {};
    publicObject.setGraphData = function(jsonData){

        var i = 0;
        $.each(jsonData, function (key, obj) {
            graph_data[i] = {
                name: obj.key,
                value: obj.value
            };
            i++;
        });

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

        var xScale = d3.scale.ordinal()
            .domain(graph_data.map(function(d) { return d.name; }))
            .rangeRoundBands([0, graphWidth], .15);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(graph_data, function(d) { return d.value; })])
            .range([graphHeight, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

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

        chart.selectAll(".bar")
            .data(graph_data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.name); })
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) { return graphHeight - yScale(d.value); })
            .attr("width", xScale.rangeBand());
    };

    return publicObject;

})();