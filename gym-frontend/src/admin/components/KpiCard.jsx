const KpiCard = ({
    title,
    value,
    icon,
    description
}) => {

    return (
        <div className="kpi-card">

            <div className="kpi-card-header">
                <span className="kpi-title">
                    {title}
                </span>

                <div className="kpi-icon">
                    {icon}
                </div>
            </div>

            <h2 className="kpi-value">
                {value}
            </h2>

            {description && (
                <p className="kpi-description">
                    {description}
                </p>
            )}

        </div>
    );
};

export default KpiCard;