/*
 *
 *  Bar Graph
 *
 */

function getBarGraphData(){

    graphData = [];

    // on page load, grab default data and load graph type
    $.getJSON("/research/age/bar", function (jsonData) {

        // Grab Statistics
        if( "median" in jsonData ) {
            $("#median").find(".val").text(jsonData.median);
        }
        else{
            $("#median").find(".val").text("n/a");
        }

        if( "average" in jsonData ) {
            $("#average").find(".val").text(jsonData.average);
        }
        else{
            $("#average").find(".val").text("n/a");
        }

        if( ("rangeLow" in jsonData) && ("rangeHigh" in jsonData) ) {
            $("#range").find(".val").text(jsonData.rangeLow + " - " + jsonData.rangeHigh);
        }
        else{
            $("#range").find(".val").text("n/a");
        }

        // Grab graph data
        if( "graphData" in jsonData ) {

            var jsonGraphData = jQuery.parseJSON(jsonData.graphData);
            var i = 0;
            $.each(jsonGraphData, function (key, obj) {
                graphData[i] = {
                    name: obj.key,
                    value: obj.value
                };
                i++;
            });
        }

        hideGraphLoadingIcon();

        // trigger draw graph
        drawBarGraph(graphData);
    });

    //return graphData;
}

function drawBarGraph(graphData){

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
        .domain(graphData.map(function(d) { return d.name; }))
        .rangeRoundBands([0, graphWidth], .15);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(graphData, function(d) { return d.value; })])
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
        .data(graphData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.name); })
        .attr("y", function(d) { return yScale(d.value); })
        .attr("height", function(d) { return graphHeight - yScale(d.value); })
        .attr("width", xScale.rangeBand());

}
