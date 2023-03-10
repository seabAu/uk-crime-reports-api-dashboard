import React from "react";
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// INPUT VALIDATION
// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string // 
/**
   *  String#isJSON() -> Boolean
   *
   *  Check if the string is valid JSON by the use of regular expressions.
   *  This security method is called internally.
   *
   *  ##### Examples
   *
   *      "something".isJSON();
   *      // -> false
   *      "\"something\"".isJSON();
   *      // -> true
   *      "{ foo: 42 }".isJSON();
   *      // -> false
   *      "{ \"foo\": 42 }".isJSON();
   *      // -> true
  **/
  export function isJSONRegex() {
    var str = this;
    if (str.blank()) return false;
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
  }
export function isValidJsonString(jsonString) {
    if (!(jsonString && typeof jsonString === "string")) {
        return false;
    }

    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}
export function IsJsonString(str) {
    try {
        var json = JSON.parse(str);
        return typeof json === "object";
    } catch (e) {
        return false;
    }
}
export function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function isJSON ( str )
{
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}
// Usage: isJSON({}) will be false, isJSON('{}') will be true.

// vanillaJS
// Checks if object or array
// export const isAO = (val) => val instanceof Array || val instanceof Object;
export function isAO(val) {
    return val instanceof Array || val instanceof Object;
}

export function valIsValid(value) {
    // console.log( "valIsValid:", value, typeof value );
    if (value) {
        if (value !== undefined) {
            if (value !== null) {
                // if ( value instanceof expectedType )
                return true;
            }
        }
    }
    return false;
}

