package femr.ui.controllers;


import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.inject.Inject;
import femr.common.dto.CurrentUser;
import femr.business.services.IResearchService;
import femr.business.services.ISessionService;

import femr.common.dto.ServiceResponse;
import femr.data.models.Roles;
import femr.ui.helpers.security.AllowedRoles;
import femr.ui.helpers.security.FEMRAuthenticated;
import femr.ui.models.triage.IndexViewModelPost;
import femr.ui.views.html.research.index;
import femr.ui.models.research.FilterViewModel;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;


import femr.common.models.AgeGraphItem;

import java.text.SimpleDateFormat;
import java.util.*;


/**
 * This is the controller for the research page, it is currently not supported.
 * Research was designed before combining of some tables in the database
 */
@Security.Authenticated(FEMRAuthenticated.class)
@AllowedRoles({Roles.RESEARCHER})
public class ResearchController extends Controller {

    private final Form<FilterViewModel> FilterViewModelForm = Form.form(FilterViewModel.class);

    private IResearchService researchService;
    private ISessionService sessionService;

    /**
     * Research Controller constructer that Injects the services indicated by the parameters
     *
     * @param sessionService  {@link ISessionService}
     * @param researchService {@link IResearchService}
     */
    @Inject
    public ResearchController(ISessionService sessionService, IResearchService researchService) {
        this.researchService = researchService;
        this.sessionService = sessionService;
    }

    public Result indexGet() {

        // There isn't really a request here, should this be different?
        FilterViewModel viewModel = FilterViewModelForm.bindFromRequest().get();

        // Set Default Start (30 Days Ago) and End Date (Today)
        Calendar today = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        viewModel.setEndDate(dateFormat.format(today.getTime()));
        today.add(Calendar.DAY_OF_MONTH, -30);
        viewModel.setStartDate(dateFormat.format(today.getTime()));

        CurrentUser currentUserSession = sessionService.getCurrentUserSession();
        return ok(index.render(currentUserSession, viewModel));
    }

    public Result getGraphPost(){

        FilterViewModel viewModel = FilterViewModelForm.bindFromRequest().get();

        // Ages are a list of Dates
        // ServiceResponse<List<Date>> getAllPatientAges()
        ServiceResponse<List<Date>> response = researchService.getAllPatientAges();
        //*
        for (Date age : response.getResponseObject())
        {

            System.out.println(age);
        }
        //* /


        String graphType = viewModel.getGraphType();
        System.out.println(graphType);
        switch( graphType ){

            case "line":
                return ageLineGraphJSONGet();
                //break;

            case "pie":
                return agePieGraphJSONGet();
                //break;

            case "scatter":
                return ageScatterGraphJSONGet();
                //break;

            case "stacked-bar":
                return ageStackedBarGraphJSONGet();
                //break;

            case "grouped-bar":
                return ageStackedBarGraphJSONGet();
                //break;

            case "bar":
            default:
                return ageBarGraphJSONGet();
        }



        /*
        JsonObject jsonObject = new JsonObject();

        // Get Post Values

        // Call Service with type values

        // Build JSON Object for type

        // output json object
        return ok(jsonObject.toString());
        */
    }


    /**
     * Used for creating Patient Age Bar Graph
     * Called via ajax
     *
     * @return JSON object of patients and age ranges
     */
    public Result ageBarGraphJSONGet() {

        JsonObject jsonObject = new JsonObject();


        Random rand = new Random();

        // generate some sample ages
        int sampleSize = 500;
        int total = 0;
        int rangeHigh = 0;
        int rangeLow = 10000;


        Integer[] ages = new Integer[sampleSize];
        Map<String, Integer> ageRanges = new HashMap<String, Integer>();
        for( int i = 0; i < sampleSize; i++){

            ages[i] = rand.nextInt(105);

            // check range
            if( ages[i] > rangeHigh ){
                rangeHigh = ages[i];
            }

            if( ages[i] < rangeLow){
                rangeLow = ages[i];
            }

            // sum total for average
            total += ages[i];

            if( ages[i] <= 10 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("0-10") ){
                    rangeTotal = ageRanges.get("0-10");
                }
                rangeTotal++;

                ageRanges.put("0-10", rangeTotal);
            }
            else if( ages[i] <= 20 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("11-20") ){
                    rangeTotal = ageRanges.get("11-20");
                }
                rangeTotal++;

                ageRanges.put("11-20", rangeTotal);
            }
            else if( ages[i] <= 30 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("21-30") ){
                    rangeTotal = ageRanges.get("21-30");
                }
                rangeTotal++;

