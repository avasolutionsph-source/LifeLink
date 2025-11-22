import React, { useState, useEffect } from 'react';
import { mockTissues, mockHospitals } from '../data/lifelinkMockData';
import {
  FaDna,
  FaExclamationTriangle,
  FaStar,
  FaEye,
  FaHandHoldingMedical,
  FaBone,
  FaHeartbeat,
  FaCircle,
  FaDumbbell,
  FaRunning,
  FaSnowflake
} from 'react-icons/fa';

const Tissues = () => {
  const [tissues, setTissues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTissueType, setFilterTissueType] = useState('');
  const [filterStatus, setFilterStatus] = useState('Available');
  const [filterQuality, setFilterQuality] = useState('');

  useEffect(() => {
    fetchTissues();
    // eslint-disable-next-line
  }, [filterTissueType, filterStatus, filterQuality]);

  const fetchTissues = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let filteredTissues = [...mockTissues];

      if (filterTissueType) {
        filteredTissues = filteredTissues.filter(t => t.Tissue_Type === filterTissueType);
      }

      if (filterStatus) {
        filteredTissues = filteredTissues.filter(t => t.Status === filterStatus);
      }

      if (filterQuality) {
        filteredTissues = filteredTissues.filter(t => t.Quality_Grade === filterQuality);
      }

      setTissues(filteredTissues);
    } catch (error) {
      console.error('Error fetching tissues:', error);
    } finally {
      setLoading(false);
    }
  };

  const tissueTypes = ['Cornea', 'Skin Graft', 'Bone Graft', 'Heart Valve', 'Blood Vessel', 'Tendon', 'Cartilage'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Reserved':
        return 'bg-blue-100 text-blue-800';
      case 'Used':
        return 'bg-purple-100 text-purple-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Quarantine':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Excellent':
        return 'text-green-700 bg-green-50';
      case 'Good':
        return 'text-blue-700 bg-blue-50';
      case 'Fair':
        return 'text-yellow-700 bg-yellow-50';
      case 'Poor':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getTissueIcon = (type) => {
    const iconMap = {
      'Cornea': <FaEye className="text-blue-500" />,
      'Skin Graft': <FaHandHoldingMedical className="text-orange-500" />,
      'Bone Graft': <FaBone className="text-gray-600" />,
      'Heart Valve': <FaHeartbeat className="text-red-500" />,
      'Blood Vessel': <FaCircle className="text-red-600" />,
      'Tendon': <FaDumbbell className="text-purple-500" />,
      'Cartilage': <FaRunning className="text-teal-500" />
    };
    return iconMap[type] || <FaDna className="text-life-green-500" />;
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-life-green-600"></div>
      </div>
    );
  }

  // Statistics
  const availableCount = tissues.filter(t => t.Status === 'Available').length;
  const expiringSoonCount = tissues.filter(t => isExpiringSoon(t.Expiry_Date) && t.Status === 'Available').length;
  const excellentQuality = tissues.filter(t => t.Quality_Grade === 'Excellent').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-life-green-600 to-life-green-500 bg-clip-text text-transparent">
          Tissue Bank
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Manage tissue inventory and track storage conditions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Available Tissues</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-life-green-600 to-life-green-500 bg-clip-text text-transparent mt-2">
                {availableCount}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Ready for use</p>
            </div>
            <div className="text-5xl opacity-80 animate-float text-life-green-500">
              <FaDna />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Expiring Soon</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mt-2">
                {expiringSoonCount}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Within 90 days</p>
            </div>
            <div className="text-5xl opacity-80 animate-float text-orange-500" style={{animationDelay: '0.5s'}}>
              <FaExclamationTriangle />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Excellent Grade</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mt-2">
                {excellentQuality}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Highest quality</p>
            </div>
            <div className="text-5xl opacity-80 animate-float text-yellow-500" style={{animationDelay: '1s'}}>
              <FaStar />
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
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Tissue Type</label>
            <select
              value={filterTissueType}
              onChange={(e) => setFilterTissueType(e.target.value)}
              className="input-field"
            >
              <option value="">All Tissue Types</option>
              {tissueTypes.map(type => (
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
              <option value="Reserved">Reserved</option>
              <option value="Used">Used</option>
              <option value="Expired">Expired</option>
              <option value="Quarantine">Quarantine</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Quality Grade</label>
            <select
              value={filterQuality}
              onChange={(e) => setFilterQuality(e.target.value)}
              className="input-field"
            >
              <option value="">All Grades</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tissues List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Tissue Inventory ({tissues.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tissue Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Batch Number</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quality</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Storage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hospital</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {tissues.map((tissue) => {
                const expiringSoon = isExpiringSoon(tissue.Expiry_Date);
                return (
                  <tr
                    key={tissue.Tissue_ID}
                    className={`hover:bg-white/50 transition-colors duration-200 ${
                      expiringSoon && tissue.Status === 'Available' ? 'bg-orange-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-semibold">{tissue.Tissue_ID}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getTissueIcon(tissue.Tissue_Type)}</span>
                        <span className="font-semibold text-gray-900">{tissue.Tissue_Type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-gray-700">
                        {tissue.Batch_Number}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityColor(tissue.Quality_Grade)}`}>
                        {tissue.Quality_Grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{tissue.Storage_Location}</div>
                        <div className="text-gray-500">{tissue.Storage_Temperature_C}°C</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {new Date(tissue.Expiry_Date).toLocaleDateString()}
                        </div>
                        {expiringSoon && tissue.Status === 'Available' && (
                          <div className="text-xs text-orange-600 font-medium flex items-center gap-1">
                            <FaExclamationTriangle /> Expiring Soon
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{tissue.Hospital_Name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tissue.Status)}`}>
                        {tissue.Status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Guidelines */}
      <div className="glass-card p-6 bg-life-green-50/30">
        <div className="flex items-start space-x-3">
          <div className="text-2xl text-blue-400">
            <FaSnowflake />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Tissue Storage & Quality Control</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Storage Temperatures:</strong> Corneas (-80°C), Skin Grafts (-150°C), Bone/Heart Valves (-196°C)
              </p>
              <p>
                <strong>Quality Grades:</strong> All tissues undergo sterility testing and quality assessment before storage.
              </p>
              <p>
                <strong>Expiry Alerts:</strong> Tissues expiring within 90 days are flagged for priority allocation.
              </p>
              <p className="mt-2">
                <strong>Data Privacy Act of 2012 Compliance:</strong> All donor information is encrypted and protected per Philippine law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tissues;
