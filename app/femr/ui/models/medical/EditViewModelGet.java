package femr.ui.models.medical;

import femr.common.models.*;
import femr.util.DataStructure.Mapping.VitalMultiMap;

import java.util.List;
import java.util.Map;

public class EditViewModelGet {
    //The patient being seen
    private PatientItem patientItem;
    //Mapped vitals for the patient
    private VitalMultiMap vitalMap;
    //The current encounter of the patient
    private PatientEncounterItem patientEncounterItem;
    //tracks the number of hpi tabs to generate
    private int numberOfHpiTabs;
    //List of problems for the patient
    private List<ProblemItem> problemItems;
    //List of prescriptions for the patient
    private List<PrescriptionItem> prescriptionItems;

    //photos for the medical tab
    private List<PhotoItem> photos;

    private SettingItem settings;



    /* Custom Tab Content */
    private List<TabItem> customTabs;
    //Map<tabName, list of field names>
    private Map<String, List<TabFieldItem>> customFields;
    /* Non-Custom Tab Content */
    //Map<fieldName, field content>
    private Map<String, TabFieldItem> staticFields;

    public PatientItem getPatientItem() {
        return patientItem;
    }

    public void setPatientItem(PatientItem patientItem) {
        this.patientItem = patientItem;
    }

    public VitalMultiMap getVitalMap() {
        return vitalMap;
    }

    public void setVitalMap(VitalMultiMap vitalMap) {
        this.vitalMap = vitalMap;
    }

    public PatientEncounterItem getPatientEncounterItem() {
        return patientEncounterItem;
    }

    public void setPatientEncounterItem(PatientEncounterItem patientEncounterItem) {
        this.patientEncounterItem = patientEncounterItem;
        Integer numberOfHpiTabs = patientEncounterItem.getChiefComplaints().size();
        if (numberOfHpiTabs == null || numberOfHpiTabs == 0){
            numberOfHpiTabs = 1;
        }
        this.numberOfHpiTabs = numberOfHpiTabs;
    }

    public List<ProblemItem> getProblemItems() {
        return problemItems;
    }

    public void setProblemItems(List<ProblemItem> problemItems) {
        this.problemItems = problemItems;
    }

    public List<PrescriptionItem> getPrescriptionItems() {
        return prescriptionItems;
    }

    public void setPrescriptionItems(List<PrescriptionItem> prescriptionItems) {
        this.prescriptionItems = prescriptionItems;
    }

    public List<TabItem> getCustomTabs() {
        return customTabs;
    }

    public void setCustomTabs(List<TabItem> customTabs) {
        this.customTabs = customTabs;
    }

    public Map<String, List<TabFieldItem>> getCustomFields() {
        return customFields;
    }

    public void setCustomFields(Map<String, List<TabFieldItem>> customFields) {
        this.customFields = customFields;
    }

    public Map<String, TabFieldItem> getStaticFields() {
        return staticFields;
    }

    public void setStaticFields(Map<String, TabFieldItem> staticFields) {
        this.staticFields = staticFields;
    }

    public List<PhotoItem> getPhotos() {
        return photos;
    }

    public void setPhotos(List<PhotoItem> photos) {
        this.photos = photos;
    }

    public int getNumberOfHpiTabs() {
        return numberOfHpiTabs;
    }

    public void setNumberOfHpiTabs(int numberOfHpiTabs) {
        this.numberOfHpiTabs = numberOfHpiTabs;
    }

    public SettingItem getSettings() {
        return settings;
    }

    public void setSettings(SettingItem settings) {
        this.settings = settings;
    }
}
