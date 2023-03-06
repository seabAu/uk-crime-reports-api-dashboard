import React from "react";
import { deepSearchObject } from "../Utilities/ObjectUtils";

const gDBName = "uk-crime-api-database";

/*
    Generic schema: 
    {
        userdata: {},
        fetchcache: {
            forces: [
                
            ],
            categories: [],
            dates: []
        },
        queries: {
            [
                {
                    id: query_id,
                    date: query_date,
                    query: {
                        callfunction: searchFunctionCalled,
                        vars: [],
                        progress: %,
                        lastCalled: [last called vars]
                    },
                    data: query_reports,
                }
                // . . . 
            ]
        },
    },
    // . . . 
*/

export const IsDBSet = () =>
{
    let db = GetDB();
    if ( db )
    {
        return true;
    }
    else
    {
        return false;
    }
}
export const InitializeLocalDB = () => {
    let db_temp = {
        userdata: {},
        fetchcache: {
            forces: [
                {
                    name: "metropolitan",
                },
            ],
            categories: [],
            dates: [],
        },
        queries: [
            {
                id: 0, // id: query_id,
                date: new Date(), // date: query_date,
                query: "initial", // query: query_string,
                data: [], // data: query_reports,
            },
            // . . .
        ],
    };

    SetDB(db_temp);
    console.table(
        "LocalDatabaseHandler.JS :: Database initialized. DB = ",
        GetDB(),
    );
};

// var result = deepSearch(myObject, "id", (k, v) => v === 1);
// or;
// var result = deepSearch(myObject, "title", (k, v) => v === "Some Recommends");
export function deepSearchDB(object, key, data) {
    if (object.hasOwnProperty(key)) {
        // If the object has a key present, return the parent object containing that key and its value?
        object[key] = data;
        console.log(
            `Deepsearch :: Object has key ${key}, setting data = `,
            data,
            ` :: result = `,
            object,
        );
        return object;
    }
    for (let i = 0; i < Object.keys(object).length; i++) {
        let value = object[Object.keys(object)[i]];
        if (typeof value === "object" && value != null) {
            console.log(
                `Deepsearch :: value = `,
                value,
                `, key = `,
                Object.keys(object)[i],
            );
            let o = deepSearchDB(object[Object.keys(object)[i]], key, data);
            console.log("Deepsearch :: o = ", o);
            if (o != null) {
                return o;
            }
        }
    }
    // return null;
    return object;
}

const findPath = (ob, key) => {
    // , value) => {
    const path = [];
    const keyExists = (obj) => {
        if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
            return false;
        } else if (obj.hasOwnProperty(key)) {
            // && obj[key] === value) {
            return true;
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

        return false;
    };

    keyExists(ob);

    return path; // .join(".");
};

const keyExists = (obj, key, data) => {
    console.log(
        `keyexists() :: obj = `,
        obj,
        `, key = `,
        key,
        `, data = `,
        data,
    );
    if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
        return obj;
    }
    if (typeof obj === "object" && !Array.isArray(obj)) {
        // Obj is an object.
        console.log(
            `keyexists() :: obj = `,
            obj,
            `, key = `,
            key,
            `, is an object, obj[key] = `,
            obj[key],
        );
        if (obj.hasOwnProperty(key)) {
            // Set the data at this key.
            if (typeof obj[key] === "object") {
                obj[key] = data;
            } else if (Array.isArray(obj)) {
                obj[key].push(data);
            }
            return obj;
        }
    } else if (Array.isArray(obj)) {
        // Obj is an array.
        for (let i = 0; i < obj.length; i++) {
            console.log(
                `keyexists() :: obj = `,
                obj,
                `, is an array, looking at key #${i} = `,
                obj[i],
            );
            // path.push(`${parentKey}[${i}]`);
            const result = keyExists(obj[i], key);
            if (result) {
                return result;
            }
            // path.pop();
        }
    } else {
        for (const k in obj) {
            console.log(
                `keyexists() :: obj = `,
                obj,
                `, is neither an array or an object, looking at const #${k} = `,
                obj[k],
            );
            const result = keyExists(obj[k], key);
            if (result) {
                return result;
            }
        }
    }

    return obj;
};

