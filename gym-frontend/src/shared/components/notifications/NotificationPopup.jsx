import { Check } from "lucide-react";

import NotificationItem from "./NotificationItem";

function NotificationPopup({
    notifications,
    loading,
    error,
    onMarkRead,
    onMarkAllRead
}) {

    const hasUnread = notifications.some((n) => !n.is_read);

    return (

        <div className="notif-popup">

            <div className="notif-popup-header">
                <h3>Notifications</h3>
            </div>

            <div className="notif-popup-list">

                {loading && (
                    <div className="notif-popup-state">
                        Loading notifications...
                    </div>
                )}

                {!loading && error && (
                    <div className="notif-popup-state notif-popup-error">
                        {error}
                    </div>
                )}

                {!loading && !error && notifications.length === 0 && (
                    <div className="notif-popup-state">
                        No notifications yet.
                    </div>
                )}

                {!loading && !error && notifications.map((notification) => (

                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={onMarkRead}
                    />

                ))}

            </div>

            {!loading && !error && notifications.length > 0 && (

                <div className="notif-popup-footer">

                    <button
                        type="button"
                        className="notif-mark-all"
                        onClick={onMarkAllRead}
                        disabled={!hasUnread}
                    >
                        <Check size={14} />
                        Mark all as read
                    </button>

                </div>

            )}

        </div>

    );

}

export default NotificationPopup;
