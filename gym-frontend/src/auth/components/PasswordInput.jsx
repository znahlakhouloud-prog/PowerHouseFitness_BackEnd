import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
    id,
    name,
    value,
    onChange,
    placeholder,
    autoComplete
}) {

    const [visible, setVisible] = useState(false);

    return (

        <div className="auth-password-wrap">

            <input
                id={id}
                type={visible ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
            />

            <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? "Hide password" : "Show password"}
                tabIndex={-1}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

        </div>

    );

}

export default PasswordInput;
