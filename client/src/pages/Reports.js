import React, { useState, useEffect } from 'react';
import { getMockStats, mockDonations, mockRequests, mockInventory } from '../data/mockData';

const Reports = () => {
  const [donationStats, setDonationStats] = useState(null);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [requestStats, setRequestStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  const fetchReports = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const mockStats = getMockStats();

      // Donation stats
      const donationByType = mockDonations.reduce((acc, don) => {
        const existing = acc.find(item => item.Blood_Type === don.Blood_Type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ Blood_Type: don.Blood_Type, count: 1 });
        }
        return acc;
      }, []);

      const donationByHospital = mockDonations.reduce((acc, don) => {
        const existing = acc.find(item => item.Hospital_Name === don.Hospital_Name);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ Hospital_Name: don.Hospital_Name, count: 1 });
        }
        return acc;
      }, []);

      setDonationStats({
        total: mockDonations.length,
        byBloodType: donationByType,
        byHospital: donationByHospital
      });

      // Inventory stats
      const invByType = mockInventory.filter(i => i.Status === 'Available').reduce((acc, item) => {
        const existing = acc.find(i => i.Blood_Type === item.Blood_Type);
        if (existing) {
          existing.total += item.Quantity;
        } else {
          acc.push({ Blood_Type: item.Blood_Type, total: item.Quantity });
        }
        return acc;
      }, []);

      const invByHospital = mockInventory.filter(i => i.Status === 'Available').reduce((acc, item) => {
        const existing = acc.find(i => i.Hospital_Name === item.Hospital_Name);
        if (existing) {
          existing.total += item.Quantity;
        } else {
          acc.push({ Hospital_Name: item.Hospital_Name, total: item.Quantity });
        }
        return acc;
      }, []);

      setInventoryStats({
        totalUnits: mockStats.inventory.totalUnits,
        expiringSoon: mockStats.inventory.expiringSoon,
        byBloodType: invByType,
        byHospital: invByHospital
      });

      // Request stats
      const reqByStatus = mockRequests.reduce((acc, req) => {
        const existing = acc.find(item => item.Status === req.Status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ Status: req.Status, count: 1 });
        }
        return acc;
      }, []);

      const reqByUrgency = mockRequests.reduce((acc, req) => {
        const existing = acc.find(item => item.Urgency_Level === req.Urgency_Level);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ Urgency_Level: req.Urgency_Level, count: 1 });
        }
        return acc;
      }, []);

      setRequestStats({
        byStatus: reqByStatus,
        byUrgency: reqByUrgency,
        pendingCount: mockRequests.filter(r => r.Status === 'Pending').length
      });

    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    setLoading(true);
    fetchReports();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blood-600 to-blood-500 bg-clip-text text-transparent">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2 font-medium">Blood donation system insights</p>
      </div>

      {/* Date Range Filter */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">Filter by Date Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <button onClick={handleDateFilter} className="btn btn-primary w-full">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Donation Statistics */}
      {donationStats && (
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Donation Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Blood Type */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Donations by Blood Type</h3>
              <div className="space-y-2">
                {donationStats.byBloodType && donationStats.byBloodType.map((item) => (
                  <div key={item.Blood_Type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blood-100 text-blood-800">
                      {item.Blood_Type}
                    </span>
                    <span className="font-bold text-gray-900">{item.count} donations</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Hospital */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Donations by Hospital</h3>
              <div className="space-y-2">
                {donationStats.byHospital && donationStats.byHospital.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">{item.Hospital_Name}</span>
                    <span className="font-bold text-gray-900">{item.count} donations</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blood-50 border-l-4 border-blood-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Total Donations</p>
                <p className="text-sm text-gray-600">
                  {dateRange.startDate && dateRange.endDate
                    ? `From ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`
                    : 'All time'}
                </p>
              </div>
              <div className="text-4xl font-bold text-blood-600">{donationStats.total}</div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Statistics */}
      {inventoryStats && (
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Current Inventory Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Blood Type */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Available Units by Blood Type</h3>
              <div className="space-y-2">
                {inventoryStats.byBloodType && inventoryStats.byBloodType.map((item) => (
                  <div key={item.Blood_Type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blood-100 text-blood-800">
                      {item.Blood_Type}
                    </span>
                    <span className="font-bold text-gray-900">{item.total} units</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Hospital */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Inventory by Hospital</h3>
              <div className="space-y-2">
                {inventoryStats.byHospital && inventoryStats.byHospital.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">{item.Hospital_Name}</span>
                    <span className="font-bold text-gray-900">{item.total} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-600">
              <p className="font-medium text-gray-700">Total Available Units</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{inventoryStats.totalUnits}</p>
            </div>
            <div className="p-4 bg-orange-50 border-l-4 border-orange-600">
              <p className="font-medium text-gray-700">Units Expiring Soon</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{inventoryStats.expiringSoon}</p>
              <p className="text-xs text-gray-600 mt-1">Within 30 days</p>
            </div>
          </div>
        </div>
      )}

      {/* Request Statistics */}
      {requestStats && (
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Blood Request Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Status */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Requests by Status</h3>
              <div className="space-y-2">
                {requestStats.byStatus && requestStats.byStatus.map((item) => {
                  const statusColors = {
                    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-500',
                    Approved: 'bg-blue-100 text-blue-800 border-blue-500',
                    Completed: 'bg-green-100 text-green-800 border-green-500',
                    Rejected: 'bg-red-100 text-red-800 border-red-500'
                  };
                  return (
                    <div key={item.Status} className={`flex justify-between items-center p-3 rounded-lg border-l-4 ${statusColors[item.Status]}`}>
                      <span className="font-medium">{item.Status}</span>
                      <span className="font-bold">{item.count} requests</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Urgency */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Requests by Urgency</h3>
              <div className="space-y-2">
                {requestStats.byUrgency && requestStats.byUrgency.map((item) => {
                  const urgencyColors = {
                    Critical: 'bg-red-600 text-white border-red-700',
                    High: 'bg-orange-600 text-white border-orange-700',
                    Medium: 'bg-yellow-600 text-white border-yellow-700',
                    Low: 'bg-green-600 text-white border-green-700'
                  };
                  return (
                    <div key={item.Urgency_Level} className={`flex justify-between items-center p-3 rounded-lg border-l-4 ${urgencyColors[item.Urgency_Level]}`}>
                      <span className="font-medium">{item.Urgency_Level}</span>
                      <span className="font-bold">{item.count} requests</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Pending Requests</p>
                <p className="text-sm text-gray-600">Awaiting approval</p>
              </div>
              <div className="text-4xl font-bold text-yellow-600">{requestStats.pendingCount}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
