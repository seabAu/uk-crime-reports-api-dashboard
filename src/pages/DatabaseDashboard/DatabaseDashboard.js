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
import Tabs from "../../components/Tabs/Tabs";

// Utility handler imports.
import * as util from '../../utilities/index';
import * as api from '../../api';
import * as db from '../../components/LocalDB/LocalDatabaseHandler.js';
import Droplist from '../../components/Droplist';

function DatabaseDashboard(props) {
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

    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const [dbCache, setDBCache] = useState([]);

    // Mainly used for debug, use this to update the text outputs for all the changes in state.
    useEffect(() => {
        console.log(
            'DatabaseDashboard :: \n\n',
            '\n',
            'query = ',
            query,
            '\n',
            'isLoading = ',
            isLoading,
            '\n',
            'isFetching = ',
            isFetching,
            '\n',
            'showContent = ',
            showContent,
            '\n',
            'dbCache = ',
            dbCache,
        );
    }, [
        query,
        isLoading,
        isFetching,
        showContent,
        dbCache,
    ]);

    useEffect(() => {
        // On load, set the db cache for easy reloading and retrieval.

        // Boot up the local DB!
        if (!db.IsDBSet()) {
            db.InitializeLocalDB();
            // db.setDBKey(`forces`, forces);
            // db.setDBKey(`categories`, categories);
            // db.setDBKey(`dates`, dates);
        } else {
            console.log(
                'Local DB = ',
                db.GetDB(),
                ', currently using: ',
                // getLocalDBSize(),
                db.getByteLength(JSON.stringify(db.GetDB()))
            );
            setDBCache([db.GetDB()]);
        }
    }, [] );
    
    useEffect(() => {
        // When DB Cache is loaded, set showContent to true. Else, set it false.
        setShowContent(dbCache ? true : false);
    }, [dbCache]);

    return (
        <>
            <Sidebar
                isFetching={isFetching}
                showSidebar={showSidebar}
            >
                <div className="flex-panel">
                    {
                        // util.val.isValidArray( dbCache, true ) &&
                        //dbCache && ()
                    }
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
                        padContent={false}
                        centered={false}
                        roundedNav={false}
                        boxShadow={true}
                        contentBoxShadow={false}
                        navBoxShadow={true}
                    >
                        <div
                            className=""
                            label="Local DB View"
                            id="local-db-cache-droplist-view"
                        >
                            {!dbCache && (
                                <div className="flex-panel">
                                    <Droplist
                                        data={[
                                            'No data was found in local db cache.',
                                        ]}
                                        label={`Local Database Cache`}
                                    ></Droplist>
                                </div>
                            )}
                            {
                                // util.val.isValidArray( dbCache, true ) &&
                                dbCache && (
                                    <div className="flex-panel">
                                        <Droplist
                                            data={dbCache}
                                            label={`Local Database Cache`}
                                        ></Droplist>
                                    </div>
                                )
                            }
                        </div>
                    </Tabs>
                </Content>
            </div>
        </>
    );
}

export default DatabaseDashboard;
