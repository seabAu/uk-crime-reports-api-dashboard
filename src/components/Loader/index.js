import React from "react";
import ProgressBar from "./ProgressBar";
import Spinner from "./Spinner";

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
                                    message={progress.message ?? ""}
                                    bgcolor={"#988dfa"}
                                    fillercolor={"#7823e6"}
                                    labelColor={"#ffffff"}
                                    height={16}
                                    margin={0}
                                    padding={ 2 }
                                    border={`1px solid white`}
                                    fillerMargin={2}
                                    fillerPadding={0}
                                    success={progress.success ?? 0}
                                    failure={progress.failure ?? 0}
                                    results={progress.results ?? 0}
                                    currValue={progress.currValue ?? 0}
                                    endValue={progress.endValue ?? 1}
                                    startTime={progress.startTime}
                                    currTime={progress.currTime}
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
        <div className="loader-container">
            <Spinner
            padding={`10px`}
            margin={`10px`}
            radius={`20`}
            cx={`25`}
            cy={`25`}
            fill={`#111111`}
            stroke={`#555555`}
            strokeWidth={5}
            spinnerPadding={5}
            
            />
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
