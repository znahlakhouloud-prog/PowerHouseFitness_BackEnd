import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import { formatTrendData } from "../utils/chartFormat";

const PaymentTypeChart = ({ data }) => {

    const chartData = formatTrendData(data);

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Revenue by Payment Type</h3>
                    <p>Approved income split by cash / card / transfer</p>
                </div>

            </div>


            <div className="chart-container">

                {chartData.length === 0 ? (

                    <div className="chart-empty">
                        No payment data available for this period.
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
                                width={60}
                            />

                            <Tooltip
                                formatter={(value, name) =>
                                    [`${Number(value).toLocaleString()} DA`, name]
                                }
                            />

                            <Legend
                                wrapperStyle={{ fontSize: 12 }}
                            />

                            <Bar
                                dataKey="cash"
                                stackId="a"
                                fill="#16a34a"
                            />

                            <Bar
                                dataKey="card"
                                stackId="a"
                                fill="#0284c7"
                            />

                            <Bar
                                dataKey="transfer"
                                stackId="a"
                                fill="#7c3aed"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default PaymentTypeChart;
