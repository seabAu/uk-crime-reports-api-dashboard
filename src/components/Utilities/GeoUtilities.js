import { array } from "prop-types";
import React from "react";

import { arrayIsValid, has } from "./ObjectUtils";

export const points2geojsonFeatures = (input) => {
    // Input MUST be an array containing simple coordinate-pair objects:
    // { lat: #, lng: # }
    let points = [];
    // Construct a points list in JSON out of the provided coordinates.
    if (arrayIsValid(input, true)) {
        // if (input.length > 0) {
        // if (Array.isArray(input)) {
        input.forEach((point, index) => {
            if (point) {
                if ("lat" in point && "lng" in point) {
                    points.push({
                        type: "Feature",
                        properties: {
                            description: `<div>${point.lat.toFixed(
                                4,
                            )}, ${point.lng.toFixed(4)}</div>`,
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [
                                parseFloat(point.lng) + 0.0001 * Math.random(),
                                parseFloat(point.lat) + 0.0001 * Math.random(),
                            ],
                        },
                    });
                }
            }
        });
        // }
        // }
    }
    // console.log(
    //     "RENDERMAP.JS :: points2geojsonFeatures() :: input = ", input, ", points = ",
    //     points,
    // );
    return points;
};

export const data2geojsonfeature = (type, coordinates) => {
    if (type === "point" || type === "polygon") {
        if (isPointObj(coordinates)) {
            // Quick convert if it's in the wrong format.
            // coordinates = pointArray2PointObj(coordinates);
            coordinates = pointObj2pointArray(coordinates);
        }
        if (isPointArray(coordinates)) {
            let description;
            if (type === "point") {
                description = `<div>${coordinates
                    .map((coord) => coord.toFixed(4))
                    .join(", ")}</div>`;
            } else if (type === "polygon") {
                description = coordinates.map(
                    (point, index) =>
                        `<div>${point
                            .map((coord) => coord.toFixed(4))
                            .join(", ")}</div>`,
                );
            }
            return {
                type: "Feature",
                properties: {
                    title: "",
                    description: description,
                },
                geometry: {
                    type: type,
                    coordinates: coordinates,
                },
            };
        }
    } else {
        return {};
    }
};

export const data2geojsonfeatures = (input) => {
    /*
        [
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [-121.353637, 40.584978],
                            [-121.284551, 40.584758],
                            [-121.275349, 40.541646],
                            [-121.246768, 40.541017],
                            [-121.251343, 40.423383],
                            [-121.32687, 40.423768],
                            [-121.360619, 40.43479],
                            [-121.363694, 40.409124],
                            [-121.439713, 40.409197],
                            [-121.439711, 40.423791],
                            [-121.572133, 40.423548],
                            [-121.577415, 40.550766],
                            [-121.539486, 40.558107],
                            [-121.520284, 40.572459],
                            [-121.487219, 40.550822],
                            [-121.446951, 40.56319],
                            [-121.370644, 40.563267],
                            [-121.353637, 40.584978],
                        ],
                    ],
                },
            },
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-121.415061, 40.506229],
                },
            },
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-121.505184, 40.488084],
                },
            },
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-121.354465, 40.488737],
                },
            },
        ];
        */
    //
    // Input MUST be an array containing simple coordinate-pair objects:
    // { lat: #, lng: # }
    let features = [];
    // Construct a points list in JSON out of the provided coordinates.
    if (arrayIsValid(input, true)) {
        // if (input.length > 0) {
        // if (Array.isArray(input)) {
        input.forEach((entry, index) => {
            /*
                    Each entry has a structure like: 
                    {
                        id,
                        index,
                        geometry: {
                            type,
                            coordinates: {
                                lat,
                                lng
                            }
                        }
                    }
                */
            if (has(entry, "geometry")) {
                // Good to go, it's a valid entry.
                let type = entry.geometry.type;
                let coordinates = entry.geometry.coordinates;
                if (type === "point") {
                    // Coordinates will be an object.
                    if ("lat" in coordinates && "lng" in coordinates) {
                        features.push(data2geojsonfeature(type, coordinates));
                    }
                } else if (type === "polygon") {
                    // Coordinates will be an array of objects.
                    // Convert the array of point-object coordinates into an array of point-array coordinates.
                    let coordinatesArray;
                    if (arrayIsValid(coordinates, true)) {
                        coordinatesArray = coordinates.map((point, index) => {
                            return pointObj2pointArray(point);
                        });
                    }
                    coordinatesArray = [coordinatesArray];
                    features.push(data2geojsonfeature(type, coordinatesArray));
                }
            }
        });
        // }
        // }
    }
    // console.log(
    //     "RENDERMAP.JS :: points2geojsonFeatures() :: input = ", input, ", features = ",
    //     features,
    // );
    return features;
};



