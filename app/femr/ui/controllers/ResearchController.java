package femr.ui.controllers;

import com.google.gson.Gson;
import com.google.inject.Inject;
import femr.business.helpers.DomainMapper;
import femr.common.dto.CurrentUser;
import femr.business.services.IResearchService;
import femr.business.services.ISessionService;

import femr.common.dto.ServiceResponse;
import femr.common.models.ResearchItem;
import femr.common.models.VitalItem;
import femr.data.models.Roles;
import femr.ui.helpers.security.AllowedRoles;
import femr.ui.helpers.security.FEMRAuthenticated;
import femr.ui.views.html.research.index;
import femr.ui.models.research.FilterViewModel;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;


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

        FilterViewModel filterViewModel = FilterViewModelForm.bindFromRequest().get();

        Map<Integer, ResearchItem> primaryItems = new HashMap<>();
        Map<Integer, ResearchItem> secondaryItems = new HashMap<>();

        // height, blood pressure - two fields to get
        String primaryDatasetName = filterViewModel.getPrimaryDataset();
        primaryItems = getDatasetItems(primaryDatasetName, filterViewModel);

        String secondaryDatasetName = filterViewModel.getSecondaryDataset();
        if (!secondaryDatasetName.isEmpty()) {

            secondaryItems = getDatasetItems(secondaryDatasetName, filterViewModel);
        }


        String jsonString = DomainMapper.createResearchGraphItem(primaryItems, secondaryItems);
        return ok(jsonString);

    }

    /*
    private Map<Integer, ResearchItem> getDatasetItems(String datasetName, FilterViewModel filterViewModel){

        ServiceResponse<Map<Integer, ResearchItem>> response = new ServiceResponse<>();

        switch(datasetName){

            // Single Value Vital Items
            case "weight":
            case "temperature":
            case "heartRate":
            case "respiratoryRate":
            case "oxygenSaturation":
            case "glucose":
            case "bloodPressureSystolic":
            case "bloodPressureDiastolic":

                response = researchService.getPatientVitals(filterViewModel.getPrimaryDataset(), filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;

            // Special Case Vital Item
            case "height":

                response = researchService.getPatientHeights(filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;

            // Patient Specific Items
            case "age":
            case "gender":
            case "pregnancyStatus":
            case "pregnancyTime":

                response = researchService.getPatientAttribute(datasetName, filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;

            // Medication Items
            case "prescribedMeds":
            case "dispensedMeds":

                response = researchService.getPatientMedications(datasetName, filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;


            default:

                // send something to trigger error: invalid data type
                break;

        }

        return response.getResponseObject();
    }
*/

    public Result getMedicationPost(){

        FilterViewModel filterViewModel = FilterViewModelForm.bindFromRequest().get();

        Map<Integer, String> medication = researchService.getMedication().getResponseObject();

        Gson gson = new Gson();

        String jsonString = gson.toJson(medication);
        return ok(jsonString);

    }



    private Map<Integer, ResearchItem> getDatasetItems(String datasetName, FilterViewModel filterViewModel){

        ServiceResponse<Map<Integer, ResearchItem>> response = new ServiceResponse<>();

        switch(datasetName){

            // Single Value Vital Items
            case "weight":
            case "temperature":
            case "heartRate":
            case "respiratoryRate":
            case "oxygenSaturation":
            case "glucose":
            case "bloodPressureSystolic":
            case "bloodPressureDiastolic":

                response = researchService.getPatientVitals(filterViewModel.getPrimaryDataset(), filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;

            // Special Case Vital Item
            case "height":

                response = researchService.getPatientHeights(filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;

            // Patient Specific Items
            case "age":
            case "gender":
            case "pregnancyStatus":
            case "pregnancyTime":

                response = researchService.getPatientAttribute(datasetName, filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;

            // Medication Items
            case "prescribedMeds":
            case "dispensedMeds":
                //response = researchService.getMedication();
                response = researchService.getPatientPrescriptions(filterViewModel.getStartDate(), filterViewModel.getEndDate());
                //response = researchService.getPatientMedications(datasetName, filterViewModel.getStartDate(), filterViewModel.getEndDate());
                break;


            default:

                // send something to trigger error: invalid data type
                break;

        }

        return response.getResponseObject();
    }

}
