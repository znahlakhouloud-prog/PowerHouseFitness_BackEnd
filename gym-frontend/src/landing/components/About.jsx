import { CheckCircle2 } from "lucide-react";

import LandingImage from "./LandingImage";
import Reveal from "./Reveal";

const POINTS = [
    "Professional training environment",
    "Modern, well-maintained equipment",
    "Experienced, hands-on coaches",
    "Membership plans for every goal",
    "Motivating, high-energy atmosphere"
];

function About() {

    return (

        <section id="about" className="lp-section">

            <div className="lp-container lp-about-grid">

                <Reveal>
                    <LandingImage
                        src="/assets/about-gym.png"
                        alt="Inside the PowerHouse Fitness training floor"
                        label="Gym Photo"
                        className="lp-about-image"
                    />
                </Reveal>

                <Reveal className="lp-about-content">

                    <span className="lp-eyebrow">About Us</span>

                    <h2>A Modern Training Environment</h2>

                    <p>
                        PowerHouse Fitness is a modern training environment
                        designed to help people improve their strength,
                        fitness, performance, and overall well-being. We
                        combine quality equipment with experienced coaching
                        in a space built for real, consistent progress.
                    </p>

                    <p>
                        Whether you're just starting out or training toward
                        a specific goal, our team and facilities are set up
                        to support you at every stage.
                    </p>

                    <ul className="lp-about-points">

                        {POINTS.map((point) => (

                            <li key={point}>
                                <CheckCircle2 size={17} />
                                {point}
                            </li>

                        ))}

                    </ul>

                </Reveal>

            </div>

        </section>

    );

}

export default About;
