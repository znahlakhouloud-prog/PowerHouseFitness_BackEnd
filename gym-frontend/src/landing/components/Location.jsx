import { MapPin } from "lucide-react";

import Reveal from "./Reveal";

function Location() {

    return (

        <section className="lp-section lp-section-alt">

            <div className="lp-container">

                <div className="lp-section-header">
                    <span className="lp-eyebrow">Find Us</span>
                    <h2>Our Location</h2>
                </div>

                <Reveal>

                    <div className="lp-location-map">

                        <MapPin size={30} />

                        <strong>[Gym Address]</strong>
                        <span>
                            Map placeholder - add your real address and an
                            embedded map once available.
                        </span>

                    </div>

                </Reveal>

            </div>

        </section>

    );

}

export default Location;
