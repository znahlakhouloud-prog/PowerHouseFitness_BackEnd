import { Wrench, GraduationCap, CalendarRange, Zap } from "lucide-react";

import Reveal from "./Reveal";

const REASONS = [
    {
        icon: <Wrench size={24} />,
        title: "Modern Equipment",
        description: "Train with quality gym equipment."
    },
    {
        icon: <GraduationCap size={24} />,
        title: "Professional Coaches",
        description: "Get guidance from experienced coaches."
    },
    {
        icon: <CalendarRange size={24} />,
        title: "Flexible Memberships",
        description: "Choose the membership duration that fits you."
    },
    {
        icon: <Zap size={24} />,
        title: "Motivating Environment",
        description: "Train in a professional and energetic atmosphere."
    }
];

function WhyChooseUs() {

    return (

        <section className="lp-section">

            <div className="lp-container">

                <div className="lp-section-header">
                    <span className="lp-eyebrow">Why PowerHouse</span>
                    <h2>Why Choose Us</h2>
                </div>

                <div className="lp-why-grid">

                    {REASONS.map((reason) => (

                        <Reveal key={reason.title}>

                            <div className="lp-why-card">

                                <div className="lp-why-icon">
                                    {reason.icon}
                                </div>

                                <h3>{reason.title}</h3>
                                <p>{reason.description}</p>

                            </div>

                        </Reveal>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default WhyChooseUs;
