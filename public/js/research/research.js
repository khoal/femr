// I do not like that this is global, but need to make it work quickly
var graphData = [];

jQuery(document ).ready(function(){

    var graphType = $("#graph-type").val();

    loadGraph(graphType);

    /* Button Clicks */
    $(".load-graph-link").click(function(){

        var newGraphType = $(this).data("gtype");

        // only load new graph on a change
        if( newGraphType != graphType ) {

            graphType = newGraphType;
            $("#graph-type").val(graphType);

            // remove any previous graph
            d3.selectAll("svg > *").remove();
            //showGraphLoadingIcon();

            $(".nav-sidebar li").removeClass("active");
            $(this).parent("li").addClass("active");

            //console.log(graphType);
            loadGraph(graphType);
        }
        return false;
    });


    // Detect changes in main container width, redraw chart
    // -- How will this perform with lots of data and on mobile devices
    var lastChartWidth = $(".main").width();
    $(window).on("resize", function() {
        var currChartWidth = $(".main").width();
        if( lastChartWidth != currChartWidth ) {

            reloadGraph(graphType);
            lastChartWidth = currChartWidth;
        }
    }).trigger("resize");

    d3.select("#save").on("click", function(){

        var graphType = $("#graph-type").val();

        saveSvgAsPng(document.getElementById("graph"), graphType + "-chart.png", 1);
    });

});

function loadGraph(graphType){

    //graphData = [];

    switch(graphType){

        case 'line':
            getLineGraphData();
            break;

        case 'scatter':
            getScatterGraphData();
            break;

        case 'pie':
            getPieGraphData();
            break;

        case 'stacked-bar':
            getStackedBarGraphData();
            break;

        case 'bar':
        default:
            getBarGraphData();
    }

    //console.log(graphData);
    //return graphData;
}

function reloadGraph(graphType){

    switch(graphType){

        case 'line':
            drawLineGraph(graphData);
            break;

        case 'scatter':
            drawScatterGraph(graphData);
            break;

        case 'pie':
            drawPieGraph(graphData);
            break;

        case 'stacked-bar':
            drawStackedBar(graphData);
            break;

        case 'bar':
        default:
            drawBarGraph(graphData);
    }
}

function showGraphLoadingIcon(){

    $(".chart-container").find(".loading").show();
}

function hideGraphLoadingIcon(){

    $(".chart-container").find(".loading").hide();
}