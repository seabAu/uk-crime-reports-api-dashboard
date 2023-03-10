import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Tabs from "./Tabs/Tabs";

function OptionsDashboard(props) {
    const {
        menu,
        setMenu,
        theme,
        setTheme,
        debug,
        setDebug,
        progressInfo,
        setProgressInfo,
        showSidebar,
        setShowSidebar,
    } = props;
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [showContent, setShowContent] = useState(false);

    return (
        <>
            <Sidebar
                isFetching={isFetching}
                showSidebar={showSidebar}
                menu={menu}
                setMenu={setMenu}>
                <div className="query-form">
                    <div className="input-field">
                        <label
                            className="input-field-label"
                            htmlFor="theme-buttons">
                            <p>Select a theme: </p>
                            <div className="theme-buttons-container button-group">
                                {["default", "light", "dark", "cool"].map(
                                    (themeName, index) => {
                                        return (
                                            <button
                                                className={`button theme-button ${
                                                    theme === themeName
                                                        ? "theme-button-active"
                                                        : ""
                                                }`}
                                                key={`theme-button-${themeName}`}
                                                id={`theme-button-${themeName}`}
                                                onClick={(event) => {
                                                    setTheme(`${themeName}`);
                                                    localStorage.setItem(
                                                        "uk-crime-dashboard-theme",
                                                        themeName,
                                                    );
                                                }}>
                                                {themeName.toUpperCase()}
                                            </button>
                                        );
                                    },
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
                    menu={menu}
                />
                <Content
                    isFetching={isFetching}
                    isLoading={isLoading}
                    progressInfo={progressInfo}
                    showContent={showContent}>
                    <Tabs
                        type="top"
                        fillArea={true}
                        centered={true}
                        padContent={false}
                        roundedNav={true}></Tabs>
                </Content>
            </div>
        </>
    );
}

export default OptionsDashboard;
