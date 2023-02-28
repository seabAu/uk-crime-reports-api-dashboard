import React, { useState } from "react";
import PropTypes from "prop-types";
import { Heading, Text, Pane, Spinner, Dialog } from "evergreen-ui";
import { copyToClipboard } from "copy-lite";
import ObjMap from "./ObjectUtils/ObjMap";
import Table from "./Table/Table";
import Loader from "./Loader";
import Tabs from "./Tabs/Tabs";
import MapContent from "./Map/MapContent";

const DashboardContent = ({
    isFetching,
    isLoading,
    progressInfo,
    crimeReports,
    queryString,
    showContent,
    showTable,
    showMap,
    setShowSidePanel,
    setSidePanelID,
    theme,
    menu,
}) => {
    const [listNumber, setListNumber] = useState(15);
    const [isBottom, setIsBottom] = useState(false);
    const [isDialogShown, setIsDialogShown] = useState(false);
    const [dialogID, setDialogID] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const UpdateStorage = () =>
    {
        // Init: 
        // localStorage.setItem("uk-crime-api-database", [
        //     {
        //         id: 0,
        //         date: new Date(),
        //         queryName: "Init",
        //         reports: [],
        //     },
        // ]);
        let currentDatabase = JSON.parse(
            localStorage.getItem("uk-crime-api-database"),
        );
        localStorage.setItem(
            "uk-crime-api-database",
            JSON.stringify([ ...currentDatabase,
                {
                    id: currentDatabase.length + 1,
                    date: new Date(),
                    queryName: queryString,
                    reports: crimeReports
                }
            ])
        );

        console.log( "DashboardConrent :: UpdateStorage :: Updated database => Database = ", localStorage.getItem( "database" ) );
    }

    let renderReportsList;

    if (crimeReports) {
        renderReportsList = [...crimeReports];
        // renderReportsList.length = listNumber;
        // UpdateStorage();
    } else renderReportsList = null;

    return (
        <div className="dashboard-content">
            {isFetching && <Loader progressInfo={progressInfo}></Loader>}
            {!isFetching && (
                <Tabs
                    type="top"
                    fillArea={true}
                    centered={true}
                    padContent={false}
                    roundedNav={true}>
                    <div className="" label="Datatable View">
                        {!isFetching &&
                            renderReportsList.length == 0 &&
                            renderReportsList[0] === undefined && (
                                <Table
                                    isVisible={showTable}
                                    isFetching={isFetching}
                                    dataName={queryString}
                                    tableData={[
                                        {
                                            "no results":
                                                "There was no data available for this search.",
                                        },
                                    ]}
                                    hideColumns={[]}></Table>
                            )}

                        {!isFetching &&
                            renderReportsList &&
                            renderReportsList[0] !== undefined &&
                            showTable && (
                                <Table
                                    isVisible={showTable}
                                    isFetching={isFetching}
                                    isFilterable={true}
                                    isSortable={true}
                                    dataName={queryString}
                                    tableData={renderReportsList}
                                    setShowSidePanel={setShowSidePanel}
                                    setSidePanelID={setSidePanelID}
                                    hideColumns={
                                        [
                                            // "location_type",
                                            // "location",
                                            // "context",
                                            // "location_subtype",
                                        ]
                                    }></Table>
                            )}
                    </div>
                    {showMap && !isFetching && renderReportsList && (
                        <div className="" label="Map View">
                            <MapContent
                                isFetching={isFetching}
                                data={renderReportsList}
                                theme={theme}></MapContent>
                        </div>
                    )}
                </Tabs>
            )}
        </div>
    );
};

DashboardContent.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    crimeReports: PropTypes.array.isRequired,
    // bottomRef: PropTypes.object.isRequired,
};

export default DashboardContent;
