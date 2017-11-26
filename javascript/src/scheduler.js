import createSchedules from "./scheduleGenerator"

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
  }

  // generate new break based on form data and add to breaks
  handleAddBreakClick(event) {

  }

  // call createSchedules with courses and breaks
  handleCreateSchedulesClick(event) {

  }

  // post form data to server
  handleSaveClick(event) {

  }
}

export default Scheduler;