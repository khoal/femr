

/*
 *
 *  Scatter Graph
 *
 */

function getScatterGraphData(){

    graphData = [];

    // on page load, grab default data and load graph type
    $.getJSON("/research/age/scatter", function (jsonData) {

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

            jsonGraphData = jQuery.parseJSON(jsonData.graphData);
            //console.log(jsonGraphData);

            //var i = 0;
            //$.each(jsonData.graphData, function (key, obj) {
            for( i = 0; i < jsonGraphData.length; i++ ){

                graphData[i] = {
                    name: i,
                    value: jsonGraphData[i]
                }
                //i++;
            }

            //console.log(graphData);
        }

        hideGraphLoadingIcon();

        // trigger draw graph
        drawScatterGraph(graphData);
    });

    //return graphData;
}


function drawScatterGraph(graphData){

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
        .domain([d3.min(graphData, function(d) { return d.name; })-1, d3.max(graphData, function(d) { return d.name; })+1])
        .range([0, graphWidth]);

    var yScale = d3.scale.linear()
        .domain([d3.min(graphData, function(d) { return d.value; }), d3.max(graphData, function(d) { return d.value; })+1])
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
        .text("Ages");

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
        .data(graphData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d){ return xScale(d.name)})
        .attr("cy", function(d){ return yScale(d.value)});
        //.style("fill", function(d) { return color(cValue(d));})
        /*
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
                + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
        */
}