// Checks if point-pair arrays' values are close to one another.
export const isNearby = (
    point1 = [0, 0],
    point2 = [0, 0],
    threshold = 0.001,
) => {
    if (!isPointArray(point1)) {
        // console.log( "isNearby :: point1 is not a point array :: ", point1 );
        if (isPointObj(point1)) {
            point1 = pointObj2pointArray(point1);
        } else {
            // Given invalid values. Exit.
            return false;
        }
    }
    if (!isPointArray(point2)) {
        // console.log("isNearby :: point2 is not a point array :: ", point2);
        if (isPointObj(point2)) {
            point2 = pointObj2pointArray(point2);
        } else {
            // Given invalid values. Exit.
            return false;
        }
    }
    // console.log("isNearby :: values are valid :: ", point1, point2, threshold);
    if (arrayIsValid(point1, false) && arrayIsValid(point2, false)) {
        console.log(
            "MapPoly.js :: isNearby() :: Checking: ",
            point1,
            point2,
            Math.abs(point1[0] - point2[0]),
            Math.abs(point1[1] - point2[1]),
            Math.abs(point1[0] - point2[0]) < threshold,
            Math.abs(point1[1] - point2[1]) < threshold,
        );
        return (
            Math.abs(point1[0] - point2[0]) < threshold &&
            Math.abs(point1[1] - point2[1]) < threshold
        );
    } else {
        return false;
    }
};

// Checks if a point-pair array's values are close any in an array of point-pair arrays.
export const isNearbyAny = (testpoint, points, threshold = 0.001) => {
    if (arrayIsValid(points, true)) {
        console.log("isNearbyAny :: ", testpoint, points, threshold);
        points.forEach((point) => {
            if (point) {
                if (isNearby(point, testpoint, 0.001)) {
                    return true;
                }
            }
        });
    }
    return false;
};

// Functions to avoid the error: "lng_lat.js:163 Uncaught Error: `LngLatLike` argument must be specified as a LngLat instance, an object {lng: <lng>, lat: <lat>}, an object {lon: <lng>, lat: <lat>}, or an array of [<lng>, <lat>]" and generally make life easier in this map renderer.
export const isGeoObj = ( input ) =>
{
    /*
    // Geo Objects look like this: 
    {
        id: ~,
        index: ~,
        geometry: {
            "type": "polygon",
            "coordinates": [...]
        }
    }
    */
    if ( has( input, "geometry" ) )
    {
        if ( has( input.geometry, "coordinates" ) )
        {
            if ( arrayIsValid( input.geometry.coordinates, true ) )
            {
                return true;
            }
        }
    }
    return false;
}
export const geoObj2geoArray = ( input ) =>
{
    if ( !isGeoObj( input ) ) { return []; }
    let coordinates = input.geometry.coordinates;
    return coordinates.map((point, index) => {
        return pointObj2pointArray(point);
    } );
}
export const isGeoArray = (input) => {
    /*
    // Geo Arrays look like this: 
        [
            [coordinates],
            [coordinates],
            [coordinates],
            [coordinates],
        ]
    */
    return arrayIsValid( input, true ) ? (input === input.filter((point) => isPointArray(point))) : false;
};
export const geoArray2geoObj = (input) => {
    if (isGeoArray(input)) {
        return {
            id: 0,
            index: 0,
            geometry: {
                type: "point",
                center: {},
                areasqm: 0,
                coordinates: pointArray2PointObj(input),
            },
        };
    }
    else if (isGeoObj(input)) {
        return {
            id: 0,
            index: 0,
            geometry: {
                type: "polygon",
                center: {},
                areasqm: 0,
                coordinates: input.map((point, index) => {
                    return pointArray2PointObj(point);
                }),
            },
        };
    }
    return {};
};

