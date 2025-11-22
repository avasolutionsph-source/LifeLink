import React, { useState, useEffect } from 'react';
import { mockOrgans, mockHospitals } from '../data/lifelinkMockData';
import {
  FaLungs,
  FaCheckCircle,
  FaClock,
  FaHeartbeat,
  FaCircle,
  FaKidney,
  FaPrescriptionBottleAlt,
  FaInfoCircle,
  FaEye
} from 'react-icons/fa';
import { GiLiver, GiStomach } from 'react-icons/gi';

const Organs = () => {
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOrganType, setFilterOrganType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');

  useEffect(() => {
    fetchOrgans();
    // eslint-disable-next-line
  }, [filterOrganType, filterStatus, filterBloodType]);

  const fetchOrgans = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let filteredOrgans = [...mockOrgans];

      if (filterOrganType) {
        filteredOrgans = filteredOrgans.filter(o => o.Organ_Type === filterOrganType);
      }

      if (filterStatus) {
        filteredOrgans = filteredOrgans.filter(o => o.Organ_Status === filterStatus);
      }

      if (filterBloodType) {
        filteredOrgans = filteredOrgans.filter(o => o.Blood_Type === filterBloodType);
      }

      setOrgans(filteredOrgans);
    } catch (error) {
      console.error('Error fetching organs:', error);
    } finally {
      setLoading(false);
    }
  };

  const organTypes = ['Heart', 'Liver', 'Kidney', 'Lung', 'Pancreas', 'Small Intestine', 'Cornea'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Matched':
        return 'bg-blue-100 text-blue-800';
      case 'Transplanted':
        return 'bg-purple-100 text-purple-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Unsuitable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrganIcon = (type) => {
    const iconMap = {
      'Heart': <FaHeartbeat className="text-red-500" />,
      'Liver': <GiLiver className="text-brown-600" />,
      'Kidney': <FaKidney className="text-purple-600" />,
      'Lung': <FaLungs className="text-blue-500" />,
      'Pancreas': <FaPrescriptionBottleAlt className="text-orange-500" />,
      'Small Intestine': <GiStomach className="text-yellow-600" />,
      'Cornea': <FaEye className="text-blue-400" />
    };
    return iconMap[type] || <FaCircle className="text-gray-500" />;
  };

  const getViabilityStatus = (viableUntil) => {
    const now = new Date();
    const viable = new Date(viableUntil);
    const hoursRemaining = Math.ceil((viable - now) / (1000 * 60 * 60));

    if (hoursRemaining < 0) return { text: 'Expired', color: 'text-red-600' };
    if (hoursRemaining < 6) return { text: `${hoursRemaining}h remaining`, color: 'text-red-600' };
    if (hoursRemaining < 12) return { text: `${hoursRemaining}h remaining`, color: 'text-orange-600' };
    return { text: `${hoursRemaining}h remaining`, color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-life-blue-600"></div>
      </div>
    );
  }

  // Statistics
  const availableCount = organs.filter(o => o.Organ_Status === 'Available').length;
  const matchedCount = organs.filter(o => o.Organ_Status === 'Matched').length;
  const criticalViability = organs.filter(o => {
    const viable = new Date(o.Viable_Until);
    const hours = Math.ceil((viable - new Date()) / (1000 * 60 * 60));
    return hours > 0 && hours < 6;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-life-blue-600 to-life-blue-500 bg-clip-text text-transparent">
          Organ Registry
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Track donated organs and manage transplant matching</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Available Organs</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-life-blue-600 to-life-blue-500 bg-clip-text text-transparent mt-2">
                {availableCount}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Ready for matching</p>
            </div>
            <div className="text-5xl opacity-80 animate-float text-life-blue-500">
              <FaLungs />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Matched</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mt-2">
                {matchedCount}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Awaiting transplant</p>
            </div>
            <div className="text-5xl opacity-80 animate-float text-green-500" style={{animationDelay: '0.5s'}}>
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Critical Time</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mt-2">
                {criticalViability}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Less than 6 hours</p>
            </div>
            <div className="text-5xl opacity-80 animate-float text-red-500" style={{animationDelay: '1s'}}>
              <FaClock />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Organ Type</label>
            <select
              value={filterOrganType}
              onChange={(e) => setFilterOrganType(e.target.value)}
              className="input-field"
            >
              <option value="">All Organ Types</option>
              {organTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Matched">Matched</option>
              <option value="Transplanted">Transplanted</option>
              <option value="Expired">Expired</option>
              <option value="Unsuitable">Unsuitable</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Blood Type</label>
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

      {/* Organs List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Organ Registry ({organs.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Organ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Donor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Match Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Viability</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hospital</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {organs.map((organ) => {
                const viability = getViabilityStatus(organ.Viable_Until);
                return (
                  <tr key={organ.Organ_ID} className="hover:bg-white/50 transition-colors duration-200">
                    <td className="px-4 py-3 text-sm font-semibold">{organ.Organ_ID}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getOrganIcon(organ.Organ_Type)}</span>
                        <span className="font-semibold text-gray-900">{organ.Organ_Type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{organ.Donor_Name}</div>
                      <div className="text-sm text-gray-500">Age: {organ.Donor_Age}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-life-red-100 text-life-red-800">
                        {organ.Blood_Type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              organ.Match_Score >= 90 ? 'bg-green-500' :
                              organ.Match_Score >= 80 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${organ.Match_Score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{organ.Match_Score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${viability.color}`}>
                        {viability.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{organ.Hospital_Name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(organ.Organ_Status)}`}>
                        {organ.Organ_Status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Assessment Note */}
      <div className="glass-card p-6 bg-life-blue-50/30">
        <div className="flex items-start space-x-3">
          <div className="text-2xl text-life-blue-600">
            <FaInfoCircle />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">HLA Compatibility & Matching</h3>
            <p className="text-sm text-gray-700">
              All organs are typed for Human Leukocyte Antigen (HLA) compatibility. Match scores above 90% indicate excellent compatibility.
              Critical viability organs (less than 6 hours) require immediate allocation to prevent wastage.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>RA 7170 (Organ Donation Act of the Philippines)</strong> - All donations comply with Philippine organ donation regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organs;
