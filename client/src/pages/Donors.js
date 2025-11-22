import React, { useState, useEffect } from 'react';
import { mockDonors } from '../data/mockData';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bloodType: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    medicalHistory: ''
  });

  useEffect(() => {
    fetchDonors();
    // eslint-disable-next-line
  }, [filterBloodType]);

  const fetchDonors = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let filteredDonors = [...mockDonors];

      if (filterBloodType) {
        filteredDonors = filteredDonors.filter(d => d.Blood_Type === filterBloodType);
      }

      setDonors(filteredDonors);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // In demo mode, just add to local state
      const newDonor = {
        Donor_ID: donors.length + 11,
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        Blood_Type: formData.bloodType,
        Date_Of_Birth: formData.dateOfBirth,
        Gender: formData.gender,
        Contact_Number: formData.contactNumber,
        Email: formData.email,
        Address: formData.address,
        Medical_History: formData.medicalHistory,
        Last_Donation_Date: null,
        Eligibility_Status: 'Eligible'
      };

      setDonors([newDonor, ...donors]);
      alert('Donor registered successfully! (Demo Mode)');

      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        bloodType: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        email: '',
        address: '',
        medicalHistory: ''
      });
    } catch (error) {
      console.error('Error creating donor:', error);
      alert('Failed to register donor');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredDonors = donors.filter(donor =>
    donor.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.Last_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blood-600 to-blood-500 bg-clip-text text-transparent">Blood Donors</h1>
          <p className="text-gray-600 mt-2 font-medium">Manage donor registrations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Register New Donor'}
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="glass-card p-8 animate-slide-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">Donor Registration Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
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
                <label className="block text-gray-700 font-medium mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="input-field"
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">Register Donor</button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Search</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Filter by Blood Type</label>
            <select
              value={filterBloodType}
              onChange={(e) => setFilterBloodType(e.target.value)}
              className="input-field"
            >
              <option value="">All Blood Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donors List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Registered Donors ({filteredDonors.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Donation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {filteredDonors.map(donor => (
                <tr key={donor.Donor_ID} className="hover:bg-white/50 transition-colors duration-200">
                  <td className="px-4 py-3 text-sm">{donor.Donor_ID}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {donor.First_Name} {donor.Last_Name}
                    </div>
                    <div className="text-sm text-gray-500">{donor.Email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blood-100 text-blood-800">
                      {donor.Blood_Type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{donor.Contact_Number}</td>
                  <td className="px-4 py-3 text-sm">
                    {donor.Last_Donation_Date ? new Date(donor.Last_Donation_Date).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      donor.Eligibility_Status === 'Eligible' ? 'bg-green-100 text-green-800' :
                      donor.Eligibility_Status === 'Temporarily Ineligible' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {donor.Eligibility_Status}
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

export default Donors;
