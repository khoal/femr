jQuery(document ).ready(function(){

    drawBarGraph();

    // Detect changes in main container width, redraw chart
    // -- How will this perform with lots of data and on mobile devices
    var lastChartWidth = $(".main").width();
    $(window).on("resize", function() {
        var currChartWidth = $(".main").width();
        if( lastChartWidth != currChartWidth ){

            drawBarGraph();
            lastChartWidth = currChartWidth;
        }


    }).trigger("resize");

    d3.select("#save").on("click", function(){

        saveSvgAsPng(document.getElementById("graph"), "diagram.png", 1);

    });

    /* Save to PNG Testing * /
    d3.select("#save").on("click", function(){
        var html = d3.select("svg")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

    //console.log(html);
        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
        var img = '<img src="'+imgsrc+'">';
        d3.select("#svgdataurl").html(img);


        var canvas = document.querySelector("canvas"),
            context = canvas.getContext("2d");

        var image = new Image;
        image.src = imgsrc;
        image.onload = function() {
            context.drawImage(image, 0, 0);

            var canvasdata = canvas.toDataURL("image/png");

            var pngimg = '<img src="'+canvasdata+'">';
            d3.select("#pngdataurl").html(pngimg);

            var a = document.createElement("a");
            a.download = "sample.png";
            a.href = canvasdata;
            a.click();
        };

    });
    */

});

function drawBarGraph(){

    // remove any previous graph
    d3.selectAll("svg > *").remove();

    var margin = {top: 20, right: 30, bottom: 50, left: 80};

    // keep 3/2 width/height ratio
    var aspectRatio = 5/3;
    var width = $(".main").width();
    var height = width / aspectRatio;

    // Calculate height/width taking margin into account
    width = width - margin.right - margin.left;
    height = height - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var chartWidth = width + margin.left + margin.right;
    var chartHeight = height + margin.top + margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .style('fill', 'steelblue')
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand());

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", "-5em")
        .style('font', '10px sans-serif')
        .text("Frequency");

}


function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}