import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Dumbbell, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "membership", label: "Membership" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" }
];

function Navbar() {

    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");


    useEffect(() => {

        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);


    useEffect(() => {

        const sections = NAV_LINKS
            .map((link) => document.getElementById(link.id))
            .filter(Boolean);

        if (sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {

                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id);
                }

            },
            { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();

    }, []);


    const handleNavClick = (id) => {

        setMobileOpen(false);

        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    };


    return (

        <header className={`lp-navbar ${scrolled || mobileOpen ? "lp-scrolled" : ""}`}>

            <div className="lp-navbar-inner">

                <a
                    href="#home"
                    className="lp-logo"
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavClick("home");
                    }}
                >

                    <span className="lp-logo-icon">
                        <Dumbbell size={19} />
                    </span>

                    <span className="lp-logo-text">
                        POWERHOUSE FITNESS
                    </span>

                </a>


                <nav className="lp-nav-links" aria-label="Primary">

                    {NAV_LINKS.map((link) => (

                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className={`lp-nav-link ${activeSection === link.id ? "lp-active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(link.id);
                            }}
                        >
                            {link.label}
                        </a>

                    ))}

                </nav>


                <div className="lp-nav-right">

                    <button
                        className="lp-btn lp-btn-dark lp-nav-login"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        className="lp-hamburger"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                </div>

            </div>

            <nav
                className={`lp-mobile-menu ${mobileOpen ? "lp-open" : ""}`}
                aria-label="Mobile"
            >

                {NAV_LINKS.map((link) => (

                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={`lp-nav-link ${activeSection === link.id ? "lp-active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(link.id);
                        }}
                    >
                        {link.label}
                    </a>

                ))}

            </nav>

        </header>

    );

}

export default Navbar;
