import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import { formatTrendData } from "../utils/chartFormat";

const IncomeChart = ({ data }) => {

    const chartData = formatTrendData(data);

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Revenue Over Time</h3>
                    <p>Approved payments only</p>
                </div>

            </div>


            <div className="chart-container">

                {chartData.length === 0 ? (

                    <div className="chart-empty">
                        No revenue data available for this period.
                    </div>

                ) : (

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart data={chartData}>

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
                                width={60}
                            />

                            <Tooltip
                                formatter={(value) =>
                                    [`${Number(value).toLocaleString()} DA`, "Income"]
                                }
                            />

                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#111827"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#111827" }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default IncomeChart;
