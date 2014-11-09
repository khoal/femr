/*
 *
 *  Stacked Bar Graph
 *
 */




var stackedBarGraphModule = (function(){

    var xAxisTitle = "";
    var measurementUnits = "";
    var graph_data = [];
    var grouped_data = {};
    var mainKeys = [];
    var innerKeys = [];
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
        mainKeys = [];
        innerKeys = [];
        xAxisTitle = xTitle;
        measurementUnits = unitOfMeasurement;

        // Group and count the individual patients
        var maxVal = Number.MIN_VALUE;
        var minVal = Number.MAX_VALUE;

        if( filterMenuModule.getPrimaryDataset() == 'age' &&
            filterMenuModule.isPrimaryDataGrouped() ) {
            setupAgeGroups();
        }

        var localGraphData1 = [];
        var localGraphData2 = [];
        if( jsonData.graphData.length > 1 ){

            localGraphData1 = jsonData.graphData[0];
            localGraphData2 = jsonData.graphData[1];

            // bail out of the dataset sizes aren't the same
            //if( localGraphData1.length != localGraphData2.length )return;
        }

        //console.log(jsonData);

        for(var i = 0; i < localGraphData1.length; i++) {

            var data1Obj = localGraphData1[i];
            var data1Key = "";
            if (filterMenuModule.getPrimaryDataset() == "gender") {

                //console.log(obj.dataSet);
                if (data1Obj.dataSet == 0) {
                    data1Key = "Male";
                }
                else if (data1Obj.dataSet == 1) {
                    data1Key = "Female";
                }
                else {
                    data1Key = "Unknown";
                }

            }
            else if( filterMenuModule.getPrimaryDataset() == "pregnancyStatus" ){

                if( data1Obj.dataSet == 0 ){
                    data1Key = "No";
                }
                else if(data1Obj.dataSet == 1){
                    data1Key = "Yes";
                }
                else{
                    data1Key = "Unknown";
                }
            }
            else {

                // Keep track of min/max to build scale values
                if (data1Obj.dataSet > maxVal) {
                    maxVal = data1Obj.dataSet;
                }
                if (data1Obj.dataSet < minVal) {
                    minVal = data1Obj.dataSet;
                }

                if( filterMenuModule.getPrimaryDataset() == 'age' &&
                    filterMenuModule.isPrimaryDataGrouped() ) {

                    if( data1Obj.dataSet <= 10 ){
                        data1Key = "0-10";
                    }
                    else if( data1Obj.dataSet <= 20 ){
                        data1Key = "11-20";
                    }
                    else if( data1Obj.dataSet <= 30 ){
                        data1Key = "21-30";
                    }
                    else if( data1Obj.dataSet <= 40 ){
                        data1Key = "31-40";
                    }
                    else if( data1Obj.dataSet <= 50 ){
                        data1Key = "41-50";
                    }
                    else if( data1Obj.dataSet <= 60 ){
                        data1Key = "51-60";
                    }
                    else if( data1Obj.dataSet <= 70 ){
                        data1Key = "61-70";
                    }
                    else if( data1Obj.dataSet <= 80 ){
                        data1Key = "71-80";
                    }
                    else if( data1Obj.dataSet <= 90 ){
                        data1Key = "81-90";
                    }
                    else if( data1Obj.dataSet <= 100 ){
                        data1Key = "91-100";
                    }
                    else{
                        data1Key = "100+";
                    }

                }
                else{

                    data1Key = data1Obj.dataSet;
                }
            }


            var data2Obj = localGraphData2[i];

            var data2Key = '';
            if (filterMenuModule.getSecondaryDataset() == "gender") {

                //console.log(obj.dataSet);
                if (data2Obj.dataSet == 0) {
                    data2Key = "Male";
                }
                else if (data2Obj.dataSet == 1) {
                    data2Key = "Female";
                }
                else {
                    data2Key = "Unknown";
                }

            }
            else if( filterMenuModule.getSecondaryDataset() == "pregnancyStatus" ){

                if( data2Obj.dataSet == 0 ){
                    data2Key = "No";
                }
                else if(data2Obj.dataSet == 1){
                    data2Key = "Yes";
                }
                else{
                    data2Key = "Unknown";
                }
            }
            else {

                // when age is secondary, always group by 10
                if( filterMenuModule.getSecondaryDataset() == 'age' ) {

                    if( data2Obj.dataSet <= 10 ){
                        data2Key = "0-10";
                    }
                    else if( data2Obj.dataSet <= 20 ){
                        data2Key = "11-20";
                    }
                    else if( data2Obj.dataSet <= 30 ){
                        data2Key = "21-30";
                    }
                    else if( data2Obj.dataSet <= 40 ){
                        data2Key = "31-40";
                    }
                    else if( data2Obj.dataSet <= 50 ){
                        data2Key = "41-50";
                    }
                    else if( data2Obj.dataSet <= 60 ){
                        data2Key = "51-60";
                    }
                    else if( data2Obj.dataSet <= 70 ){
                        data2Key = "61-70";
                    }
                    else if( data2Obj.dataSet <= 80 ){
                        data2Key = "71-80";
                    }
                    else if( data2Obj.dataSet <= 90 ){
                        data2Key = "81-90";
                    }
                    else if( data2Obj.dataSet <= 100 ){
                        data2Key = "91-100";
                    }
                    else{
                        data2Key = "100+";
                    }

                }
                else {
                    data2Key = data2Obj.dataSet;
                }
            }

            // keep track of inner keys
            if( filterMenuModule.getSecondaryDataset() != 'age' ) {
                innerKeys.pushIfNotExist(data2Key, function(e) {
                    return e === data2Key;
                });
            }

            if (!grouped_data[data1Key]) {
                grouped_data[data1Key] = {};

                // add keys as they are needed - used for x-axis
                //mainKeys[i] = data1Key;

            }
            if (!grouped_data[data1Key][data2Key]) {
                grouped_data[data1Key][data2Key] = 0;
            }
            grouped_data[data1Key][data2Key] += 1;

        }


        if( filterMenuModule.getSecondaryDataset() == 'age' ) {

            // setup
            innerKeys = ["0-10","11-20","21-30","31-40","41-50",
                        "51-60","61-70","71-80","81-90","91-100","100+"];
        }

        //console.log(grouped_data);

        // tickValues
        // max at 20 ticks
        //*
        mainKeys = Object.keys(grouped_data);
        if( mainKeys.length > 20 ){
            for( var i = minVal; i <= maxVal; i++ ){
                if( i % 5 == 0 ){
                    tickValues.push(i);
                }
            }
        }
        //*/

        var i = 0;
        $.each(grouped_data, function (key, obj) {

            graph_data[i] = {

                name: key
            };
            $.each(innerKeys, function (key2, innerKey) {

                var obj2 = 0;
                if(obj[innerKey]){

                    obj2 = obj[innerKey];
                }

                graph_data[i][innerKey] = obj2;

            });
            i++;
        });

        //console.log(graph_data);

        /*
        var i = 0;
        //$(grouped_data).each(function(key, obj){
        $.each(innerKeys, function (key2, innerKey) {

            var j = 0;
            graph_data[i] = [];
            //$(innerKeys).each(function(key2, innerKey){
            $.each(grouped_data, function (key, obj) {

                var obj2 = 0;
                if(obj[innerKey]){

                    obj2 = obj[innerKey];
                }

                graph_data[i][j] = {
                    name: key,
                    x: j,
                    y: obj2
                };
                j++;
            });
            i++;
        });
        */

        //console.log(graph_data);

        //console.log(grouped_data);


        /*
        for( var i = 0; i < jsonData.length; i++ )
        {
            var j = 0;
            graph_data[i] = [];
            var secondaryData = jsonData[i];
            $.each(secondaryData, function (key, obj) {
                graph_data[i][j] = {
                    name: key,
                    x: j,
                    y: obj.value
                };
                j++;
            });
        }
        /*/
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

        //Easy colors accessible via a 20-step ordinal scale
        var colors = d3.scale.category20();

        // get possible colors from keys in first element
        colors.domain(d3.keys(graph_data[0]).filter(function(key) {
            return key !== "name" && key != "groups" && key != "total";
        }));

        graph_data.forEach(function(d) {
            var y0 = 0;
            d.groups = colors.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.total = d.groups[d.groups.length - 1].y1;
        });

        //Set up scales
        var xScale = d3.scale.ordinal()
            .domain(graph_data.map(function(d) { return d.name; }))
            .rangeRoundBands([0, graphWidth], 0.15);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(graph_data, function(d) { return d.total; })])
            .range([graphHeight, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        if( tickValues.length > 0 ){

            xAxis.tickValues(tickValues)
        }

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var val = d.y1 - d.y0;
                return "<strong>Patients ("+ d.name+"):</strong> <span>" + val + "</span>";
            });


        //Create SVG element
        var chart = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.call(tip);

        /*
        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + graphHeight + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");
        */
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

        var state = chart.selectAll(".bar")
            .data(graph_data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + xScale(d.name) + ",0)"; });

        state.selectAll("rect")
            .data(function(d) { return d.groups; })
            .enter().append("rect")
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.y1); })
            .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
            .style("fill", function(d) { return colors(d.name); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var legend = chart.selectAll(".legend")
            .data(colors.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", graphWidth - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colors);

        legend.append("text")
            .attr("x", graphWidth - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });




        // Add a group for each row of data
        /*
        var groups = chart.selectAll("g")
            .data(graph_data)
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
            .attr("width", xScale.rangeBand())
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);



        */
        /*
        var legend = svg.selectAll(".legend")
            .data(ageNames.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", graphWidth - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", graphWidth - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
        */
    };

    return publicObject;

})();