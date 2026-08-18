import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const ExpiredMembershipsChart = ({ data }) => {

    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>
                    <h3>Expired Memberships</h3>
                    <p>Monthly churn trend</p>
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

                        <Bar
                            dataKey="total"
                            radius={[6, 6, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default ExpiredMembershipsChart;
