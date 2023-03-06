import React from "react";
//import data from './data.json' assert { type: 'JSON' };
import metro_results_data from "./AllMetropolitanData.json";
import metro_neighborhoods_data from "./MetropolitanAllNeighborhoodsData.json";

export function getMetroResultsData() {
    console.log(metro_results_data);
    return metro_results_data;
}

export function getMetroNeighborhoodsData() {
    console.log(metro_neighborhoods_data);
    return metro_neighborhoods_data;
}

export function importFile(filepath) {
    if (filepath) {
        let data;
        fetch(`${filepath}`)
            .catch((error) => {
                console.error(
                    `importFile :: ${filepath} returned an error: `,
                    error,
                );
                return;
            })
            .then((response) => {
                if (response) {
                    if (!response.ok) {
                        throw new Error("Http error: " + response.status);
                    } else {
                        return response.json();
                    }
                }
            })
            .catch((error) => {
                console.error(
                    `importFile :: ${filepath} returned an error: `,
                    error,
                );
                return;
            })
            .then((result) => {
                data = result;
                console.log(result);
            });
        if (data) {
            return data;
        }
    }
}
