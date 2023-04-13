import React from "react";


// INPUT TYPE CHECKING
// From https://www.freecodecamp.org/news/javascript-type-checking-how-to-check-type-in-js-with-typeof/ // 
// https://www.freecodecamp.org/news/javascript-typeof-how-to-check-the-type-of-a-variable-or-object-in-js/
export const typeCheck = value => {
    const return_value = Object.prototype.toString.call(value);
    const type = return_value.substring(
        return_value.indexOf(' ') + 1,
        return_value.indexOf(']')
    );

    return type.toLowerCase();
};

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

export function isJSON(str) {
    if (!(str && typeof str === "string")) {
        return false;
    }
    try {
        var json = JSON.parse(str);
        return typeof json === "object";
        // Usage: isJSON({}) will be false, isJSON('{}') will be true.
        // return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
}

// vanillaJS
// Checks if object or array
// export const isAO = (val) => val instanceof Array || val instanceof Object;
export function isAO(val) {
    return val instanceof Array || val instanceof Object;
}

/*
export const isValidArray = (arr, checklength) => {
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
*/

export function isDefined(value) {
    return value !== undefined && value !== null;
}

// Checks if a value is defined, not null, is an object, and NOT an array (arrays sometimes show up as both array and object).
export const isObject = (value) => {
    return value !== null && value !== undefined && typeof value === "object" && !Array.isArray(value);
}
export const isArray = (value) => {
    return value !== null && Array.isArray(value);
}
export const isArray2 = (value) => {
    return value !== null && Array.isArray(value) && typeof value !== "object";
};
export const isString = (x) => {
    return Object.prototype.toString.call(x) === "[object String]";
}

// Returns whether a value is NOT invalid/undefined/null, NOT an array, and NOT an object. 
export const isScalar = value => {
    return (
        value !== null &&
        value !== undefined &&
        !Array.isArray(value) &&
        typeof value !== 'object'
    );
};
// https://stackoverflow.com/questions/29312123/how-does-the-double-exclamation-work-in-javascript
// ! is the logical negation or "not" operator. !! is ! twice. It's a way of casting a "truthy" or "falsy" value to true or false, respectively. Given a boolean, ! will negate the value, i.e. !true yields false and vice versa. Given something other than a boolean, the value will first be converted to a boolean and then negated. For example, !undefined will first convert undefined to false and then negate it, yielding true. Applying a second ! operator (!!undefined) yields false, so in effect !!undefined converts undefined to false.
// 
// In JavaScript, the values false, null, undefined, 0, -0, NaN, and '' (empty string) are "falsy" values. All other values are "truthy."(1):7.1.2 Here's a truth table of ! and !! applied to various values:
// 
//  value     │  !value  │  !!value
// ━━━━━━━━━━━┿━━━━━━━━━━┿━━━━━━━━━━━
//  false     │ ✔ true   │   false
//  true      │   false  │ ✔ true
//  null      │ ✔ true   │   false
//  undefined │ ✔ true   │   false
//  0         │ ✔ true   │   false
//  -0        │ ✔ true   │   false
//  1         │   false  │ ✔ true
//  -5        │   false  │ ✔ true
//  NaN       │ ✔ true   │   false
//  ''        │ ✔ true   │   false
//  'hello'   │   false  │ ✔ true

export function isNumber(value) {
    return typeof value === "number";
}
export function escapeHtml(unsafe) {
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// INPUT VALIDATION


export const valsAreValid = (inputs = []) => {
    for (var i = 0; i < inputs.length; i++) {
        if (!valIsValid(inputs[i])) {
            return false;
        }
    }

    return true;
};

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

export const validate = input => {
    if (input) {
        // Input is neither null or undefined, proceed to type-specific checks.
        if (Array.isArray(input)) {
            // Input is an array.
            if (input.length > 0) {
                // Array Input has at least 1 entry.
                input.forEach((value, index) => {
                    if (value === undefined || value === null || value === '') {
                        return false;
                    }
                });
                return true;
            } else {
                return false;
            }
        } else if (typeof input === 'object') {
            Object.entries(input).forEach((prop, index) => {
                let key = prop[0];
                let value = prop[1];

                if (
                    value === undefined ||
                    value === null ||
                    value === '' ||
                    key === undefined ||
                    key === null ||
                    key === ''
                ) {
                    return false;
                }
            });
            return true;
        } else {
            if (input === undefined || input === null || input === '') {
                return false;
            } else {
                return true;
            }
        }
    } else {
        return false;
    }
};

export const isValidArray = (input, checklength) =>
    input && Array.isArray(input)
        ? input[0] !== undefined && input[0] !== null
            ? checklength
                ? input.length > 0
                : true
            : false
        : false;


// DEBUG / MISC
export function printDebug ( src, vars = [] ) {
    if ( isValidArray( vars ) )
    {
        console.log(
            src, " :: vars = ", vars, 
            vars.map( ( v, index ) =>
            {
                return v;
            })
                // vars.map((v) => {
                // return [Object.keys(v)[0], v].join(" = ");
                // } ).join( "\n\n" )
            
        );
    } else
    {
        console.log( "Printdebug :: given nothing to print." );
    }
}