export const geoObjArray2geoArrayArray = ( input ) =>
{
    console.log("GeoUtilities :: geoObjArray2geoArrayArray :: ", input);
    if ( arrayIsValid( input, true ) )
    {
        let result = input.map( ( geoObj, index ) =>
        {
            console.log(
                "GeoUtilities :: geoObjArray2geoArrayArray :: geoObj = ",
                geoObj,
                ", geoObj2geoArray => ",
                geoObj2geoArray(geoObj),
            );
            return geoObj2geoArray( geoObj );
        })
        console.log(
            "GeoUtilities :: geoObjArray2geoArrayArray :: result = ",
            result,
        );
        return result;
    }
    else
    {
        return input;
    }
}
/*
[
    {
        "id": "7732679584ab5da61c1a8f17eb455bf1",
        "index": 2,
        "geometry": {
            "type": "polygon",
            "center": {
                "lat": 0,
                "lng": 0
            },
            "areasqm": 0,
            "coordinates": [
                {
                    "lat": -2.454852132381376,
                    "lng": 51.389641707920305
                },
                {
                    "lat": -2.3518988601073545,
                    "lng": 51.34764905973566
                },
                {
                    "lat": -2.37798035692947,
                    "lng": 51.27728948199115
                },
                {
                    "lat": -2.7093501454336604,
                    "lng": 51.268978375551484
                },
                {
                    "lat": -2.622411471800916,
                    "lng": 51.37221149410871
                },
                {
                    "lat": -2.549657826059928,
                    "lng": 51.42188623739494
                },
                {
                    "lat": -2.454852132381376,
                    "lng": 51.389641707920305
                }
            ]
        }
    },
    {
        "id": "5df2dc9cf03972b089ca17df28814d3e",
        "index": 2,
        "geometry": {
            "type": "polygon",
            "center": {
                "lat": 0,
                "lng": 0
            },
            "areasqm": 0,
            "coordinates": [
                {
                    "lat": -2.454852132381376,
                    "lng": 51.389641707920305
                },
                {
                    "lat": -2.3518988601073545,
                    "lng": 51.34764905973566
                },
                {
                    "lat": -2.37798035692947,
                    "lng": 51.27728948199115
                },
                {
                    "lat": -2.7093501454336604,
                    "lng": 51.268978375551484
                },
                {
                    "lat": -2.622411471800916,
                    "lng": 51.37221149410871
                },
                {
                    "lat": -2.549657826059928,
                    "lng": 51.42188623739494
                },
                {
                    "lat": -2.454852132381376,
                    "lng": 51.389641707920305
                }
            ]
        }
    },
    {
        "id": "0d6b5e87497cf918287bd36833609fa6",
        "index": 2,
        "geometry": {
            "type": "polygon",
            "center": {
                "lat": 0,
                "lng": 0
            },
            "areasqm": 0,
            "coordinates": [
                {
                    "lat": -2.454852132381376,
                    "lng": 51.389641707920305
                },
                {
                    "lat": -2.3518988601073545,
                    "lng": 51.34764905973566
                },
                {
                    "lat": -2.37798035692947,
                    "lng": 51.27728948199115
                },
                {
                    "lat": -2.7093501454336604,
                    "lng": 51.268978375551484
                },
                {
                    "lat": -2.622411471800916,
                    "lng": 51.37221149410871
                },
                {
                    "lat": -2.549657826059928,
                    "lng": 51.42188623739494
                },
                {
                    "lat": -2.454852132381376,
                    "lng": 51.389641707920305
                }
            ]
        }
    }
]
*/

export const isPointObj = (input) => has(input, "lat") && has(input, "lng");
export const pointObj2pointArray = (point) => isPointObj(point) ? [point.lat, point.lng] : [];

export const isPointArray = (input) => arrayIsValid(input, false) ? input.length >= 2 : false;
export const pointArray2PointObj = (point) => isPointArray(point) ? { lat: point[0], lng: point[1] } : [];

export const filterNearby = (pointsArray, filterPoint) => {
    if (arrayIsValid(pointsArray, true)) {
        return pointsArray.filter((point) => {
            return !isNearby(point, filterPoint, 0.001);
        });
    }
    return pointsArray;
};
