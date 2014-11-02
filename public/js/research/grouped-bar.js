/*
 *
 *  Grouped Bar Graph
 *
 */

var groupedBarGraphModule = (function(){

    var graph_data = [];

    var publicObject = {};
    publicObject.setGraphData = function(jsonData){

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

        $(".graph-header").hide();
        //var chart = $(".chart-container").prepend('<p style="text-align: center; margin-top: 1em;">Coming Soon</p>');
        var chart = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

        chart.append("text")
            .attr("x", containerWidth / 2)
            .attr("y", containerHeight / 2)
            .style("text-anchor", "middle")
            .text("Coming Soon...");

/*
        / *
         var xScale = d3.scale.ordinal()
         .domain(graphData.map(function(d) { return d.name; }))
         .rangeRoundBands([0, graphWidth], .15);

         var yScale = d3.scale.linear()
         .domain([0, d3.max(graphData, function(d) { return d.value; })])
         .rangeRound([graphHeight, 0]);
         * /

        var stack = d3.layout.stack(); //.values( function(d){ return d.value; });
        var stackedData = stack(graph_data);

        console.log(stackedData);

        //Set up scales
        var xScale = d3.scale.ordinal()
            .domain(d3.range(stackedData[0].length))
            //.domain(stackedData[0].map(function(d) { return d.name; }))
            .rangeRoundBands([0, graphWidth], 0.15);

        var x1 = d3.scale.ordinal()
                .domain();

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
            .orient("left")
            .tickFormat(d3.format(".2s"));

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

    return publicObject;

})();

