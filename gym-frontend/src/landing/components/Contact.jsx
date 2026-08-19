import { useState } from "react";

import { Phone, Mail, MapPin, Clock } from "lucide-react";

import { sendContactMessage } from "../services/contactService";

import Reveal from "./Reveal";

const INFO = [
    {
        icon: <Phone size={19} />,
        label: "Phone",
        value: "+213 XXX XX XX XX",
        placeholder: true
    },
    {
        icon: <Mail size={19} />,
        label: "Email",
        value: "contact@powerhousefitness.com",
        placeholder: true
    },
    {
        icon: <MapPin size={19} />,
        label: "Address",
        value: "[Gym Address]",
        placeholder: true
    },
    {
        icon: <Clock size={19} />,
        label: "Opening Hours",
        value: "Mon - Sat: 8:00 AM - 10:00 PM",
        placeholder: true
    }
];

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Contact() {

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const [status, setStatus] = useState("idle");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const validate = () => {

        const nextErrors = {};

        if (!formData.name.trim()) {
            nextErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required";
        } else if (!EMAIL_PATTERN.test(formData.email.trim())) {
            nextErrors.email = "Enter a valid email address";
        }

        if (!formData.message.trim()) {
            nextErrors.message = "Message is required";
        }

        return nextErrors;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const validationErrors = validate();

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setStatus("loading");

        try {

            await sendContactMessage(formData);

            setStatus("success");
            setFormData(EMPTY_FORM);

        } catch (error) {

            console.error("CONTACT FORM ERROR:", error);
            setStatus("error");

        }

    };

    return (

        <section id="contact" className="lp-section">

            <div className="lp-container">

                <div className="lp-section-header">
                    <span className="lp-eyebrow">Get In Touch</span>
                    <h2>Contact Us</h2>
                    <p>
                        Have a question about memberships or training?
                        Reach out and our team will get back to you.
                    </p>
                </div>

                <div className="lp-contact-grid">

                    <Reveal>

                        <div className="lp-contact-info-list">

                            {INFO.map((item) => (

                                <div key={item.label} className="lp-contact-info-item">

                                    <div className="lp-contact-icon">
                                        {item.icon}
                                    </div>

                                    <div>
                                        <strong>{item.label}</strong>
                                        <p>{item.value}</p>
                                        {item.placeholder && (
                                            <span className="lp-placeholder-tag">
                                                Placeholder - update with real info
                                            </span>
                                        )}
                                    </div>

                                </div>

                            ))}

                        </div>

                    </Reveal>

                    <Reveal>

                        <form className="lp-contact-form" onSubmit={handleSubmit} noValidate>

                            {status === "success" && (
                                <div className="lp-form-success">
                                    Your message has been sent. We'll get back
                                    to you soon.
                                </div>
                            )}

                            {status === "error" && (
                                <div className="lp-form-error">
                                    Something went wrong sending your message.
                                    Please try again.
                                </div>
                            )}

                            <div className="lp-form-row">

                                <div className={`lp-form-field ${errors.name ? "lp-field-error" : ""}`}>

                                    <label htmlFor="lp-contact-name">Name</label>

                                    <input
                                        id="lp-contact-name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />

                                    {errors.name && (
                                        <p className="lp-field-error-msg">{errors.name}</p>
                                    )}

                                </div>

                                <div className={`lp-form-field ${errors.email ? "lp-field-error" : ""}`}>

                                    <label htmlFor="lp-contact-email">Email</label>

                                    <input
                                        id="lp-contact-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                    {errors.email && (
                                        <p className="lp-field-error-msg">{errors.email}</p>
                                    )}

                                </div>

                            </div>

                            <div className="lp-form-field">

                                <label htmlFor="lp-contact-phone">Phone (optional)</label>

                                <input
                                    id="lp-contact-phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className={`lp-form-field ${errors.message ? "lp-field-error" : ""}`}>

                                <label htmlFor="lp-contact-message">Message</label>

                                <textarea
                                    id="lp-contact-message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                />

                                {errors.message && (
                                    <p className="lp-field-error-msg">{errors.message}</p>
                                )}

                            </div>

                            <button
                                type="submit"
                                className="lp-btn lp-btn-primary"
                                disabled={status === "loading"}
                                style={{ width: "100%" }}
                            >
                                {status === "loading" ? "Sending..." : "Send Message"}
                            </button>

                        </form>

                    </Reveal>

                </div>

            </div>

        </section>

    );

}

export default Contact;
