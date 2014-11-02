package femr.ui.models.research;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;


public class FilterViewModel {

    private String primaryDataset;
    private String secondaryDataset;
    private String graphType;
    private String startDate;
    private String endDate;

    public String getPrimaryDataset() {
        return primaryDataset;
    }

    public void setPrimaryDataset(String primaryDataset) {
        this.primaryDataset = primaryDataset;
    }

    public String getSecondaryDataset() {
        return secondaryDataset;
    }

    public void setSecondaryDataset(String secondaryDataset) {
        this.secondaryDataset = secondaryDataset;
    }

    public String getGraphType() {
        return graphType;
    }

    public void setGraphType(String graphType) {
        this.graphType = graphType;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getRFCStartDate() {
        SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
        Date date = new Date();
        try {
            date = format.parse(startDate);
            SimpleDateFormat rfcFormat = new SimpleDateFormat("yyyy-MM-dd");
            return rfcFormat.format(date);
        }
        catch(ParseException e){
            // Invalid Date String
            return "";
        }
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public String getRFCEndDate() {

        SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
        Date date = new Date();
        try {
            date = format.parse(endDate);
            SimpleDateFormat rfcFormat = new SimpleDateFormat("yyyy-MM-dd");
            return rfcFormat.format(date);
        }
        catch(ParseException e){
            // Invalid Date String
            return "";
        }
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
