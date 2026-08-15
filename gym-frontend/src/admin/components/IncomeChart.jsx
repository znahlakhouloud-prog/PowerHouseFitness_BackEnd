import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const IncomeChart = ({ data }) => {

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Income Overview</h3>
                    <p>Monthly income performance</p>
                </div>

            </div>


            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="income"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default IncomeChart;