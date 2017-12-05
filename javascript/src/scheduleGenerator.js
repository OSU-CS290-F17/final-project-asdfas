
class ScheduleGenerator {
  makeSchedule = (courseName, classObj) => {
    let schedule = {}
    schedule[courseName] = classObj
    return schedule;
  }
  getClassArray = (course) => {
    return Object.values(course.sections);
  }
  hasTimeOverlap(course1, course2) {
    let course1_times = course1.time_range.split("-").map((time) => parseInt(time));
    let course2_times = course2.time_range.split("-").map((time) => parseInt(time));
    if (course1_times[0] < course2_times[0] && course2_times[0] < course1_times[1]
        || course2_times[0] < course1_times[0] && course1_times[0] < course2_times[1]) {
          return false;
    } else {
      return true
    }
  } 
  scheduleRecurs = (index) => {
    let courseName = Object.keys(this.all[index])[0];
    let course = Object.values(this.all[index])[0];
    let sections = this.getClassArray(course);
    console.log("==coursename", courseName);
    console.log("==index", index);
    if (index == this.all.length - 1) {
      return (sections.map(section => this.makeSchedule(courseName, section)));
    } else {
      let allSchedules = []
      sections.forEach((section) => {
        let schedules = this.scheduleRecurs(index + 1);
        console.log("==schedules", schedules);
        schedules.forEach((schedule, i) => {
          Object.values(schedule).forEach((scheduleClass) => {
            if (this.hasTimeOverlap(section, scheduleClass)) {
              schedules.splice(i, 1);
            }
          });
          schedule[courseName] = section;
        })
        allSchedules = allSchedules.concat(schedules); 
      })
      console.log("==allschedules", allSchedules);
      return allSchedules
    }
  }

  createSchedules = (courses, breaks) => {
    console.log(courses);
    console.log(breaks);
    this.all = courses.concat(breaks);
    this.final = this.scheduleRecurs(0);
    return this.final;

  }

}

export default ScheduleGenerator;