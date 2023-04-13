import React, { Children, Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import TabNav from './TabNav';
import styles from './Tabs.module.css';
import { has, _has } from '../../utilities/AO';
import * as util from '../../utilities';

const TabContent = props => {
    const {
        children,
        tabIndex,
        selectedTabIndex,
        items,
        type,
        centered,
        padContent,
        fillArea,
        roundedNav,
    } = props;

    const tabContents = Children.toArray(children);

    const getTabContent = input => {
        if (input) {
            // console.log( "getTabContent :: input = ", input, typeof input, Array.isArray(input) );
            if (typeof input === 'object' && !Array.isArray(input)) {
                input = [input];
            }
            if (util.val.isValidArray(input, true)) {
                    return input.map((tab, index) => {
                        if (tab) {
                            if (has(tab, 'props')) {
                                if (has(tab.props, 'children')) {
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
                        } else {
                            return '';
                        }
                    });
            }
        }
    };
    return (
        <div className="tab-content-container">
            <div
                className={`tab-content ${
                    padContent ? 'tab-content-padded' : ''
                }`}
            >
                {getTabContent(children)}
            </div>
        </div>
    );
};

export default TabContent;
