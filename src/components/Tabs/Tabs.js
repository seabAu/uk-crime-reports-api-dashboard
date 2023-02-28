import React, { Children, Component, useEffect } from "react";
import PropTypes from "prop-types";
import TabNav from "./TabNav";
import styles from "./Tabs.module.css";

const Tabs = ({ children, type, centered, padContent, fillArea, roundedNav }) => {
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
    const onClickSetActiveTab = (index) => {
        setSelectedTabIndex(index);
    };
    const tabContents = Children.toArray( children );
    
    useEffect( () =>
    {
        if ( children )
        {
            if ( children.length > 0 )
            {
                if ( selectedTabIndex >= children.length - 1 )
                {
                    console.log("TABS :: selectedTabIndex = ", selectedTabIndex, " children.length = ", children.length);
                    setSelectedTabIndex(children.length - 1);
                }
            }
        }
    }, [children]);
    return (
        <div
            className={`tabs-container ${
                type === "top" ? "tabs-top" : type === "left" ? "tabs-left" : ""
            } ${fillArea ? "fill-area" : ""}`}
            id={`tabs-container`}>
            <div className={`tabs-nav-list`}>
                {children.map((tab, index) => {
                    // console.log( tab );
                    if (tab) {
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
                    } else {
                        return "";
                    }
                })}
            </div>
            <div className="tab-content-container">
                <div
                    className={`tab-content ${
                        padContent ? "tab-content-padded" : ""
                    }`}>
                    {
                        children &&
                        (children.length > 0) && (
                            children.map( ( tab, index ) =>
                            {
                                if ( tab )
                                {
                                    if (index !== selectedTabIndex) {
                                        return undefined;
                                    } else {
                                        return tab.props.children;
                                    }
                                } else
                                {
                                    return '';
                                }
                            })
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Tabs
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


/* // Archived on 02-16-23 // 
    import React, { Children } from "react";
    import TabNav from "./TabNav";

    function Tabs({ labels, children }) {
        const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
        const onClickSetActiveTab = (index) => {
            setSelectedTabIndex(index);
        };
        const tabContents = Children.toArray(children);
        return (
            <div>
                <div className="tabs-container tabs-left">
                    <div className="tabs-nav-list">
                        { tabContents.map( ( tab, index ) =>
                        {
                            const { label, id } = tab.props;
                            return (
                                <TabNav
                                    index={ index }
                                    active={ selectedTabIndex }
                                    label={ label }
                                    onClick={ onClickSetActiveTab }
                                    id={id === '' ? '' : id}
                                />
                            )
                        })}
                    </div>
                    <div className="tab-content-container">
                        <div className="tab-content">
                            {tabContents.map((tab, index) => {
                                if (index !== selectedTabIndex) {
                                    return undefined;
                                } else {
                                    return tab.props.children;
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    export default Tabs;

*/

/* // Archived on 02-16-23 // 
    import React, { Children } from "react";
    import TabNav from "./TabNav";

    function Tabs({ labels, children }) {
        const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
        const onClickSetActiveTab = (index) => {
            setSelectedTabIndex(index);
        };
        const tabContents = Children.toArray(children);
        return (
            <div>
                <div className="tabs-container tabs-left">
                    <div className="tabs-nav-list">
                        { tabContents.map( ( tab, index ) =>
                        {
                            const { label, id } = tab.props;
                            return (
                                <TabNav
                                    index={ index }
                                    active={ selectedTabIndex }
                                    label={ label }
                                    onClick={ onClickSetActiveTab }
                                    id={id === '' ? '' : id}
                                />
                            )
                        })}
                    </div>
                    <div className="tab-content-container">
                        <div className="tab-content">
                            {tabContents.map((tabPanel) => {
                                // console.log(tabPanel, tabPanel.props);
                                if (tabPanel.props.label !== selectedTabIndex) {
                                    return undefined;
                                } else {
                                    return tabPanel.props.children;
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    export default Tabs;

*/

/*
    import React from "react";

    function Tabs({ labels, children }) {
        const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
        const onClickSetActiveTab = (index) => {
            setSelectedTabIndex(index);
        };
        return (
            <div>
                <div className="tabs-container tabs-left">
                    <div className="tabs-nav-list">
                        {labels.map((label, index) => (
                            <div
                                className={`tab-nav-item ${
                                    selectedTabIndex === index ? "tab-active" : ""
                                }`}
                                onClick={onClickSetActiveTab(index)}>
                                <h1 className="tab-nav-item-label">{label}</h1>
                            </div>
                        ))}
                    </div>
                    <div className="tab-content-container">
                        <div className="tab-content">
                            {children.map((child) => {
                                if (child.props.label !== selectedTabIndex) {
                                    return undefined;
                                } else {
                                    return child.props.children;
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    export default Tabs;

*/