export const validate = (input) => {
    if (input) {
        // Input is neither null or undefined, proceed to type-specific checks.
        if (Array.isArray(input)) {
            // Input is an array.
            if (input.length > 0) {
                // Array Input has at least 1 entry.
                input.forEach((value, index) => {
                    if (value === undefined || value === null || value === "") {
                        return false;
                    }
                });
                return true;
            } else {
                return false;
            }
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
    } else {
        return false;
    }
};

export const arrayIsValid = (arr, checklength) => {
    if (arr) {
        // Arr is not undefined or null.
        if (Array.isArray(arr)) {
            // Arr is an array to begin with.
            // if (arr.length > 0) {
                // Arr has at least one element.
                if (arr[0] !== undefined) {
                    // console.log( "arr[0] = ", arr[ 0 ] );
                    if ( checklength )
                    {
                        if ( arr.length > 0 ) { return true; }
                        else { return false; }
                    } else
                    {
                        return true;
                    }
                }
            // }
        }
    }
    return false;
};

export const has = (input, search = '') => {
    if (input) {
        if (typeof input === "object") {
            // Input is an object.
            if (search === '') {
                // If search is left blank, just return obj-is-valid check results.
                return true;
            }
            return input.hasOwnProperty(search);
        }
        else if ( Array.isArray( input ) )
        {
            // Input is an array.
            if (input.length > 0) {
                // Arr has at least one element.
                if ( input[ 0 ] !== undefined )
                {
                    // return input.indexOf(search) >= 0;
                    return input.includes( search );
                }
            }
        }
        else
        {
            // Input is anything else.
            return valContains( input, search );
        }
    }
    return false;
};
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// INPUT SANITATION
export const cleanInvalid = (val, replace) =>
    val === null ||
    val === undefined ||
    val === "" ||
    val === " "
        ? replace
        : val;

export const SanitizeObj = (obj) => {
    console.log("SanitizeObj :: obj = ", obj);
    return Object.keys(obj).forEach((key) => {
        console.log("SanitizeObj :: key = ", key, " :: obj[key] = ", obj[key]);

        // Sanitize the value if it's null or undefined.
        // if (
        //     obj[key] === null ||
        //     obj[key] === undefined ||
        //     obj[key] === "" ||
        //     obj[key] === " "
        // ) {
        //     obj[key] = "-";
        // }
        obj[ key ] = cleanInvalid( obj[ key ], "-" );
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
export const getObjKeys = ( inputObj ) =>
{
    try {
        return Object.keys(inputObj).map((key, index) => {
            return {
                id: index,
                key: key,
                value: key,
                label:
                    key.replace("_", " ").charAt(0).toUpperCase() +
                    key.replace("_", " ").slice(1),
            };
        });
    } catch (error) {
        return [{no_data: "No data"}];
    }
};
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY MANIPULATION
// This applies the properties of spliceObj to each object in the objArray.
export const SpliceObjArray = (objArray, spliceObj) => {
    if (Array.isArray(objArray)) {
        return objArray.map((obj) => {
            return Object.assign(obj, spliceObj);
        });
    } else {
        console.log(
            "OBJUTILS.JS :: SpliceObjArray :: objArray = ",
            objArray,
            "\nspliceObj = ",
            spliceObj,
            "\nError: Bad input.",
        );
        return objArray;
    }
};
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY FLATTENING INTO FLAT OBJECTS
// Array.prototype.flatten = function () {
export const flatten = function () {
    let flatArray = [];
    for (let index = 0; index < this.length; index++) {
        const element = this[index];
        if (Array.isArray(element)) {
            flatArray = flatArray.concat(this.flatten.call(element));
        } else {
            flatArray.push(element);
        }
    }
    return flatArray;
};
// export function flattenFilterAndSort(arr) {
//     let flatArray = [];
//     for (var i = 0; i < arr.length; i++) {
//         if (Array.isArray(arr[i])) {
//             flatArray = flatArray.concat(flatten(arr[i]));
//         } else {
//             flatArray.push(arr[i]);
//         }
//     }
//     return typeof flatArray[0] === "string"
//         ? [...new Set(flatArray)].sort()
//         : [...new Set(flatArray)].sort((num1, num2) => {
//               return num1 - num2;
//           });
// }

// Declare a flatten function that takes
// object as parameter and returns the
// flatten object
export const flattenObj = (obj) => {
    // The object which contains the
    // final result
    let result = {};

    // loop through the object "ob"
    // for (const key in obj) {
    Object.keys(obj).forEach((key) => {
        // Sanitize the value if it's null or undefined.
        if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
            obj[key] = "-";
        }
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const temp = flattenObj(obj[key]);
            for (const j in temp) {
                // Store temp in result
                result[key + "_" + j] = temp[j];
            }
        }

        // Else store obj[key] in result directly
        else {
            result[key] = obj[key];
        }
    });
    return result;
};

// This flattens an object into HTML elements.
export const flattenObjArray = (objArray) => {
    // console.log("flattenObjArray(): ", objArray);
    return objArray.map((obj, index) => {
        if (typeof obj === "object") {
            return flattenObj(obj);
        } else if (Array.isArray(obj)) {
            return [...flattenObjArray(obj)];
        } else {
            return obj;
        }
    });
};
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY FLATTENING INTO HTML ELEMENTS
// This flattens an object into HTML elements.
export const flatMapObjText = (obj) => {
    // console.log("flatMapObjText(): ", obj);
    return Object.entries(obj)
        .map((objProperty) => {
            if (typeof objProperty[1] === "object" && objProperty[1] !== null) {
                return `${flatMapObjText(objProperty[1])}`;
            } else {
                return `${objProperty[0]}: ${objProperty[1]}`;
            }
        })
        .join("");
};

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// DEEP NESTED OBJECT / ARRAY FILTERING & SORTING

export const filterData = (data, filters) => {
    // Data is an array of objects.
    // Filters is an array of objects consisting only of single key value pairs.
    // console.log(
    //     "FilterData() :: BEFORE :: ",
    //     "\ndata",
    //     data,
    //     "\ndata has ",
    //     data.length,
    //     "elements.",
    // );
    // console.log( "FilterData :: ", filters.length );
    if (filters.length > 0) {
        let filteredData = data;
        // Filters in the format {key: key, value: filterString}.
        filters.forEach((element) => {
            if (element.key && element.value) {
                // Run for each filter.
                let filterKey = element.key;
                let filterValue = element.value.toLowerCase();
                filteredData = filteredData.filter((obj, index) => {
                    // Filter for each object in the array.
                    if (obj) {
                        // Object is valid. Check if it contains the key of the filter we're currently filtering for.
                        if (obj.hasOwnProperty(filterKey)) {
                            // Object contains the key we're filtering for.
                            if (obj[filterKey]) {
                                // Object has a valid value.
                                if (typeof obj[filterKey] === "object") {
                                    // The value contained in this key is a nested object. Rather than run through each key value pair recursively, just convert to a string and see if it has the substring we're looking for.
                                    // return JSON.stringify(obj[filterKey]).toLowerCase().includes(filterValue);
                                    // return obj[ filterKey ].toString().toLowerCase().includes( filterValue );
                                    return Object.values(obj[filterKey])
                                        .toString()
                                        .toLowerCase()
                                        .includes(filterValue);
                                } else if (Array.isArray(obj[filterKey])) {
                                    // The value contained in this key is an array. Have to see if any of its elements contains the value we're looking for.
                                    return obj[filterKey].some((item) => {
                                        return item
                                            .toLowerCase()
                                            .includes(filterValue);
                                    });
                                } else {
                                    // The value contained in this key is anything else; a scalar;
                                    return obj[filterKey]
                                        .toString()
                                        .toLowerCase()
                                        .includes(filterValue);
                                }
                            } else {
                                // Object does not have a valid value.
                                // This could be something like undefined, null, '', or some other invalid value.
                                return true;
                            }
                        } else {
                            // Object does not contain the key we're filtering for.
                            return true;
                        }
                    } else {
                        // Object is invalid.
                        return true;
                    }
                });
            }
        });
        // console.log(
        //     "FilterData() :: AFTER :: ",
        //     "\nfilteredData", filteredData,
        //     "\nfilteredData has ", filterData.length, "elements."
        // );
        return filteredData;
    } else {
        // Return data as-is.
        return data;
    }
};

export const filterDataFast = (data, filters) => {
    // Data is an array of objects.
    // Filters is an array of objects consisting only of single key value pairs.
    // console.log(
    //     "FilterData() :: BEFORE :: ",
    //     "\ndata",
    //     data,
    //     "\ndata has ",
    //     data.length,
    //     "elements.",
    // );
    // console.log( "FilterData :: ", filters.length );
    if (filters.length > 0) {
        let filteredData = data;
        // Filters in the format {key: key, value: filterString}.
        filters.forEach((element) => {
            if (element.key && element.value) {
                // Run for each filter.
                let filterKey = element.key;
                let filterValue = element.value.toLowerCase();
                filteredData = filteredData.filter((obj, index) => {
                    // Filter for each object in the array.
                    if (obj) {
                        // Object is valid. Check if it contains the key of the filter we're currently filtering for.
                        // To do this quick, just turn the whole object into a string and see if it contains the filter value as a substring.
                        // Lol.
                        // console.log( "filtering '''''fast''''' :: ", filterKey, filterValue, obj, JSON.stringify(obj) );
                        if (obj.hasOwnProperty(filterKey)) {
                            return JSON.stringify(obj[filterKey])
                                .toLowerCase()
                                .includes(filterValue);
                        } else
                        {
                            return false;
                        }
                    } else {
                        // Object is invalid.
                        return true;
                    }
                });
            }
        });
        // console.log(
        //     "FilterData() :: AFTER :: ",
        //     "\nfilteredData", filteredData,
        //     "\nfilteredData has ", filterData.length, "elements."
        // );
        return filteredData;
    } else {
        // Return data as-is.
        return data;
    }
};

/*
    function filterObject ( obj, callback )
    {
        return Object.fromEntries(
            Object.entries(obj).filter(([key, val]) => callback(val, key)),
        );
    }

    const filterData3 = (data, filters) => {
        if (data) {
            if (filters.length > 0) {
                // New tactic: run loop for each object in data, and run the internal loop on each filter inside that.
                let filteredData = [];
                data.forEach((item, index) => {});
            } else {
                // Do nothing, just return the input.
                return data;
            }
        } else {
            // Do nothing, just return the input.
            return data;
        }
    };
*/

/*  // Sorting function snippet graveyard. // 
    // Abandon hope all ye who enter here. // 

    const sortDataByKey = (data, key, order) => {
        let sortedData = data.sort(compareValues(key, order));
        console.log(
            "Table :: sortDataByKey(): \n\n\nbefore = ",
            JSON.stringify(data),
            " :: \n\n\nafter = ",
            JSON.stringify(data.sort(compareValues(key, order))),
            " :: \n\n\ntest = ",
            JSON.stringify(data.sort(sortByKey(key, order))),
            " :: \n\n\ntest = ",
            JSON.stringify(sortArrayOfObjects(data, key)),
        );

        const data5 = [...data].sort((a, b) =>
            a[key].toString().localeCompare(b[key].toString(), "en", {
                numeric: true,
            }),
        );
        console.log("");
        // return data.sort( sortByKey( key, order ) ); // sortedData;
        setRenderData(sortedData);
        return sortedData;
        // return sortArrayOfObjects(data, key);
    };

    function compareValues(key, order = 1) {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA =
                typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
            const varB =
                typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            // console.log(`Table :: compareValues(): comparing [ ${varA}, ${varB} ] :: ${varA > varB} :: comparison = ${comparison}`); // sort by name
            return comparison * order;
        };
    }

    const sortArrayOfObjects = (arr, key) => {
        return arr.sort((a, b) => {
            return a[key] - b[key];
        });
    };

    const sortByKey = (sortKey, order) => (a, b) => {
        // return a[ sortKey ].toLowerCase() > b[ sortKey ].toLowerCase() ? 1 : -1;

        const varA =
            typeof a[sortKey] === "string"
                ? a[sortKey].toLowerCase()
                : a[sortKey];
        const varB =
            typeof b[sortKey] === "string"
                ? b[sortKey].toLowerCase()
                : b[sortKey];
        console.log(
            `Table :: compareValues( ${a}, ${b} ): comparing [ ${varA}, ${varB} ] :: ${
                varA > varB
            }`,
        ); // sort by name
        return varA > varB ? 1 * order : -1 * order;
    };

*/


///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// DEEP NESTED OBJECT / ARRAY SEARCHING
export const valContains = (input, search) => {
    // console.log(`valContains(${JSON.stringify(input)}, ${search}) :: `);
    let inputstr = JSON.stringify(input);
    let searchstr = JSON.stringify(search);
    return inputstr.toLowerCase().includes(searchstr.toLowerCase());
};
/*
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
        return input.toString().toLowerCase().includes(filter);
    }
};
export const arrayContains = (input, filter) => {
    if (typeof input === "object") {
        // Input is an object
        return objContains(input, filter);
    } else if (Array.isArray(input)) {
        // Input is an array.
        input.forEach((value, index) => {
            if (typeof value === "object") {
                // Input is an object
                return objContains(value, filter);
            } else if (Array.isArray(value)) {
                // Input is an array.
                return arrayContains(value, filter);
            } else {
                // Input is anything else.
                return value.toString().toLowerCase().includes(filter);
            }
        });
    } else {
        // Input is anything else.
        return input.toString().toLowerCase().includes(filter);
    }
};
// Deeply search nested objects and return the object or value whose key that matches the search value.
export const objDeepSearch = (input, search) => {
    // First check if the value even exists in the tree.
    if (valContains(input, search)) {
        if (typeof input === "object") {
            // Input is an object
            Object.keys(input).forEach((key) => {
                if (input[key]) {
                    console.log(
                        `ObjDeepSearch(${JSON.stringify(
                            input,
                        )}, ${search}) :: looking at key = ${key}, value = ${
                            input[key]
                        }`,
                    );
                    if (
                        key.toLowerCase().includes(search) ||
                        input[key].toLowerCase().includes(search)
                    ) {
                        // Found a match. Return the object.
                        return input[key];
                    } else {
                        // Not found yet. Keep searching.
                        if (typeof input[key] === "object") {
                            // Input is an object
                            return objDeepSearch(input[key], search);
                        } else if (Array.isArray(input)) {
                            // Input is an array.
                            return arrayDeepSearch(input, search);
                        } else {
                            // Input is anything else.
                            // return input.toString().toLowerCase().includes(search);
                            // If we reach here, we're at the bottom of the nested tree, so return nothing.
                            return undefined;
                        }
                    }
                }
            });
            // return false;
            // Not found, return nothing.
            return undefined;
        } else if (Array.isArray(input)) {
            // Input is an array.
            return arrayDeepSearch(input, search);
        } else {
            // Input is anything else.
            // return input.toString().toLowerCase().includes(search);
            // If we reach here, we're at the bottom of the nested tree, so return nothing.
            return undefined;
        }
    } else {
        // Value is nowhere to be found in the tree, return nothing.
        return undefined;
    }
};
export const arrayDeepSearch = (input, search) => {
    // First check if the value even exists in the tree.
    if (valContains(input, search)) {
        if (typeof input === "object") {
            // Input is an object
            return objDeepSearch(input, search);
        } else if (Array.isArray(input)) {
            // Input is an array.
            input.forEach((value, index) => {
                if (value) {
                    console.log(
                        `arrayDeepSearch(${JSON.stringify(
                            input,
                        )}, ${search}) :: looking at value = ${value}`,
                    );
                    if (typeof value === "object") {
                        // Input is an object
                        return objDeepSearch(value, search);
                    } else if (Array.isArray(value)) {
                        // Input is an array.
                        return arrayDeepSearch(value, search);
                    } else {
                        // Input is anything else.
                        if (value.toLowerCase().includes(search)) {
                            // Found a match. Return the object.
                            return value;
                        }
                        // return value.toString().toLowerCase().includes(search);
                    }
                }
            });
        } else {
            // Input is anything else.
            return input.toString().toLowerCase().includes(search);
        }
    } else {
        // Value is nowhere to be found in the tree, return nothing.
        return undefined;
    }
};
export const deepSearchObject = (ob, key) => {
    const path = [];
    const keyExists = (obj) => {
        if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
            return undefined;
        } else if (obj.hasOwnProperty(key)) {
            return obj[key];
        } else if (Array.isArray(obj)) {
            let parentKey = path.length ? path.pop() : "";

            for (let i = 0; i < obj.length; i++) {
                path.push(`${parentKey}[${i}]`);
                const result = keyExists(obj[i], key);
                if (result) {
                    return result;
                }
                path.pop();
            }
        } else {
            for (const k in obj) {
                path.push(k);
                const result = keyExists(obj[k], key);
                if (result) {
                    return result;
                }
                path.pop();
            }
        }
        return undefined;
    };

    // return keyExists(ob);

    return path.join(".");
};
// https://stackoverflow.com/questions/15523514/find-by-key-deep-in-a-nested-array
export function findNestedObj(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (valToFind === "" || valToFind === null || valToFind === undefined) {
            if (nestedValue && nestedValue[keyToFind] === valToFind) {
                foundObj = nestedValue;
            }
        } else {
            if (nestedValue && nestedValue[keyToFind] === valToFind) {
                foundObj = nestedValue;
            }
        }
        return nestedValue;
    });
    return foundObj;
}
*/

// var result = deepSearch(myObject, "id", (k, v) => v === 1);
// or;
// var result = deepSearch(myObject, "title", (k, v) => v === "Some Recommends");

export function deepGetKey ( object, key )
{
    return deepSearch(object, key, (k, v) => k === key, false);
}
export function deepSearch(object, key, predicate, getParent = false) {
    if (object.hasOwnProperty(key) && predicate(key, object[key]) === true) {
        // If the object has a key present, return the parent object containing that key and its value?
        if ( getParent )
        {
            // Return the object containing the key we're looking for.
            return object;
        } else
        {
            // Return the value contained in the key we're looking for.
            return object[key];
        }
    }
    for (let i = 0; i < Object.keys(object).length; i++) {
        let value = object[Object.keys(object)[i]];
        if (typeof value === "object" && value != null) {
            let o = deepSearch(
                object[Object.keys(object)[i]],
                key,
                predicate,
                getParent,
            );
            if (o != null) {
                // console.log( "Deepsearch :: o = ", o );
                return o;
            }
        }
    }
    return null;
}

// Here is the demo: http://jsfiddle.net/a21dx6c0/
// In the same way you can find more than one object
export function deepSearchItems(object, key, predicate) {
    let ret = [];
    if (object.hasOwnProperty(key) && predicate(key, object[key]) === true) {
        ret = [...ret, object];
    }
    if (Object.keys(object).length) {
        for (let i = 0; i < Object.keys(object).length; i++) {
            let value = object[Object.keys(object)[i]];
            if (typeof value === "object" && value != null) {
                let o = this.deepSearchItems(
                    object[Object.keys(object)[i]],
                    key,
                    predicate,
                );
                if (o != null && o instanceof Array) {
                    ret = [...ret, ...o];
                }
            }
        }
    }
    return ret;
}
/*
const findByKey = (obj, kee) => {
    if (kee in obj) return obj[kee];
    for (n of Object.values(obj)
        .filter(Boolean)
        .filter((v) => typeof v === "object")) {
        let found = findByKey(n, kee);
        if (found) return found;
    }
};

const findByProperty = (obj, predicate) => {
    if (predicate(obj)) return obj;
    for (n of Object.values(obj)
        .filter(Boolean)
        .filter((v) => typeof v === "object")) {
        let found = findByProperty(n, predicate);
        if (found) return found;
    }
};

let findByValue = (o, val) => {
    if (o === val) return o;
    if (o === NaN || o === Infinity || !o || typeof o !== "object") return;
    if (Object.values(o).includes(val)) return o;
    for (n of Object.values(o)) {
        const found = findByValue(n, val);
        if (found) return n;
    }
};
*/

/*  // https://dev.to/jonrandy/comment/24ojn // 
Sort by Truthy/Falsy value
Avoiding Number is considerably better for performance:
// for true/false
const subscribedUsersFirst = users.sort((a, b) => +b.subscribed - +a.subscribed)

// for any truthy/falsy (avoiding issues with undefined, bigint etc.)
const subscribedUsersFirst = users.sort((a, b) => +!!b.subscribed - +!!a.subscribed)
*/
/*
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
export function objSortByKeys(unordered) {
    const ordered = Object.keys(unordered)
        .sort()
        .reduce((obj, key) => {
            obj[key] = unordered[key];
            return obj;
        }, {});
    return ordered;
}
export function sortObject(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
// The rest parameter syntax allows a function to accept an indefinite number of arguments as an array, providing a way to represent variadic functions in JavaScript.

// https://www.tutorialspoint.com/find-specific-key-value-in-array-of-objects-using-javascript
// const productsObj = {
//    "LAPTOP": [{
//       "productId": "123"
//    }],
//    "DESKTOP": [{
//       "productId": "456"
//    }],
//    "MOUSE": [{
//       "productId": "789"
//    }, {
//       "productId": "012"
//    }],
//    "KEY-BOARD": [{
//       "productId": "345"
//    }]
// };
// console.log(searchByPair(productsObj, {
//    'productId': '123'
// }));
// 
// OUTPUT: LAPTOP
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
*/

export const updateObjArray = (input) => {};