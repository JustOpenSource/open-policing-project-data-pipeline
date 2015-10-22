var _ = require("underscore");
var csv = require("fast-csv");
var xlsx = require("node-xlsx");
var fs = require("fs");
var verify = require(__dirname + "/verify.js");

var incidentReportSchema = require("./schema/incident.1.json");

var mappings = {
    AIM : require("./mappings/AIM.1.json"),
    IAPro : require("./mappings/IAPro.1.json")
}

function getXLSX(filePath){

    var raw = xlsx.parse(fs.readFileSync(filePath));
    var data = raw[0].data;
    var headers = data[0];

    data = data.splice(1, data.length + 1);

    return {
        "headers" : headers,
        "data" : data
    }
}

function getCSV(filePath, cb){

    var gotHeaders = false;
    var headers = "";
    var results = [];

    csv.fromPath(filePath, {
    
        "delimiter": "\t"

    }).on("data", function(data){
        

        if(!gotHeaders){
            
            headers = data;
            gotHeaders = true;

        } else {

            results.push(data)
        }

    }).on("end", function(){
        
        cb({
            "headers" : headers,
            "data" : results
        });
    
    });
}

/*
processData
converts the orignal format into a normalized json format that matches the schema
*/
function processData(data, mapping){

    var processedData = [];

    _.each(data, function(row){

        var resultObject = {};

        _.each(row, function(field, index){

            resultObject[mapping.adjusted[index]] = field;

        });

        processedData.push(resultObject);
    })

    return processedData;
}

/*

*/
function writeOutputFiles(fileName, data, cb){
    var output = {
        "data" : data
    }

    fs.writeFile(__dirname + '/processed/' + fileName + '.json', JSON.stringify(output), function (err) {
        
        if (err) {
            cb(err);
        }

        console.log('success: /processed/' + fileName + '.json');

        cb(false);
    });
}

function processIAPro(){
    var IAPRO_FILE_NAME = '2014_redacted';
    var IAPRO_FILE = __dirname + "/data/" + IAPRO_FILE_NAME + '.xlsx';
    var IAPro = getXLSX(IAPRO_FILE);
    var IAProProcessed = processData(IAPro.data, mappings.IAPro);

    writeOutputFiles(IAPRO_FILE_NAME, IAProProcessed, function(err){
        
        if(err){
            console.log(err);
            return;
        }
    });
}

function processAIM(cb){
    var AIM_FILE_NAME = '2010_to_2013_stats';
    var AIM_FILE = __dirname + "/data/" + AIM_FILE_NAME + ".csv";

    getCSV(AIM_FILE, function(results){

        var AIMProcessed = processData(results.data, mappings.AIM);

        writeOutputFiles(AIM_FILE_NAME, AIMProcessed, function(err){
        
            if(err){
                console.log(err);
                cb(err);
                return;
            }

            cb();
        });
    });
}

function processAll(){
    var aim = require(__dirname + "/processed/2010_to_2013_stats.json");
    var iapro = require(__dirname + "/processed/2014_redacted.json");

    
    var all = _.extend(aim, iapro);

    writeOutputFiles("all", all, function(err){
        if(err){
            console.log(err);
            return;
        }
    });
}

function results(){
    processIAPro();
    processAIM(function(){
        processAll()
    });
    
}

module.exports = results();