var courseRow = require('../../views/partials/scheduleRow.handlebars');

class Schedule {
  constructor(data) {

  }

  get html() {
    let template = Handlebars.compile(courseRow)
    return template({id: this.id});
  }
}

export default Schedule;
