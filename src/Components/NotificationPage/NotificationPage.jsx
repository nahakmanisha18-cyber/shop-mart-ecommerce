"use client";

import { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./NotificationPage.css";

const NotificationPage = () => {

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Profile Updated",
            message: "Your profile information has been updated successfully.",
            time: "5 minutes ago",
            read: false,
        },
        {
            id: 2,
            title: "Welcome!",
            message: "Welcome to our platform. We are happy to have you here.",
            time: "1 hour ago",
            read: false,
        },
        {
            id: 3,
            title: "Password Changed",
            message: "Your password was changed successfully.",
            time: "Yesterday",
            read: true,
        },
        {
            id: 4,
            title: "New Update Available",
            message: "A new update is available for your account.",
            time: "2 days ago",
            read: true,
        },
    ]);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        );
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    return (
        <Container className="notification-container py-5">

            <Card className="notification-card">

                {/* Header */}
                <div className="notification-header">

                    <div className="notification-title-box">

                        <div className="notification-icon">
                            <i className="bi bi-bell"></i>
                        </div>

                        <div>
                            <h2>Notifications</h2>

                            <p>
                                You have {unreadCount} unread notification
                                {unreadCount !== 1 ? "s" : ""}
                            </p>
                        </div>

                    </div>

                    {unreadCount > 0 && (
                        <Button
                            className="mark-all-btn"
                            onClick={markAllAsRead}
                        >
                            <i className="bi bi-check-lg"></i>
                            Mark all as read
                        </Button>
                    )}

                </div>

                {/* Notifications */}
                <div className="notification-list">

                    {notifications.length === 0 ? (

                        <div className="empty-notification">

                            <i className="bi bi-bell"></i>

                            <h4>No Notifications</h4>

                            <p>
                                You don't have any notifications right now.
                            </p>

                        </div>

                    ) : (

                        notifications.map((notification) => (

                            <div
                                key={notification.id}
                                className={`notification-item ${!notification.read ? "unread" : ""
                                    }`}
                            >

                                <div className="notification-left">

                                    <div className="notification-small-icon">
                                        <i className="bi bi-bell"></i>
                                    </div>

                                    <div className="notification-content">

                                        <div className="notification-heading">

                                            <h5>
                                                {notification.title}
                                            </h5>

                                            {!notification.read && (
                                                <span className="unread-dot"></span>
                                            )}

                                        </div>

                                        <p>
                                            {notification.message}
                                        </p>

                                        <span className="notification-time">
                                            {notification.time}
                                        </span>

                                    </div>

                                </div>

                                <div className="notification-actions">

                                    {!notification.read && (
                                        <button
                                            className="read-btn"
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                            title="Mark as read"
                                        >
                                            <i className="bi bi-check-lg"></i>
                                        </button>
                                    )}

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            deleteNotification(notification.id)
                                        }
                                        title="Delete"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </Card>

        </Container>
    );
};

export default NotificationPage;