import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as util from '../../utilities';

const TabNav = props => {
    const {
        tabIndex,
        activeTabIndex,
        id,
        label,
        sublabel,
        onClick,
        rounded = false,
        navBoxShadow = false,
    } = props;

    const tabNavItemStyles = {
        // borderRadius: `${rounded ? "8px" : "0px"}`,
        boxShadow: `${navBoxShadow ? '0 0 5px black' : 'none'}`,
        // padding: `${spinnerPadding}px`,
        // textAlign: "right",
        // transition: "width 1s ease-in-out",
        // display: "flex",
        // justifyContent: "flex-end",
        // alignItems: "center",
        // top: "50%",
        // left: "50%",
        // margin: "-25px 0 0 -25px",
        // width: "50px",
        // height: "50px",
    };

    return (
        <div
            style={tabNavItemStyles}
            className={`tab-nav-item ${
                activeTabIndex === tabIndex ? 'tab-active' : ''
            } ${rounded ? 'tab-nav-rounded' : ''}`}
            onClick={event => {
                onClick(tabIndex);
            }}
            id={id === '' ? '' : id}
            key={id === '' ? '' : id}
        >
            {label && label !== undefined && label !== null && (
                <div className="tab-nav-item-label">{label ? label : '-'}</div>
            )}
            {sublabel && sublabel !== undefined && sublabel !== null && (
                <div className="tab-nav-item-sublabel">
                    {sublabel ? sublabel : '-'}
                </div>
            )}
        </div>
    );
};

TabNav.propTypes = {
    tabIndex: PropTypes.number.isRequired,
    activeTabIndex: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default TabNav;

/*

class TabNav extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        active: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    onClick = () => {
        const { index, label, onClick } = this.props;
        onClick(index);
    };

    render() {
        const {
            onClick,
            props: { index, active, label, id, rounded = false },
        } = this;

        return (
            <div
                className={`tab-nav-item ${
                    active === index ? "tab-active" : ""
                } ${rounded ? "tab-nav-rounded" : ""}`}
                onClick={onClick}
                id={id === "" ? "" : id}>
                <div className="tab-nav-item-label">{label ? label : '-'}</div>
            </div>
        );
    }
}

export default TabNav;

*/

/*
import React from "react";

// This is the tab label and click handle.
function TabNav ( { index, active, label, id } )
{
    const [isActive, setIsActive] = React.useState(false);
        console.log(this.props);

    const handleClick = () =>
    {
        this.props.onClick( index );
    }
    return (
        <div
            className={`tab-nav-item ${active === index ? "tab-active" : ""}`}
            onClick={handleClick(index)}>
            <h1 className="tab-nav-item-label">{label}</h1>
        </div>
    );
}

export default TabNav;

*/
