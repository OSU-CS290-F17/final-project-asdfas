import createSchedules from "./scheduleGenerator";
import Schedule from './schedule';
import breakGenerator from './breakGenerator';

class Scheduler {

  constructor(data) {
    // data should be a js object containing all values needed to initialize the application
    // identify elements for buttons and call corresponding functions on them
    // initialize all other variables
    this.courses = data.courses;
    this.breaks = data.breaks;
    this.schedules = data.schedules;

    this.handleAddBreakClick = this.handleAddBreakClick.bind(this);
    this.handleAddCourseClick = this.handleAddCourseClick.bind(this);
    this.handleCreateSchedulesClick = this.handleCreateSchedulesClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);

    var addCourseButton = document.querySelector('.add-course-button');
    addCourseButton.addEventListener('click', this.handleAddCourseClick);

    document.querySelector('.added-courses-container').addEventListener('click', this.handleRemoveCourseClick);

    var addBreakButton = document.querySelector('.add-break-button');
    addBreakButton.addEventListener('click', this.handleAddBreakClick);

    document.querySelector('.breaks-container table').addEventListener('click', this.handleRemoveBreakClick);

    var generateButton = document.getElementById('generate-schedules-button');
    generateButton.addEventListener('click', this.handleCreateSchedulesClick);

    var saveButton = document.getElementById('generate-schedules-button');
    saveButton.addEventListener('click', this.handleSaveClick);
  }

  // handle[x] functions should be passed directly to event listeners

  // use api route to get course data from server and add to existing courses
  handleAddCourseClick = (event) => {
    console.log("handling add class click");
    var self = this;
    var subject = document.querySelector('.subject-input').value.toUpperCase();
    var course = document.querySelector('.course-input').value;
    if(!subject || !course) {
      alert('Please enter valid subject and course');
    }
    else {
      var request = new XMLHttpRequest();
      var requestURL = 'api/' + subject + '/' + course;
      request.open('GET', requestURL);

      request.addEventListener('load', function(event) {
        if(event.target.status !== 200) {
          var message = event.target.response;
          alert('Error adding course: ' + message);
        }
        else {
          var fullCourse = (subject + course).toLowerCase();
          var sections = JSON.parse(event.target.response);
          var newCourse = {};
          newCourse[fullCourse] = sections;
          self.courses.push(newCourse);
          console.log('courses after add: ', self.courses);
          var courseContext = {
            subject: subject,
            course: course
          };
          var courseTemplate = require('../../views/partials/course.handlebars');
          var courseHTML = courseTemplate(courseContext);
          document.querySelector('.added-courses-container').insertAdjacentHTML('beforeend', courseHTML);
          document.querySelector('.subject-input').value = '';
          document.querySelector('.course-input').value = '';
        }
      });
      request.send();
    }
  }

  handleRemoveCourseClick = (event) => {
    if(!event.target.classList.contains('remove-course-button')) {
      return;
    }
    console.log("handling remove course click");
    var courseHTML = event.target.parentNode;
    var subject = courseHTML.querySelector('.course-subject').innerHTML;
    var course = courseHTML.querySelector('.course-number').innerHTML;
    var idx = this.courses.indexOf(subject+course);
    this.courses.splice(idx, 1);
    console.log('courses after remove: ', this.courses);
    courseHTML.remove();
  }

  // generate new break based on form data and add to breaks
  handleAddBreakClick = (event) => {
    // converts to 12-hour time for display
    function time12(hours) {
      var str;
      if(hours < 12) {
        str = Math.trunc(hours) + ':';
      }
      else {
        str = Math.trunc(hours) - 12 + ':';
      }
      if(hours % 1) {
        str += (hours % 1 * 60).toString();
      }
      else {
        str += '00';
      }
      if(hours < 12) {
        str += ' AM';
      }
      else {
        str += ' PM';
      }
      return str;
    }

    console.log("handling add break click");
    var name = document.querySelector('.name-input').value;
    var length = document.querySelector('.length-input').value;
    var startTime = document.querySelector('.start-time-input').value;
    var endTime = document.querySelector('.end-time-input').value;
    if(!name || !length || !startTime || !endTime) {
      alert('Please enter valid name, length, start time, and end time');
    }
    else {
      var startTime12 = time12(startTime);
      var endTime12 = time12(endTime);
      var breakContext = {
        name: name,
        length: length,
        startTime: startTime12,
        endTime: endTime12
      };
      this.breaks.push(breakGenerator(name, length, startTime, endTime));
      console.log('breaks after add: ', this.breaks);
      var breakTemplate = require('../../views/partials/break.handlebars');
      var breakHTML = breakTemplate(breakContext);
      document.querySelector('.top-boxes table tbody').insertAdjacentHTML('beforeend', breakHTML);
      document.querySelector('.name-input').value = '';
      document.querySelector('.length-input').value = '';
      document.querySelector('.start-time-input').value = '';
      document.querySelector('.end-time-input').value = '';
    }
  }

  handleRemoveBreakClick = (event) => {
    if(!event.target.classList.contains('remove-break-button')) {
      return;
    }
    console.log("handling remove break click");
    var name = event.target.parentNode.innerHTML;
    var breakHTML = event.target.parentNode.parentNode;
    var idx = this.breaks.indexOf(name);
    this.breaks.splice(idx, 1);
    console.log('breaks after remove: ', this.breaks);
    breakHTML.remove();
  }

  // call createSchedules with courses and breaks
  handleCreateSchedulesClick = (event) => {
    this.schedules = createSchedules(this.courses, this.breaks).map(schedule => new Schedule(schedule));

  }

  // post form data to server
  handleSaveClick = (event) => {

  }
}

export default Scheduler;
