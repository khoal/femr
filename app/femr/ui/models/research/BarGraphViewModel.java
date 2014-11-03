package femr.ui.models.research;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import femr.common.models.VitalItem;

import java.util.*;


public class BarGraphViewModel {

    List<PatientGraphItem> graphValues;
    double average;
    int median;
    int rangeLow;
    int rangeHigh;
    String xAxisTitle;

    public List<PatientGraphItem> getGraphValues() {
        return graphValues;
    }

    public void setGraphValues(List<PatientGraphItem> graphValues) {
        this.graphValues = graphValues;
    }

    public void buildGraphValues(Map<Integer,VitalItem> patientInfo){

        // Count occurrences of temperature values
        Map<String, Integer> vitalValues = new HashMap<>();
        int index = 0;
        Iterator it = patientInfo.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pairs = (Map.Entry)it.next();

            VitalItem vital = (VitalItem)pairs.getValue();
            String key = vital.getValue().toString();
            Integer rangeTotal = 0;
            if( vitalValues.containsKey(key) ){
                rangeTotal = vitalValues.get(key);
            }
            rangeTotal++;
            vitalValues.put(key, rangeTotal);

            it.remove(); // avoids a ConcurrentModificationException
        }

        graphValues = new ArrayList<PatientGraphItem>();
        it = vitalValues.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pairs = (Map.Entry) it.next();

            String key = (String)pairs.getKey();
            graphValues.add(0, new PatientGraphItem(key, (Integer)pairs.getValue()));

        }

    }

    public double getAverage() {
        return average;
    }

    public void setAverage(double average) {
        this.average = average;
    }

    public int getMedian() {
        return median;
    }

    public void setMedian(int median) {
        this.median = median;
    }

    public int getRangeLow() {
        return rangeLow;
    }

    public void setRangeLow(int rangeLow) {
        this.rangeLow = rangeLow;
    }

    public int getRangeHigh() {
        return rangeHigh;
    }

    public void setRangeHigh(int rangeHigh) {
        this.rangeHigh = rangeHigh;
    }

    public String getxAxisTitle() {
        return xAxisTitle;
    }

    public void setxAxisTitle(String xAxisTitle) {
        this.xAxisTitle = xAxisTitle;
    }


    public String toJson(){

        Gson gson = new Gson();

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("median", median);
        jsonObject.addProperty("average", average);
        jsonObject.addProperty("rangeLow", rangeLow);
        jsonObject.addProperty("rangeHigh", rangeHigh);
        jsonObject.addProperty("graphData", gson.toJson(graphValues));

        return jsonObject.toString();
    }
}
