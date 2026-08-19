import { useNavigate } from "react-router-dom";

import { Flame, ArrowRight } from "lucide-react";

function Hero() {

    const navigate = useNavigate();

    const handleExplore = () => {

        document.getElementById("membership")?.scrollIntoView({ behavior: "smooth" });

    };

    return (

        <section id="home" className="lp-hero">

            <div className="lp-hero-bg" />

            <div className="lp-hero-overlay" />

            <div className="lp-container">

                <div className="lp-hero-content">

                    <span className="lp-hero-eyebrow">
                        <Flame size={15} />
                        Powerhouse Fitness
                    </span>

                    <h1>Build Your Strongest Self</h1>

                    <p className="lp-hero-tagline">
                        Train harder. Stay stronger. Become better. A modern
                        training environment built around real equipment,
                        real coaches, and real progress.
                    </p>

                    <div className="lp-hero-actions">

                        <button
                            className="lp-btn lp-btn-primary"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                        <button
                            className="lp-btn lp-btn-outline"
                            onClick={handleExplore}
                        >
                            Explore Memberships
                            <ArrowRight size={16} />
                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Hero;
