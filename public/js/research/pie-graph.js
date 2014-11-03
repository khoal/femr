/*
 *
 *
  *  Pie Graph
 *
 */

var pieGraphModule = (function(){

    var graph_data = [];

    var publicObject = {};
    publicObject.setGraphData = function(jsonData){

        graph_data = [];

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

        // keep 3/2 width/height ratio on container
        var aspectRatio = 5/2.5;
        var containerWidth = $(".main").width();
        var containerHeight = containerWidth / aspectRatio;

        // Calculate height/width taking margin into account
        var graphWidth = containerWidth - margin.right - margin.left;
        var graphHeight = containerHeight - margin.top - margin.bottom;

        var pieWidth = graphHeight;
        var pieHeight = graphHeight;
        var outerRadius = pieWidth / 2; var innerRadius = 0;
        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var pie = d3.layout.pie()
            .value(function(d){ return d.value; } );
        var color = d3.scale.category20();

        var chart = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Set up groups
        var arcs = chart.selectAll("g.arc")
            .data(pie(graph_data))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

        arcs.append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("data-legend", function(d, i){ return graph_data[i].name; })
            .attr("d", arc);

        var legendLeft = pieWidth + margin.left;
        var legend = chart.append("g")
            .attr("class", "legend")
            .attr("width", outerRadius * 2)
            .attr("height", outerRadius * 2)
            .selectAll("g")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + legendLeft + "," + i * 20 + ")"; });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function(d,i) { return graph_data[i].name; });

    };

    return publicObject;

})();