import createSchedules from "./scheduleGenerator";
import Schedule from './schedule';

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
  }

  // handle[x] functions should be passed directly to event listeners

  // use api route to get course data from server and add to existing courses
  handleAddCourseClick = (event) => {
    console.log("handling add class click");
  }

  // generate new break based on form data and add to breaks
  handleAddBreakClick = (event) => {

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