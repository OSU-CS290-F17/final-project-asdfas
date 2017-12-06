import Scheduler from "./scheduler";

var data = {
  'courses': [],
  'breaks': [],
  'schedules': []
};

console.log('initial data: ', JSON.stringify(data));

var scheduler = new Scheduler(data);
