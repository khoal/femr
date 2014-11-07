var allowedFilterValues = (function(){

    var allowedValues = {

        age: {
            graphTypes: ['bar','line','pie','scatter','table'],
            secondaryData: ['gender', 'pregnancyStatus']
        },
        gender: {
            graphTypes: ['bar','pie', 'table'],
            secondaryData: []
        },
        pregnancyStatus: {
            graphTypes: ['bar','line','pie','scatter','table'],
                secondaryData: ['gender']
        },
        pregnancyTime: {
            graphTypes: ['bar','line','pie','scatter','table'],
            secondaryData: ['gender', 'pregnancyStatus']
        },
        height: {
            graphTypes: ['bar','line','scatter','table'],
            secondaryData: ['gender']
        },
        weight: {
            graphTypes: ['bar','line','pie', 'scatter','table'],
            secondaryData: ['gender']
        },
        dispensedMeds: {
            graphTypes: ['bar','pie','table'],
            secondaryData: []
        },
        prescribedMeds: {
            graphTypes: ['bar','pie','table'],
            secondaryData: []
        },
        bloodPressure: {
            graphTypes: ['line','scatter','chart'],
            secondaryData: []
        },
        temperature: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: ['age','gender']
        },
        oxygenSaturation: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        },
        heartRate: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        },
        respiratoryRate: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        },
        glucose: {
            graphTypes: ['bar','line','scatter','chart'],
            secondaryData: []
        }
    };

    var combinableGraphs = ["stacked-bar", "grouped-bar"];

    var publicObject = {};
    publicObject.isPrimaryDataValid = function(dataset){

        if( allowedValues[dataset] != undefined ){

            return true;
        }
        else return false;
    };
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
    publicObject.isCombinableGraph = function(graphType){

        var found = false;
        combinableGraphs.forEach(function(val){

            if( val == graphType ){

                found = true;
                return;
            }
        });
        return found;
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

        dataset1: $("#primaryDataset"),
        dataset2: $("#secondaryDataset"),
        graphType: $("#graphType"),
        startDate: $("#startDate"),
        endDate: $("#endDate")
    };

    var filterMenus = {
        errors: $("#filter-errors"),
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
        $(".menu-item").removeClass("active").find("ul.submenu").hide();

        $(activeSubMenu).addClass("active");
        $(activeSubMenu).children("ul.submenu").show();
    };

    var clearGraphOptions = function(){

        // Clear Values
        filterValues.dataset1 = null;
        filterValues.dataset2 = null;
        filterValues.graphType = null;
        filterValues.startDate = null;
        filterValues.endDate = null;

        // Clear Form Fields
        $(filterFields.dataset1).val('');
        $(filterFields.dataset2).val('');
        $(filterFields.graphType).val('');

        // Set Date to previous month
        $(filterFields.startDate).val('');
        $(filterFields.endDate).val('');

        // Clear Visual Fields
        $(filterMenus.dataset1).find(".val").text("");
        $(filterMenus.dataset2).find(".val").text("");
        $(filterMenus.graphType).find(".val").text("");
        $(filterMenus.filter).find(".val").find(".date").find(".start").text('');
        $(filterMenus.filter).find(".val").find(".date").find(".end").text('');

    };

    var saveAsImage = function(){

        var graphType = $(filterFields.graphType).val();
        saveSvgAsPng(document.getElementById("graph"), graphType + "-chart.png", 1);

        closeSubMenu();
        return false;
    };

    var updateAvailableFilterChoices = function(){

        // run after any filter change
        // make sure what is selected is still valid
        // enable/disable invalid choices

        // Check currently selected dataset2 validity
        // -- clear if not valid
        if( filterValues.dataset2 != null &&
            !allowedFilterValues.isSecondaryDataAllowed(filterValues.dataset1, filterValues.dataset2) ){

            // clear Dataset2
            filterValues.dataset2 = null;
            $(filterMenus.dataset2).find(".val").text("");
            $(filterFields.dataset2).val("");
        }

        // Check currently selected graphType validity
        // - clear if not valid
        // -- is set
        // -- allowed for dataset1
        // -- dataset1 and dataset2 are set and graph is for combinable
        if( filterValues.graphType != null ){

            if( filterValues.dataset1 != null && filterValues.dataset2 != null &&
                !allowedFilterValues.isCombinableGraph(filterValues.graphType) ){

                // clear Graph Type
                filterValues.graphType = null;
                $(filterMenus.graphType).find(".val").text("");
                $(filterFields.graphType).val("");

            }
            else if( filterValues.dataset2 == null &&
                !allowedFilterValues.isGraphTypeAllowed(filterValues.dataset1, filterValues.graphType) ){

                // clear Graph Type
                filterValues.graphType = null;
                $(filterMenus.graphType).find(".val").text("");
                $(filterFields.graphType).val("");
            }
        }


        // Disable Secondary Data as needed
        $(filterMenus.dataset2).find(".submenu").find("a").not(".clear").each(function () {
            if (!allowedFilterValues.isSecondaryDataAllowed(filterValues.dataset1, $(this).data("dname2"))) {
                $(this).addClass('disabled');
            }
            else {
                $(this).removeClass('disabled');
            }
        });


        // Disable Graph Types as needed
        if( filterValues.dataset2 == null ) {

            $(filterMenus.graphType).find(".submenu").find("a").not(".clear").each(function () {
                if (!allowedFilterValues.isGraphTypeAllowed(filterValues.dataset1, $(this).data("gtype"))) {
                    $(this).addClass('disabled');
                }
                else {
                    $(this).removeClass('disabled');
                }
            });
        }
        else{

            // Disable All Types but Combined
            $(filterMenus.graphType).find(".submenu").find("a").not(".clear").each(function () {
                if( !allowedFilterValues.isCombinableGraph($(this).data("gtype")) ){
                    $(this).addClass('disabled');
                }
                else {
                    $(this).removeClass('disabled');
                }
            });

        }

    }

    var chooseDataSet1 = function(){

        if( $(this).hasClass('clear') ){

            // clear Dataset2
            filterValues.dataset1 = null;
            $(filterMenus.dataset1).find(".val").text("");
            $(filterFields.dataset1).val("");
        }
        else {

            var newVal = $(this).data("dname1");
            if (newVal != filterValues.dataset1) {

                // Set New Dataset 1 value
                filterValues.dataset1 = newVal;
                $(filterMenus.dataset1).find(".val").text($(this).text());
                $(filterFields.dataset1).val(filterValues.dataset1);
            }
        }

        updateAvailableFilterChoices();
        closeSubMenu();
        return false;
    };

    var chooseDataSet2 = function(){

        // do nothing for disabled secondary types
        if( $(this).hasClass('disabled') ) return false;

        if( $(this).hasClass('clear') ){

            // clear Dataset2
            filterValues.dataset2 = null;
            $(filterMenus.dataset2).find(".val").text("");
            $(filterFields.dataset2).val("");
        }
        else {
            var newVal = $(this).data("dname2");
            if (newVal != filterValues.dataset2) {

                filterValues.dataset2 = newVal;
                $(filterMenus.dataset2).find(".val").text($(this).text());
                $(filterFields.dataset2).val(filterValues.dataset2);
            }
        }

        updateAvailableFilterChoices();
        closeSubMenu();
        return false;
    };

    var chooseStartDate = function(){

        var dateString = $(filterFields.startDate).val();
        // date field is in format yyyy-MM-dd --> convert to Date object and build string like mm/dd/yyyy
        var startDate = new Date(dateString);
        if( Object.prototype.toString.call(startDate) === "[object Date]" && !isNaN(startDate.getTime()) ) {

            var monthNum = startDate.getUTCMonth() + 1;
            var dayNum = startDate.getUTCDate();
            if (dayNum < 10 && dayNum >= 0) dayNum = '0' + dayNum.toString();
            var yearNum = startDate.getUTCFullYear();
            var startDateString = monthNum + '/' + dayNum + '/' + yearNum;
            $(filterMenus.filter).find(".val").find(".date").find(".start").text(startDateString);
            filterValues.startDate = startDateString;
        }
        else{

            $(filterMenus.filter).find(".val").find(".date").find(".start").text("");
        }

    };

    var chooseEndDate = function(){

        var dateString = $(filterFields.endDate).val();
        // date field is in format yyyy-MM-dd --> convert to Date object and build string like mm/dd/yyyy
        var endDate = new Date(dateString);
        if( Object.prototype.toString.call(endDate) === "[object Date]" && !isNaN(endDate.getTime()) ) {

            var monthNum = endDate.getUTCMonth() + 1;
            var dayNum = endDate.getUTCDate();
            if (dayNum < 10 && dayNum >= 0) dayNum = '0' + dayNum.toString();
            var yearNum = endDate.getUTCFullYear();
            var endDateString = monthNum + '/' + dayNum + '/' + yearNum;
            $(filterMenus.filter).find(".val").find(".date").find(".end").text(endDateString);
            filterValues.endDate = endDateString;
        }
        else{
            $(filterMenus.filter).find(".val").find(".date").find(".end").text("");
        }
    };

    var chooseGraphType = function(){

        // do nothing for disabled secondary types
        if( $(this).hasClass('disabled') ) return false;

        if( $(this).hasClass('clear') ){

            // clear Graph Type
            filterValues.graphType = null;
            $(filterMenus.graphType).find(".val").text("");
            $(filterFields.graphType).val("");
        }
        else {

            var newVal = $(this).data("gtype");
            if (newVal != filterValues.graphType) {

                filterValues.graphType = newVal;
                $(filterMenus.graphType).find(".val").text($(this).text());
                $(filterFields.graphType).val(filterValues.graphType);
            }
        }

        updateAvailableFilterChoices();
        closeSubMenu();
        return false;
    };

    var optionLinkClick = function(evt){

        // do nothing is tab is within submenu
        if($(evt.target).parents('ul.submenu').length) {
            return;
        }

        activeSubMenu = $(this);
        if( $(activeSubMenu).hasClass("active") ) {
            closeSubMenu();
        }
        else{
            openSubMenu();
        }
        return false;
    };

    var checkFilterValid = function(){

        var errors = [];
        //var filtersAreValid = true;

        // Dataset 1 has valid value
        if( !allowedFilterValues.isPrimaryDataValid(filterValues.dataset1) ){

            //filtersAreValid = false;
            errors.push("Choose valid Primary Dataset");
        }

        // Dataset 2 has valid value - based on dataset1
        if( filterValues.dataset2 != null ){
            if( !allowedFilterValues.isSecondaryDataAllowed(filterValues.dataset1, filterValues.dataset2) ) {
                //filtersAreValid = false;
                errors.push("Choose valid Secondary Dataset");
            }
        }

        // Graph Type has valid value
        if( filterValues.dataset2 != null &&
            !allowedFilterValues.isCombinableGraph(filterValues.graphType) ){

            //filtersAreValid = false;
            errors.push("Choose valid Graph Type");
        }
        else if(filterValues.dataset2 == null &&
                !allowedFilterValues.isGraphTypeAllowed(filterValues.dataset1, filterValues.graphType) ){

            //filtersAreValid = false;
            errors.push("Choose valid Graph Type");
        }

        // Start Date has value
        // Start Date is before or equal to today
        if( filterValues.startDate != null ){

            var startDate = new Date(filterValues.startDate);
            if( Object.prototype.toString.call(startDate) === "[object Date]" && !isNaN(startDate.getTime()) ) {

                var today = new Date();
                if( startDate.getTime() > today.getTime() ){

                    errors.push("Start Date cannot be in the future")
                }
            }
            else{
                errors.push("Invalid Start Date");
            }
        }

        // End Date is after Start Date
        // End Date is 30 days or less from Start Date
        if( filterValues.endDate != null ){

            var endDate = new Date(filterValues.endDate);
            if( Object.prototype.toString.call(endDate) === "[object Date]" && !isNaN(endDate.getTime()) ) {

                var today = new Date();
                var startDate = new Date(filterValues.startDate);
                if( endDate.getTime() > today.getTime() ){

                    errors.push("End Date cannot be in the future");
                }
                else if( Object.prototype.toString.call(startDate) === "[object Date]" && !isNaN(startDate.getTime()) ){


                    // if StartDate is more than 30 days before end date
                    // use 31 because we use the entire 30th day
                    var startTime = startDate.getTime() + (31 * 24 * 60 * 60 * 1000);
                    //console.log(startTime+" < "+endDate.getTime());

                    if( endDate.getTime() < startDate.getTime() ){
                        errors.push("End Date is before Start Date");
                    }
                    else if( startTime < endDate.getTime() ){

                        errors.push("Date Range max is 30 days");
                    }
                }
            }
            else{
                errors.push("Invalid End Date");
            }
        }

        // clear errors
        $(filterMenus.errors).html("");
        // show error list on page
        if( errors.length > 0 ){

            var errorList = "<ul>";
            for (i = 0; i < errors.length; ++i) {

                errorList += "<li>" + errors[i] + "</li>";
            }
            errorList += "</ul>";
            $(filterMenus.errors).append(errorList);
            return (false);
        }
        else{

            return (true);
        }


    };

    var getGraph = function(){

        closeSubMenu();

        // Validate before submitting
        var filtersAreValid = checkFilterValid();
        if( filtersAreValid ) {
            // Get Filter values from form hidden fields
            var graphType = $(filterValues.graphType).val();
            var postData = $("#graph-options").serialize();
            console.log(postData);
            graphLoaderModule.loadGraph(filterValues.graphType, postData);
        }

        // stop html form post
        return false;
    };

    var publicObject = {};
    publicObject.init = function() {

        // Register Actions
        //$(".menu-item").find("a.opt-link").click(optionLinkClick);
        $(".menu-item").click(optionLinkClick);
        $(filterMenus.dataset1).find(".submenu").find("a").click(chooseDataSet1);
        $(filterMenus.dataset2).find(".submenu").find("a").click(chooseDataSet2);
        $(filterMenus.graphType).find(".submenu").find("a").click(chooseGraphType);

        $(filterFields.startDate).change(chooseStartDate);
        $(filterFields.endDate).change(chooseEndDate);
        $(filterFields.startDate).trigger("change");
        $(filterFields.endDate).trigger("change");

        $("#clear-button").click(clearGraphOptions);
        $("#submit-button").click(getGraph);
        $("#save").click(saveAsImage);

        // stop form submission
        $("#graph-options").attr("onsubmit", "return false;");

        updateAvailableFilterChoices();
    };

    return publicObject;

})();



