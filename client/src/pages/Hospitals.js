import React, { useState, useEffect } from 'react';
import { mockHospitals, mockInventory, mockDonations, mockRequests } from '../data/mockData';
import { MdLocalHospital } from 'react-icons/md';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalStats, setHospitalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      setHospitals(mockHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalStats = async (hospitalId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Calculate stats from mock data
      const inventory = mockInventory
        .filter(item => item.Hospital_ID === hospitalId && item.Status === 'Available')
        .map(item => ({
          Blood_Type: item.Blood_Type,
          total: item.Quantity
        }));

      const totalDonations = mockDonations.filter(d => d.Hospital_ID === hospitalId).length;

      const requests = mockRequests
        .filter(r => r.Hospital_ID === hospitalId)
        .reduce((acc, req) => {
          const existing = acc.find(item => item.Status === req.Status);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ Status: req.Status, count: 1 });
          }
          return acc;
        }, []);

      setHospitalStats({
        inventory,
        totalDonations,
        requests
      });
    } catch (error) {
      console.error('Error fetching hospital stats:', error);
    }
  };

  const handleHospitalClick = async (hospital) => {
    setSelectedHospital(hospital);
    await fetchHospitalStats(hospital.Hospital_ID);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blood-600 to-blood-500 bg-clip-text text-transparent">Hospitals</h1>
        <p className="text-gray-600 mt-2 font-medium">Naga City Hospital Network</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hospitals List */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Registered Hospitals ({hospitals.length})
            </h2>
            <div className="space-y-4">
              {hospitals.map(hospital => (
                <div
                  key={hospital.Hospital_ID}
                  onClick={() => handleHospitalClick(hospital)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedHospital?.Hospital_ID === hospital.Hospital_ID
                      ? 'border-blood-600 bg-blood-50'
                      : 'border-gray-200 hover:border-blood-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl text-life-red-500">
                          <MdLocalHospital />
                        </span>
                        <h3 className="text-lg font-bold text-gray-900">
                          {hospital.Hospital_Name}
                        </h3>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FaMapMarkerAlt className="text-gray-500" />
                          <span>{hospital.Address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaPhone className="text-gray-500" />
                          <span>{hospital.Contact}</span>
                        </div>
                        {hospital.Email && (
                          <div className="flex items-center space-x-2">
                            <FaEnvelope className="text-gray-500" />
                            <span>{hospital.Email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-blood-600 font-medium text-sm">
                      View Details →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Details */}
        <div className="lg:col-span-1">
          {selectedHospital ? (
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Hospital Statistics</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {selectedHospital.Hospital_Name}
                  </h3>
                </div>

                {hospitalStats ? (
                  <>
                    {/* Inventory */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Blood Inventory</h4>
                      {hospitalStats.inventory.length > 0 ? (
                        <div className="space-y-2">
                          {hospitalStats.inventory.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blood-100 text-blood-800">
                                {item.Blood_Type}
                              </span>
                              <span className="font-bold text-gray-900">{item.total} units</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No inventory data</p>
                      )}
                    </div>

                    {/* Donations */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Total Donations</h4>
                      <p className="text-3xl font-bold text-gray-900">
                        {hospitalStats.totalDonations}
                      </p>
                    </div>

                    {/* Requests */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Blood Requests</h4>
                      {hospitalStats.requests.length > 0 ? (
                        <div className="space-y-2">
                          {hospitalStats.requests.map((req, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 capitalize">{req.Status}</span>
                              <span className="font-semibold text-gray-900">{req.count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No requests</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood-600"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8">
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4 text-life-red-400">
                  <MdLocalHospital />
                </div>
                <p>Select a hospital to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
