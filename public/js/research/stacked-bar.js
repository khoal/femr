/*
 *
 *  Bar Graph
 *
 */

function getStackedBarGraphData(){

    graphData = [];

    // on page load, grab default data and load graph type
    $.getJSON("/research/age/stacked", function (jsonData) {

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

            //console.log(jsonGraphData);

            for( i = 0; i < jsonGraphData.length; i++ )
            {
                var j = 0;
                graphData[i] = [];
                genderGraphData = jsonGraphData[i];
                $.each(genderGraphData, function (key, obj) {
                    graphData[i][j] = {
                        name: obj.key,
                        x: j,
                        y: obj.value
                    };
                    j++;
                });
            }
        }

        //console.log(graphData);

        hideGraphLoadingIcon();

        // trigger draw graph
        drawStackedBarGraph(graphData);
    });

    //return graphData;
}

function drawStackedBarGraph(graphData){


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

    var stack = d3.layout.stack(); //.values( function(d){ return d.value; });
    var stackedData = stack(graphData);

    console.log(stackedData);

    //Set up scales
    var xScale = d3.scale.ordinal()
        .domain(d3.range(stackedData[0].length))
        //.domain(stackedData[0].map(function(d) { return d.name; }))
        .rangeRoundBands([0, graphWidth], 0.15);

    var yScale = d3.scale.linear()
        .domain([0,
            d3.max(stackedData, function(d) {
                return d3.max(d, function(d) {
                    return d.y0 + d.y;
                });
            })
        ])
        .range([graphHeight, 0]);
        //.range([0, graphHeight]);

    //Easy colors accessible via a 10-step ordinal scale
    //var colors = d3.scale.category10();
    var colors = d3.scale.ordinal().range(["#629BF7", "#F49AB5"]);

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

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

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


    /*
    //Set up scales
    var xScale = d3.scale.ordinal()
        .domain(d3.range(stackedData[0].length))
        //.map(function(d) { return d.name; })
        //.domain(stackedData.map(function(d, i) { return d.name; }))
        .rangeRoundBands([0, graphWidth], 0.15);

    var yScale = d3.scale.linear()
        .domain([0,
            d3.max(stackedData, function(d) {
                return d3.max(d, function(d) {
                    return d.y0 + d.y;
                });
            })
        ])
        .range([graphHeight, 0]);



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
        .attr("y", function(d,i) {
            return yScale(d.y0);
        })
        .attr("height", function(d) {
            return yScale(d.y);
        })
        .attr("width", xScale.rangeBand());
    */
    /*
    var bar = chart.selectAll(".bar")
        .data(stack(graphData))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.name); })
        .attr("y", function(d) { return yScale(d.value); })
        .attr("height", function(d) { return graphHeight - yScale(d.value); })
        .attr("width", xScale.rangeBand());

    bar.selectAll("rect")
        .data(function(d) { return d.value; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });
       */
}
