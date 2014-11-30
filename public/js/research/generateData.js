/**
 * Created by Khoa on 10/31/2014.
 */

jQuery(document).ready(function(){


    //*** Loop Start
    for (var i=0; i<10; i++) {
        // Generate new vitals/demographics every time - maybe change patient name
        var postData = {

            firstName: (randomString()),
            lastName: (randomString()),
            address: (randomInt(100, 2000)) + ' address',
            city: 'anywhere',
            age: (randomInt(1950, 2000)) + '-' + (randomInt(1, 12)) + '-' + (randomInt(1, 12)),
            sex: (randomGender()),

            bloodPressureSystolic: (randomInt(110, 150)),
            bloodPressureDiastolic: (randomInt(60, 100)),
            heartRate: (randomInt(10, 60)),
            temperature: (randomInt(92, 101)),
            respiratoryRate: (randomInt(10, 22)),
            oxygenSaturation: (randomInt(80, 100)),
            heightFeet: (randomInt(0, 7)),
            heightInches: (randomInt(0, 12)),
            weight: (randomInt(92, 101)),
            glucose: null,
            chiefComplaint: null,
            weeksPregnant: null

            // Add the rest of the form fields here
        };

        $.post("/triage?id=0", postData, function (responseData) {

            console.log(postData);

        });
    }
    //*** Loop End

});


function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
};

function randomGender(){
    var genderSelection = ['Male','Female'];
    var gender = Math.floor(Math.random() * genderSelection.length);
    return genderSelection[gender];
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
};