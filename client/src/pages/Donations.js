import React, { useState, useEffect } from 'react';
import { mockDonations, mockDonors, mockHospitals } from '../data/mockData';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    donorId: '',
    hospitalId: '',
    donationDate: new Date().toISOString().split('T')[0],
    bloodType: '',
    unitsDonated: 1,
    healthStatus: 'Good',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      setDonations(mockDonations);
      setDonors(mockDonors);
      setHospitals(mockHospitals);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // In demo mode, just show success
      alert('Donation recorded successfully! (Demo Mode)');

      setShowForm(false);
      setFormData({
        donorId: '',
        hospitalId: '',
        donationDate: new Date().toISOString().split('T')[0],
        bloodType: '',
        unitsDonated: 1,
        healthStatus: 'Good',
        notes: ''
      });
    } catch (error) {
      console.error('Error recording donation:', error);
      alert('Failed to record donation');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-fill blood type when donor is selected
    if (name === 'donorId') {
      const selectedDonor = donors.find(d => d.Donor_ID === parseInt(value));
      if (selectedDonor) {
        setFormData(prev => ({ ...prev, bloodType: selectedDonor.Blood_Type }));
      }
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blood-600 to-blood-500 bg-clip-text text-transparent">Donation Records</h1>
          <p className="text-gray-600 mt-2 font-medium">Track blood donation history</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Record New Donation'}
        </button>
      </div>

      {/* Donation Form */}
      {showForm && (
        <div className="glass-card p-8 animate-slide-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">Record New Donation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Donor *</label>
                <select
                  name="donorId"
                  value={formData.donorId}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Donor</option>
                  {donors.filter(d => d.Eligibility_Status === 'Eligible').map(donor => (
                    <option key={donor.Donor_ID} value={donor.Donor_ID}>
                      {donor.First_Name} {donor.Last_Name} - {donor.Blood_Type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Hospital *</label>
                <select
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.Hospital_ID} value={hospital.Hospital_ID}>
                      {hospital.Hospital_Name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Donation Date *</label>
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Blood Type *</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Units Donated *</label>
                <input
                  type="number"
                  name="unitsDonated"
                  value={formData.unitsDonated}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Health Status</label>
                <input
                  type="text"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">Record Donation</button>
          </form>
        </div>
      )}

      {/* Donations List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Donation History ({donations.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Donor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Units</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hospital</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {donations.map(donation => (
                <tr key={donation.Donation_ID} className="hover:bg-white/50 transition-colors duration-200">
                  <td className="px-4 py-3 text-sm">{donation.Donation_ID}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(donation.Donation_Date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {donation.First_Name} {donation.Last_Name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blood-100 text-blood-800">
                      {donation.Blood_Type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">{donation.Units_Donated}</td>
                  <td className="px-4 py-3 text-sm">{donation.Hospital_Name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {donation.Health_Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Donations;
