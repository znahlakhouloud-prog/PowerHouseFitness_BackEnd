import { useState } from "react";

import { X, ImageOff } from "lucide-react";

import Reveal from "./Reveal";

const PHOTOS = [
    { src: "/assets/gym-training.png", label: "Weight Training" },
    { src: "/assets/cardio.jpg", label: "Cardio Area" },
    { src: "/assets/equipment.jpg", label: "Machines" },
    { src: "/assets/coaching.png", label: "Coaching" },
    { src: "/assets/gym-interior.png", label: "Gym Interior" },
    { src: "/assets/free-weights.jpg", label: "Free Weights" }
];

function GalleryImage({ photo, onClick }) {

    const [failed, setFailed] = useState(false);

    return (

        <button
            type="button"
            className="lp-gallery-item"
            onClick={onClick}
            aria-label={`View larger photo: ${photo.label}`}
        >

            {failed ? (

                <div className="lp-img-placeholder" style={{ display: "flex", position: "static", height: "100%" }}>
                    <ImageOff size={24} />
                    <span>{photo.label}</span>
                </div>

            ) : (

                <img
                    src={photo.src}
                    alt={photo.label}
                    loading="lazy"
                    onError={() => setFailed(true)}
                />

            )}

            <div className="lp-gallery-overlay">
                <span>{photo.label}</span>
            </div>

        </button>

    );

}

function Gallery() {

    const [preview, setPreview] = useState(null);

    return (

        <section id="gallery" className="lp-section lp-section-alt">

            <div className="lp-container">

                <div className="lp-section-header">
                    <span className="lp-eyebrow">Take a Look</span>
                    <h2>Our Gym</h2>
                    <p>
                        A look inside our training floor, equipment, and
                        coaching environment.
                    </p>
                </div>

                <div className="lp-gallery-grid">

                    {PHOTOS.map((photo) => (

                        <Reveal key={photo.src}>
                            <GalleryImage
                                photo={photo}
                                onClick={() => setPreview(photo)}
                            />
                        </Reveal>

                    ))}

                </div>

            </div>

            {preview && (

                <div
                    className="lp-lightbox"
                    onClick={() => setPreview(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={preview.label}
                >

                    <div
                        className="lp-lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            className="lp-lightbox-close"
                            onClick={() => setPreview(null)}
                            aria-label="Close preview"
                        >
                            <X size={26} />
                        </button>

                        <img src={preview.src} alt={preview.label} />

                    </div>

                </div>

            )}

        </section>

    );

}

export default Gallery;
