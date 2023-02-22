import React from "react";
import { ExportToCsv } from "export-to-csv";
function TableDownload ( { dataName, tableData, downloadFileType } )
{
    const options = {
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

    // Declare a flatten function that takes
    // object as parameter and returns the
    // flatten object
    const flattenObj = (obj) => {
        // The object which contains the
        // final result
        let result = {};

        // loop through the object "ob"
        // for (const key in obj) {
        Object.keys( obj ).forEach( ( key ) =>
        {
            // Sanitize the value if it's null or undefined.
            if ( obj[ key ] === null || obj[ key ] === undefined )
            {
                obj[ key ] = "-";
            }
            if ( typeof obj[ key ] === "object" && !Array.isArray( obj[ key ] ) )
            {
                const temp = flattenObj( obj[ key ] );
                for ( const j in temp )
                {
                    // Store temp in result
                    result[ key + "_" + j ] = temp[ j ];
                }
            }

            // Else store obj[key] in result directly
            else
            {
                result[ key ] = obj[ key ];
            }
        } );
        return result;
    };

    // This flattens an object into HTML elements.
    const flatMapObjArray = (objArray) => {
        // console.log("flatMapObjText(): ", obj);
        return objArray.map((obj, index) => {
            if (typeof obj === "object") {
                // console.log(
                //     "flattenObject, ",
                //     "obj = ",
                //     obj,
                //     " \n\n\n flattened object = ",
                //     flattenObject(obj),
                // );
                // return flatMapObj(obj, "_"); // flatMapObjText(obj);
                // return flattenObject(obj);
                return flattenObj(obj);
            } else if (Array.isArray(obj)) {
                return [...flatMapObjArray(obj)];
            } else {
                return obj;
            }
        });
    };

    // This flattens an object into HTML elements.
    const flatMapObjText = (obj) => {
        // console.log("flatMapObjText(): ", obj);
        return Object.entries(obj)
            .map((objProperty) => {
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    return `${flatMapObjText(objProperty[1])}`;
                } else {
                    return `${objProperty[0]}: ${objProperty[1]}`;
                }
            })
            .join("");
    };

    const download = (data, filetype) => {
        const flattenedData = flatMapObjArray(data);
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(flattenedData);
    };

    return (
        <div className="table-download-container">
            <button
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