const findObject = (obj = {}, key, value) => {
    const result = [];
    const recursiveSearch = (obj = {}) => {
        if (!obj || typeof obj !== "object") {
            return;
        }
        if (obj[key] === value) {
            result.push(obj);
        }
        Object.keys(obj).forEach(function (k) {
            recursiveSearch(obj[k]);
        });
    };
    recursiveSearch(obj);
    return result;
};
// console.log( findObject( obj, 'id', null ) );

const findAndSetObject = (obj = {}, key, value) => {
    const result = [];
    const recursiveSearch = (obj = {}, key, value) => {
        if (!obj || typeof obj !== "object") {
            return;
        }
        // if (obj[key] === value) {
        if ( obj.hasOwnProperty( key ) )
        {
            // Object has the key we're looking for. 
            obj[ key ] = value;
            return;
        }
        Object.keys( obj ).forEach((k)=>
            {
                return recursiveSearch( obj[ k ], key, value);
            }
        );
    };
    recursiveSearch(obj, key, value);
    // return result;
    return obj;
};
// console.log( findObject( obj, 'id', null ) );

export const setDBKey = (key, data) => {
    let db = GetDB();
    SetDB(findAndSetObject(db, key, data));
    // Keep it simple for now.
    // let tempdb = deepSearchDB(db, key, data);
    // console.log(`findPath :: `, findPath(db, key));
    // console.log(`keyExists :: `, keyExists(db, key, data));
    // console.log(`findAndSetObject :: `, findAndSetObject(db, key, data));

    // let path = findPath(db, key);
    // let find = db;
    // // if (path) {
    // //     if (path.length > 0) {
    // //         path.forEach((k) => {
    // //             if (find.hasOwnProperty(k)) {
    // //                 // If the object has a key present, return the parent object containing that key and its value?
    // //                 object[key] = data;
    // //                 console.log(
    // //                     `Deepsearch :: Object has key ${key}, setting data = `,
    // //                     data,
    // //                     ` :: result = `,
    // //                     object,
    // //                 );
    // //                 return object;
    // //             }
    // //         });
    // //     }
    // // }
    // 
    // console.table(
    //     `setDBKey() :: db = `,
    //     db,
    //     `, tempdb = `,
    //     tempdb,
    //     `, key = `,
    //     key,
    //     `, data = `,
    //     data,
    // );
};

export const GetDB = () => {
    // Basic function to fetch the DB and turn it into an object array.
    return JSON.parse(localStorage.getItem(gDBName));
};

export const SetDB = (db) => {
    // Basic function to turn the DB from an object array to JSON and save it.
    localStorage.setItem(gDBName, JSON.stringify(db));
    console.table(
        "DashboardConrent :: UpdateStorage :: Updated database => Database = ",
        GetDB(),
        "\n\nLocalDB now takes up: ", localStorageSpace()
    );
};

export const AddLocalDBEntry = (key, data) => {
    // Init:
    // localStorage.setItem("uk-crime-api-database", [
    //     {
    //         id: 0,
    //         date: new Date(),
    //         queryName: "Init",
    //         reports: [],
    //     },
    // ]);
    let db = GetDB();
    db.queries.push({
        ...data,
        id: db.queries.length + 1,
        date: new Date(),
    });
    SetDB(db);

};

export var localStorageSpace = function () {
    var allStrings = "";
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings
        ? 3 + (allStrings.length * 16) / (8 * 1024) + " KB"
        : "Empty (0 KB)";
};

export const getLocalDBSize = () => {
    var allStrings = "";
    for (var key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
            allStrings += window.localStorage[key];
        }
    }
    let size = getByteLength( allStrings );
    return size ? size + " KB" : "Empty (0 KB)";
    // return allStrings
    //     ? 3 + (allStrings.length * 16) / (8 * 1024) + " KB"
    //     : "Empty (0 KB)";
};


export const getByteLength = (input) => {
    let allStrings = input.toString();
    return allStrings
        ? 3 + (allStrings.length * 16) / (8 * 1024)
        : 0;
}
// Make function that finds whether a specific query has been done yet, and if so, overwrites it; if not, inserts a new entry.

function sizeofAllStorage() {
    // provide the size in bytes of the data currently stored
    var size = 0;
    for (var i = 0; i <= localStorage.length - 1; i++) {
        let key = localStorage.key(i);
        size += lengthInUtf8Bytes(localStorage.getItem(key));
    }
    return size;
}

function lengthInUtf8Bytes(str) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}
