import React from "react";

export const SanitizeObj = (obj) => {
    console.log("SanitizeObj :: obj = ", obj);
    return Object.keys(obj).forEach((key) => {
        console.log("SanitizeObj :: key = ", key, " :: obj[key] = ", obj[key]);

        // Sanitize the value if it's null or undefined.
        if (
            obj[key] === null ||
            obj[key] === undefined ||
            obj[key] === "" ||
            obj[key] === " "
        ) {
            obj[key] = "-";
        }

        if (obj[key]) {
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                console.log(
                    "SanitizeObj :: obj has a nested object :: key = ",
                    key,
                    " :: obj[key] = ",
                    obj[key],
                );
                obj[key] = SanitizeObj(obj[key]);
            } else if (Array.isArray(obj[key])) {
                console.log(
                    "SanitizeObj :: obj has a nested array :: key = ",
                    key,
                    " :: obj[key] = ",
                    obj[key],
                );
                obj[key] = SanitizeObjArray(obj[key]);
            }
        } else {
        }
    });
};

// This runs through an object array and replaces any null, undefined, empty, or otherwise invalid values with a placeholder, to avoid errors.
export const SanitizeObjArray = (objArray) => {
    console.log("SanitizeObjectArray() :: objArray = ", objArray);
    let sanitized = objArray.map((object, index) => {
        console.log("SanitizeObjArray() :: object = ", object);
        return SanitizeObj(object);
        // Object.entries(object).map(
        //     (objProperty, index) => {
        //         let objKey = objProperty[0];
        //         let objValue = objProperty[1];
        //         if (
        //             typeof objValue === "object" &&
        //             objValue !== null
        //         )
        //         {
        //
        //         } else
        //         {
        //             if ( objValue == null ||
        //                     objValue === undefined ||
        //                     objValue === " " ||
        //                 objValue === "" )
        //             {
        //                 return { objKey: objValue };
        //             }
        //         }
        //     },
        // )
    });
    console.log("sanitized = ", sanitized);
    return sanitized;
};

// This applies the properties of spliceObj to each object in the objArray.
export const SpliceObjArray = ( objArray, spliceObj ) =>
{
    if ( Array.isArray( objArray ) )
    {
        return objArray.map((obj) => {
            return Object.assign(obj, spliceObj);
        });
    }
    else
    {
        console.log( "OBJUTILS.JS :: SpliceObjArray :: objArray = ", objArray, "\nspliceObj = ", spliceObj, "\nError: Bad input." );
        return objArray;
    }
};


