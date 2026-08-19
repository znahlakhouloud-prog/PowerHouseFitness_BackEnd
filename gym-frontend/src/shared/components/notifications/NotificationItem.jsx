import {
    UserPlus,
    CreditCard,
    CalendarX,
    Wrench,
    Bell as BellIcon
} from "lucide-react";

const ICONS = {
    registration: <UserPlus size={16} />,
    payment: <CreditCard size={16} />,
    membership: <CalendarX size={16} />,
    equipment: <Wrench size={16} />
};

const formatRelativeTime = (dateString) => {

    const date = new Date(dateString);
    const now = new Date();

    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) {
        return "Just now";
    }

    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }

    return date.toLocaleDateString();

};

function NotificationItem({ notification, onMarkRead }) {

    const isUnread = !notification.is_read;

    return (

        <button
            type="button"
            className={`notif-item ${isUnread ? "unread" : ""}`}
            onClick={() => isUnread && onMarkRead(notification.id)}
        >

            <span className="notif-icon">
                {ICONS[notification.type] || <BellIcon size={16} />}
            </span>

            <span className="notif-body">

                <strong>{notification.title}</strong>
                <p>{notification.descrip}</p>
                <span className="notif-time">
                    {formatRelativeTime(notification.created_at)}
                </span>

            </span>

            {isUnread && <span className="notif-dot" />}

        </button>

    );

}

export default NotificationItem;
