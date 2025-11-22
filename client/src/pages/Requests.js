import React, { useState, useEffect } from 'react';
import { mockRequests, mockHospitals } from '../data/mockData';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    hospitalId: '',
    bloodType: '',
    unitsRequested: 1,
    urgencyLevel: 'Medium',
    requiredByDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filterStatus]);

  const fetchData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let filteredRequests = [...mockRequests];

      if (filterStatus) {
        filteredRequests = filteredRequests.filter(r => r.Status === filterStatus);
      }

      setRequests(filteredRequests);
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
      alert('✅ Blood request submitted successfully! (Demo Mode)');

      setShowForm(false);
      setFormData({
        hospitalId: '',
        bloodType: '',
        unitsRequested: 1,
        urgencyLevel: 'Medium',
        requiredByDate: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // In demo mode, update local state
      const updatedRequests = requests.map(req =>
        req.Request_ID === requestId ? { ...req, Status: newStatus } : req
      );
      setRequests(updatedRequests);

      alert(`✅ Request ${newStatus.toLowerCase()} successfully! (Demo Mode)`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update request status');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-red-600 text-white';
      case 'High':
        return 'bg-orange-600 text-white';
      case 'Medium':
        return 'bg-yellow-600 text-white';
      case 'Low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blood-600 to-blood-500 bg-clip-text text-transparent">Blood Requests</h1>
          <p className="text-gray-600 mt-2 font-medium">Manage hospital blood requests</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Blood Request'}
        </button>
      </div>

      {/* Request Form */}
      {showForm && (
        <div className="glass-card p-8 animate-slide-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">Submit Blood Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-gray-700 font-medium mb-2">Units Requested *</label>
                <input
                  type="number"
                  name="unitsRequested"
                  value={formData.unitsRequested}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Urgency Level *</label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Required By Date</label>
                <input
                  type="date"
                  name="requiredByDate"
                  value={formData.requiredByDate}
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
                placeholder="Additional details about the request..."
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Request</button>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Blood Requests ({requests.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hospital</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Units</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Urgency</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Request Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Required By</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map(request => (
                <tr key={request.Request_ID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{request.Request_ID}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{request.Hospital_Name}</div>
                    <div className="text-xs text-gray-500">{request.Contact}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blood-100 text-blood-800">
                      {request.Blood_Type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">{request.Units_Requested}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.Urgency_Level)}`}>
                      {request.Urgency_Level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(request.Request_Date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {request.Required_By_Date ? new Date(request.Required_By_Date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.Status)}`}>
                      {request.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {request.Status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(request.Request_ID, 'Approved')}
                          className="text-xs btn bg-blue-600 text-white hover:bg-blue-700 px-2 py-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request.Request_ID, 'Rejected')}
                          className="text-xs btn bg-red-600 text-white hover:bg-red-700 px-2 py-1"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {request.Status === 'Approved' && (
                      <button
                        onClick={() => handleStatusUpdate(request.Request_ID, 'Completed')}
                        className="text-xs btn bg-green-600 text-white hover:bg-green-700 px-2 py-1"
                      >
                        Complete
                      </button>
                    )}
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

export default Requests;
