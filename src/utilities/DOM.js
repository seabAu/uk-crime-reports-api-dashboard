// A set of utility functions centered around updating and managing the site DOM.
import React from "react";
import { cleanInvalid } from "./AO";
import { isValidArray, isArray, isObject } from "./Val";

export function setElementValueById ( id, value )
{
    if (id && value) {
        // Valid inputs, proceed.
        const element = document.getElementById(id);
        if (element) {
            element.value = value.latitude;
            return element; // Return element if successful.
        } else {
            // console.error("setElementValueById :: ERR: Invalid ID: ", id);
        }
    } else {
        // console.error("setElementValueById :: ERR: Invalid Inputs: ", value, ", ", id);
    }
}


// Turns an object into an unordered list, except as json-friendly text instead of HTML elements.
export const obj2ListText = (input) => {
    // console.log( "obj2ListText :: input = ", input );
    let result = "";
    if (typeof input === "object") {
        Object.entries(input).forEach((prop, index) => {
            let objKey = prop[0];
            let objValue = prop[1];
            if (typeof objValue === "object" && objValue !== null) {
                // Nested object
                result += `<li className="obj-list-item">${objKey}:` + obj2ListText(objValue) + `</li>`;
            } else {
                // Not a nested object.
                result += `<li className="obj-list-item">${objKey}: ${cleanInvalid(objValue, "-")}</li>`;
            }
        })
        
    }

    return `<ul>` + result + `</ul>`;
}


// Turns an object array into an unordered list, with recursion.
export const objArray2List = (input) => {
    // console.log("objArray2List :: input = ", input);
    if (isArray(input)) {
        return (
            <ul className="obj-list">
                {input.map((object, arrayIndex) => {
                    return (
                        //<li id={`obj-list-${arrayIndex}`} className={`li-${arrayIndex}`}>
                        Object.entries(object).map((prop, objIndex) => {
                            let objKey = prop[0];
                            let objValue = prop[1];
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
                                return (
                                    <li className="obj-list-item">
                                        <div className="obj-list-key">
                                            {objKey}
                                        </div>
                                        :{" "}
                                        <div className="obj-list-value">
                                            {cleanInvalid(objValue, "-")}
                                        </div>
                                    </li>
                                );
                            }
                        })
                        //</li>
                    );
                })}
            </ul>
        );
    } else if (typeof input === "object") {
        return obj2List(input);
    }
};

export const value2List = ( input ) =>
{
    return ( !( isArray( input ) ) && !( typeof input === "object" ) ) ? ( <div className="obj-list-value">
        { cleanInvalid( input, "-" ) }
    </div> ) : '';
}

// Turns an object into an unordered list, with recursion.
export const array2List = (input) => {
    // console.log("array2List :: input = ", input);
    if (isArray(input)) {
        return array2List(input);
    } else if (typeof input === "object") {
        return obj2List(input);
    } else
    {
        
    }
};

// Turns an object into an unordered list, with recursion.
export const obj2List = (input) => {
    // console.log("obj2List :: input = ", input);
    if (isArray(input)) {
        return objArray2List(input);
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
                                <div className="obj-list-value">
                                    {obj2List(objValue)}
                                </div>
                            </li>
                        );
                    } else {
                        // Not a nested object.
                        // Sanitize the value if it's null or undefined.
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">{objKey}</div>:{" "}
                                <div className="obj-list-value">{cleanInvalid(objValue, "-")}</div>
                            </li>
                        );
                    }
                })}
            </ul>
        );
    }
};



///////////////////////////////////////////////////////






// Turns an object into an unordered list, with recursion.
export const objArrayToList = (input) => {
    // console.log("arrayToList :: input = ", input);
    // if (isArray(input)) {
    //     return arrayToList(input);
    // } else if (typeof input === "object") {
    //     return objToList(input);
    // } else
    // {
    //     return valueToList( input );
    // }
    return isObject(input)
        ? objToList(input)
        : isArray(input)
        ? arrayToList(input)
        : valToList(input);
};

// Turns an object array into an unordered list, with recursion.
export const arrayToList = (input) => {
    // console.log("objArrayToList :: input = ", input);
    if (isArray(input) && isValidArray(input)) {
        return (
            <ul className="obj-list">
                { input.map( ( element, arrayIndex ) =>
                {
                    // Run through each element in the array.
                    // For each, check if it's an array, object, or scalar, and build nested elements accordingly. 
                    return (
                        <li className="obj-list-item">
                            <div className="obj-list-key">
                                `${arrayIndex}: `
                            </div>
                            <div className="obj-list-value">
                                { isObject(element) ? ((objToList(element))) : (( isArray( element ) ) ? (arrayToList( element )) : (valToList( element )))
                                    // if ( isObject(element) )
                                    // {
                                    //     // Array element is an object.
                                    //     return (objToList(element));
                                    // } else if ( isArray( element ) )
                                    // {
                                    //     // Array element is another array.
                                    //     return arrayToList( element );
                                    // } else
                                    // {
                                    //     // Array element is just a scalar value.
                                    //     return valToList( element );
                                    // }
                                }
                            </div>
                        </li>
                    );
                }
                )
                }
            </ul>
        );
    } else if (typeof input === "object") {
        return objToList(input);
    }
};

// Turns an object into an unordered list, with recursion.
export const objToList = (input) => {
    // console.log("objToList :: input = ", input);
        if (isObject(input)) {
            // Input is an object.
            return (
            <ul className="obj-list">
            {
                //<li id={`obj-list-${arrayIndex}`} className={`li-${arrayIndex}`}>
                Object.entries(input).map((prop, objIndex) => {
                    let objKey = prop[0];
                    let objValue = prop[1];
                    if (typeof objValue === "object" && objValue !== null) {
                        // Nested object
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">
                                    `${objKey}: `
                                </div>
                                <div className="obj-list-value">
                                    {objToList(objValue)}
                                </div>
                            </li>
                        );
                    } else if (isArray(objValue)) {
                        // Nested array
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">
                                    `${objKey}: `
                                </div>
                                <div className="obj-list-value">
                                    {arrayToList(objValue)}
                                </div>
                            </li>
                        );
                    } else {
                        // Just a scalar.
                        // Sanitize the value if it's null or undefined.
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">
                                    `${objKey}: `
                                </div>
                                <div className="obj-list-value">
                                    {valueToList(objValue)}
                                </div>
                            </li>
                        );
                    }
                })
                //</li>
                }</ul>
            );
        } else if (isArray(input)) {
            // Input is an array.
            return arrayToList( input );
        } else {
            // Input is just a scalar value.
            return valToList(input);
        }
};

// export const valueToList = ( input ) => ( !( isArray( input ) ) && !( typeof input === "object" ) ) ? ( cleanInvalid( input, "-" )) : '';
export const valueToList = (input) =>
    !isArray(input) && !(typeof input === "object")
        ? cleanInvalid(input, "-")
        : "";

export const valToList = (input) =>
    isArray(input) ? (
        // Array
        <div className="obj-list-value">{arrayToList(input)}</div>
    ) : (
        (typeof input === "object") ? (
            // Object
            (<div className="obj-list-value">{objToList(input)}</div>)
        ) : (
            // Scalar
            <div className="obj-list-value">{cleanInvalid(input, "-")}</div>
        )
    );