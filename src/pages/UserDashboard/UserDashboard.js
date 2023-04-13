// React
import React, { useState, useEffect, useRef } from "react";

// Redux state management
import { useDispatch, useSelector } from 'react-redux';
import {
    SetMenu,
    SetTheme,
    SetEnvironment,
    SetDebug,
    SetLoading,
    SetFetching,
    SetCache,
    ReloadData,
} from '../../redux/rootSlice';

// Components
import Header from "../../components/Page/Header/Header";
import Sidebar from "../../components/Page/Sidebar/Sidebar";
import Content from "../../components/Page/Content/Content";
import Tabs from '../../components/Tabs/Tabs';

function OptionsDashboard(props) {
    const {
        progressInfo,
        setProgressInfo,
        showSidebar,
        setShowSidebar,
    } = props;
    const dispatch = useDispatch();
    const {
        menu,
        theme,
        environment,
        debug,
        loading,
        fetching,
        cache,
        reloadData,
    } = useSelector(state => state.root);

    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [showContent, setShowContent] = useState(false);



    return (
        <>
            <Sidebar isFetching={isFetching} showSidebar={showSidebar}>
                <div className="query-form">
                    <div className="input-field">
                        <label
                            className="input-field-label"
                            htmlFor="theme-buttons"
                        >
                            <p>Theme</p>
                            <div className="option-buttons-container button-group">
                                {['default', 'light', 'dark', 'cool'].map(
                                    (name, index) => {
                                        return (
                                            <button
                                                className={`button option-button ${
                                                    theme === name
                                                        ? 'option-button-active'
                                                        : ''
                                                }`}
                                                key={`option-button-theme-${name}-${index}`}
                                                id={`option-button-theme-${name}-${index}`}
                                                onClick={event => {
                                                    dispatch(
                                                        SetTheme(`${name}`)
                                                    );
                                                    localStorage.setItem(
                                                        'uk-crime-dashboard-theme',
                                                        name
                                                    );
                                                }}
                                            >
                                                {name.toUpperCase()}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </label>
                    </div>
                    <div className="input-field">
                        <label
                            className="input-field-label"
                            htmlFor="env-buttons"
                        >
                            <p>Environment</p>
                            <div className="option-buttons-container button-group">
                                {['production', 'development'].map(
                                    (name, index) => {
                                        return (
                                            <button
                                                className={`button option-button ${
                                                    environment === name
                                                        ? 'option-button-active'
                                                        : ''
                                                }`}
                                                key={`options-button-env-${name}-${index}`}
                                                id={`options-button-env-${name}-${index}`}
                                                onClick={event => {
                                                    dispatch(
                                                        SetEnvironment(
                                                            `${name}`
                                                        )
                                                    );
                                                    localStorage.setItem(
                                                        'uk-crime-dashboard-environment',
                                                        name
                                                    );
                                                }}
                                            >
                                                {name.toUpperCase()}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </label>
                    </div>
                    <div className="input-field">
                        <label
                            className="input-field-label"
                            htmlFor="env-buttons"
                        >
                            <p>Debug</p>
                            <div className="option-buttons-container button-group">
                                {['on', 'off'].map(
                                    (name, index) => {
                                        return (
                                            <button
                                                className={`button option-button ${
                                                    debug === name
                                                        ? 'option-button-active'
                                                        : ''
                                                }`}
                                                key={`options-button-debug-${name}-${index}`}
                                                id={`options-button-debug-${name}-${index}`}
                                                onClick={event => {
                                                    dispatch(
                                                        SetDebug(
                                                            name === "on" ? true : false
                                                        )
                                                    );
                                                    localStorage.setItem(
                                                        'uk-crime-dashboard-debug',
                                                        name
                                                    );
                                                }}
                                            >
                                                {name.toUpperCase()}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            </Sidebar>
            <div className="page-content">
                <Header
                    showSidebar={showSidebar}
                    toggleSidebar={() => setShowSidebar(!showSidebar)}
                    showTitle={true}
                />
                <Content
                    isFetching={isFetching}
                    isLoading={isLoading}
                    progressInfo={progressInfo}
                    showContent={showContent}
                >
                    <Tabs
                        type="top"
                        fillArea={true}
                        centered={true}
                        padContent={false}
                        roundedNav={true}
                    ></Tabs>
                </Content>
            </div>
        </>
    );
}

export default OptionsDashboard;