var graphLoaderModule = (function(){

    var graphType = 'bar';

    var showGraphLoadingIcon = function(){

        $(".chart-container").find(".loading").show();
    };

    var hideGraphLoadingIcon = function(){

        $(".chart-container").find(".loading").hide();
    };

    var publicObject = {};
    publicObject.loadGraph = function(newGraphType, postData){

        showGraphLoadingIcon();
        $(".graph-header").show();
        graphType = newGraphType;

        //console.log(postData);

        // post graph
        $.post("/research/graph", postData, function (rawData) {

            jsonData = jQuery.parseJSON(rawData);
            //console.log(jsonData);

            switch(graphType){

                case 'line':
                    lineGraphModule.setGraphData(jQuery.parseJSON(jsonData.graphData));
                    lineGraphModule.buildGraph();
                    break;

                case 'scatter':
                    scatterGraphModule.setGraphData(jQuery.parseJSON(jsonData.graphData));
                    scatterGraphModule.buildGraph();
                    break;

                case 'pie':
                    pieGraphModule.setGraphData(jQuery.parseJSON(jsonData.graphData));
                    pieGraphModule.buildGraph();
                    break;

                case 'stacked-bar':
                    stackedBarGraphModule.setGraphData(jQuery.parseJSON(jsonData.graphData));
                    stackedBarGraphModule.buildGraph();
                    break;

                case 'grouped-bar':
                    groupedBarGraphModule.setGraphData(jQuery.parseJSON(jsonData.graphData));
                    groupedBarGraphModule.buildGraph();
                    break;

                case 'bar':
                default:
                    barGraphModule.setGraphData(jsonData.graphValues);
                    //barGraphModule.setGraphData(jQuery.parseJSON(jsonData.graphData));
                    barGraphModule.buildGraph();
            }

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
            hideGraphLoadingIcon();
        });

    };

    publicObject.reloadGraph = function(){

        switch(graphType){

            case 'line':
                lineGraphModule.buildGraph();
                break;

            case 'scatter':
                scatterGraphModule.buildGraph();
                break;

            case 'pie':
                pieGraphModule.buildGraph();
                break;

            case 'stacked-bar':
                stackedBarGraphModule.buildGraph();
                break;

            case 'grouped-bar':
                groupedBarGraphModule.buildGraph();
                break;

            case 'bar':
            default:
                barGraphModule.buildGraph();
        }

        /*
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
        */
    };

    publicObject.init = function(){

        // do any initialization that might be needed
    };

    return publicObject;
})();


