import { useContext, useEffect, useRef, useState } from "react";

import { Bell } from "lucide-react";

import { AuthContext } from "../../../auth/context/authContext";

import {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} from "../../services/notificationService";

import NotificationPopup from "./NotificationPopup";

function NotificationBell() {

    const { user } = useContext(AuthContext);

    const containerRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const loadUnreadCount = async () => {

        try {

            const count = await getUnreadCount();
            setUnreadCount(count);

        } catch (err) {

            console.error("LOAD UNREAD COUNT ERROR:", err);

        }

    };

    const loadNotifications = async () => {

        setLoading(true);
        setError("");

        try {

            const data = await getMyNotifications(user.id);
            setNotifications(data);

        } catch (err) {

            console.error("LOAD NOTIFICATIONS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load notifications."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadUnreadCount();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {

        if (!open) {
            return;
        }

        loadNotifications();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);


    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);

    }, []);


    const handleMarkRead = async (id) => {

        // Optimistic update - the popup should feel instant
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));

        try {

            await markAsRead(id);

        } catch (err) {

            console.error("MARK READ ERROR:", err);

            // Revert on failure
            await loadNotifications();
            await loadUnreadCount();

        }

    };

    const handleMarkAllRead = async () => {

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, is_read: true }))
        );

        setUnreadCount(0);

        try {

            await markAllAsRead();

        } catch (err) {

            console.error("MARK ALL READ ERROR:", err);

            await loadNotifications();
            await loadUnreadCount();

        }

    };


    return (

        <div className="notification-container" ref={containerRef}>

            <button
                className="navbar-icon"
                title="Notifications"
                onClick={() => setOpen(!open)}
            >

                <Bell size={20} />

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}

            </button>

            {open && (

                <NotificationPopup
                    notifications={notifications}
                    loading={loading}
                    error={error}
                    onMarkRead={handleMarkRead}
                    onMarkAllRead={handleMarkAllRead}
                />

            )}

        </div>

    );

}

export default NotificationBell;
