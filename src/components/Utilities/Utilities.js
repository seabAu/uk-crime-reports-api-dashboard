import React from "react";
import { arrayIsValid } from "./ObjectUtils";

export function escapeHtml(unsafe) {
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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
export function length(numA, numB) {
    return Math.abs(numA - numB);
}
export function isDefined(value) {
    return value !== undefined && value !== null;
}
export const isObject = (value) => {
    return value !== null && value !== undefined && typeof value === "object";
}
export const isArray = (value) => {
    return value !== null && Array.isArray(value) && typeof value !== "object";
}


export function isNumber(value) {
    return typeof value === "number";
}
export function captialize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function distanceTo(pointA, pointB) {
    const xDiff = (pointB.x - pointA.x) ** 2;
    const yDiff = (pointB.y - pointA.y) ** 2;

    return Math.sqrt(xDiff + yDiff);
}

export function sec2str(t) {
    var d = Math.floor(t / 86400),
        h = ("0" + (Math.floor(t / 3600) % 24)).slice(-2),
        m = ("0" + (Math.floor(t / 60) % 60)).slice(-2),
        s = ("0" + (t % 60)).slice(-2);
    return (
        (d > 0 ? d + "d " : "") +
        (h > 0 ? h + ":" : "") +
        (m > 0 ? m + ":" : "") +
        (t > 60 ? s : s + "s")
    );
}
export function timeElapsed(start, finish) {
    const difference = (finish - start) / 1000;
    return sec2str(difference);
}

export function timeEstimate(start, finish, numCompleted, numTotal) {
    // It took (seconds) time to reach (numTotal). 
    const seconds = (finish - start) / 1000;
    // const difference = Math.abs( numTotal - numCompleted );
    const secondsPerCompleted = seconds / numCompleted;
    const secondsToComplete = secondsPerCompleted * numTotal;
    // Divide by( numCompleted ) and multiply by( numTotal ).
    return sec2str(secondsToComplete);
}

export function printDebug ( src, vars = [] ) {
    if ( arrayIsValid( vars ) )
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
export const varToString = varObj => Object.keys( varObj )[ 0 ];

export const generateDateOptions = (startYear = 2017, startMonth = 8) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const start = new Date(startYear, startMonth);
    const now = new Date();
    // const now = new Date("2020, 8");

    var numMonths =
        now.getMonth() -
        start.getMonth() +
        (now.getYear() - start.getYear()) * 12;
    // var numMonths = differenceInMonths( now, start );
    // var numYears = Math.floor(numMonths / 12);
    const dates = [];
    for (let y = 0; numMonths >= 0; y++) {
        let year = startYear + y;
        // For each year between now and the start date, ascending.
        for (
            let m = year === startYear ? startMonth : 1;
            m <= 12 && numMonths >= 0;
            m++
        ) {
            // For each month in the year.
            let month = months[m - 1];
            dates.unshift({
                key: `${year}-${m}`,
                value: `${month} ${year}`,
            });
            numMonths--;
        }
    }

    // dates.unshift({
    //     key: "all_dates",
    //     value: "All Dates",
    // });
    // dates.splice(0, 3);
    return dates;
};

export const formatObjArray = ( array, split = '_', join = ' ' ) =>
{
    if ( arrayIsValid( array, true ) )
    {
        
        return array.map( ( element, index ) =>
        {
            if ( isObject( element ) )
            {
                // Element is an object.
                Object.keys( element ).forEach( ( key ) =>
                {
                    element[ key ] = element[ key ]
                        .split( split )
                        .join( join );
                } );
                return element;
            }
            else if ( isArray( element ) )
            {
                // Element is an array.
                return element.map( ( val ) =>
                {
                    return val.split( split ).join( join );
                } );
            }
            else
            {
                // Element is a scalar value.
                return element.split(split).join(join);
            }
        });
    }
};
