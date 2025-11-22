import React, { useState, useEffect } from 'react';
import { mockRecipients, mockHospitals } from '../data/lifelinkMockData';

const Recipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOrganType, setFilterOrganType] = useState('');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [filterUrgency, setFilterUrgency] = useState('');

  useEffect(() => {
    fetchRecipients();
    // eslint-disable-next-line
  }, [filterOrganType, filterStatus, filterUrgency]);

  const fetchRecipients = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let filteredRecipients = [...mockRecipients];

      if (filterOrganType) {
        filteredRecipients = filteredRecipients.filter(r => r.Needed_Organ_Type === filterOrganType);
      }

      if (filterStatus) {
        filteredRecipients = filteredRecipients.filter(r => r.Waitlist_Status === filterStatus);
      }

      if (filterUrgency) {
        filteredRecipients = filteredRecipients.filter(r => r.Medical_Urgency === filterUrgency);
      }

      // Sort by priority (highest first)
      filteredRecipients.sort((a, b) => b.Priority_Points - a.Priority_Points);

      setRecipients(filteredRecipients);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  const organTypes = ['Heart', 'Liver', 'Kidney', 'Lung', 'Pancreas', 'Small Intestine', 'Cornea'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Matched':
        return 'bg-green-100 text-green-800';
      case 'Transplanted':
        return 'bg-purple-100 text-purple-800';
      case 'Removed':
        return 'bg-gray-100 text-gray-800';
      case 'Deceased':
        return 'bg-red-100 text-red-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Life-Threatening':
        return 'bg-red-600 text-white';
      case 'Critical':
        return 'bg-orange-600 text-white';
      case 'Urgent':
        return 'bg-yellow-600 text-white';
      case 'Routine':
        return 'bg-blue-600 text-white';
      case 'Elective':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getPriorityLevel = (points) => {
    if (points >= 1000) return { label: 'Critical', color: 'text-red-600' };
    if (points >= 800) return { label: 'High', color: 'text-orange-600' };
    if (points >= 600) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-life-blue-600"></div>
      </div>
    );
  }

  // Statistics
  const activeCount = recipients.filter(r => r.Waitlist_Status === 'Active').length;
  const matchedCount = recipients.filter(r => r.Waitlist_Status === 'Matched').length;
  const criticalCount = recipients.filter(r => r.Medical_Urgency === 'Life-Threatening' || r.Medical_Urgency === 'Critical').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-life-blue-600 to-life-green-600 bg-clip-text text-transparent">
          Recipient Waitlist
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Manage organ recipient priority queue and matching</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Active on Waitlist</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-life-blue-600 to-life-blue-500 bg-clip-text text-transparent mt-2">
                {activeCount}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Awaiting match</p>
            </div>
            <div className="text-5xl opacity-80 animate-float">⏱️</div>
          </div>
        </div>

        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Matched</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mt-2">
                {matchedCount}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Ready for surgery</p>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '0.5s'}}>✅</div>
          </div>
        </div>

        <div className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Critical Status</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mt-2">
                {criticalCount}
              </p>
              <p className="text-sm text-gray-600 font-semibold mt-2">Life-threatening</p>
            </div>
            <div className="text-5xl opacity-80 animate-float" style={{animationDelay: '1s'}}>🚨</div>
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
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Needed Organ</label>
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
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Waitlist Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Matched">Matched</option>
              <option value="Transplanted">Transplanted</option>
              <option value="Removed">Removed</option>
              <option value="Deceased">Deceased</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">Medical Urgency</label>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="input-field"
            >
              <option value="">All Urgency Levels</option>
              <option value="Life-Threatening">Life-Threatening</option>
              <option value="Critical">Critical</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
              <option value="Elective">Elective</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recipients List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
          Recipient Priority Queue ({recipients.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Needed Organ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Urgency</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Wait Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hospital</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {recipients.map((recipient, index) => {
                const priority = getPriorityLevel(recipient.Priority_Points);
                return (
                  <tr
                    key={recipient.Recipient_ID}
                    className={`hover:bg-white/50 transition-colors duration-200 ${
                      recipient.Medical_Urgency === 'Life-Threatening' ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-700">#{index + 1}</span>
                        <span className={`text-xs font-semibold ${priority.color}`}>{priority.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">
                        {recipient.First_Name} {recipient.Last_Name}
                      </div>
                      <div className="text-sm text-gray-500">{recipient.Contact_Number}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{recipient.Needed_Organ_Type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-life-red-100 text-life-red-800">
                        {recipient.Blood_Type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-lg ${getUrgencyColor(recipient.Medical_Urgency)}`}>
                        {recipient.Medical_Urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">{recipient.Wait_Time_Days} days</div>
                        <div className="text-xs text-gray-500">
                          Since {new Date(recipient.Waitlist_Entry_Date).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div
                            className={`h-2 rounded-full ${
                              recipient.Priority_Points >= 1000 ? 'bg-red-500' :
                              recipient.Priority_Points >= 800 ? 'bg-orange-500' :
                              recipient.Priority_Points >= 600 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, (recipient.Priority_Points / 1200) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">{recipient.Priority_Points}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{recipient.Hospital_Name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(recipient.Waitlist_Status)}`}>
                        {recipient.Waitlist_Status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority Scoring Info */}
      <div className="glass-card p-6 bg-life-blue-50/30">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">📊</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Priority Scoring System</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Priority Points Calculation:</strong> Based on medical urgency (0-50 pts), wait time (0-30 pts),
                compatibility factors (0-20 pts), and clinical severity scores.
              </p>
              <p>
                <strong>Life-Threatening Cases:</strong> Automatically receive highest priority (1000+ points) and are matched urgently.
              </p>
              <p>
                <strong>Fair Allocation:</strong> System ensures equitable organ distribution following Philippine DOH guidelines
                and international best practices.
              </p>
              <p className="mt-2">
                <strong>RA 7170 Compliance:</strong> All allocations follow the Organ Donation Act of the Philippines for ethical transplantation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipients;
