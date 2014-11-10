/*
 *
 *  Bar Graph
 *
 */

var tableChartModule = (function(){

    var xAxisTitle = "";
    var measurementUnits = "";
    var graph_data = [];
    var grouped_data = {};

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
            else if( filterMenuModule.getPrimaryDataset() == "prescribedMeds" ){

                if( obj.dataSet == 1 ){
                    keyStr = "Aspirin";
                }
                else if(obj.dataSet == 2){
                    keyStr = "Tylenol";
                }
                else if(obj.dataSet == 3){
                    keyStr = "Amoxycilin";
                }
                else if(obj.dataSet == 3){
                    keyStr = "Hydrocodone";
                }
                else{
                    keyStr = "Claritin";
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

        $("#graph").hide();
        var table = $("#table-container");
        $(table).html('');
        $(table).show();

        var table_html = '<table class="table table-striped">' +
            '<thead>' +
            '<tr>' +
                '<th>'+xAxisTitle+'</th>' +
                '<th>Number of Patients</th>' +
            '</tr>' +
            '</thead>';

        table_html += '<tbody>';

        $.each(grouped_data, function (key, obj) {

            table_html += '<tr>' +
                '<td>'+obj.name+'</td>' +
                '<td>'+obj.value+'</td>' +
                '</tr>';

        });

        table_html += '</tbody>';

        $(table).append(table_html);

    };

    return publicObject;

})();