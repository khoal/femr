package femr.common.models;

import java.util.Date;

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
public class ResearchItem {

    private int patientId;
    private float dataSet1;
    private float dataSet2;
    private String dataType1;
    private String dataType2;


    public ResearchItem( ){
        //default empty values
        this.patientId = 0;
        this.dataSet1 = 0;
        this.dataSet2 = 0;
        this.dataType1 = "";
        this.dataType2 = "";
    }



    public ResearchItem( int id, String type1, float set1){
        this.patientId = id;
        this.dataSet1 = set1;
        this.dataSet2 = 0;
        this.dataType1 = type1;
        this.dataType2 = "";
    }

    public ResearchItem( int id, String type1, float set1, String type2, float set2){
        this.patientId = id;
        this.dataSet1 = set1;
        this.dataSet2 = set2;
        this.dataType1 = type1;
        this.dataType2 = type2;
    }





    public int getpatientId() {
        return patientId;
    }

    public void setpatientId(int id) {
        patientId = id;
    }

    public float getDataSet1() {
        return dataSet1;
    }

    public void setDataSet1(float dataSet) {
        this.dataSet1 = dataSet;
    }

    public float getDataSet2() {
        return dataSet2;
    }

    public void setDataSet2(float dataSet) {
        this.dataSet2 = dataSet;
    }

    public String getDataType1() {
        return dataType1;
    }

    public void setDataType1(String dataType) {
        this.dataType1 = dataType;
    }

    public String getDataType2() {
        return dataType2;
    }

    public void setDataType2(String dataType) {
        this.dataType2 = dataType;
    }
}

