(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "ESTAB",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "LFO",
            alias: "Legal Form",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "LFO_LABEL",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "NAME",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "NAICS2017_LABEL",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "GEO_ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "NAICS2017",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "state",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "CBP CA test",
            alias: "Establishments for all legal forms of organization, in California for Accommodation and food services industry.",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.census.gov/data/2017/cbp?get=ESTAB,LFO,LFO_LABEL,NAME,NAICS2017_LABEL,GEO_ID&for=state:06&NAICS2017=72", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "ESTAB": feat[i].ESTAB,
                    "LFO": feat[i].LFO,
                    "LFO_LABEL": feat[i].LFO_LABEL,
                    "NAME": feat[i].NAME,
                    "GEO_ID": feat[i].GEO_ID,
                    "NAICS2017_LABEL": feat[i].NAICS2017_LABEL,
                    "state":feat[i].state
                      
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "CBP CA Test"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
