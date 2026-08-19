import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import MembershipPlans from "../components/MembershipPlans";
import Gallery from "../components/Gallery";
import WhyChooseUs from "../components/WhyChooseUs";
import Contact from "../components/Contact";
import Location from "../components/Location";
import Footer from "../components/Footer";

import "../style/landing.css";

function Landing() {

    return (

        <div className="landing-page">

            <Navbar />
            <Hero />
            <About />
            <Services />
            <MembershipPlans />
            <Gallery />
            <WhyChooseUs />
            <Contact />
            <Location />
            <Footer />

        </div>

    );
}

export default Landing;
