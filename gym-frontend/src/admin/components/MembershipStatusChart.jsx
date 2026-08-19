import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

const STATUS_META = [
    { key: "active", label: "Active", color: "#16a34a" },
    { key: "expiring", label: "Expiring Soon", color: "#d97706" },
    { key: "expired", label: "Expired", color: "#dc2626" }
];

const MembershipStatusChart = ({ data }) => {

    const chartData = STATUS_META
        .map((meta) => ({
            name: meta.label,
            value: data?.[meta.key] || 0,
            color: meta.color
        }))
        .filter((row) => row.value > 0);

    const total = chartData.reduce((sum, row) => sum + row.value, 0);

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Membership Status</h3>
                    <p>Active, expiring soon and expired</p>
                </div>

            </div>


            <div className="chart-container">

                {total === 0 ? (

                    <div className="chart-empty">
                        No membership data available.
                    </div>

                ) : (

                    <ResponsiveContainer width="100%" height="100%">

                        <PieChart>

                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="55%"
                                outerRadius="80%"
                                paddingAngle={2}
                            >

                                {chartData.map((row) => (
                                    <Cell key={row.name} fill={row.color} />
                                ))}

                            </Pie>

                            <Tooltip
                                formatter={(value, name) => [value, name]}
                            />

                            <Legend
                                wrapperStyle={{ fontSize: 12 }}
                            />

                        </PieChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default MembershipStatusChart;
