/*
     fEMR - fast Electronic Medical Records
     Copyright (C) 2014  Team fEMR

     fEMR is free software: you can redistribute it and/or modify
     it under the terms of the GNU General Public License as published by
     the Free Software Foundation, either version 3 of the License, or
     (at your option) any later version.

     fEMR is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     GNU General Public License for more details.

     You should have received a copy of the GNU General Public License
     along with fEMR.  If not, see <http://www.gnu.org/licenses/>. If
     you have any questions, contact <info@teamfemr.org>.
*/
package femr.business.services;


import com.avaje.ebean.ExpressionList;
import com.avaje.ebean.Query;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Provider;
import femr.business.helpers.DomainMapper;
import femr.business.helpers.QueryProvider;
import femr.common.dto.ServiceResponse;
import femr.common.models.*;
import femr.data.daos.IRepository;
import femr.data.models.*;
import femr.util.calculations.dateUtils;

import java.text.SimpleDateFormat;
import java.util.*;

public class ResearchService implements IResearchService {


    //repositories
    private final IRepository<IChiefComplaint> chiefComplaintRepository;
    private final IRepository<IPatient> patientRepository;
    private final IRepository<IPatientEncounter> patientEncounterRepository;
    private final IRepository<IPatientEncounterVital> patientEncounterVitalRepository;
    private final IRepository<IUser> userRepository;
    private final IRepository<IVital> vitalRepository;
    private final Provider<IPatientEncounterVital> patientEncounterVitalProvider;

    private final DomainMapper domainMapper;

    /**
     * Initializes the research service and injects the dependence
     */
    @Inject
    public ResearchService(IRepository<IChiefComplaint> chiefComplaintRepository,
                           IRepository<IPatient> patientRepository,
                           IRepository<IPatientEncounter> patientEncounterRepository,
                           IRepository<IPatientEncounterVital> patientEncounterVitaRepository,
                           IRepository<IUser> userRepository,
                           IRepository<IVital> vitalRepository,
                           Provider<IPatientEncounterVital> patientEncounterVitalProvider,

                           DomainMapper domainMapper) {
        this.chiefComplaintRepository = chiefComplaintRepository;
        this.patientRepository = patientRepository;
        this.patientEncounterRepository = patientEncounterRepository;
        this.patientEncounterVitalRepository = patientEncounterVitaRepository;
        this.userRepository = userRepository;
        this.vitalRepository = vitalRepository;
        this.patientEncounterVitalProvider = patientEncounterVitalProvider;
        this.domainMapper = domainMapper;
    }

    //TODO: Implement research business logic

    /**
     * {@inheritDoc}
     */
    @Override
    public ServiceResponse<List<PatientItem>> getAllPatientItems() {
        ServiceResponse<List<PatientItem>> response = new ServiceResponse<>();

        try {
            List<? extends IPatient> patients = patientRepository.findAll(Patient.class);
            List<PatientItem> patientItems = new ArrayList<>();
            for (IPatient v : patients) {
                float temp = 2;
                patientItems.add(domainMapper.createPatientItem(v, 2, 2, 2, temp));
            }
            response.setResponseObject(patientItems);
        } catch (Exception ex) {
            response.addError("exception", ex.getMessage());
        }
        /*
        for (PatientItem v : response.getResponseObject())
        {
            System.out.println(v.getId());
            System.out.println(v.getBirth());
        }
        */
        return response;
    }

    public ServiceResponse<List<Date>> getAllPatientAges() {
        ServiceResponse<List<Date>> response = new ServiceResponse<>();

        try {
            List<? extends IPatient> patients = patientRepository.findAll(Patient.class);
            List<Date> patientAges = new ArrayList<>();
            for (IPatient patientAge : patients) {
                patientAges.add(patientAge.getAge());
            }
            response.setResponseObject(patientAges);
        } catch (Exception ex) {
            response.addError("exception", ex.getMessage());
        }




        return response;
    }

    /**
     * {@inheritDoc}
     */
    public ServiceResponse<Map<Integer, ResearchItem>> getPatientVitals(String vitalName, String startDateString, String endDateString) {

        ServiceResponse<Map<Integer, ResearchItem>> response = new ServiceResponse<>();

        try {

            SimpleDateFormat sqlFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            // Set Start Date to start of day
            String startParseDate = startDateString + " 00:00:00";
            Date startDateObj = sqlFormat.parse(startParseDate);
            // Set End Date to end of day
            String parseEndDate = endDateString + " 23:59:59";
            Date endDateObj = sqlFormat.parse(parseEndDate);

            Query q = QueryProvider.getPatientEncounterVitalQuery();
            q.fetch("vital")
                    .where()
                    .gt("dateTaken", sqlFormat.format(startDateObj))
                    .lt("dateTaken", sqlFormat.format(endDateObj))
                    .eq("vital.name", vitalName)
                    .orderBy("vitalValue")
                    .findList();

            List<? extends IPatientEncounterVital> patientEncounterVitals = patientEncounterVitalRepository.find(q);
            Map<Integer, ResearchItem> researchItems = new HashMap<>();
            for (IPatientEncounterVital eVital : patientEncounterVitals) {

                researchItems.put(
                        eVital.getPatientEncounterId(),
                        new ResearchItem(
                                eVital.getPatientEncounterId(),
                                vitalName,
                                eVital.getVitalValue(),
                                eVital.getVital().getUnitOfMeasurement()
                        )
                );

            }
            response.setResponseObject(researchItems);

        } catch (Exception ex) {

            response.addError("exception", ex.getMessage());
        }

        return response;
    }

