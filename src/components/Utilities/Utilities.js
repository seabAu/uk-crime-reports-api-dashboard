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
export function isObject(value) {
    return value !== null && typeof value === "object";
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
const varToString = varObj => Object.keys( varObj )[ 0 ];
