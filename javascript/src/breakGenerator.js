function hoursToString(hours) {
  var str;
  if(hours >= 10) {
    str = Math.trunc(hours).toString();
  }
  else {
    str = '0' + Math.trunc(hours).toString();
  }
  if(hours % 1) {
    str = str + (hours % 1 * 60).toString();
  }
  else {
    str = str + '00';
  }
  return str;
}

function breakGenerator(name, length, startTime, endTime) {
  startTime = parseFloat(startTime);
  endTime = parseFloat(endTime);
  length = parseInt(length);
  console.log('endTime:', endTime);
  console.log('startTime:', startTime);
  console.log('length:', length);
  var numBreaks;
  if(length === 30) {
    numBreaks = (endTime - startTime) * 2;
  }
  else {
    numBreaks = Math.trunc((endTime - startTime) * 2 - (length / 60));
  }
  var breakObj = {};
  breakObj[name] = {};
  breakObj[name]['sections'] = {};

  console.log('numBreaks:', numBreaks);
  for(var i = 0; i < numBreaks; i++) {
    var j = i.toString();
    breakObj[name]['sections'][j] = {};
    breakObj[name]['sections'][j]['length_minutes'] = length.toString();
    var rangeStart = startTime + i * .5;
    var rangeEnd = rangeStart + (length / 60);
    rangeStart = hoursToString(rangeStart);
    rangeEnd = hoursToString(rangeEnd);
    breakObj[name]['sections'][j]['time_range'] = rangeStart + '-' + rangeEnd;
    breakObj[name]['sections'][j]['time'] = rangeStart;
    breakObj[name]['sections'][j]['days'] = "MTWRF";
  }
  return breakObj;
}

export default breakGenerator;
