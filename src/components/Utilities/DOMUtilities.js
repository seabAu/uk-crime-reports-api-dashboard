// A set of utility functions centered around updating and managing the site DOM.
import React from "react";
import { cleanInvalid } from "./ObjectUtils";

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
    console.log( "obj2ListText :: input = ", input );
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
    if (Array.isArray(input)) {
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

// Turns an object into an unordered list, with recursion.
export const obj2List = (input) => {
    // console.log("obj2List :: input = ", input);
    if (Array.isArray(input)) {
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
