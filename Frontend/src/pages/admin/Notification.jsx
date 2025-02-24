import React, { useEffect, useState } from "react";
import moment from "moment";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_APIS_ROUTE);

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/notifications");
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Listen for new notifications via WebSocket
    socket.on("receiveNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on("notificationRead", ({ id }) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    });

    return () => {
      socket.off("receiveNotification");
      socket.off("notificationRead");
    };
  }, []);

  const markAsRead = (id) => {
    socket.emit("markNotificationAsRead", { id });

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="mt-5 p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="bg-white shadow-md rounded-lg p-4">
        {notifications.length === 0 ? (
          <li className="text-gray-500">No notifications</li>
        ) : (
          notifications.map((notification) => (
            <li
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              className={`border-b py-2 px-4 cursor-pointer rounded-md transition duration-200 ${
                !notification.read ? "bg-green-200 font-semibold" : "bg-gray-100 text-gray-600"
              } hover:bg-gray-200`}
            >
              📢 {notification.message}
              <span className="text-sm text-gray-500 ml-2">
                {moment(notification.createdAt).fromNow()}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminNotification;
