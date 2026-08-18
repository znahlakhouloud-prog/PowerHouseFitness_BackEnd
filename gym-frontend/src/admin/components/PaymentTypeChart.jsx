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

const PaymentTypeChart = ({ data }) => {

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Revenue by Payment Type</h3>
                    <p>Monthly income split by cash / card / transfer</p>
                </div>

            </div>


            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Bar
                            dataKey="cash"
                            stackId="a"
                            fill="#16a34a"
                            radius={[0, 0, 0, 0]}
                        />

                        <Bar
                            dataKey="card"
                            stackId="a"
                            fill="#0284c7"
                            radius={[0, 0, 0, 0]}
                        />

                        <Bar
                            dataKey="transfer"
                            stackId="a"
                            fill="#7c3aed"
                            radius={[6, 6, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default PaymentTypeChart;
