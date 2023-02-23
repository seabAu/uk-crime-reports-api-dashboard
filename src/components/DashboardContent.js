import React, { useState } from "react";
import PropTypes from "prop-types";
import { Heading, Text, Pane, Spinner, Dialog } from "evergreen-ui";
import { copyToClipboard } from "copy-lite";
import ObjMap from "./ObjectUtils/ObjMap";
import Table from "./Table/Table";

const DashboardContent = ({
    isFetching,
    crimeReports,
    queryString,
    bottomRef,
    showTable,
}) => {
    const [listNumber, setListNumber] = useState(15);
    const [isBottom, setIsBottom] = useState(false);
    const [isDialogShown, setIsDialogShown] = useState(false);
    const [dialogID, setDialogID] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleScroll = (event) => {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        const bottom = scrollHeight - scrollTop === clientHeight;

        if (bottom) {
            const crimeReportsClone = [...crimeReports];
            // console.log( "Reached bottom of table: ", crimeReports );
            if (crimeReportsClone.length > listNumber) {
                if (!isBottom) setIsBottom(true);

                setTimeout(() => setListNumber(listNumber + 15), 1000);
            } else if (isBottom) setIsBottom(false);
        }
    };

    const debugDumpData = () => {
        console.log(
            "DashboardContent Debug:\n\n",
            isFetching,
            bottomRef,
            JSON.stringify(crimeReports),
        );
    };

    let truncatedCrimeReportsList;

    if (crimeReports) {
        truncatedCrimeReportsList = [...crimeReports];
        truncatedCrimeReportsList.length = listNumber;
    } else truncatedCrimeReportsList = null;

    let renderReportsList;

    if (crimeReports) {
        renderReportsList = [...crimeReports];
        // renderReportsList.length = listNumber;
    } else renderReportsList = null;

    return (
        <div className="dashboard-content">
            {isFetching && (
                <Pane
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height={400}>
                    <Spinner size={50} marginX="auto" marginY={10} />
                </Pane>
            )}

            {!isFetching &&
                renderReportsList.length == 0 &&
                renderReportsList[0] === undefined && (
                    <Table
                        isVisible={showTable}
                        isFetching={isFetching}
                        dataName={queryString}
                        tableData={[{"no results": "There was no data available for this search."}]}
                        hideColumns={[]}></Table>
                )}

            {!isFetching &&
                truncatedCrimeReportsList &&
                truncatedCrimeReportsList[0] !== undefined && (
                    <Table
                        isVisible={showTable}
                        isFetching={isFetching}
                        dataName={queryString}
                        // tableData={truncatedCrimeReportsList}
                        tableData={renderReportsList}
                        // entriesPerPage={entriesPerPage}
                        // setEntriesPerPage={setEntriesPerPage}
                        // pageNum={pageNum}
                        // setPageNum={setPageNum}
                        // changePage={changePage}
                        hideColumns={[
                            // "location_type",
                            // "location",
                            // "context",
                            // "location_subtype",
                        ]}></Table>
                )}

            <div ref={bottomRef}></div>
        </div>
    );
};

DashboardContent.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    crimeReports: PropTypes.array.isRequired,
    bottomRef: PropTypes.object.isRequired,
};

export default DashboardContent;