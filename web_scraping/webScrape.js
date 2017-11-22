module.exports = {
    getClassJSON: function(subjectCode, courseNum) {
        cs290 = {
            "001": {
              "days": "mwf",
              "time": "3:00pm",
              "instructor": "Hess, Rob",
              "crn": "23049",
              "location": "LInC 210"
            }
        }
        return cs290;
        //returns JSON of class with section objects inside
        //add "type" : "lecture"
    }
};