jQuery(document).ready(function(){

    filterMenuModule.init();
    graphLoaderModule.init();

    /*
    var test_post = {

        startDate: '2014-10-07',
        endDate: '2014-11-06',
        primaryDataset: 'age',
        secondaryDataset: '',
        graphType: 'pie'
    };
    graphLoaderModule.loadGraph('pie', test_post);
    */



    // Detect changes in main container width, redraw chart
    var lastChartWidth = $(".main").width();
    $(window).on("resize", function() {
        var currChartWidth = $(".main").width();
        if( lastChartWidth != currChartWidth ) {

            graphLoaderModule.reloadGraph();
            lastChartWidth = currChartWidth;
        }
    }).trigger("resize");



    //*** Loop Start
    /*
    for (var i=0; i<200; i++) {
        // Generate new vitals/demographics every time - maybe change patient name
        var postData = {

            firstName: (randomString()),
            lastName: (randomString()),
            address: (randomInt(100, 2000)) + ' address',
            city: 'anywhere',
            age: (randomInt(1930, 2000)) + '-' + (randomInt(1, 12)) + '-' + (randomInt(1, 12)),
            sex: (randomGender()),
            bloodPressureSystolic: (randomInt(110, 150)),
            bloodPressureDiastolic: (randomInt(60, 100)),
            heartRate: (randomInt(10, 60)),
            temperature: (randomInt(92, 101)),
            respiratoryRate: (randomInt(10, 22)),
            oxygenSaturation: (randomInt(80, 100)),
            heightFeet: (randomInt(0, 7)),
            heightInches: (randomInt(0, 12)),
            weight: (randomInt(92, 101)),
            glucose: (randomInt(70, 140)),
            chiefComplaint: null,
            weeksPregnant: null

            // Add the rest of the form fields here
        };

        $.post("/triage?id=0", postData, function (responseData) {

            console.log(postData);

        });
    }
    */
    //*** Loop End
});

///*
function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
};

function randomGender(){
    var genderSelection = ['Male','Female'];
    var gender = Math.floor(Math.random() * genderSelection.length);
    return genderSelection[gender];
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
};
//*/


function encodeID(s) {
    if (s==='') return '_';
    return s.replace(/[^a-zA-Z0-9.-]/g, function(match) {
        return '_'+match[0].charCodeAt(0).toString(16)+'_';
    });
}