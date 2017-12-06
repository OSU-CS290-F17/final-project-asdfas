import Scheduler from "./scheduler";

var data = {
  'courses': [],
  'breaks': [],
  'schedules': []
};

console.log('initial data:', data);

if (document.querySelector('main.edit')) {
  var scheduler = new Scheduler({});
}
