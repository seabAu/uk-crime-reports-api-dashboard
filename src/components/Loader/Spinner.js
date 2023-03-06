import React from 'react'
function Spinner (props)
{
    const {
        padding = 0,
        margin = 0,
        radius,
        cx = 0,
        cy = 0,
        fill,
        stroke,
        strokeWidth,
        spinnerPadding = 0,
    } = props;
    
    const spinnerContainerStyles = {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        alignContent: "center",
        // height: height,
        // width: `${width > 100 ? 100 : width}%`,
        // backgroundColor: fillercolor,
        // borderRadius: borderRadius,
        padding: `${padding}px`,
        margin: `${margin}`,
    };

    const spinnerStyles = {
        padding: `${spinnerPadding}px`,
        textAlign: "right",
        transition: "width 1s ease-in-out",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        top: "50%",
        left: "50%",
        margin: "-25px 0 0 -25px",
        width: "50px",
        height: "50px",
    };

    const spinnerPathStyles = {
        stroke: "#111111",
        strokeLinecap: "rounsd",
        padding: `${padding}px`,
        color: "white",
    };

  return (
      <div className="loader-spinner-container" style={spinnerContainerStyles}>
          <svg
              className="spinner"
              id="spinner"
              style={spinnerStyles}
              viewBox="0 0 50 50">
              <circle
                  style={spinnerPathStyles}
                  className="path"
                  cx={cx ?? "25"}
                  cy={cy ?? "25"}
                  r={radius ?? "20"}
                  fill={"none"}
                  stroke={stroke ?? "#111111"}
                  // pathlength={1}
                  strokeWidth={strokeWidth ?? "5"}></circle>
          </svg>
      </div>
  );
}

export default Spinner
