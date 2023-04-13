import React, { Children, Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Loader from "../../Loader";

const Content = (props) =>
{
    const {
        children,
        isFetching,
        isLoading,
        progressInfo,
        showContent,
        // showTable,
        // showMap,
        // setShowSidePanel,
    } = props;
    useEffect( () =>
    {
        if ( children )
        {
            if ( children.length > 0 )
            {
            }
        }
    }, [ children ] );
    
    return (
        <div className="dashboard-content">
            { showContent && isFetching && progressInfo && (
                <Loader progressInfo={ progressInfo }></Loader>
            ) }
            { showContent && !isFetching && children && children !== false && (
                children
            )}
        </div>
    );
};

Content.propTypes = {
    // children: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
};

export default Content;