                ageRanges.put("21-30", rangeTotal);
            }
            else if( ages[i] <= 40 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("31-40") ){
                    rangeTotal = ageRanges.get("31-40");
                }
                rangeTotal++;

                ageRanges.put("31-40", rangeTotal);
            }
            else if( ages[i] <= 50 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("41-50") ){
                    rangeTotal = ageRanges.get("41-50");
                }
                rangeTotal++;

                ageRanges.put("41-50", rangeTotal);
            }
            else if( ages[i] <= 60 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("51-60") ){
                    rangeTotal = ageRanges.get("51-60");
                }
                rangeTotal++;

                ageRanges.put("51-60", rangeTotal);
            }
            else if( ages[i] <= 70 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("61-70") ){
                    rangeTotal = ageRanges.get("61-70");
                }
                rangeTotal++;

                ageRanges.put("61-70", rangeTotal);
            }
            else if( ages[i] <= 80 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("71-80") ){
                    rangeTotal = ageRanges.get("71-80");
                }
                rangeTotal++;

                ageRanges.put("71-80", rangeTotal);
            }
            else if( ages[i] <= 90 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("81-90") ){
                    rangeTotal = ageRanges.get("81-90");
                }
                rangeTotal++;

                ageRanges.put("81-90", rangeTotal);
            }
            else if( ages[i] <= 100 ) {

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("91-100") ){
                    rangeTotal = ageRanges.get("91-100");
                }
                rangeTotal++;

                ageRanges.put("91-100", rangeTotal);
            }
            else{

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("100+") ){
                    rangeTotal = ageRanges.get("100+");
                }
                rangeTotal++;

                ageRanges.put("100+", rangeTotal);
            }
        }

        // count ages in ranges
        // calculate average, median, range
        double average = total/sampleSize;

        Arrays.sort(ages, new Comparator<Integer>()
        {
            @Override
            public int compare(Integer x, Integer y)
            {
                return x - y;
            }
        });
        int median = ages[(int)Math.ceil(sampleSize/2)];

        // Make graph data random numbers for now - preserve index order
        List<AgeGraphItem> graphValues = new ArrayList<AgeGraphItem>();
        graphValues.add(0, new AgeGraphItem("0-10", ageRanges.get("0-10")));
        graphValues.add(1, new AgeGraphItem("11-20", ageRanges.get("11-20")));
        graphValues.add(2, new AgeGraphItem("21-30", ageRanges.get("21-30")));
        graphValues.add(3, new AgeGraphItem("31-40", ageRanges.get("31-40")));
        graphValues.add(4, new AgeGraphItem("41-50", ageRanges.get("41-50")));
        graphValues.add(5, new AgeGraphItem("51-60", ageRanges.get("51-60")));
        graphValues.add(6, new AgeGraphItem("61-70", ageRanges.get("61-70")));
        graphValues.add(7, new AgeGraphItem("71-80", ageRanges.get("71-80")));
        graphValues.add(8, new AgeGraphItem("81-90", ageRanges.get("81-90")));
        graphValues.add(9, new AgeGraphItem("91-100", ageRanges.get("91-100")));
        graphValues.add(10, new AgeGraphItem("100+", ageRanges.get("100+")));

        Gson gson = new Gson();

        jsonObject.addProperty("median", median);
        jsonObject.addProperty("average", average);
        jsonObject.addProperty("rangeLow", rangeLow);
        jsonObject.addProperty("rangeHigh", rangeHigh);
        jsonObject.addProperty("graphData", gson.toJson(graphValues));

        return ok(jsonObject.toString());
    }


    public Result ageLineGraphJSONGet(){

        JsonObject jsonObject = new JsonObject();

        Random rand = new Random();

        // generate some sample ages
        int maxAge = 105;
        int sampleSize = 500;
        int total = 0;
        int rangeHigh = 0;
        int rangeLow = 10000;


        Integer[] ages = new Integer[sampleSize];

        //Map<Integer, Integer> ageRanges = new HashMap<Integer, Integer>();
        int[] ageTotals = new int[maxAge];
        for( int i = 0; i < sampleSize; i++){

            ages[i] = rand.nextInt(maxAge);

            // get range
            if( ages[i] > rangeHigh ){
                rangeHigh = ages[i];
            }

            if( ages[i] < rangeLow){
                rangeLow = ages[i];
            }

            // sum total for average
            total += ages[i];

            ageTotals[ages[i]]++;

        }

        // count ages in ranges
        // calculate average, median, range
        double average = total/sampleSize;

        Arrays.sort(ages, new Comparator<Integer>()
        {
            @Override
            public int compare(Integer x, Integer y)
            {
                return x - y;
            }
        });
        int median = ages[(int)Math.ceil(sampleSize/2)];

        Gson gson = new Gson();

        jsonObject.addProperty("median", median);
        jsonObject.addProperty("average", average);
        jsonObject.addProperty("rangeLow", rangeLow);
        jsonObject.addProperty("rangeHigh", rangeHigh);
        jsonObject.addProperty("graphData", gson.toJson(ageTotals));

        return ok(jsonObject.toString());
    }

    public Result ageScatterGraphJSONGet(){

        JsonObject jsonObject = new JsonObject();

        Random rand = new Random();

        // generate some sample ages
        int maxAge = 105;
        int sampleSize = 10000;
        int total = 0;
        int rangeHigh = 0;
        int rangeLow = 10000;


        Integer[] ages = new Integer[sampleSize];

        //Map<Integer, Integer> ageRanges = new HashMap<Integer, Integer>();
        int[] ageTotals = new int[maxAge];
        for( int i = 0; i < sampleSize; i++){

            ages[i] = rand.nextInt(maxAge);

            // get range
            if( ages[i] > rangeHigh ){
                rangeHigh = ages[i];
            }

            if( ages[i] < rangeLow){
                rangeLow = ages[i];
            }

            // sum total for average
            total += ages[i];

            ageTotals[ages[i]]++;

        }

        // count ages in ranges
        // calculate average, median, range
        double average = total/sampleSize;

        Arrays.sort(ages, new Comparator<Integer>()
        {
            @Override
            public int compare(Integer x, Integer y)
            {
                return x - y;
            }
        });
        int median = ages[(int)Math.ceil(sampleSize/2)];

        Gson gson = new Gson();

        jsonObject.addProperty("median", median);
        jsonObject.addProperty("average", average);
        jsonObject.addProperty("rangeLow", rangeLow);
        jsonObject.addProperty("rangeHigh", rangeHigh);
        jsonObject.addProperty("graphData", gson.toJson(ageTotals));

        return ok(jsonObject.toString());

    }

    public Result agePieGraphJSONGet(){


        JsonObject jsonObject = new JsonObject();


        Random rand = new Random();

        // generate some sample ages
        int sampleSize = 500;
        int total = 0;
        int rangeHigh = 0;
        int rangeLow = 10000;


        Integer[] ages = new Integer[sampleSize];

        Map<String, Integer> ageRanges = new HashMap<String, Integer>();
        for( int i = 0; i < sampleSize; i++){

            ages[i] = rand.nextInt(105);

            // get range
            if( ages[i] > rangeHigh ){
                rangeHigh = ages[i];
            }

            if( ages[i] < rangeLow){
                rangeLow = ages[i];
            }

            // sum total for average
            total += ages[i];

            if( ages[i] <= 10 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("0-10") ){
                    rangeTotal = ageRanges.get("0-10");
                }
                rangeTotal++;

                ageRanges.put("0-10", rangeTotal);
            }
            else if( ages[i] <= 20 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("11-20") ){
                    rangeTotal = ageRanges.get("11-20");
                }
                rangeTotal++;

                ageRanges.put("11-20", rangeTotal);
            }
            else if( ages[i] <= 30 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("21-30") ){
                    rangeTotal = ageRanges.get("21-30");
                }
                rangeTotal++;

                ageRanges.put("21-30", rangeTotal);
            }
            else if( ages[i] <= 40 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("31-40") ){
                    rangeTotal = ageRanges.get("31-40");
                }
                rangeTotal++;

                ageRanges.put("31-40", rangeTotal);
            }
            else if( ages[i] <= 50 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("41-50") ){
                    rangeTotal = ageRanges.get("41-50");
                }
                rangeTotal++;

                ageRanges.put("41-50", rangeTotal);
            }
            else if( ages[i] <= 60 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("51-60") ){
                    rangeTotal = ageRanges.get("51-60");
                }
                rangeTotal++;

                ageRanges.put("51-60", rangeTotal);
            }
            else if( ages[i] <= 70 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("61-70") ){
                    rangeTotal = ageRanges.get("61-70");
                }
                rangeTotal++;

                ageRanges.put("61-70", rangeTotal);
            }
            else if( ages[i] <= 80 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("71-80") ){
                    rangeTotal = ageRanges.get("71-80");
                }
                rangeTotal++;

                ageRanges.put("71-80", rangeTotal);
            }
            else if( ages[i] <= 90 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("81-90") ){
                    rangeTotal = ageRanges.get("81-90");
                }
                rangeTotal++;

                ageRanges.put("81-90", rangeTotal);
            }
            else if( ages[i] <= 100 ) {

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("91-100") ){
                    rangeTotal = ageRanges.get("91-100");
                }
                rangeTotal++;

                ageRanges.put("91-100", rangeTotal);
            }
            else{

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("100+") ){
                    rangeTotal = ageRanges.get("100+");
                }
                rangeTotal++;

                ageRanges.put("100+", rangeTotal);
            }
        }

        // count ages in ranges
        // calculate average, median, range
        double average = total/sampleSize;

        Arrays.sort(ages, new Comparator<Integer>()
        {
            @Override
            public int compare(Integer x, Integer y)
            {
                return x - y;
            }
        });
        int median = ages[(int)Math.ceil(sampleSize/2)];

        // Make graph data random numbers for now - preserve index order
        List<AgeGraphItem> graphValues = new ArrayList<AgeGraphItem>();
        graphValues.add(0, new AgeGraphItem("0-10", ageRanges.get("0-10")));
        graphValues.add(1, new AgeGraphItem("11-20", ageRanges.get("11-20")));
        graphValues.add(2, new AgeGraphItem("21-30", ageRanges.get("21-30")));
        graphValues.add(3, new AgeGraphItem("31-40", ageRanges.get("31-40")));
        graphValues.add(4, new AgeGraphItem("41-50", ageRanges.get("41-50")));
        graphValues.add(5, new AgeGraphItem("51-60", ageRanges.get("51-60")));
        graphValues.add(6, new AgeGraphItem("61-70", ageRanges.get("61-70")));
        graphValues.add(7, new AgeGraphItem("71-80", ageRanges.get("71-80")));
        graphValues.add(8, new AgeGraphItem("81-90", ageRanges.get("81-90")));
        graphValues.add(9, new AgeGraphItem("91-100", ageRanges.get("91-100")));
        graphValues.add(10, new AgeGraphItem("100+", ageRanges.get("100+")));

        Gson gson = new Gson();

        jsonObject.addProperty("median", median);
        jsonObject.addProperty("average", average);
        jsonObject.addProperty("rangeLow", rangeLow);
        jsonObject.addProperty("rangeHigh", rangeHigh);
        jsonObject.addProperty("graphData", gson.toJson(graphValues));

        return ok(jsonObject.toString());
    }

    public Result ageStackedBarGraphJSONGet() {

        JsonObject jsonObject = new JsonObject();


        Random rand = new Random();

        // generate some sample ages
        int sampleSize = 500;
        int total = 0;
        int rangeHigh = 0;
        int rangeLow = 10000;


        Integer[] ages = new Integer[sampleSize];

        Map<String, Integer> ageRanges = new HashMap<String, Integer>();
        for( int i = 0; i < sampleSize; i++){

            ages[i] = rand.nextInt(105);

            // get range
            if( ages[i] > rangeHigh ){
                rangeHigh = ages[i];
            }

            if( ages[i] < rangeLow){
                rangeLow = ages[i];
            }

            // sum total for average
            total += ages[i];

            if( ages[i] <= 10 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("0-10") ){
                    rangeTotal = ageRanges.get("0-10");
                }
                rangeTotal++;

                ageRanges.put("0-10", rangeTotal);
            }
            else if( ages[i] <= 20 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("11-20") ){
                    rangeTotal = ageRanges.get("11-20");
                }
                rangeTotal++;

                ageRanges.put("11-20", rangeTotal);
            }
            else if( ages[i] <= 30 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("21-30") ){
                    rangeTotal = ageRanges.get("21-30");
                }
                rangeTotal++;

                ageRanges.put("21-30", rangeTotal);
            }
            else if( ages[i] <= 40 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("31-40") ){
                    rangeTotal = ageRanges.get("31-40");
                }
                rangeTotal++;

                ageRanges.put("31-40", rangeTotal);
            }
            else if( ages[i] <= 50 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("41-50") ){
                    rangeTotal = ageRanges.get("41-50");
                }
                rangeTotal++;

                ageRanges.put("41-50", rangeTotal);
            }
            else if( ages[i] <= 60 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("51-60") ){
                    rangeTotal = ageRanges.get("51-60");
                }
                rangeTotal++;

                ageRanges.put("51-60", rangeTotal);
            }
            else if( ages[i] <= 70 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("61-70") ){
                    rangeTotal = ageRanges.get("61-70");
                }
                rangeTotal++;

                ageRanges.put("61-70", rangeTotal);
            }
            else if( ages[i] <= 80 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("71-80") ){
                    rangeTotal = ageRanges.get("71-80");
                }
                rangeTotal++;

                ageRanges.put("71-80", rangeTotal);
            }
            else if( ages[i] <= 90 ){

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("81-90") ){
                    rangeTotal = ageRanges.get("81-90");
                }
                rangeTotal++;

                ageRanges.put("81-90", rangeTotal);
            }
            else if( ages[i] <= 100 ) {

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("91-100") ){
                    rangeTotal = ageRanges.get("91-100");
                }
                rangeTotal++;

                ageRanges.put("91-100", rangeTotal);
            }
            else{

                Integer rangeTotal = 0;
                if( ageRanges.containsKey("100+") ){
                    rangeTotal = ageRanges.get("100+");
                }
                rangeTotal++;

                ageRanges.put("100+", rangeTotal);
            }
        }

        // count ages in ranges
        // calculate average, median, range
        double average = total/sampleSize;

        Arrays.sort(ages, new Comparator<Integer>()
        {
            @Override
            public int compare(Integer x, Integer y)
            {
                return x - y;
            }
        });
        int median = ages[(int)Math.ceil(sampleSize/2)];

        // need: [ key: "0-10" male: 35 female: 35 ]


        // Make graph data random numbers for now - preserve index order
        //*
        List<AgeGraphItem> maleGraphValues = new ArrayList<AgeGraphItem>();
        maleGraphValues.add(0, new AgeGraphItem("0-10", ageRanges.get("0-10")/2));
        maleGraphValues.add(1, new AgeGraphItem("11-20", ageRanges.get("11-20")/2));
        maleGraphValues.add(2, new AgeGraphItem("21-30", ageRanges.get("21-30")/2));
        maleGraphValues.add(3, new AgeGraphItem("31-40", ageRanges.get("31-40")/2));
        maleGraphValues.add(4, new AgeGraphItem("41-50", ageRanges.get("41-50")/2));
        maleGraphValues.add(5, new AgeGraphItem("51-60", ageRanges.get("51-60")/2));
        maleGraphValues.add(6, new AgeGraphItem("61-70", ageRanges.get("61-70")/2));
        maleGraphValues.add(7, new AgeGraphItem("71-80", ageRanges.get("71-80")/2));
        maleGraphValues.add(8, new AgeGraphItem("81-90", ageRanges.get("81-90")/2));
        maleGraphValues.add(9, new AgeGraphItem("91-100", ageRanges.get("91-100")/2));
        maleGraphValues.add(10, new AgeGraphItem("100+", ageRanges.get("100+")/2));

        List<AgeGraphItem> femaleGraphValues = new ArrayList<AgeGraphItem>(maleGraphValues);
        //*/

        List graphValues = new ArrayList();
        graphValues.add(maleGraphValues);
        graphValues.add(femaleGraphValues);


        Gson gson = new Gson();

        jsonObject.addProperty("median", median);
        jsonObject.addProperty("average", average);
        jsonObject.addProperty("rangeLow", rangeLow);
        jsonObject.addProperty("rangeHigh", rangeHigh);
        jsonObject.addProperty("graphData", gson.toJson(graphValues));

        return ok(jsonObject.toString());


    }

}
