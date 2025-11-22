import React, { useState, useEffect } from 'react';
import { mockInventory, mockHospitals } from '../data/mockData';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodType, setFilterBloodType] = useState('');
  const [filterHospital, setFilterHospital] = useState('');
  const [filterStatus, setFilterStatus] = useState('Available');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filterBloodType, filterHospital, filterStatus]);

  const fetchData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let filteredInventory = [...mockInventory];

      if (filterBloodType) {
        filteredInventory = filteredInventory.filter(item => item.Blood_Type === filterBloodType);
      }

      if (filterHospital) {
        filteredInventory = filteredInventory.filter(item => item.Hospital_ID === parseInt(filterHospital));
      }

      if (filterStatus) {
        filteredInventory = filteredInventory.filter(item => item.Status === filterStatus);
      }

      setInventory(filteredInventory);
      setHospitals(mockHospitals);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'Used':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blood-600 to-blood-500 bg-clip-text text-transparent">Blood Inventory</h1>
        <p className="text-gray-600 mt-2 font-medium">Track and manage blood unit availability</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Blood Type</label>
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
          <div>
            <label className="block text-gray-700 font-medium mb-2">Hospital</label>
            <select
              value={filterHospital}
              onChange={(e) => setFilterHospital(e.target.value)}
              className="input-field"
            >
              <option value="">All Hospitals</option>
              {hospitals.map(hospital => (
                <option key={hospital.Hospital_ID} value={hospital.Hospital_ID}>
                  {hospital.Hospital_Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Used">Used</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Inventory Units ({inventory.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hospital</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Collection Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {inventory.map(unit => (
                <tr
                  key={unit.Unit_ID}
                  className={`hover:bg-white/50 transition-colors duration-200 ${
                    isExpiringSoon(unit.Expiry_Date) && unit.Status === 'Available' ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm">{unit.Unit_ID}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blood-100 text-blood-800">
                      {unit.Blood_Type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">{unit.Quantity}</td>
                  <td className="px-4 py-3 text-sm">{unit.Hospital_Name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(unit.Collection_Date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>{new Date(unit.Expiry_Date).toLocaleDateString()}</div>
                    {isExpiringSoon(unit.Expiry_Date) && unit.Status === 'Available' && (
                      <div className="text-xs text-orange-600 font-medium">Expiring Soon</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(unit.Status)}`}>
                      {unit.Status}
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

export default Inventory;
