import React, { Component } from "react";
import PropTypes from "prop-types";

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
                <div className="tab-nav-item-label">{label}</div>
            </div>
        );
    }
}

export default TabNav;

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
