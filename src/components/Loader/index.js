import React from "react";
import { Pane, Spinner } from "evergreen-ui";
import ProgressBar from "./ProgressBar";

const Loader = ({ progressInfo }) => {
    const getProgressBars = (input) => {
        let loaders = [];
        if (input) {
            if (Array.isArray(input)) {
                if (input.length > 0) {
                    input.forEach((progress, index) => {
                        // console.log(
                        //     "Progress bar loader.js :: input = ",
                        //     input,
                        //     "\nprogress = ",
                        //     progress,
                        // );
                        if (progress.currValue && progress.endValue) {
                            loaders.push(
                                <ProgressBar
                                    id={progress.id ?? index}
                                    key={index}
                                    message={progress.message}
                                    bgcolor={"#988dfa"}
                                    fillercolor={"#78c7e6"}
                                    height={36}
                                    success={progress.success}
                                    failure={progress.failure}
                                    currValue={progress.currValue}
                                    endValue={progress.endValue}
                                />,
                            );
                        }
                    });
                }
            }
        }
        if (loaders.length > 0) {
            return loaders;
        }
    };
    return (
        <div class="spinner-container">
            <div className="flex-row">
                <svg className="spinner" id="spinner" viewBox="0 0 50 50">
                    <circle
                        class="path"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="5"></circle>
                </svg>
            </div>
            {progressInfo && getProgressBars(progressInfo)}
        </div>
    );
};

export default Loader;

/*

        <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={450}>
            <Spinner size={100} />
        </Pane>
*/
