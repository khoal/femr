package femr.ui.models.research;

import femr.common.models.AgeGraphItem;
import java.util.List;


public class IndexGraphAgeViewModel {

    List<AgeGraphItem> graphValues;
    double average;
    int median;
    int rangeLow;
    int rangeHigh;

    public List<AgeGraphItem> getGraphValues() {
        return graphValues;
    }

    public void setGraphValues(List<AgeGraphItem> graphValues) {
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
