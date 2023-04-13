import React, { Children, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import TabNav from './TabNav';
import * as util from '../../utilities/index';
import './tabs.css';
// import styles from "./Tabs.module.css";

const Tabs = props => {
    const {
        children,
        items = [],
        type = 'top',
        centered = true,
        padContent = true,
        fillArea = true,
        roundedNav = true,
        boxShadow,
        contentBoxShadow = true,
        navBoxShadow = true,
    } = props;

    const itemsToTabs = input => {
        if (util.val.isValidArray(input, true)) {
            return input.map((item, index) => {
                if (util.ao.has(item, 'label') && util.ao.has(item, 'children')) {
                    console.log(
                        'itemsToTabs :: ',
                        item,
                        item.label,
                        item.children
                    );
                    return (
                        <div
                            className="tabs-item"
                            label={item.label}
                            id={`tab-${index}-${item.label}`}
                            key={util.ao.has(item, 'key') ? item.key : index}
                        >
                            {item.children}
                        </div>
                    );
                }
                return '';
            });
        }
    };

    const [tabChildren, setTabChildren] = React.useState(
        children
            ? children
            : util.val.isValidArray(items, true)
            ? itemsToTabs(items)
            : []
    );
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
    const onClickSetActiveTab = index => {
        setSelectedTabIndex(index);
    };
    // const tabContents = Children.toArray( children );
    // console.log("TABS :: props = ", props);

    useEffect(() => {
        if (children) {
            if (children.length > 0) {
                if (selectedTabIndex >= children.length - 1) {
                    // console.log("TABS :: selectedTabIndex = ", selectedTabIndex, " children.length = ", children.length);
                    setSelectedTabIndex(children.length - 1);
                }
            }
        }
    }, [children]);

    const getTabNav = input => {
        if (input) {
            if (typeof input === 'object' && !Array.isArray(input)) {
                input = [input];
            }
            if (Array.isArray(input)) {
                if (
                    input[0] !== undefined &&
                    input[0] !== null &&
                    input[0] !== false
                ) {
                    return input.map((tab, index) => {
                        // console.log(tab);
                        if (tab) {
                            if (util.ao.has(tab, 'props')) {
                                // if (has(tab.props, "label") && has(tab.props, "id")) {
                                // const { label, id } = tab.props;
                                // console.log(tab, tab.props);
                                return (
                                    <TabNav
                                        tabIndex={index}
                                        activeTabIndex={selectedTabIndex}
                                        label={
                                            util.ao.has(tab.props, 'label')
                                                ? tab.props.label
                                                : ''
                                        } // {label ?? ' '}
                                        sublabel={
                                            util.ao.has(tab.props, 'sublabel')
                                                ? tab.props.sublabel
                                                : ''
                                        }
                                        onClick={onClickSetActiveTab}
                                        id={
                                            util.ao.has(tab.props, 'id')
                                                ? tab.props.id
                                                : util.ao.has(tab.props, 'label')
                                                ? tab.props.label
                                                : ''
                                        } // {id === "" ? "" : id}
                                        rounded={roundedNav}
                                        navBoxShadow={navBoxShadow}
                                    />
                                );
                                // }
                            }
                        }
                        return <></>;
                    });
                }
            }
        }
        return (
            <TabNav
                tabIndex={0}
                activeTabIndex={selectedTabIndex}
                label={''}
                onClick={onClickSetActiveTab}
                id={'blank-tab-nav'}
                rounded={roundedNav}
                navBoxShadow={navBoxShadow}
            />
        );
    };

    const getTabContentQuickRender = input => {
        if (input) {
            // console.log( "getTabContent :: input = ", input, typeof input, Array.isArray(input) );
            if (typeof input === 'object' && !Array.isArray(input)) {
                input = [input];
            }
            if (util.val.isValidArray(input, true)) {
                return input.map((tab, index) => {
                    if (tab) {
                        if (util.ao.has(tab, 'props')) {
                            if (util.ao.has(tab.props, 'children')) {
                                return (
                                    <div
                                        style={tabContentStyles}
                                        className={`tab-content ${
                                            padContent
                                                ? 'tab-content-padded'
                                                : ''
                                        } ${
                                            index !== selectedTabIndex
                                                ? 'tab-content-hidden'
                                                : ''
                                        }`}
                                    >
                                        {tab.props.children}
                                    </div>
                                );
                            }
                        }
                    }
                    return '';
                });
            }
        }
    };

    const getTabContentSingleRender = input => {
        if (input) {
            // console.log( "getTabContent :: input = ", input, typeof input, Array.isArray(input) );
            if (typeof input === 'object' && !Array.isArray(input)) {
                input = [input];
            }
            if (util.val.isValidArray(input, true)) {
                return input.map((tab, index) => {
                    if (tab) {
                        if (index !== selectedTabIndex) {
                            return undefined;
                        } else {
                            if (util.ao.has(tab, 'props')) {
                                if (util.ao.has(tab.props, 'children')) {
                                    return tab.props.children;
                                }
                            }
                            return undefined;
                        }
                    } else {
                        return '';
                    }
                });
            }
        }
    };
    const tabContainerStyles = {
        height: `${fillArea ? '100%' : 'auto'}`,
        width: `${fillArea ? '100%' : 'auto'}`,
        boxShadow: `${boxShadow ? '0 0 5px black' : 'none'}`,
        // display: "flex",
        // justifyContent: "space-around",
        // alignItems: "center",
        // flexDirection: "row",
        // alignContent: "center",
        // height: height,
        // width: `${width > 100 ? 100 : width}%`,
        // backgroundColor: fillercolor,
        // borderRadius: borderRadius,
        // padding: `${padding}px`,
        // margin: `${margin}`,
    };

    const tabNavListStyles = {
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

    const tabContentStyles = {
        gap: `${padContent ? '0.125rem' : '0rem'}`,
        padding: `${padContent ? '2rem' : '0rem'}`,
        boxShadow: `${contentBoxShadow ? '0 0 5px black' : 'none'}`,
        // height: `${centered ? '100%' : 'auto'}`,
        // width: `${centered ? '100%' : 'auto'}`,
        display: "flex",
        justifyContent: `${centered ? 'center' : 'flex-start'}`,
        alignItems: `${centered ? 'center' : 'flex-start'}`,
    };

    console.log(
        'Tabs.js :: props = ',
        props,
        ' :: tabChildren = ',
        tabChildren
    );

    return (
        <div
            style={tabContainerStyles}
            className={`tabs-container ${
                type === 'top' ? 'tabs-top' : type === 'left' ? 'tabs-left' : ''
            } ${fillArea ? 'fill-area' : ''}`}
            id={`tabs-container`}
        >
            <div className={`tabs-nav-list`}>{getTabNav(children)}</div>
            <div className="tab-content-container">
                <div
                    style={tabContentStyles}
                    className={`tab-content ${
                        padContent ? 'tab-content-padded' : ''
                    }`}
                >
                    {getTabContentQuickRender(children)}
                </div>
            </div>
        </div>
    );
};

export default Tabs;

/*
    import React, { Children, Component } from "react";
    import PropTypes from "prop-types";
    import TabNav from "./TabNav";
    import styles from "./Tabs.module.css";

    class Tabs extends Component {
        static propTypes = {
            children: PropTypes.instanceOf(Array).isRequired,
            type: PropTypes.string,
        };

        constructor(props) {
            super(props);

            this.state = {
                selectedTabIndex: this.props.children[0].props.index,
                // tabItems: this.props.children,
                // tabItems: Children.toArray(this.props.children),
                tabItems: this.props.children,
            };
        }

        onClickSetActiveTab = (index) => {
            this.setState({ selectedTabIndex: index });
        };

        render() {
            const {
                onClickSetActiveTab,
                props: { children, type, centered, padContent, fillArea, roundedNav },
                state: { selectedTabIndex = 0 },
            } = this;

            return (
                <div
                    className={`tabs-container ${
                        type === "top"
                            ? "tabs-top"
                            : type === "left"
                            ? "tabs-left"
                            : ""
                    } ${fillArea ? "fill-area" : ""}`}
                    id={`tabs-container`}>
                    <div className={`tabs-nav-list`}>
                        {children.map((tab, index) => {
                            // console.log( tab );
                            if ( tab )
                            {
                                const { label, id } = tab.props;
                                return (
                                    <TabNav
                                        index={index}
                                        active={selectedTabIndex}
                                        label={label}
                                        onClick={onClickSetActiveTab}
                                        id={id === "" ? "" : id}
                                        rounded={roundedNav}
                                    />
                                );
                            } else
                            {
                                return '';
                            }
                        })}
                    </div>
                    <div className="tab-content-container">
                        <div
                            className={`tab-content ${
                                padContent ? "tab-content-padded" : ""
                            }`}>
                            {children.map((tab, index) => {
                                if (index !== selectedTabIndex) {
                                    return undefined;
                                } else {
                                    return tab.props.children;
                                }
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    }

    export default Tabs;
*/
