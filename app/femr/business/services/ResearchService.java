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
import com.google.inject.Inject;
import com.google.inject.Provider;
import femr.business.helpers.DomainMapper;
import femr.business.helpers.QueryHelper;
import femr.business.helpers.QueryProvider;
import femr.common.dto.ServiceResponse;
import femr.data.daos.IRepository;
import femr.data.models.*;
import femr.common.models.PatientEncounterItem;
import femr.common.models.PatientItem;
import femr.common.models.VitalItem;
import femr.util.calculations.dateUtils;
import femr.util.stringhelpers.StringUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ResearchService implements IResearchService{


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
    public ResearchService (IRepository<IChiefComplaint> chiefComplaintRepository,
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
                patientItems.add(domainMapper.createPatientItem(v ,2,2,2, temp));
            }
            response.setResponseObject(patientItems);
        } catch (Exception ex) {
            response.addError("exception", ex.getMessage());
        }
        System.out.println(response.getResponseObject().toString());
        return response;
    }


}
