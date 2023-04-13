const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function sec2str(t) {
    var d = Math.floor(t / 86400),
        h = ("0" + (Math.floor(t / 3600) % 24)).slice(-2),
        m = ("0" + (Math.floor(t / 60) % 60)).slice(-2),
        s = ("0" + (t % 60)).slice(-2);
    return (
        (d > 0 ? d + "d " : "") +
        (h > 0 ? h + ":" : "") +
        (m > 0 ? m + ":" : "") +
        (t > 60 ? s : s + "s")
    );
}
export function timeElapsed(start, finish) {
    const difference = (finish - start) / 1000;
    return sec2str(difference);
}

export function timeEstimate(start, finish, numCompleted, numTotal) {
    // It took (seconds) time to reach (numTotal).
    const seconds = (finish - start) / 1000;
    // const difference = Math.abs( numTotal - numCompleted );
    const secondsPerCompleted = seconds / numCompleted;
    const secondsToComplete = secondsPerCompleted * numTotal;
    // Divide by( numCompleted ) and multiply by( numTotal ).
    return sec2str(secondsToComplete);
}

export const dateStr2LocaleDateStr = (datestr) => {
    // console.log(
    //     "dateStr2LocaleDateStr :: ",
    //     datestr,
    // );
    // Replace "present" with current date.
    if (datestr === "Present") {
        datestr = // new Date().toLocaleString();
            [months[new Date().getMonth()], new Date().getFullYear()].join(
                " ",
            );
    }
    let date = datestr.split(" ");
    let month = months.indexOf(date[0]);
    let year = date[1];

    // console.log(
    //     "time period = ",
    //     datestr,
    //     date,
    //     month,
    //     year,
    //     new Date(year, month).toLocaleDateString(),
    // );
    return new Date(year, month).toLocaleDateString();
};

export const generateDateOptions = (startYear = 2017, startMonth = 8) => {
    const start = new Date(startYear, startMonth);
    const now = new Date();
    // const now = new Date("2020, 8");

    var numMonths =
        now.getMonth() -
        start.getMonth() +
        (now.getYear() - start.getYear()) * 12;
    // var numMonths = differenceInMonths( now, start );
    // var numYears = Math.floor(numMonths / 12);
    const dates = [];
    for (let y = 0; numMonths >= 0; y++) {
        let year = startYear + y;
        // For each year between now and the start date, ascending.
        for (
            let m = year === startYear ? startMonth : 1;
            m <= 12 && numMonths >= 0;
            m++
        ) {
            // For each month in the year.
            let month = months[m - 1];
            dates.unshift({
                key: `${year}-${m}`,
                value: `${month} ${year}`,
            });
            numMonths--;
        }
    }

    // dates.unshift({
    //     key: "all_dates",
    //     value: "All Dates",
    // });
    // dates.splice(0, 3);
    return dates;
};
