import createSchedules from "./scheduleGenerator";

class Scheduler {

  constructor(data) {
    // data should be a js object containing all values needed to initialize the application
    // identify elements for buttons and call corresponding functions on them
    // initialize all other variables
    this.courses = data.courses;
    this.breaks = data.breaks;
    this.schedules = data.schedules;
  }

  // handle[x] functions should be passed directly to event listeners

  // use api route to get course data from server and add to existing courses
  handleAddCourseClick(event) {
    console.log("handling add class click");
    var subject = document.querySelector('.subject-input').value.toUpperCase();
    var course = document.querySelector('.course-input').value;
    if(!subject || !course) {
      alert('Please enter valid subject and course');
    }
    else {
      var request = new XMLHttpRequest();
      var requestURL = '/addCourse';
      request.open('POST', requestURL);

      var courseContext = {
        subject: subject,
        course: course
      };

      var requestBody = JSON.stringify(courseContext);
      request.setRequestHeader(
        'Content-Type', 'application/json'
      );

      request.addEventListener('load', function(event) {
        if(event.target.status !== 200) {
          var message = event.target.response;
          alert('Error adding course: ' + message);
        }
        else {
          var courseTemplate = require('../../views/partials/course.handlebars');
          var courseHTML = courseTemplate(courseContext);
          document.querySelector('.added-courses-container').insertAdjacentHTML('beforeend', courseHTML);
          document.querySelector('.subject-input').value = '';
          document.querySelector('.course-input').value = '';
        }
      });
      request.send(requestBody);
    }
  }

  // generate new break based on form data and add to breaks
  handleAddBreakClick(event) {
    console.log("handling add break click");
    var name = document.querySelector('.name-input').value;
    var length = document.querySelector('.length-input').value;
    var startTime = document.querySelector('.start-time-input').value;
    var endTime = document.querySelector('.end-time-input').value;
    if(!name || !length || !startTime || !endTime) {
      alert('Please enter valid name, length, start time, and end time');
    }
    else {
      var request = new XMLHttpRequest();
      var requestURL = '/addBreak';
      request.open('POST', requestURL);

      var breakContext = {
        name: name,
        length: length,
        startTime: startTime,
        endTime: endTime
      };

      var requestBody = JSON.stringify(breakContext);
      request.setRequestHeader(
        'Content-Type', 'application/json'
      );

      request.addEventListener('load', function(event) {
        if(event.target.status !== 200) {
          var message = event.target.response;
          alert('Error adding break: ' + message);
        }
        else {
          var breakTemplate = require('../../views/partials/break.handlebars');
          var breakHTML = breakTemplate(breakContext);
          document.querySelector('.top-boxes table tbody').insertAdjacentHTML('beforeend', breakHTML);
          document.querySelector('.name-input').value = '';
          document.querySelector('.length-input').value = '';
          document.querySelector('.start-time-input').value = '';
          document.querySelector('.end-time-input').value = '';
        }
      });
      request.send(requestBody);
    }
  }

  // call createSchedules with courses and breaks
  handleCreateSchedulesClick(event) {

  }

  // post form data to server
  handleSaveClick(event) {

  }
}

export default Scheduler;
