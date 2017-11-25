var PythonShell = require('python-shell');
var fs = require('fs');

function getClassJSON (subjectCode, courseNum) {
    var options = {
        mode: "text",
        args: [subjectCode, courseNum, 'W18']
    };
    var parsedData = "";
    pyshell = new PythonShell('web_scraping/soup_attempt.py', options);
    pyshell.on('Done', function(results){
        // for (var i = 0; i < results.length; i++){
        //     results[i] = results[i].replace(/\r/g, '\n');
        //     results[i] = results[i].replace(/^(,)/,"");
        // }
        fs.readFile('web_scraping/data/cs161_W18.json', 'utf8', function (err, data) {
            if (err) throw err; // we'll not consider error handling for now
            parsedData = JSON.parse(data);
            //console.log(JSON.stringify(parsedData));
            return JSON.stringify(parsedData);
            console.log("Success");
        });
    });
}

module.exports = {
    getClassJSON: getClassJSON
}