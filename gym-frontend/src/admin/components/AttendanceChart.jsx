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

const AttendanceChart = ({ data }) => {

    const chartData = formatTrendData(data);

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Attendance</h3>
                    <p>Gym check-ins over time</p>
                </div>

            </div>


            <div className="chart-container">

                {chartData.length === 0 ? (

                    <div className="chart-empty">
                        No attendance data available for this period.
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
                                formatter={(value) => [value, "Check-ins"]}
                            />

                            <Bar
                                dataKey="total"
                                fill="#0ea5e9"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default AttendanceChart;