// Declare a flatten function that takes
// object as parameter and returns the
// flatten object
export const flattenObj = (obj) => {
    // The object which contains the
    // final result
    let result = {};

    // loop through the object "ob"
    // for (const key in obj) {
    Object.keys( obj ).forEach( ( key ) =>
    {
        // Sanitize the value if it's null or undefined.
        if ( obj[ key ] === null || obj[ key ] === undefined || obj[key] === '' )
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
export const flatMapObjArray = (objArray) => {
    // console.log("flatMapObjArray(): ", objArray);
    return objArray.map((obj, index) => {
        if (typeof obj === "object") {
            // return flatMapObj(obj, "_"); // flatMapObjText(obj);
            // return flattenObject(obj);
            // console.log(
            //     "FlattenMapObjArray: Original object: ",
            //     obj,
            //     "\n\nFlattened object: ",
            //     flattenObj(obj),
            // );
            return flattenObj(obj);
        } else if (Array.isArray(obj)) {
            return [...flatMapObjArray(obj)];
        } else {
            return obj;
        }
    });
};

// This flattens an object into HTML elements.
export const flatMapObjText = (obj) => {
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

export const objArray2List = (input) => {
    // console.log("objArray2List :: input = ", input);
    if (Array.isArray(input)) {
        return (
            <ul className="obj-list">
                {input.map((object, arrayIndex) => {
                    return (
                        //<li id={`obj-list-${arrayIndex}`} className={`li-${arrayIndex}`}>
                            Object.entries(object).map(
                                (objProperty, objIndex) => {
                                    let objKey = objProperty[0];
                                    let objValue = objProperty[1];
                                    if (
                                        typeof objValue === "object" &&
                                        objValue !== null
                                    ) {
                                        // Nested object
                                        return (
                                            <li className="obj-list-item">
                                                <div className="obj-list-key">
                                                    {objKey}
                                                </div>
                                                :{" "}
                                                <div className="obj-list-value">
                                                    {obj2List(objValue)}
                                                </div>
                                            </li>
                                        );
                                    } else {
                                        // Not a nested object.

                                        // Sanitize the value if it's null or undefined.
                                        if (
                                            objValue === null ||
                                            objValue === undefined ||
                                            objValue === "" ||
                                            objValue === " "
                                        ) {
                                            objValue = "-";
                                        }
                                        return (
                                            <li className="obj-list-item">
                                                <div className="obj-list-key">
                                                    {objKey}
                                                </div>
                                                :{" "}
                                                <div className="obj-list-value">
                                                    {objValue}
                                                </div>
                                            </li>
                                        );
                                    }
                                },
                            )
                        //</li>
                    );
                })}
            </ul>
        );
    } else if (typeof input === "object") {
        return obj2List(input);
    }
};

export const obj2List = ( input ) =>
{
    // console.log("obj2List :: input = ", input);
    if ( Array.isArray( input ) )
    {
        return objArray2List( input );
    } else if (typeof input === "object") {
        return (
            <ul className="obj-list">
                {Object.entries(input).map((objProperty, index) => {
                    let objKey = objProperty[0];
                    let objValue = objProperty[1];
                    if (typeof objValue === "object" && objValue !== null) {
                        // Nested object
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">{objKey}</div>:{" "}
                                <div className="obj-list-value">{obj2List(objValue)}</div>
                            </li>
                        );
                    } else {
                        // Not a nested object.
                        // Sanitize the value if it's null or undefined.
                        if (
                            objValue === null ||
                            objValue === undefined ||
                            objValue === "" ||
                            objValue === " "
                        ) {
                            objValue = "-";
                        }
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">{objKey}</div>:{" "}
                                <div className="obj-list-value">{objValue}</div>
                            </li>
                        );
                    }
                })}
            </ul>
        );
    }
}

export const objContains = (input, filter) => {
        if (typeof input === "object") {
            // Input is an object
            Object.keys(input).forEach((key) => {
                if (input[key]) {
                    let val = input[key];
                    if (val.toLowerCase().includes(filter)) {
                        return true;
                    }
                }
            });
            return false;
        } else if (Array.isArray(input)) {
            // Input is an array.
            return arrayContains(input, filter);
        } else {
            // Input is anything else.
            return input.toString().toLowerCase().includes( filter );
        }
    };

export const arrayContains = (input, filter) => {
        if (typeof input === "object") {
            // Input is an object
            return objContains(input, filter);
        } else if (Array.isArray(input)) {
            // Input is an array.
            input.forEach( ( value, index ) =>
            {
                if (typeof value === "object") {
                    // Input is an object
                    return objContains(value, filter);
                } else if (Array.isArray(value)) {
                    // Input is an array.
                    return arrayContains( value, filter );
                } else {
                    // Input is anything else.
                    return value.toString().toLowerCase().includes(filter);
                }
            })
        } else {
            // Input is anything else.
            return input.toString().toLowerCase().includes(filter);
        }
    };

    // From https://stackoverflow.com/questions/15164655/generate-html-table-from-2d-javascript-array
    export function makeTableHTML(ar) {
        return `<table>${ar.reduce(
            (c, o) =>
                (c += `<tr>${o.reduce(
                    (c, d) => (c += `<td>${d}</td>`),
                    "",
                )}</tr>`),
            "",
        )}</table>`;
}

export const isValid = (input) => {
    if (Array.isArray(input)) {
        input.forEach((value, index) => {
            if (value === undefined || value === null || value === "") {
                return false;
            }
        });
        return true;
    } else if (typeof input === "object") {
        Object.entries(input).forEach((prop, index) => {
            let key = prop[0];
            let value = prop[1];

            if (
                value === undefined ||
                value === null ||
                value === "" ||
                key === undefined ||
                key === null ||
                key === ""
            ) {
                return false;
            }
        });
        return true;
    } else {
        if (input === undefined || input === null || input === "") {
            return false;
        } else {
            return true;
        }
    }
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/*  // https://dev.to/jonrandy/comment/24ojn // 
Sort by Truthy/Falsy value
Avoiding Number is considerably better for performance:
// for true/false
const subscribedUsersFirst = users.sort((a, b) => +b.subscribed - +a.subscribed)

// for any truthy/falsy (avoiding issues with undefined, bigint etc.)
const subscribedUsersFirst = users.sort((a, b) => +!!b.subscribed - +!!a.subscribed)
*/

// https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/ // 
// Case insensitive value comparison
export function compareValues(key, order = "asc") {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
        const comparison = a[key].localeCompare(b[key]);

        return order === "desc" ? comparison * -1 : comparison;
    };
}

// https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key // 
// Sort an object's properties by its keys:
export function objSortByKeys ( unordered )
{
    const ordered = Object.keys(unordered)
        .sort()
        .reduce((obj, key) => {
            obj[key] = unordered[key];
            return obj;
        }, {} );
    return ordered;
}
export function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}
export function escapeHtml(unsafe) {
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
// The rest parameter syntax allows a function to accept an indefinite number of arguments as an array, providing a way to represent variadic functions in JavaScript.
export function sumIndefinite(...theArgs) {
    let total = 0;
    for (const arg of theArgs) {
        total += arg;
    }
    return total;
}
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// https://www.tutorialspoint.com/find-specific-key-value-in-array-of-objects-using-javascript
/*
const productsObj = {
   "LAPTOP": [{
      "productId": "123"
   }],
   "DESKTOP": [{
      "productId": "456"
   }],
   "MOUSE": [{
      "productId": "789"
   }, {
      "productId": "012"
   }],
   "KEY-BOARD": [{
      "productId": "345"
   }]
};
console.log(searchByPair(productsObj, {
   'productId': '123'
}));

OUTPUT: LAPTOP
*/
export const searchByPair = (obj = {}, pair = {}) => {
    const toSearch = Object.values(pair)[0];
    let required = undefined;
    Object.keys(obj).forEach((key) => {
        if (obj[key].find((pid) => pid.productId === toSearch)) {
            required = key;
        }
    });
    return required;
};