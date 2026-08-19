import { Dumbbell } from "lucide-react";

import "../style/auth.css";

function AuthLayout({ children }) {

    return (

        <div className="auth-page">

            <div className="auth-bg" />
            <div className="auth-overlay" />

            <div className="auth-container">

                <div className="auth-brand">

                    <span className="auth-brand-icon">
                        <Dumbbell size={19} />
                    </span>

                    <span className="auth-brand-text">
                        POWERHOUSE FITNESS
                    </span>

                </div>

                <div className="auth-card">
                    {children}
                </div>

            </div>

        </div>

    );

}

export default AuthLayout;
