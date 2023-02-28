const ProgressBar = ( {
    id,
    key,
    message,
    success,
    failure,
    startValue = 0,
    currValue = 0,
    endValue = 100,
    bgcolor,
    fillercolor,
    labelColor,
    height,
    width = 100,
    margin = 10,
    padding = 5,
    borderRadius = 50,
}) => {
    const roundToDecimal = (value, decimal_places) => {
        // return Math.round( ( value + Number.EPSILON ) * 100 ) / 100;
        return +(
            Math.round(value + "e+" + decimal_places) +
            "e-" +
            decimal_places
        );
    };
    const containerStyles = {
        height: height,
        width: `${width > 100 ? 100 : width}%`,
        backgroundColor: fillercolor,
        borderRadius: borderRadius,
        padding: `${padding}px`,
        margin: margin,
        boxShadow: "inset 1px 1px 2px rgba(0, 0, 0, 0.5)",
    };

    const fillerStyles = {
        height: "100%",
        width: `${Math.floor((currValue / endValue) * 100)}%`,
        padding: `${padding}px`,
        backgroundColor: bgcolor,
        borderRadius: "inherit",
        textAlign: "right",
        transition: "width 1s ease-in-out",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    };

    const labelStyles = {
        padding: `${padding}px`,
        color: "white",
        fontWeight: "bold",
        fontSize: "0.75rem",
    };

    const getProgressBar = () => {
        return (
            <div className="loader-progress-container" id={id ?? ''} key={key ?? ''}>
                {message && (
                    <div className="loader-progress-message-container">
                        <h2 className="loader-progress-message">{message}</h2>
                        <h2 className="loader-success-count">{success} results</h2>
                        <h2 className="loader-failure-count">{failure} errors</h2>
                    </div>
                ) }
                <div className="loader-progress-bar-container">
                    <div className="progress-bar-container" style={containerStyles}>
                        <div className="progress-bar-filler" style={fillerStyles}>
                            <span
                                className="progress-bar-label"
                                style={labelStyles}>{`${Math.round(
                                (currValue / (endValue === 0 ? 1 : endValue)) * 100,
                            )}%`}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return getProgressBar();
};

export default ProgressBar;
