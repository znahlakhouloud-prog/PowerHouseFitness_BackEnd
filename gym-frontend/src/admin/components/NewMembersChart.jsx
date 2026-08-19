import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import { formatTrendData } from "../utils/chartFormat";

const NewMembersChart = ({ data }) => {

    const chartData = formatTrendData(data);

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>New Members</h3>
                    <p>New memberships started over time</p>
                </div>

            </div>


            <div className="chart-container">

                {chartData.length === 0 ? (

                    <div className="chart-empty">
                        No new members in this period.
                    </div>

                ) : (

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={chartData}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="period_label"
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis
                                tick={{ fontSize: 12 }}
                                width={40}
                                allowDecimals={false}
                            />

                            <Tooltip
                                formatter={(value) => [value, "New Members"]}
                            />

                            <Bar
                                dataKey="total"
                                fill="#16a34a"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default NewMembersChart;
