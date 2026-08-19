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

const ExpiredMembershipsChart = ({ data }) => {

    const chartData = formatTrendData(data);

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Expired Memberships</h3>
                    <p>Churn trend over time</p>
                </div>

            </div>


            <div className="chart-container">

                {chartData.length === 0 ? (

                    <div className="chart-empty">
                        No memberships expired in this period.
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
                                formatter={(value) => [value, "Expired"]}
                            />

                            <Bar
                                dataKey="total"
                                fill="#dc2626"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default ExpiredMembershipsChart;
