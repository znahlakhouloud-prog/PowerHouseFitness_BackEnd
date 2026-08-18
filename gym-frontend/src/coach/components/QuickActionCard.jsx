import { Link } from "react-router-dom";

function QuickActionCard({ to, icon, title, description }) {

    return (

        <Link to={to} className="quick-action-card">

            <div className="quick-action-icon">
                {icon}
            </div>

            <strong>{title}</strong>
            <span>{description}</span>

        </Link>

    );

}

export default QuickActionCard;
