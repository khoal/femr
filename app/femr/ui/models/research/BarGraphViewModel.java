package femr.ui.models.research;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import femr.common.models.VitalItem;
import femr.common.models.ResearchItem;
import java.util.*;


public class BarGraphViewModel {

    List<PatientGraphItem> graphValues;
    double average = 0;
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

        /*
        Arrays.sort(ages, new Comparator<Integer>()
        {
            @Override
            public int compare(Integer x, Integer y)
            {
                return x - y;
            }
        });
        */

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

        // Attempting to sort values by key
        graphValues = new ArrayList<PatientGraphItem>();
        SortedSet<String> keys = new TreeSet<String>(new Comparator<String>() {
            /**
             * Returns a positive value if number1 is larger than number 2, a
             * negative number if number1 is less than number2, and 0 if they
             * are equal.
             */
            public int compare(String number1, String number2) {
                return (int)(Double.parseDouble(number1) - Double.parseDouble(number2));
            }
        });
        keys.addAll(vitalValues.keySet());

        int i = 0;
        for (String key : keys) {
        //for (int k = keys.size()-1; k >= 0; k-- ){

            //String key = keys.
            Integer val = vitalValues.get(key);

            //String key = (String)pairs.getKey();
            graphValues.add(new PatientGraphItem(key, val));
            i++;
        }

        /*
        graphValues = new ArrayList<PatientGraphItem>();
        it = vitalValues.entrySet().iterator();
        int i = 0;
        while (it.hasNext()) {
            Map.Entry pairs = (Map.Entry) it.next();

            String key = (String)pairs.getKey();
            graphValues.add(i, new PatientGraphItem(key, (Integer)pairs.getValue()));
            i++;
        }
        */
    }



    public void buildGraphValues(List<ResearchItem> input){
        boolean first = true;

        double sum = 0;
        graphValues = new ArrayList<PatientGraphItem>();
        for (ResearchItem r : input) {
            if (first)
            {
                rangeHigh = (int) r.getDataSet1();
                rangeLow = (int) r.getDataSet1();
                first = false;
            }
            if (r.getDataSet1() > rangeHigh) {rangeHigh = (int) r.getDataSet1();}
            if (r.getDataSet1() < rangeLow) {rangeLow = (int) r.getDataSet1();}
            sum += r.getDataSet1();
            graphValues.add(0, new PatientGraphItem(r.getDataType1(), (int) r.getDataSet1()));

        }
        median = graphValues.get(graphValues.size()/2).getValue();
        average = sum/graphValues.size();
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
