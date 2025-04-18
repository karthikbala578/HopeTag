import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import './Report.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Report = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    isAnonymous: false,
    status: 'pending',
  });
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
  });

  const handleMapClick = (e) => {
    const { latLng } = e;
    setLocation({ lat: latLng.lat(), lng: latLng.lng() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.description || !location) {
      alert('Please fill all fields and select a location on the map');
      return;
    }

    setLoading(true);
    const reportId = uuidv4();
    let mediaUrl = null;

    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'my_reports_upload');
      uploadData.append('public_id', `reports/${reportId}`);

      try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/dlxpkrbvc/image/upload', uploadData);
        mediaUrl = res.data.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        alert('Media upload failed.');
        setLoading(false);
        return;
      }
    }

    const reportData = {
      ...formData,
      location,
      createdAt: new Date().toISOString(),
      mediaUrl: mediaUrl || null,
    };

    try {
      await setDoc(doc(collection(db, 'reports'), reportId), reportData);
      alert('Report submitted successfully!');
      setFormData({
        category: '',
        description: '',
        isAnonymous: false,
        status: 'pending',
      });
      setLocation(null);
      setFile(null);
    } catch (error) {
      console.error('Firestore error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="report-form-container">
      <h2>Report an Issue</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label>Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="homelessness">Homelessness</option>
          <option value="lost">Lost Item</option>
          <option value="civic">Civic Issue</option>
        </select>

        <label>Description</label>
        <textarea
          placeholder="Describe the issue..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <label>Attach Photo (optional)</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
          />
          Submit Anonymously
        </label>

        <div className="map-section">
          <GoogleMap
            mapContainerStyle={{ height: '300px', width: '100%' }}
            center={location || { lat: 13.0827, lng: 80.2707 }}
            zoom={14}
            onClick={handleMapClick}
          >
            {location && <Marker position={location} />}
          </GoogleMap>
          <p className="map-hint">Click on the map to select location</p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default Report;
