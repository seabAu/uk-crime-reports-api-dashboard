import React, { Children, Component, useEffect } from "react";
import PropTypes from "prop-types";
import TabNav from "./TabNav";
import styles from "./Tabs.module.css";
import { arrayIsValid, has } from "../Utilities/ObjectUtils";

const Tabs = ( props ) =>
{
    const { children, type, centered, padContent, fillArea, roundedNav } = props;
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
    const onClickSetActiveTab = (index) => {
        setSelectedTabIndex(index);
    };
    const tabContents = Children.toArray( children );
    // console.log("TABS :: props = ", props);
    
    useEffect( () =>
    {
        if ( children )
        {
            if ( children.length > 0 )
            {
                if ( selectedTabIndex >= children.length - 1 )
                {
                    // console.log("TABS :: selectedTabIndex = ", selectedTabIndex, " children.length = ", children.length);
                    setSelectedTabIndex(children.length - 1);
                }
            }
        }
    }, [ children ] );
    
    const getTabNav = ( input ) =>
    {
        if ( input )
        {
            if (typeof input === "object" && !Array.isArray(input)) {
                input = [input];
            }
            if ( Array.isArray( input ) )
            {
                if (
                    input[0] !== undefined &&
                    input[0] !== null &&
                    input[0] !== false
                ) {
                    return input.map((tab, index) => {
                        // console.log(tab);
                        if (tab) {
                            if (has(tab, "props")) {
                                // if (has(tab.props, "label") && has(tab.props, "id")) {
                                // const { label, id } = tab.props;
                                return (
                                    <TabNav
                                        index={index}
                                        active={selectedTabIndex}
                                        label={
                                            has(tab.props, "label")
                                                ? tab.props.label
                                                : ""
                                        } // {label ?? ' '}
                                        onClick={onClickSetActiveTab}
                                        id={
                                            has(tab.props, "id")
                                                ? tab.props.id
                                                : has(tab.props, "label")
                                                ? tab.props.label
                                                : ""
                                        } // {id === "" ? "" : id}
                                        rounded={roundedNav}
                                    />
                                );
                                // }
                            }
                        }
                        return (<></>);
                    });
                }
            }
        }
        return (
            <TabNav
                index={0}
                active={selectedTabIndex}
                label={""}
                onClick={onClickSetActiveTab} 
                id={"blank-tab-nav"}
                rounded={roundedNav}
            />
        );
    }
    const getTabContent = ( input ) =>
    {
        if ( input )
        {
            // console.log( "getTabContent :: input = ", input, typeof input, Array.isArray(input) );
            if (typeof input === "object" && !Array.isArray(input)) {
                input = [input];
            }
            if (Array.isArray(input)) {
                if (input[0] !== undefined && input[0] !== null) {
                    return (
                        input.map((tab, index) => {
                            if (tab) {
                                if (index !== selectedTabIndex) {
                                    return undefined;
                                } else
                                {
                                    // console.log( "getTabContent :: tab = ", tab, ", children = ", children, ", input = ", input );
                                    if ( has( tab, "props" ) )
                                    {
                                        // console.log(
                                        //     "getTabContent :: tab has props = ",
                                        //     tab.props,
                                        //     ", children = ",
                                        //     children,
                                        //     ", input = ",
                                        //     input,
                                        // );
                                        if ( has( tab.props, "children" ) )
                                        {
                                            // console.log(
                                            //     "getTabContent :: tab has props.children = ",
                                            //     tab.props.children,
                                            //     ", children = ",
                                            //     children,
                                            //     ", input = ",
                                            //     input,
                                            // );
                                            return tab.props.children;
                                        }
                                    }
                                    return undefined;
                                }
                            } else {
                                return "";
                            }
                        } )
                    );
                }
            }
        }
    }
    return (
        <div
            className={`tabs-container ${
                type === "top" ? "tabs-top" : type === "left" ? "tabs-left" : ""
            } ${fillArea ? "fill-area" : ""}`}
            id={`tabs-container`}>
            <div className={`tabs-nav-list`}>{getTabNav(children)}</div>
            <div className="tab-content-container">
                <div
                    className={`tab-content ${
                        padContent ? "tab-content-padded" : ""
                    }`}>
                    {getTabContent(children)}
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
