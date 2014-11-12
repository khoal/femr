/*
 *
 *  Bar Graph
 *
 */

var barGraphModule = (function(){

    var xAxisTitle = "";
    var measurementUnits = "";
    var graph_data = [];
    var grouped_data = {};
    var tickValues = [];

    var setupAgeGroups = function(){

        // Manually setup age groups, should do this programmatically eventually
        grouped_data["0-10"] = {
            name: "0-10",
            value: 0
        };

        grouped_data["11-20"] = {
            name: "11-20",
            value: 0
        };

        grouped_data["21-30"] = {
            name: "21-30",
            value: 0
        };

        grouped_data["31-40"] = {
            name: "31-40",
            value: 0
        };

        grouped_data["41-50"] = {
            name: "41-50",
            value: 0
        };

        grouped_data["51-60"] = {
            name: "51-60",
            value: 0
        };

        grouped_data["61-70"] = {
            name: "61-70",
            value: 0
        };

        grouped_data["71-80"] = {
            name: "71-80",
            value: 0
        };

        grouped_data["81-90"] = {
            name: "81-90",
            value: 0
        };

        grouped_data["91-100"] = {
            name: "91-100",
            value: 0
        };

        grouped_data["100+"] = {
            name: "100+",
            value: 0
        };

    };

    var publicObject = {};
    publicObject.setGraphData = function(jsonData, xTitle, unitOfMeasurement){

        // reset possible previous graphs
        tickValues = [];
        graph_data = [];
        grouped_data = {};
        xAxisTitle = xTitle;
        measurementUnits = unitOfMeasurement;

        //console.log(jsonData);

        // Group and count the individual patients
        var maxVal = Number.MIN_VALUE;
        var minVal = Number.MAX_VALUE;

        if( filterMenuModule.getPrimaryDataset() == 'age' &&
            filterMenuModule.isPrimaryDataGrouped() ) {
            setupAgeGroups();
        }

        var localGraphData = [];
        if( jsonData.graphData.length > 0 ){

            //only need primaryDataset
            localGraphData = jsonData.graphData[0];
        }
        $.each(localGraphData, function (key, obj) {

            var keyStr = "";
            if( filterMenuModule.getPrimaryDataset() == "gender" ){

                //console.log(obj.dataSet);
                if( obj.dataSet == 0 ){
                    keyStr = "Male";
                }
                else if(obj.dataSet == 1){
                    keyStr = "Female";
                }
                else{
                    keyStr = "Unknown";
                }

            }
            else if( filterMenuModule.getPrimaryDataset() == "pregnancyStatus" ){

                if( obj.dataSet == 0 ){
                    keyStr = "No";
                }
                else if(obj.dataSet == 1){
                    keyStr = "Yes";
                }
                else{
                    keyStr = "Unknown";
                }

            }
            else if( filterMenuModule.getPrimaryDataset() == "prescribedMeds" ){
                if( medications[obj.dataSet]){
                    keyStr = medications[obj.dataSet];
                }
                else{
                    keyStr = "Unknown";
                }
            }
            else{

                // Keep track of min/max to build scale values
                if( obj.dataSet > maxVal){
                    maxVal = obj.dataSet;
                }
                if( obj.dataSet < minVal){
                    minVal = obj.dataSet;
                }

                if( filterMenuModule.getPrimaryDataset() == 'age' &&
                    filterMenuModule.isPrimaryDataGrouped() ) {

                    if( obj.dataSet <= 10 ){
                        keyStr = "0-10";
                    }
                    else if( obj.dataSet <= 20 ){
                        keyStr = "11-20";
                    }
                    else if( obj.dataSet <= 30 ){
                        keyStr = "21-30";
                    }
                    else if( obj.dataSet <= 40 ){
                        keyStr = "31-40";
                    }
                    else if( obj.dataSet <= 50 ){
                        keyStr = "41-50";
                    }
                    else if( obj.dataSet <= 60 ){
                        keyStr = "51-60";
                    }
                    else if( obj.dataSet <= 70 ){
                        keyStr = "61-70";
                    }
                    else if( obj.dataSet <= 80 ){
                        keyStr = "71-80";
                    }
                    else if( obj.dataSet <= 90 ){
                        keyStr = "81-90";
                    }
                    else if( obj.dataSet <= 100 ){
                        keyStr = "91-100";
                    }
                    else{
                        keyStr = "100+";
                    }

                }
                else{

                    keyStr = obj.dataSet;
                }
            }

            if( !grouped_data[keyStr] ){

                grouped_data[keyStr] = {

                    name: keyStr,
                    value: 0
                };
            }
            grouped_data[keyStr].value += 1;
        });

        console.log(grouped_data);

        // tickValues
        // max at 20 ticks
        if( Object.keys(grouped_data).length > 20 ){
            for( var i = minVal; i <= maxVal; i++ ){
                if( i % 5 == 0 ){
                    tickValues.push(i);
                }
            }
        }


        var i = 0;
        $.each(grouped_data, function (key, obj) {

            //console.log(key);
            //console.log(obj);
            graph_data[i] = {
                name: key,
                value: obj.value
            };
            i++;
        });

    };

    publicObject.buildGraph = function(){

        $("#graph").show();
        $("#table-container").hide();

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
            //.range([0, graphWidth], .25);
            .rangeRoundBands([0, graphWidth], .25);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(graph_data, function(d) { return d.value; })])
            .range([graphHeight, 0]);


        var xAxis = d3.svg.axis()
            .scale(xScale)
            //.tickValues(xScale.domain().filter(function(d, i) { return !(i % 6); }))
            .orient("bottom");
        // Only use tickValues if they are set
        if( tickValues.length > 0 ){

            xAxis.tickValues(tickValues)
        }

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickFormat(d3.format("d"));

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return '<span class="name">' + d.name + '</span> <span class="val"><strong>Patients: </strong>' + d.value + '</span>';
            });

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
            .text(xAxisTitle);

        chart.call(tip);

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
            //.attr("width", function(d) { return xScale(d.name); })
            .attr("width", xScale.rangeBand())
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    };

    return publicObject;

})();