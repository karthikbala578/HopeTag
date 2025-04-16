import React, { useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import "./Report.css";

const Report = ({ google }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    isAnonymous: false,
  });
  const [location, setLocation] = useState(null);

  const handleMapClick = (t, map, coord) => {
    const { latLng } = coord;
    setLocation({ lat: latLng.lat(), lng: latLng.lng() });
  };

  return (
    <div className="report-form-container">
      <h2>Report an Issue</h2>
      <form>
        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
          <option value="">Select Category</option>
          <option value="homelessness">Homelessness</option>
          <option value="lost">Lost Item</option>
          <option value="civic">Civic Issue</option>
        </select>
        <textarea placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <input type="file" />
        <label>
          <input type="checkbox" onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} />
          Report Anonymously
        </label>
        <Map google={google} zoom={14} initialCenter={{ lat: 13.0827, lng: 80.2707 }} onClick={handleMapClick} style={{ height: '300px', width: '100%' }}>
          {location && <Marker position={location} />}
        </Map>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default GoogleApiWrapper({ apiKey: 'YOUR_GOOGLE_MAPS_API_KEY' })(Report);
