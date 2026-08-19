const PERIODS = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" }
];

function PeriodSelector({ value, onChange }) {

    return (

        <div className="period-selector">

            {PERIODS.map((period) => (

                <button
                    key={period.value}
                    className={
                        value === period.value ? "active" : ""
                    }
                    onClick={() => onChange(period.value)}
                >
                    {period.label}
                </button>

            ))}

        </div>

    );

}

export default PeriodSelector;