    /**
     * {@inheritDoc}
     */
    public ServiceResponse<Map<Integer, ResearchItem>> getPatientAttribute(String attributeName, String startDateString, String endDateString) {

        ServiceResponse<Map<Integer, ResearchItem>> response = new ServiceResponse<>();

        try {

            SimpleDateFormat sqlFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            // Set Start Date to start of day
            String startParseDate = startDateString + " 00:00:00";
            Date startDateObj = sqlFormat.parse(startParseDate);
            // Set End Date to end of day
            String parseEndDate = endDateString + " 23:59:59";
            Date endDateObj = sqlFormat.parse(parseEndDate);

            // Get patients that had an encounter between startDate and endDate
            // using dateOfTriageVisit for now -- might want to also check dateOfMedicalVisit & dateOfPharmacyVisit
            Query q = QueryProvider.getPatientEncounterQuery();
            q.fetch("patient")
                    .where()
                    .gt("dateOfTriageVisit", sqlFormat.format(startDateObj))
                    .lt("dateOfTriageVisit", sqlFormat.format(endDateObj))
                    .findList();

            List<? extends IPatientEncounter> encounters = patientEncounterRepository.find(q);
            Map<Integer, ResearchItem> researchItems = new HashMap<>();
            for (IPatientEncounter encounter : encounters) {

                IPatient patient = encounter.getPatient();

                switch (attributeName) {

                    case "age":

                        Float age = (float)Math.floor(dateUtils.getAgeFloat(patient.getAge()));

                        researchItems.put(
                                encounter.getId(),
                                new ResearchItem(
                                        encounter.getId(),
                                        "age",
                                        age,
                                        "years"
                                )
                        );
                        break;
                    case "gender":

                        float gender = -1;
                        // Do case in-sensitve comparison to be safe
                        if ( patient.getSex().matches("(?i:Male)") ) {gender = 0;}
                        else if ( patient.getSex().matches("(?i:Female)") ) {gender = 1;}
                        researchItems.put(
                                encounter.getId(),
                                new ResearchItem(
                                        encounter.getId(),
                                        "gender",
                                        gender,
                                        ""
                                )
                        );

                        break;

                    case "pregnancyStatus":

                        Integer wksPregnant = encounter.getWeeksPregnant();
                        if( wksPregnant == null ) wksPregnant = 0;
                        float pregnancyStatus = 0;
                        if( wksPregnant > 0 ){
                            pregnancyStatus = 1;
                        }
                        researchItems.put(
                                encounter.getId(),
                                new ResearchItem(
                                        encounter.getId(),
                                        "pregnancyStatus",
                                        pregnancyStatus,
                                        ""
                                )
                        );

                        break;

                    case "pregnancyTime":


                        Integer weeksPregnant = encounter.getWeeksPregnant();
                        if( weeksPregnant == null ) weeksPregnant = 0;
                        researchItems.put(
                                encounter.getId(),
                                new ResearchItem(
                                        encounter.getId(),
                                        "pregnancyTime",
                                        weeksPregnant,
                                        "weeks"
                                )
                        );
                        break;
                }
            }

            response.setResponseObject(researchItems);

        } catch (Exception ex) {
            response.addError("exception", ex.getMessage());
        }

        return response;

    }

    /**
     * {@inheritDoc}
     */
    public ServiceResponse<Map<Integer, ResearchItem>> getPatientMedications(String medicationType, String startDateString, String endDateString){

        ServiceResponse<Map<Integer, ResearchItem>> response = new ServiceResponse<>();


        return response;
    }


    /*

    ReturnData
    - patient ID
    -

    Demographics
    ** data from patients table
    ** date from patient_encouters
    - Age
    - Gender

    ** data and date from patient_encounters table
    - Pregnancy Status (Weeks > 0 || weeks != null => yes)
    - Weeks Pregnant

    Vitals
    ** id from vitals table
    ** data from patient_encounter_vitals table
    ** date from patient_encounters table
    - Temperature
    - Blood Pressure (Systolic, Diastolic)
    - Heart Rate
    - Respirations
    - Pregnancy Status
    - Oxygen Saturation
    - Glucose
    - Height (feet, inches)
    - Weight

     */


}
