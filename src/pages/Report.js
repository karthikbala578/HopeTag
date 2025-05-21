import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { collection, doc, setDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import './Report.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Modal from './Modal';
import { getDistance } from './GetDistance';
import Navbar from '../NavBar/Navbar';
import { showErrorToast, showSuccessToast } from '../Toast/toastUtils';

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
  const [nearestStations, setNearestStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
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
    let uploadedMediaUrl = null;

    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'my_reports_upload');
      uploadData.append('public_id', `reports/${reportId}`);

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dlxpkrbvc/image/upload',
          uploadData
        );
        uploadedMediaUrl = res.data.secure_url;
        setMediaUrl(uploadedMediaUrl);
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
      mediaUrl: uploadedMediaUrl || null,
    };

    try {
      await setDoc(doc(collection(db, 'reports'), reportId), reportData);

      await addDoc(collection(db, 'notifications'), {
        message: `New Report\nCategory: ${formData.category}\nDescription: ${formData.description}`,
        timestamp: serverTimestamp(),
      });

      let collectionName;
      if (formData.category === 'lost') {
        collectionName = 'policeStations';
      } else if (formData.category === 'homelessness') {
        collectionName = 'ngos';
      } else if (formData.category === 'civic') {
        collectionName = 'corporations';
      }

      const snap = await getDocs(collection(db, collectionName));
      const stationsWithDistances = [];

      snap.forEach((doc) => {
        const station = doc.data();
        const dist = getDistance(location.lat, location.lng, station.lat, station.lng);
        stationsWithDistances.push({ ...station, distance: dist });
      });

      stationsWithDistances.sort((a, b) => a.distance - b.distance);
      setNearestStations(stationsWithDistances);
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      /* alert('Something went wrong. Please try again.'); */
      showSuccessToast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStationSelection = async (station) => {
    setSelectedStation(station);
    setShowModal(false);

    try {
      const confirmSend = window.confirm(
        `Do you want to notify the selected ${formData.category}?\n\n${station.name}\n${station.address}`
      );

      if (confirmSend) {
        await axios.post('http://localhost:5000/send-email', {
          to: station.email,
          subject: `New HopeTag Report: ${formData.category}`,
          text: `A new ${formData.category} report was submitted.\nDescription: ${formData.description}\nLocation: https://maps.google.com/?q=${location.lat},${location.lng}`,
          html: `
            <h3>New ${formData.category} Report Submitted</h3>
            <p><strong>Description:</strong> ${formData.description}</p>
            <p><strong>Anonymous:</strong> ${formData.isAnonymous ? 'Yes' : 'No'}</p>
            <p><strong>Location:</strong> 
              <a href="https://maps.google.com/?q=${location.lat},${location.lng}" target="_blank">
                View on Map
              </a>
            </p>
            <p><strong>Attachment:</strong> ${mediaUrl ? `<br/><img src="${mediaUrl}" width="300"/>` : ''}</p>
          `,
          mediaUrl,
        });

        /* alert(`Notification sent to ${station.name}`); */
        showSuccessToast(`Notification sent to ${station.name}`);
      } else {
        /* alert('Notification skipped.'); */
        showErrorToast('Notification skipped');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      /* alert('Failed to send notification. Please try again.'); */
      showErrorToast('Failed to send notification. Please try again.');
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <>
    <Navbar/>
    {/* <div className="report-form-container">
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
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

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
            center={location || { lat: 11.669672, lng: 78.140625 }}
            zoom={12}
            onClick={handleMapClick}
          >
            {location && <Marker position={location} />}
          </GoogleMap>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>

      {showModal && (
        <Modal
          stations={nearestStations}
          category={formData.category}
          onClose={() => setShowModal(false)}
          onSelectStation={handleStationSelection}
        />
      )}
    </div> */}

      <div className="report-page-wide">
  <h2 className="report-title">Report an Issue</h2>

  <form onSubmit={handleSubmit} className="report-form-wide">
    
    {/* <div className="form-group">
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
    </div> */}

    <div className="form-group category-select-group">
  <label htmlFor="category-select">Category</label>
  <select
    id="category-select"
    className="custom-select"
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
  >
    <option value="">Select Category</option>
    <option value="homelessness">🏚️ Homelessness</option>
    <option value="lost">🔍 Lost Item</option>
    <option value="civic">🏙️ Civic Issue</option>
  </select>
</div>


    <div className="form-group">
      <label>Description</label>
      <textarea
        placeholder="Describe the issue..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
    </div>

    <div className="form-row">
      {/* <div className="form-group half">
        <label>Attach Photo (optional)</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div> */}

      <div className="form-group half file-upload-group">
    <label className="upload-label">Attach Photo (optional)</label>

    <div className="custom-file-upload">
      <label htmlFor="file-upload" className="file-upload-button">
        📁 Choose File
      </label>
      <span className="file-name">
        {file ? file.name : 'No file chosen'}
      </span>
      <input
        type="file"
        id="file-upload"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="hidden-file-input"
      />
    </div>

    {/* Optional: Preview Image if file is an image */}
    {file && file.type.startsWith('image/') && (
      <div className="image-preview">
        <img src={URL.createObjectURL(file)} alt="Preview" />
      </div>
    )}
  </div>

      <div className="form-group half checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
          />
          Submit Anonymously
        </label>
      </div>
    </div>

    <div className="map-wrapper-wide">
      <h4 className='map-loc'>Mark Location</h4>
      
      <GoogleMap
        mapContainerStyle={{ height: '350px', width: '100%', borderRadius: '8px' }}
        center={location || { lat: 11.669672, lng: 78.140625 }}
        zoom={12}
        onClick={handleMapClick}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </div>

    <div className="submit-section-wide">
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </div>
  </form>

  {showModal && (
    <Modal
      stations={nearestStations}
      category={formData.category}
      onClose={() => setShowModal(false)}
      onSelectStation={handleStationSelection}
    />
  )}
</div>





    </>
  );
};

export default Report;
