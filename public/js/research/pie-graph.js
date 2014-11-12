/*
 *
 *
  *  Pie Graph
 *
 */

var pieGraphModule = (function(){

    var xAxisTitle = "";
    var measurementUnits = "";
    var graph_data = [];
    var grouped_data = {};
    var label_ids = {};
    var arc_ids = {};

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
        graph_data = [];
        grouped_data = {};
        xAxisTitle = xTitle;
        measurementUnits = unitOfMeasurement;

        //console.log(jsonData);

        // Group and count the individual patients
        var maxVal = Number.MIN_VALUE;
        var minVal = Number.MAX_VALUE;

        if( filterMenuModule.getPrimaryDataset() == 'age' ) {
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

            else if( filterMenuModule.getPrimaryDataset() == "prescribedMeds" || filterMenuModule.getPrimaryDataset() == "dispensedMeds" ){

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

                // Age only on Pie graph as grouped
                if( filterMenuModule.getPrimaryDataset() == 'age' ) {

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

        // keep 3/2 width/height ratio on container
        var aspectRatio = 5/2.5;
        var containerWidth = $(".main").width();
        var containerHeight = containerWidth / aspectRatio;

        // Calculate height/width taking margin into account
        var graphWidth = containerWidth - margin.right - margin.left;
        var graphHeight = containerHeight - margin.top - margin.bottom;

        var pieWidth = graphHeight-20;
        var pieHeight = graphHeight-20;
        var outerRadius = pieWidth / 2;
        var innerRadius = 0;
        var textOffset = 14;


        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var arcOver = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius + 10);

        var pie = d3.layout.pie()
            .value(function(d){ return d.value; } );
        var color = d3.scale.category20();

        var pied_data = pie(graph_data);

        var pieLeftTranslate = (graphWidth/2)+margin.left;
        var pieTopTranslate = (graphHeight/2)+margin.top;
        var chart = d3.select(".chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", "translate(" + pieLeftTranslate + "," + pieTopTranslate + ")");

        //Set up Arcs
        var arcs = chart.selectAll("g.arc")
            .data(pied_data)
            .enter()
            .append("g")
            .attr("class", "arc")
            .each(function(d, i){

                var labelId = "label-"+i;
                var arcId = "arc-"+i;
                arc_ids[d.data.name] = arcId;
                label_ids[d.data.name] = labelId;

            })
            .attr('id', function(d){ return arc_ids[d.data.name]; })
            .on("mouseover", function(d) {
                d3.select(this).select("path").transition()
                    .duration(200)
                    .attr("d", arcOver);

                var labelId = label_ids[d.data.name];
                $("#"+labelId).show();

            })
            .on("mouseout", function(d) {
                d3.select(this).select("path").transition()
                    .duration(100)
                    .attr("d", arc);

                var labelId = label_ids[d.data.name];
                $("#"+labelId).hide();

            });

        arcs.append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("data-legend", function(d, i){ return d.data.name; })
            .attr("d", arc);

        //GROUP FOR LABELS
        var label_group = d3.select(".chart").append("g")
            .attr("class", "label_group")
            .attr("transform", "translate(" + pieLeftTranslate + "," + pieTopTranslate + ")");


        //DRAW LABELS WITH PERCENTAGE VALUES
        //*
        var enteringLabels = label_group.selectAll("g.label")
            .data(pied_data)
            .enter();
        var labelGroups = enteringLabels.append("g")
            .attr("class", "label")
            .attr("id", function(d){

                var labelId = label_ids[d.data.name];
                return labelId;
            });

        labelGroups.append("circle").attr({
            x: 0,
            y: 0,
            r: 2,
            fill: "#333",
            transform: function (d, i) {
                centroid = arc.centroid(d);
                return "translate(" + arc.centroid(d) + ")";
            },
            'class': "label-circle"
        });

        cDim = {
            height: graphWidth,
            width: graphWidth,
            labelRadius: graphWidth/4
        }

        var textLines = labelGroups.append("line").attr({
            x1: function (d, i) {
                return arc.centroid(d)[0];
            },
            y1: function (d, i) {
                return arc.centroid(d)[1];
            },
            x2: function (d, i) {
                centroid = arc.centroid(d);
                midAngle = Math.atan2(centroid[1], centroid[0]);
                x = Math.cos(midAngle) * cDim.labelRadius;
                return x;
            },
            y2: function (d, i) {
                centroid = arc.centroid(d);
                midAngle = Math.atan2(centroid[1], centroid[0]);
                y = Math.sin(midAngle) * cDim.labelRadius;
                return y;
            },
            'class': "label-line"
        });

        var textLabels = labelGroups.append("text").attr({
            x: function (d, i) {
                centroid = arc.centroid(d);
                midAngle = Math.atan2(centroid[1], centroid[0]);
                x = Math.cos(midAngle) * cDim.labelRadius;
                sign = (x > 0) ? 1 : -1
                labelX = x + (5 * sign)
                return labelX;
            },
            y: function (d, i) {
                centroid = arc.centroid(d);
                midAngle = Math.atan2(centroid[1], centroid[0]);
                y = Math.sin(midAngle) * cDim.labelRadius;
                return y;
            },
            'text-anchor': function (d, i) {
                centroid = arc.centroid(d);
                midAngle = Math.atan2(centroid[1], centroid[0]);
                x = Math.cos(midAngle) * cDim.labelRadius;
                return (x > 0) ? "start" : "end";
            },
            'class': 'label-text'
        }).text(function (d) {

            //console.log(d);
            var label = d.data.name+" "+measurementUnits+": "+d.data.value+" patients";
            return label;
        });
        //*/


        var legend = d3.select(".chart")
            .append("g")
            .attr("class", "legend")
            .attr("width", outerRadius)
            .attr("height", outerRadius * 2)
            .attr("transform", "translate(20,"+margin.top+")")
            .selectAll("g.item")
            .data(graph_data)
            .enter().append("g")
            .attr("class", "item")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            .on("mouseover", function(d) {

                var arcID = arc_ids[d.name];
                d3.select("#"+arcID).select("path").transition()
                    .duration(200)
                    .attr("d", arcOver);

                var labelId = label_ids[d.name];
                $("#"+labelId).show();
            })
            .on("mouseout", function(d) {

                var arcID = arc_ids[d.name];
                d3.select("#"+arcID).select("path").transition()
                    .duration(100)
                    .attr("d", arc);

                var labelId = label_ids[d.name];
                $("#"+labelId).hide();

            });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) { return color(i); });

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function(d) { return d.name+" "+measurementUnits; });
    };

    var arcMouseover = function(){


    }

    return publicObject;

})();