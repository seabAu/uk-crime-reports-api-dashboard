import React from 'react'

const Marker = ({ onClick, children, feature }) => {
    const _onClick = () => {
        onClick(feature.properties.description);
    };

    return (
        <button onClick={_onClick} className="marker">
            {children}
        </button>
    );
};


export default Marker
