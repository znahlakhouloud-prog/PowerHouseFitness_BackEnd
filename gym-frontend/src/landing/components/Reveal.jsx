import { useEffect, useRef, useState } from "react";

/*
 * Wraps content in a subtle fade-up-on-scroll-into-view animation.
 * Fires once per element (no re-triggering while scrolling back and
 * forth), keeping it cheap and non-distracting.
 */
function Reveal({ children, className = "" }) {

    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {

        const el = ref.current;

        if (!el) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {

                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }

            },
            { threshold: 0.15 }
        );

        observer.observe(el);

        return () => observer.disconnect();

    }, []);

    return (
        <div
            ref={ref}
            className={`lp-reveal ${visible ? "lp-visible" : ""} ${className}`}
        >
            {children}
        </div>
    );

}

export default Reveal;
