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
package femr.data.models;

import java.util.Collection;

/**
 * Created by kevin on 7/20/14.
 */
public interface IChiefComplaint {
    int getId();

    String getValue();

    void setValue(String value);

    IPatientEncounter getPatientEncounter();

    void setPatientEncounter(IPatientEncounter patientEncounter);

//    Collection<PatientEncounterTabField> getPatientEncounterTabFields();
//
//    void setPatientEncounterTabFields(Collection<PatientEncounterTabField> patientEncounterTabFields);
}
