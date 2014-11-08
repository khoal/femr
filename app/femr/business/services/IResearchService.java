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

import com.google.gson.JsonObject;
import femr.common.dto.ServiceResponse;
import femr.common.models.PatientEncounterItem;
import femr.common.models.PatientItem;
import femr.common.models.VitalItem;
import femr.common.models.ResearchItem;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Interface for the Research Service
 */
public interface IResearchService {

    ServiceResponse<List<PatientItem>> getAllPatientItems();

    ServiceResponse<List<Date>> getAllPatientAges();
    //ServiceResponse<List<PatientItem>> getData();

    /**
     * Retrieve patient and update the patients sex. Used when a user submits a sex for
     * a patient with a previously unidentified sex.
     *
     * @param vitalType the string name of the vital to lookup
     * @param startDate starting range of vital taken range
     * @param endDate ending range of vital taken range
     * @return a map of unique readings of vitalType indexed by encounterID
     */
    public ServiceResponse<Map<Integer,VitalItem>> getPatientVitals(String vitalType, String startDate, String endDate);
    public ServiceResponse<String> getPatientAttribute(String attributeName, String startDateString, String endDateString);
}
