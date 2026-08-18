import {
    useContext,
    useEffect,
    useState
} from "react";

import { AuthContext } from "../../auth/context/authContext";

import {
    getNotificationsByUser,
    markNotificationAsRead
} from "../services/notificationService";

import "../style/receptionist.css";

function NotificationsPage() {

    const { user } = useContext(AuthContext);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadNotifications = async () => {

        try {

            const data = await getNotificationsByUser(user.id);

            setNotifications(data);

        } catch (err) {

            console.error("LOAD NOTIFICATIONS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load notifications"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadNotifications();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleMarkRead = async (notification) => {

        try {

            await markNotificationAsRead(notification.id);

            await loadNotifications();

        } catch (err) {

            console.error("MARK READ ERROR:", err);

        }

    };


    if (loading) {

        return (
            <div className="receptionist-loading">
                Loading notifications...
            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-error">{error}</div>
        );

    }


    return (

        <div className="notifications-page">

            <div className="page-header">

                <div>
                    <h1>Notifications</h1>
                    <p>Stay up to date</p>
                </div>

            </div>

            {notifications.length === 0 ? (

                <div className="receptionist-empty">
                    No notifications.
                </div>

            ) : (

                <div className="notifications-list">

                    {notifications.map((n) => (

                        <div
                            key={n.id}
                            className={
                                n.is_read
                                    ? "notification-item"
                                    : "notification-item unread"
                            }
                        >

                            <div className="notification-body">

                                <strong>{n.title}</strong>

                                <p>{n.descrip}</p>

                                <span className="notification-date">
                                    {n.created_at
                                        ? new Date(
                                            n.created_at
                                        ).toLocaleString()
                                        : ""
                                    }
                                </span>

                            </div>

                            {!n.is_read && (

                                <button
                                    className="btn-link"
                                    onClick={() =>
                                        handleMarkRead(n)
                                    }
                                >
                                    Mark as read
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default NotificationsPage;
