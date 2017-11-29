import Scheduler from "./scheduler";

var data = {
  "cs290": {
    "001": {
      "days": "mwf",
      "time": "3:00pm",
      "instructor": "Hess, Rob",
      "type": "lecture",
      "crn": "23049",
      "location": "LInC 210"
    }
  },
  "agri402": {
    "001": {
      "days": "tr",
      "time": "9:00am",
      "instructor": "Gaebel, K.",
      "type": "lecture",
      "crn": "73008",
      "location": "ALS 0008"
    }
  }
}


var scheduler = new Scheduler(data);

var addCourseButton = document.querySelector('.add-course-button');
addCourseButton.addEventListener('click', scheduler.handleAddCourseClick);

var addBreakButton = document.querySelector('.add-break-button');
addBreakButton.addEventListener('click', scheduler.handleAddBreakClick);
