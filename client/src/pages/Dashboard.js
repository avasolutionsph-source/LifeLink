import React, { useState, useEffect } from 'react';
import { getLifeLinkStats } from '../data/lifelinkMockData';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    donors: { total: 0, eligible: 0, organDonors: 0 },
    blood: { totalUnits: 0, expiringSoon: 0, lowStock: 0 },
    organs: { available: 0, matched: 0, critical: 0 },
    tissues: { available: 0, expiringSoon: 0, excellentGrade: 0 },
    recipients: { active: 0, matched: 0, critical: 0 },
    requests: { pending: 0, critical: 0 },
    donations: { total: 0, thisMonth: 0 }
  });
  const [inventoryByType, setInventoryByType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const lifelinkStats = getLifeLinkStats();
      setStats(lifelinkStats);
      setInventoryByType(lifelinkStats.inventoryByType || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getBloodTypeQuantity = (type) => {
    const found = inventoryByType.find(item => item.Blood_Type === type);
    return found ? found.total : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-life-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-life-red-600 via-life-blue-600 to-life-green-600 bg-clip-text text-transparent">
          LifeLink Dashboard
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Life-saving donation network overview • Blood • Organs • Tissues</p>
      </div>

      {/* Primary Statistics - Donation Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/blood" className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Blood Inventory</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-life-red-600 to-life-red-500 bg-clip-text text-transparent mt-2">
                {stats.blood.totalUnits}
              </p>
              <div className="flex gap-3 mt-3">
                <p className="text-xs text-orange-600 font-semibold">⚠ {stats.blood.expiringSoon} expiring</p>
                <p className="text-xs text-red-600 font-semibold">🚨 {stats.blood.lowStock} low stock</p>
              </div>
            </div>
            <div className="text-5xl opacity-80 animate-float">🩸</div>
          </div>
        </Link>

        <Link to="/organs" className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in cursor-pointer" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Organ Registry</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-life-blue-600 to-life-blue-500 bg-clip-text text-transparent mt-2">
                {stats.organs.available}
              </p>
              <div className="flex gap-3 mt-3">
                <p className="text-xs text-green-600 font-semibold">✓ {stats.organs.matched} matched</p>
                <p className="text-xs text-red-600 font-semibold">⏰ {stats.organs.critical} critical time</p>
              </div>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '0.5s'}}>🫁</div>
          </div>
        </Link>

        <Link to="/tissues" className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in cursor-pointer" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Tissue Bank</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-life-green-600 to-life-green-500 bg-clip-text text-transparent mt-2">
                {stats.tissues.available}
              </p>
              <div className="flex gap-3 mt-3">
                <p className="text-xs text-blue-600 font-semibold">⭐ {stats.tissues.excellentGrade} excellent</p>
                <p className="text-xs text-orange-600 font-semibold">📅 {stats.tissues.expiringSoon} expiring</p>
              </div>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '1s'}}>🧬</div>
          </div>
        </Link>
      </div>

      {/* Secondary Statistics - System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/donors" className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in cursor-pointer" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Donors</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-2">{stats.donors.total}</p>
              <p className="text-sm text-green-600 font-semibold mt-2">✓ {stats.donors.eligible} eligible</p>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '1.5s'}}>👥</div>
          </div>
        </Link>

        <Link to="/recipients" className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in cursor-pointer" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Recipients</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mt-2">{stats.recipients.active}</p>
              <p className="text-sm text-red-600 font-semibold mt-2">🚨 {stats.recipients.critical} critical</p>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '2s'}}>⏱️</div>
          </div>
        </Link>

        <Link to="/requests" className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in cursor-pointer" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Pending</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent mt-2">{stats.requests.pending}</p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Awaiting approval</p>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '2.5s'}}>📝</div>
          </div>
        </Link>

        <Link to="/donations" className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in cursor-pointer" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Donations</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mt-2">{stats.donations.total}</p>
              <p className="text-sm text-gray-600 font-semibold mt-2">{stats.donations.thisMonth} this month</p>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '3s'}}>📋</div>
          </div>
        </Link>
      </div>

      {/* Blood Type Inventory */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Blood Inventory by Type</h2>
          <Link to="/blood" className="text-sm font-semibold text-life-red-600 hover:text-life-red-700 transition-colors">
            View Details →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bloodTypes.map((type, index) => {
            const quantity = getBloodTypeQuantity(type);
            return (
              <div
                key={type}
                className={`p-6 rounded-2xl text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-in ${
                  quantity > 10 ? 'bg-green-100/60 border-2 border-green-400/50 hover:border-green-500' :
                  quantity > 5 ? 'bg-yellow-100/60 border-2 border-yellow-400/50 hover:border-yellow-500' :
                  quantity > 0 ? 'bg-orange-100/60 border-2 border-orange-400/50 hover:border-orange-500' :
                  'bg-red-100/60 border-2 border-red-400/50 hover:border-red-500'
                }`}
                style={{animationDelay: `${0.7 + index * 0.05}s`}}
              >
                <div className="text-2xl font-bold text-gray-800">{type}</div>
                <div className="text-4xl font-bold mt-2 text-gray-900">{quantity}</div>
                <div className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wide">units</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            to="/donors"
            className="group p-5 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border-2 border-gray-200/50 hover:border-life-red-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">👥</div>
            <h3 className="font-bold text-gray-800 text-sm">Register Donor</h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">Add new donor</p>
          </Link>

          <Link
            to="/blood"
            className="group p-5 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border-2 border-gray-200/50 hover:border-life-red-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🩸</div>
            <h3 className="font-bold text-gray-800 text-sm">Blood Inventory</h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">Manage blood units</p>
          </Link>

          <Link
            to="/organs"
            className="group p-5 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border-2 border-gray-200/50 hover:border-life-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🫁</div>
            <h3 className="font-bold text-gray-800 text-sm">Organ Registry</h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">View organs</p>
          </Link>

          <Link
            to="/tissues"
            className="group p-5 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border-2 border-gray-200/50 hover:border-life-green-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🧬</div>
            <h3 className="font-bold text-gray-800 text-sm">Tissue Bank</h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">Browse tissues</p>
          </Link>

          <Link
            to="/recipients"
            className="group p-5 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border-2 border-gray-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">⏱️</div>
            <h3 className="font-bold text-gray-800 text-sm">Waitlist</h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">View recipients</p>
          </Link>

          <Link
            to="/requests"
            className="group p-5 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border-2 border-gray-200/50 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">📝</div>
            <h3 className="font-bold text-gray-800 text-sm">New Request</h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">Submit request</p>
          </Link>
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card p-6 bg-gradient-to-br from-life-blue-50/30 to-life-green-50/30">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🫀</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">LifeLink Network Status</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Coverage:</strong> {stats.blood.totalUnits} blood units, {stats.organs.available} organs, {stats.tissues.available} tissues available across Naga City hospitals
              </p>
              <p>
                <strong>Active Donors:</strong> {stats.donors.total} registered donors ({stats.donors.organDonors} organ donors, {stats.donors.eligible} eligible for blood)
              </p>
              <p>
                <strong>Waitlist:</strong> {stats.recipients.active} recipients active ({stats.recipients.critical} critical status, {stats.recipients.matched} matched)
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Compliant with RA 7719 (Blood Services Act), RA 7170 (Organ Donation Act), and Data Privacy Act of 2012
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
