const MONTH_ABBR = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Backend labels are raw "YYYY-MM-DD" (week/month periods) or
// "YYYY-MM" (year period) - turn either into a short, readable tick
// label instead of rendering the raw string on the chart axis.
export const formatPeriodLabel = (label) => {

    if (!label) {
        return "";
    }

    if (label.length === 10) {

        const [, month, day] = label.split("-");

        return `${MONTH_ABBR[Number(month) - 1]} ${Number(day)}`;

    }

    if (label.length === 7) {

        const [year, month] = label.split("-");

        return `${MONTH_ABBR[Number(month) - 1]} ${year}`;

    }

    return label;

};

// Applies formatPeriodLabel to every row's period_label, keeping the
// rest of the row untouched - what every trend chart needs before
// handing data to Recharts.
export const formatTrendData = (rows) =>
    (rows || []).map((row) => ({
        ...row,
        period_label: formatPeriodLabel(row.period_label)
    }));
