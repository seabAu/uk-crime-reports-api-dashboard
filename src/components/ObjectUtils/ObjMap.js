import React from "react";

function ObjMap ( { object, elementWrap } )
{
    console.log( "ObjMap():\n\n", object, elementWrap );
    // This flattens an object into HTML elements.
    const flatMapObj = (obj, wrap = "") => {
        let wrapBefore = "";
        let wrapAfter = "";
        if (wrap) {
            wrapBefore = `<${wrap}>`;
            wrapAfter = `</${wrap}>`;
        } else {
            wrap = "div";
        }
        console.log("flatMapObj(): ", obj, wrap);
        return Object.entries(obj)
            .map((objProperty) => {
                const wrapElement = document.createElement(`${wrap}`);
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    wrapElement.innerText = `${flatMapObj(
                        objProperty[1],
                        wrap,
                    )}`;
                    // console.log(wrapElement);
                    return wrapElement;
                    // return `${ flatMapObj( objProperty[ 1 ], ) }`;
                } else {
                    wrapElement.innerText = `${objProperty[0]}: ${objProperty[1]}`;
                    // console.log(wrapElement);
                    return wrapElement;
                    // return `${wrapBefore}${objProperty[0]}: ${objProperty[1]}${wrapAfter}`;
                }
            })
            .join("");
    };

    return (
        <div>
            {flatMapObj(object, elementWrap)}
        </div>
    );
}

export default ObjMap;

/*

    // This flattens an object into HTML elements.
    const flatMapObj = (obj, elementWrap = "", parentElement) => {
        if (obj == null) {
            return;
        }
        if (!parentElement) {
            return;
        }
        if (!elementWrap) {
            elementWrap = "div";
        }
        console.log(
            "DashboardContent::flatMapObj(): ",
            obj,
            elementWrap,
            parentElement,
        );
        const flattened = document.createElement("div");
        let objList = Object.entries(obj);
        console.log(objList);
        objList.forEach((value, index) => {
            const objLine = document.createElement(elementWrap);
            objLine.innerText = `${value[0]}: ${value[1]}`;
            flattened.appendChild(objLine);
        });
        // flattened.innerHTML = objList.map((objProperty) => {
        //         const wrapElement = document.createElement(`${elementWrap}`);
        //         if (
        //             typeof objProperty[1] === "object" &&
        //             objProperty[1] !== null
        //         ) {
        //             wrapElement.innerText = `${flatMapObj(
        //                 objProperty[1],
        //                 elementWrap,
        //                 parentElement
        //             )}`;
        //             console.log(wrapElement);
        //             return wrapElement;
        //             // return `${ flatMapObj( objProperty[ 1 ], ) }`;
        //         } else {
        //             wrapElement.innerText = `${objProperty[0]}: ${objProperty[1]}`;
        //             console.log(wrapElement);
        //             return wrapElement;
        //             // return `${wrapBefore}${objProperty[0]}: ${objProperty[1]}${wrapAfter}`;
        //         }
        //     })
        //     .join("");
        console.log("DashboardContent::flatMapObj(): flattened = ", flattened);
        parentElement.appendChild(flattened);
        return flattened;
    };

    // This flattens an object into HTML elements.
    const flatMapObj2 = (obj, elementWrap = "", parentElement) => {
        if (obj == null) {
            return;
        }
        if (!parentElement) {
            return;
        }
        if (!elementWrap) {
            elementWrap = "div";
        }
        console.log("DashboardContent::flatMapObj(): ", obj, elementWrap);
        const flattened = document.createElement("div");
        flattened.innerHTML = Object.entries(obj)
            .map((objProperty) => {
                const wrapElement = document.createElement(`${elementWrap}`);
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    wrapElement.innerText = `${flatMapObj(
                        objProperty[1],
                        elementWrap,
                    )}`;
                    console.log(wrapElement);
                    return wrapElement;
                    // return `${ flatMapObj( objProperty[ 1 ], ) }`;
                } else {
                    wrapElement.innerText = `${objProperty[0]}: ${objProperty[1]}`;
                    console.log(wrapElement);
                    return wrapElement;
                    // return `${wrapBefore}${objProperty[0]}: ${objProperty[1]}${wrapAfter}`;
                }
            })
            .join("");
        console.log("DashboardContent::flatMapObj(): flattened = ", flattened);
        document.getElementById(parentElement).appendChild(flattened);
    };

    // This flattens an object into HTML elements.
    const flatMapObjText = (obj) => {
        // console.log("flatMapObj(): ", obj, elementWrap);
        return Object.entries(obj)
            .map((objProperty) => {
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    return `${flatMapObj(objProperty[1])}`;
                } else {
                    return `${objProperty[0]}: ${objProperty[1]}`;
                }
            })
            .join("");
    };

    const AppendRows = (objArray, tableElement) => {};

    // const changePage = (pagenum) => {
    //     // console.log( "changePage(): ", pagenum, pageNum );
    //     const crimeReportsClone = [...crimeReports];
    //     // console.log( "Reached bottom of table: ", crimeReports );
    //     if (crimeReportsClone.length > listNumber) {
    //         setTimeout( () =>
    //         {
    //             return setPageNum(pagenum);
    //         }, 10 );
    //     }
    // };

*/