# Open Policing Project Data Pipeline

## Schema
The [Incident Schema](https://github.com/JustOpenSource/open-policing-project-data-pipeline/blob/master/schema/incident.1.json) describes the various fields of an incident report.

## Lang
The lang directory contains a json file with [plain english translation of the fields](https://github.com/JustOpenSource/open-policing-project-data-pipeline/blob/master/lang/en.json) (for the purposes of table headings and other user interfaces).

## Mappings
The mappings describe which field from a given file type map onto which field within the schema.  

### AIM
[AIM](https://github.com/JustOpenSource/open-policing-project-data-pipeline/blob/master/mappings/AIM.1.json)

### IAPro
[IAPro](https://github.com/JustOpenSource/open-policing-project-data-pipeline/blob/master/mappings/IAPro.1.json)

##Main
The [main.js](https://github.com/JustOpenSource/open-policing-project-data-pipeline/blob/master/main.js) file converts the original file formats into a format that matches the schema, based on the file mappings.

To run it:

```$ cd open-policing-project-data-pipeline```

```$ node main.js```

