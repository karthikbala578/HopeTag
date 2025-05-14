import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseconfig.js';
import './Dashboard.css';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [comments, setComments] = useState({});
  const [editedReport, setEditedReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  // Function to format createdAt string into a readable date
  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt); // Convert ISO 8601 string to Date object
    return date.toLocaleString(); // Format it as a readable string
  };

  // Fetch reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'reports'));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReports(data);

        // Initialize selectedStatus
        const initialStatus = {};
        data.forEach((report) => {
          initialStatus[report.id] = report.status || 'pending';
        });
        setSelectedStatus(initialStatus);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  // Function to save comment in Firestore
  const saveComment = async (reportId, commentText) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        comment: commentText,
      });
      alert('Comment saved!');
      setEditedReport(reportId);
    } catch (error) {
      console.error('Failed to save comment:', error);
    }
  };

  // Function to save status in Firestore
  const saveStatus = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: newStatus,
      });
      setSelectedStatus((prev) => ({
        ...prev,
        [reportId]: newStatus,
      }));
      alert('Status updated!');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Function to handle comment change
  const handleCommentChange = (reportId, value) => {
    setComments((prev) => ({
      ...prev,
      [reportId]: value,
    }));
  };

  // Function to handle status change
  const handleStatusChange = (reportId, event) => {
    const newStatus = event.target.value;
    saveStatus(reportId, newStatus);
  };

  return (
    <div className="dashboard-container">
      <h2>NGO/Govt Dashboard</h2>

      {reports.map((report) => (
        <div key={report.id} className="report-item">
          <div>
            <strong>Issue Time: </strong>{formatCreatedAt(report.createdAt)}
          </div>

          <div>
            <strong>Category: </strong>{report.category || 'Unknown'}
          </div>

          <div>
            <strong>Status: </strong>
            <select
              value={selectedStatus[report.id] || report.status || 'pending'}
              onChange={(e) => handleStatusChange(report.id, e)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <strong>Description: </strong>{report.description || 'No description available'}
          </div>

          <div>
            <img src={report.mediaUrl} alt="Report Media" className="report-image" />
          </div>

          <textarea
            value={comments[report.id] || report.comment || ''}
            onChange={(e) => handleCommentChange(report.id, e.target.value)}
            placeholder="Add or update comment"
          />

          <div className="button-container">
            <button onClick={() => saveComment(report.id, comments[report.id])}>
              Save Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
