import React from "react";
import { ExportToCsv } from "export-to-csv";
import { 
    SanitizeObj,
    SanitizeObjArray,
    SpliceObjArray,
    flattenObj,
    flatMapObjArray,
    flatMapObjText } from "../ObjectUtils/ObjectUtils";

function TableDownload ( { dataName, tableData, downloadFileType } )
{
    const options = {
        filename:`UK-Crime-API-Results_${dataName}`,
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: true,
        title: `UK-Crime-API-Results_${dataName}`,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const download = ( data, filetype ) =>
    {
        const flattenedData = flatMapObjArray(data);
        // console.log(
        //     "TableDownload: ",
        //     "\nData = ",
        //     data,
        //     "\nData has ",
        //     data.length,
        //     "elements.",
        //     "\nFlattenedData = ",
        //     flattenedData,
        //     "\nFlattenedData has ",
        //     flattenedData.length,
        //     "elements.",
        // );
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(flattenedData);
    };

    return (
        <div className="table-download-container">
            <button className="button"
                onClick={() => {
                    download(tableData, downloadFileType);
                }}>
                Download Results (CSV)
            </button>
        </div>
    );
}

export default TableDownload;

/*

    const flatMapObj = (obj, parentKey = "_") => {
        return Object.entries(obj).map((objProperty) => {
            let key = objProperty[0];
            let value = objProperty[1];
            if (typeof value === "object" && value !== null) {
                key = `${parentKey}_${key}`;
                return flatMapObj(value, key);
            } else {
                return objProperty.join(": ");
                // objProperty[ 0 ] = `${ parentKey }_${ objProperty[ 0 ] }`;
                // return { objProperty[ 0 ]: objProperty[ 1 ] };
            }
        });
    };

    const flattenObject2 = (obj, keyName = "concat") => {
        var flattenedObj = {};
        if (obj) {
            Object.keys(obj).forEach((key) => {
                var newKey = `${keyName}_${key}`;
                if (typeof obj[key] === "object") {
                    // calling the function again
                    flattenObject(obj[key], newKey);
                } else {
                    flattenedObj[newKey] = obj[key];
                }
            });
        }
        //console.log( "flattendObj = ", flattenedObj );
        return flattenedObj;
    };

    const flattenObject = (obj, parentKey = "_") => {
        const flattened = {};

        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            // console.log("value = obj[", key, "] = ", (obj[key]));
            if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                // console.log(
                //     "Object.assign(flattened, flattenObject(value)) = ",
                //     flattened, flattenObject(value),
                // );
                Object.assign(flattened, flattenObject(value));
            } else {
                // console.log("flattened[", key, "] = value = ", flattened[key], value);
                flattened[key] = value;
            }
        });

        return flattened;
    };

            <Button onClick={getTransactionData}>
                Download transactions to csv
            </Button>
            <CSVLink
                data={transactionData}
                filename="transactions.csv"
                className="hidden"
                ref={csvLink}
                target="_blank"
            />
*/
