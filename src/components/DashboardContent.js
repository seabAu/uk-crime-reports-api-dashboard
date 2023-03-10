import React, { useState } from "react";
import PropTypes from "prop-types";
// import { Heading, Text, Pane, Spinner, Dialog } from "evergreen-ui";
import { copyToClipboard } from "copy-lite";
import Table from "./Table/Table";
import Loader from "./Loader";
import Tabs from "./Tabs/Tabs";
import MapContainer from "./Map/MapContainer";
import ObjMap from "./Utilities/ObjMap";
import { arrayIsValid } from "./Utilities/ObjectUtils";

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
    debug,
    errorLog,
}) => {
    const [listNumber, setListNumber] = useState(15);
    const [isBottom, setIsBottom] = useState(false);
    const [isDialogShown, setIsDialogShown] = useState(false);
    const [dialogID, setDialogID] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

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
                            !arrayIsValid(crimeReports, true) && (
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
                            arrayIsValid(crimeReports, true) &&
                            showTable && (
                                <Table
                                    // isVisible={showTable}
                                    isFetching={isFetching}
                                    isFilterable={true}
                                    isSortable={true}
                                    dataName={queryString}
                                    tableData={crimeReports}
                                    setShowSidePanel={setShowSidePanel}
                                    setSidePanelID={setSidePanelID}></Table>
                            )}
                    </div>
                    {showMap &&
                        !isFetching &&
                        arrayIsValid(crimeReports, true) && (
                            <div className="" label="Map View">
                                <MapContainer
                                    isFetching={isFetching}
                                    data={crimeReports}
                                    theme={theme}></MapContainer>
                            </div>
                        )}
                    {debug && !isFetching && arrayIsValid(errorLog, true) && (
                        <div className="" label="Debug View">
                            <Table
                                // isVisible={debug}
                                isFetching={isFetching}
                                isFilterable={true}
                                isSortable={true}
                                dataName={`${queryString}_errorlog`}
                                tableData={errorLog}
                                setShowSidePanel={setShowSidePanel}
                                setSidePanelID={setSidePanelID}></Table>
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
