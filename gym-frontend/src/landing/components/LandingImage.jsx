import { useState } from "react";
import { ImageOff } from "lucide-react";

/*
 * Renders an <img> that gracefully falls back to a styled
 * placeholder card if the file at `src` doesn't exist yet (none of
 * the real gym photos have been added to public/assets/ yet). Once
 * a real file is dropped at that path, it displays automatically -
 * no code change needed.
 */
function LandingImage({ src, alt, label, icon, className = "" }) {

    const [failed, setFailed] = useState(false);

    return (

        <div className={`lp-img-frame ${failed ? "lp-img-fallback" : ""} ${className}`}>

            <img
                src={src}
                alt={alt}
                loading="lazy"
                onError={() => setFailed(true)}
            />

            <div className="lp-img-placeholder">
                {icon || <ImageOff size={26} />}
                {label && <span>{label}</span>}
            </div>

        </div>

    );

}

export default LandingImage;
