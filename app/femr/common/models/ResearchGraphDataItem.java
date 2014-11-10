package femr.common.models;

import java.util.List;

/**
 * Created by Arslan on 11/5/2014.
 */
public class ResearchGraphDataItem {

    private float average;
    private float median;
    private float rangeLow;
    private float rangeHigh;
    private List<List<ResearchItem>> graphData;
    private List<ResearchItem> primaryGraphData;
    private List<ResearchItem> secondaryGraphData;
    private String xAxisTitle;
    private String unitOfMeasurement;

    public float getAverage() {
        return average;
    }

    public void setAverage(float average) {
        this.average = average;
    }

    public float getMedian() {
        return median;
    }

    public void setMedian(float median) {
        this.median = median;
    }

    public float getRangeLow() {
        return rangeLow;
    }

    public void setRangeLow(float rangeLow) {
        this.rangeLow = rangeLow;
    }

    public float getRangeHigh() {
        return rangeHigh;
    }

    public void setRangeHigh(float rangeHigh) {
        this.rangeHigh = rangeHigh;
    }

    public String getxAxisTitle() {
        return xAxisTitle;
    }

    public void setxAxisTitle(String xAxisTitle) {
        this.xAxisTitle = xAxisTitle;
    }

    public String getUnitOfMeasurement() {
        return unitOfMeasurement;
    }

    public void setUnitOfMeasurement(String unitOfMeasurement) {
        this.unitOfMeasurement = unitOfMeasurement;
    }


    public List<ResearchItem> getPrimaryGraphData() {
        return primaryGraphData;
    }

    public void setPrimaryGraphData(List<ResearchItem> primaryGraphData) {
        this.primaryGraphData = primaryGraphData;
    }

    public List<ResearchItem> getSecondaryGraphData() {
        return secondaryGraphData;
    }

    public void setSecondaryGraphData(List<ResearchItem> secondaryGraphData) {
        this.secondaryGraphData = secondaryGraphData;
    }


    public List<List<ResearchItem>> getGraphData() {
        return graphData;
    }

    public void setGraphData(List<List<ResearchItem>> graphData) {
        this.graphData = graphData;
    }
}
