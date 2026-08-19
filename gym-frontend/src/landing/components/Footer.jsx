import { useNavigate } from "react-router-dom";

import { Dumbbell } from "lucide-react";

const QUICK_LINKS = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "membership", label: "Membership" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" }
];

// lucide-react doesn't ship brand/social logo icons in this version,
// so these are simple initial badges rather than platform logos.
const SOCIAL_LINKS = [
    { initials: "F", label: "Facebook", href: "#" },
    { initials: "IG", label: "Instagram", href: "#" },
    { initials: "TT", label: "TikTok", href: "#" }
];

function Footer() {

    const navigate = useNavigate();

    const handleLinkClick = (id) => {

        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    };

    return (

        <footer className="lp-footer">

            <div className="lp-container lp-footer-grid">

                <div className="lp-footer-brand">

                    <div className="lp-logo">

                        <span className="lp-logo-icon">
                            <Dumbbell size={19} />
                        </span>

                        <span className="lp-logo-text">
                            POWERHOUSE FITNESS
                        </span>

                    </div>

                    <p>
                        A modern training environment built around quality
                        equipment, experienced coaches, and a motivating
                        atmosphere.
                    </p>

                </div>

                <div>

                    <h4>Quick Links</h4>

                    <ul className="lp-footer-links">

                        {QUICK_LINKS.map((link) => (

                            <li key={link.id}>
                                <button onClick={() => handleLinkClick(link.id)}>
                                    {link.label}
                                </button>
                            </li>

                        ))}

                    </ul>

                </div>

                <div>

                    <h4>Account</h4>

                    <ul className="lp-footer-links">

                        <li>
                            <button onClick={() => navigate("/login")}>
                                Login
                            </button>
                        </li>

                    </ul>

                </div>

                <div>

                    <h4>Follow Us</h4>

                    <div className="lp-social-links">

                        {SOCIAL_LINKS.map((social) => (

                            <a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 11, fontWeight: 700 }}
                            >
                                {social.initials}
                            </a>

                        ))}

                    </div>

                </div>

            </div>

            <div className="lp-footer-bottom">
                © 2026 PowerHouse Fitness. All rights reserved.
            </div>

        </footer>

    );

}

export default Footer;
