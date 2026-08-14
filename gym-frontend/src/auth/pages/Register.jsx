import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { registerUser } from "../services/authService";

function Register() {

    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        user_name: "",
        age: "",
        email: "",
        role: ""
    });

    const [temporaryPassword, setTemporaryPassword] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setTemporaryPassword("");
        setLoading(true);

        try {

            const data = await registerUser(formData);

            console.log(
                "REGISTER RESPONSE:",
                data
            );

            setSuccess(
                "User created successfully"
            );

            setTemporaryPassword(
                data.temporaryPassword
            );

            setFormData({
                user_name: "",
                age: "",
                email: "",
                role: ""
            });

        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };

    const copyPassword = () => {

        navigator.clipboard.writeText(
            temporaryPassword
        );

        alert("Temporary password copied");
    };

    return (

        <div>

            <h1>Register User</h1>

            <p>
                Logged in as:
                {" "}
                <strong>
                    {user?.role}
                </strong>
            </p>

            {error && (
                <p>{error}</p>
            )}

            {success && (
                <p>{success}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        User name
                    </label>

                    <input
                        type="text"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>
                        Age
                    </label>

                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>
                        Role
                    </label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select role
                        </option>

                        {user?.role === "admin" && (
                            <>
                                <option value="member">
                                    Member
                                </option>

                                <option value="coach">
                                    Coach
                                </option>

                                <option value="employee">
                                    Employee
                                </option>

                                <option value="receptionist">
                                    Receptionist
                                </option>
                            </>
                        )}

                        {user?.role === "receptionist" && (
                            <>
                                <option value="member">
                                    Member
                                </option>

                                <option value="coach">
                                    Coach
                                </option>
                            </>
                        )}

                    </select>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create User"
                    }
                </button>

            </form>

            {temporaryPassword && (

                <div>

                    <h2>
                        User created successfully
                    </h2>

                    <p>
                        Give this temporary password
                        to the user:
                    </p>

                    <strong>
                        {temporaryPassword}
                    </strong>

                    <br />

                    <button
                        type="button"
                        onClick={copyPassword}
                    >
                        Copy Password
                    </button>

                </div>

            )}

        </div>
    );
}

export default Register;