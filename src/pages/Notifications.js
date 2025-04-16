import React from 'react';
import "./Notifications.css";

const Notifications = () => {
  return (
    <div className="notifications-panel">
      <h3>Notifications</h3>
      <ul>
        <li>Report #1234 has been marked as Resolved</li>
        <li>New report submitted in your area</li>
      </ul>
    </div>
  );
};
export default Notifications;