var _ = require("underscore");
var schema = require("./schema/incident.1.json");
var aim = require("./mappings/AIM.1.json");
var iapro = require("./mappings/IAPro.1.json");
var combined = _.uniq(aim.adjusted.concat(iapro.adjusted));
var headers = require("./lang/en.json");

function l(m){
    console.log(m);
    console.log('');
}

function main(){
    
    l('\n');
    l('---- Schema and Mappings Report ----');
    l('# of AIM Headers: ' + aim.adjusted.length);
    l('# of IAPro Headers: ' + iapro.adjusted.length);
    l('# of Combined (deduped) Headers: ' + combined.length);
    l('# of Schema Headers: ' + Object.keys(schema.properties).length);

    //check for missing aim fields from schema
    var missingAIM = [];

    _.each(aim.adjusted, function(field){
        
        if(!schema.properties[field]){
            l('AIM schema is missing field: ' + field);
            missingAIM.push(field);
        }
    });

    if(missingAIM.length === 0){
        l('All AIM fields are present in schema');
    } else {
        throw new Error('AIM fields missing from schema: ' + missingAIM.join(', '))
    }

    //check for missing iapro fields from schema
    var missingIAPro = [];
    
    _.each(iapro.adjusted, function(field){
        
        if(!schema.properties[field]){
            l('IAPro schema is missing field: ' + field);
            missingIAPro.push(field);
        }
    });

    if(missingIAPro.length === 0){
        l('All IAPro fields are present in schema');
    } else {
        throw new Error('IApro fields missing from schema: ' + missingIAPro.join(', '))
    }

    //check for schema fields not being used by any of the mappings
    var extraSchemaField = [];
    
    _.each(schema.properties, function(field, key){

        if(combined.indexOf(key) === -1){
            l('Schema key is not being used: ' + key);
            extraSchemaField.push(key);
        }
    });

    if(extraSchemaField.length === 0){
        l('There are no unused fields in schema');
    } else {
        throw new Error('Unused fields in schema: ' + extraSchemaField.join(', '))
    }

    //check for schema fields not being used by any of the mappings
    var missingHeaders = [];
    
    _.each(schema.properties, function(field, key){

        if(!headers[key]){
            l('Header is missing a property: ' + key);
            missingHeaders.push(key);
        }
    });

    if(missingHeaders.length === 0){
        l('There are no missing headers in en.json');
    } else {
        throw new Error('Missing headers: ' + missingHeaders.join(', '))
    }
}

module.exports = main();