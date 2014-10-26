var allowedGraphValues = (function(){

    var allowedValues = {

        age: {
            graphTypes: ['bar','line','pie','scatter','table'],
            secondaryData: ['gender', 'pregnancy_status']
        },
        gender: {
            graphTypes: ['bar','pie', 'table'],
            secondaryData: []
        },
        pregnancy_status: {
            graphTypes: ['bar','line','pie','scatter','table'],
                secondaryData: ['gender', 'pregnancy']
        },
        pregnancy_time: {
            graphTypes: ['bar','line','pie','scatter','table'],
            secondaryData: ['gender', 'pregnancy']
        },
        height: {
            graphTypes: ['bar','line','scatter','table'],
            secondaryData: ['gender']
        },
        weight: {
            graphTypes: ['bar','line','pie', 'scatter','table'],
            secondaryData: ['gender']
        },
        dispensed_meds: {
            graphTypes: ['bar','pie','table'],
            secondaryData: []
        },
        prescribed_meds: {
            graphTypes: ['bar','pie','table'],
            secondaryData: []
        },
        blood_pressure: {
            graphTypes: ['line','scatter','chart'],
            secondaryData: []
        },
        temp: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: ['age','gender']
        },
        oxy_sat: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        },
        heart_rate: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        },
        resp: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        },
        glucose: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        }


    };

    var publicObject = {};
    publicObject.isGraphTypeAllowed = function(dataset, graphType){

        if( allowedValues[dataset] != undefined ){
            var found = false;
            allowedValues[dataset].graphTypes.forEach(function(val){
                if( val === graphType ){

                    found = true;
                    return;
                }
            });
            return found;
        }
    };
    publicObject.isSecondaryDataAllowed = function(dataset, secondaryData){

        if( allowedValues[dataset] != undefined ){

            var found = false;
            allowedValues[dataset].secondaryData.forEach(function(val){
                if( val === secondaryData ){

                    found = true;
                    return;
                }
            });
            return found;
        }
    };
    return publicObject;

})();

var filterMenuModule = (function(){

    var activeSubMenu = null;
    var filterValues = {

        dataset1: null,
        dataset2: null,
        graphType: null,
        startDate: null,
        endDate: null
    };

    var filterFields = {

        dataset1: $("#gDataset1"),
        dataset2: $("#gDataset2"),
        graphType: $("#gType"),
        startDate: $("#gStartDate"),
        endDate: $("#gEndDate")
    };

    var filterMenus = {

        dataset1: $("#gdata1-menu"),
        dataset2: $("#gdata2-menu"),
        graphType: $("#gtype-menu"),
        filter: $("#gfilter-menu")
    };


    var closeSubMenu = function(){

        if( activeSubMenu == null ) return;

        $(activeSubMenu).removeClass("active");
        $(activeSubMenu).children("ul.submenu").hide();

        activeSubMenu = null;
    };

    var openSubMenu = function(){

        if( activeSubMenu == null ) return;

        // reset any previously shown menu
        $(".menu-item").find("ul.submenu").hide();
        $(".menu-item").removeClass("active");

        $(activeSubMenu).addClass("active");
        $(activeSubMenu).children("ul.submenu").show();
    };

    var clearGraphOptions = function(){

        $(filterMenus.dataset1).find(".val").text("");
        $(filterMenus.dataset2).find(".val").text("");
        $(filterMenus.graphType).find(".val").text("");
        $(filterMenus.filter).find(".val").text("");
    }

    var chooseDataSet1 = function(){

        filterValues.dataset1 = $(this).data("dtype1");
        $(filterMenus.dataset1).find(".val").text($(this).text());
        $(filterFields.dataset1).val(filterValues.dataset1);

        // Disable Secondary Data as needed
        $(filterMenus.dataset2).find(".submenu").find("a").each(function(){
            if( !allowedGraphValues.isSecondaryDataAllowed(filterValues.dataset1, $(this).data("dtype2")) ){
                 $(this).addClass('disabled');
            }
            else{
                $(this).removeClass('disabled');
            }
        });

        // Disable Graph Types as needed
        $(filterMenus.graphType).find(".submenu").find("a").each(function(){
            if( !allowedGraphValues.isGraphTypeAllowed(filterValues.dataset1, $(this).data("gtype")) ){
                $(this).addClass('disabled');
            }
            else{
                $(this).removeClass('disabled');
            }
        });

        closeSubMenu();
        return false;
    };

    var chooseDataSet2 = function(){

        // do nothing for disabled secondary types
        if( $(this).hasClass('disabled') ) return false;

        filterValues.dataset2 = $(this).data("dtype1");
        $(filterMenus.dataset2).find(".val").text($(this).text());
        $(filterFields.dataset2).val(filterValues.dataset2);

        closeSubMenu();
        return false;
    };

    var chooseGraphType = function(){

        filterValues.graphType = $(this).data("gtype");
        $(filterMenus.graphType).find(".val").text($(this).text());
        $(filterFields.graphType).val(filterValues.graphType);

        closeSubMenu();
        return false;
    };

    var optionLinkClick = function(){

        activeSubMenu = $(this).parent(".menu-item");
        if( $(activeSubMenu).hasClass("active") ) {
            closeSubMenu();
        }
        else{
            openSubMenu();
        }
        return false;
    };

    var publicObject = {};
    publicObject.init = function() {

        // Register Actions
        $(".menu-item").find("a.opt-link").click(optionLinkClick);
        $(filterMenus.dataset1).find(".submenu").find("a").click(chooseDataSet1);
        $(filterMenus.dataset2).find(".submenu").find("a").click(chooseDataSet2);
        $(filterMenus.graphType).find(".submenu").find("a").click(chooseGraphType);

        $("#clear-button").click(clearGraphOptions);
    };

    return publicObject;

})();

jQuery(document ).ready(function(){

    filterMenuModule.init();


    var graphType = $("#graph-type").val();

    loadGraph(graphType);

    /* Button Clicks
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
     */

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
            drawStackedBarGraph(graphData);
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