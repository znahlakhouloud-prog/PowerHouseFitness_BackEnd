import { Dumbbell, HeartPulse, Users, Activity } from "lucide-react";

import Reveal from "./Reveal";

const SERVICES = [
    {
        icon: <Dumbbell size={24} />,
        title: "Strength Training",
        description: "Professional equipment for strength and muscle development."
    },
    {
        icon: <HeartPulse size={24} />,
        title: "Cardio",
        description: "Equipment and training for improving endurance."
    },
    {
        icon: <Users size={24} />,
        title: "Coaching",
        description: "Professional coaches helping members improve their training."
    },
    {
        icon: <Activity size={24} />,
        title: "Fitness Training",
        description: "Training environment suitable for different fitness goals."
    }
];

function Services() {

    return (

        <section id="services" className="lp-section lp-section-alt">

            <div className="lp-container">

                <div className="lp-section-header">
                    <span className="lp-eyebrow">What We Offer</span>
                    <h2>Our Services</h2>
                    <p>
                        Everything you need in one training environment,
                        built around real equipment and real guidance.
                    </p>
                </div>

                <div className="lp-services-grid">

                    {SERVICES.map((service) => (

                        <Reveal key={service.title}>

                            <div className="lp-service-card">

                                <div className="lp-service-icon">
                                    {service.icon}
                                </div>

                                <h3>{service.title}</h3>
                                <p>{service.description}</p>

                            </div>

                        </Reveal>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default Services;
