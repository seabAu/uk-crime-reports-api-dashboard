import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Tabs from "./Tabs/Tabs";

function DatabaseDashboard(props) {
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
                setMenu={setMenu}></Sidebar>
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

export default DatabaseDashboard;
