
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
    let course1_days = course1.days;
    let course2_days = course2.days;
    if (course1_days.split('').map((day) => course2_days.includes(day)).includes(true)) { // check if course1 and 2 occur on at least one of the same days
      let course1_times = course1.time_range.split("-").map((time) => parseInt(time));
      let course2_times = course2.time_range.split("-").map((time) => parseInt(time));
      if (course1_times[0] <= course2_times[0] && course2_times[0] < course1_times[1]
          || course2_times[0] <= course1_times[0] && course1_times[0] < course2_times[1]) {
            return true;
      } else {
        return false
      }
    } else {
      return false;
    }
  } 

  hasConflict(section, schedule) {
    Object.values(schedule).forEach((scheduleClass) => {
      if (this.hasTimeOverlap(section, scheduleClass)) {
        console.log("returning true");
        return true;
      }
    });
    console.log("returning false");
    return false;
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
        let filteredSchedules = []
        console.log("==schedules before filter", schedules);
        schedules = schedules.forEach((schedule => {
          if (!(this.hasConflict(section, schedule))) filteredSchedules.push(schedule); 
        }));
        console.log("==schedules after filter", schedules);
        filteredSchedules.forEach((schedule, i) => {
          // Object.values(schedule).forEach((scheduleClass) => {
          //   if (this.hasTimeOverlap(section, scheduleClass)) {
          //     schedules.splice(i, 1);
          //   }
          // });
          schedule[courseName] = section;
        })
        allSchedules = allSchedules.concat(filteredSchedules); 
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