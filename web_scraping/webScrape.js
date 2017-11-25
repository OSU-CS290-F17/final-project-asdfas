var PythonShell = require('python-shell');
var fs = require('fs');
var execSync = require('exec-sync');

function getClassJSON (subjectCode, courseNum) {
    var command = "python soup_attempy.py " + subjectCode + " " + courseNum + " W18";
    var out = execSync(command);
    console.log(out);
    var parsedData;
            
    fs.readFile('web_scraping/data/cs161_W18.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        parsedData = JSON.parse(data);
        //console.log(JSON.stringify(parsedData));
        return JSON.stringify(parsedData);
        console.log("Success");
    });

    return parsedData;
    var options = {
        mode: "text",
        args: [subjectCode, courseNum, 'W18']
    };

    pyshell = new PythonShell('web_scraping/soup_attempt.py', options);
    pyshell.on('Done', function(results){
        // for (var i = 0; i < results.length; i++){
        //     results[i] = results[i].replace(/\r/g, '\n');
        //     results[i] = results[i].replace(/^(,)/,"");
        // }
        return "w234"
        try{                
            fs.readFile('web_scraping/data/cs161_W18.json', 'utf8', function (err, data) {
                if (err) throw err; // we'll not consider error handling for now
                parsedData = JSON.parse(data);
                //console.log(JSON.stringify(parsedData));
                return JSON.stringify(parsedData);
                console.log("Success");
            });
        }
        catch(err){
            throw err;
        }
    });
}

module.exports = {
    getClassJSON: getClassJSON
}