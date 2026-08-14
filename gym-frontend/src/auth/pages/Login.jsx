import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext.js";
import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = await loginUser(
                email,
                password
            );

            console.log("LOGIN RESPONSE:", data);

        

            login(
                data.user,
                data.token
            );
            //   first login
            if (data.user.must_change_password === 1) {

                navigate("/change-password");

                return ;

            } 
            
            // Normal login
            switch (data.user.role) {
                case"admin":
                   navigate("/admin");
                   break;

                case "employee":
                    navigate("/employee");
                    break;

                 case "coach":
                    navigate("/coach");
                    break;

                 case "member":
                    navigate("/member");
                    break;
                
                 case "receptionist":
                    navigate("/receptionist");
                    break;

                default:
                    setError("Unknown user role");
            }

        } catch (error) {

            console.error("LOGIN ERROR:",error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div>

            <h1>Login</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                </div>

                <div>

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "Login"
                    }

                </button>

                <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                >
                Forgot Password?
</button>

            </form>

        </div>
    );
}

export default Login;