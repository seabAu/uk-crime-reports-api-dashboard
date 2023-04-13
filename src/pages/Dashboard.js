import React, { useState, useEffect, useRef } from "react";
import axios, { isCancel, AxiosError } from "axios";

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
} from '../redux/rootSlice';

import * as api from "../api";
import QueryDashboard from "./QueryDashboard/QueryDashboard.js";
import MapDashboard from "./MapDashboard/MapDashboard.js";
import DatabaseDashboard from "./DatabaseDashboard/DatabaseDashboard.js";
import OptionsDashboard from "./UserDashboard/UserDashboard.js";

const Dashboard = () =>
{
    const dispatch = useDispatch();
    const { menu, theme, environment, debug, loading, fetching, cache, reloadData } =
        useSelector(state => state.root);

    // const [theme, setTheme] = useState(
    //     localStorage.getItem('uk-crime-dashboard-theme') ?? 'default'
    // );
    // const [menu, setMenu] = useState('map'); // Menu options: ["query", "map", "database", "options"]
    const [showSidebar, setShowSidebar] = useState(true);
    // const [ debug, setDebug ] = useState( true );

    const [progressInfo, setProgressInfo] = useState([
        {
            id: 'Not Set',
            message: 'Not Set',
            currValue: 0,
            endValue: 1,
            results: 0,
            success: 0,
            failure: 0,
            currentCall: ``,
        },
    ]);
    // axios.defaults.headers.get["Content-Type"] = "application/json;charset=utf-8";
    // axios.defaults.headers.get[ "Access-Control-Allow-Origin" ] = "*";
    const loadContent = currentmenu => {
        switch (currentmenu) {
            case 'query':
                return (
                    <QueryDashboard
                        progressInfo={progressInfo}
                        setProgressInfo={setProgressInfo}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            case 'map':
                return (
                    <MapDashboard
                        progressInfo={progressInfo}
                        setProgressInfo={setProgressInfo}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            case 'database':
                return (
                    <DatabaseDashboard
                        progressInfo={progressInfo}
                        setProgressInfo={setProgressInfo}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            case 'options':
                return (
                    <OptionsDashboard
                        progressInfo={progressInfo}
                        setProgressInfo={setProgressInfo}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            default:
                break;
        }
    };
    return (
        <div className={`page-container theme-${theme}`}>
            {
                // environment === 'development'
                //     ? loadContent(menu)
                //     : loadContent( 'query' )
                loadContent(menu)
            }
        </div>
    );
};

export default Dashboard;
