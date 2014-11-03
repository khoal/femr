package femr.ui.models.research;

import java.util.List;


public class BarGraphViewModel {

    List<PatientGraphItem> graphValues;
    double average;
    int median;
    int rangeLow;
    int rangeHigh;

    public List<PatientGraphItem> getGraphValues() {
        return graphValues;
    }

    public void setGraphValues(List<PatientGraphItem> graphValues) {
        this.graphValues = graphValues;
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
}
