import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseconfig.js';
import { collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import './Notifications.css';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notifications'));
        const notificationsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationsArray);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Function to clear all notifications
  const clearAllNotifications = async () => {
    const batch = writeBatch(db); // Use writeBatch to create a batch operation
    notifications.forEach(notification => {
      const notificationRef = doc(db, 'notifications', notification.id);
      batch.delete(notificationRef); // Queue delete operation for each notification
    });

    try {
      await batch.commit(); // Commit the batch operation
      setNotifications([]); // Clear state after batch commit
    } catch (error) {
      console.error('Error clearing notifications: ', error);
    }
  };

  // Function to clear a particular notification
  const clearNotification = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id)); // Delete individual notification
      setNotifications(notifications.filter(notification => notification.id !== id)); // Remove it from state
    } catch (error) {
      console.error('Error deleting notification: ', error);
    }
  };

  return (
    <div className="notifications-panel">
      <h3>Notifications</h3>
      {notifications.length > 0 ? (
        <>
          <ul>
            {notifications.map(notification => (
              <li key={notification.id}>
                <strong>{notification.message}</strong>
                <div className="notification-time">
                  <small>{new Date(notification.timestamp.seconds * 1000).toLocaleString()}</small>
                </div>
                <button 
                  className="clear-btn" 
                  onClick={() => clearNotification(notification.id)}
                >
                  Clear
                </button>
              </li>
            ))}
          </ul>
          <button className="clear-all-btn" onClick={clearAllNotifications}>
            Clear All
          </button>
        </>
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationsPanel;
