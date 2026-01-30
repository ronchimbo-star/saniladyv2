import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ServiceVisit {
  id: string;
  customer_id: string;
  subscription_id: string | null;
  scheduled_date: string;
  completed_date: string | null;
  status: string;
  notes: string | null;
  bin_count: number;
  customers: {
    company_name: string;
    address_line_1: string;
    city: string;
    postcode: string;
  };
}

export default function AdminServiceVisits() {
  const [serviceVisits, setServiceVisits] = useState<ServiceVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchServiceVisits();
  }, []);

  async function fetchServiceVisits() {
    try {
      const { data, error } = await supabase
        .from('service_visits')
        .select(`
          *,
          customers(company_name, address_line_1, city, postcode)
        `)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setServiceVisits(data || []);
    } catch (error) {
      console.error('Error fetching service visits:', error);
    } finally {
      setLoading(false);
    }
  }

  const getFilteredVisits = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return serviceVisits.filter(visit => {
      const matchesSearch =
        visit.customers.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.customers.postcode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;

      const visitDate = new Date(visit.scheduled_date);
      let matchesDate = true;

      if (dateFilter === 'today') {
        matchesDate = visitDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'upcoming') {
        matchesDate = visitDate >= today;
      } else if (dateFilter === 'past') {
        matchesDate = visitDate < today;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filteredVisits = getFilteredVisits();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    scheduled: serviceVisits.filter(v => v.status === 'scheduled').length,
    in_progress: serviceVisits.filter(v => v.status === 'in_progress').length,
    completed: serviceVisits.filter(v => v.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading service visits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Visits</h1>
              <p className="mt-2 text-gray-600">Schedule and manage service appointments</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white rounded-lg border border-gray-300 p-1 flex">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Calendar View
                </button>
              </div>
              <Link
                to="/admin/service-visits/new"
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Schedule Service
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{statusCounts.scheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{statusCounts.in_progress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{statusCounts.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer or postcode..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date Filter
              </label>
              <select
                id="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Service Visits ({filteredVisits.length})
              </h2>
            </div>

            {filteredVisits.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'No service visits found matching your filters.'
                  : 'No service visits scheduled yet.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bins
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(visit.scheduled_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(visit.scheduled_date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/admin/customers/${visit.customer_id}`}
                            className="text-sm font-medium text-pink-600 hover:text-pink-900"
                          >
                            {visit.customers.company_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{visit.customers.address_line_1}</div>
                          <div className="text-sm text-gray-500">
                            {visit.customers.city}, {visit.customers.postcode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{visit.bin_count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(visit.status)}`}>
                            {visit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            to={`/admin/service-visits/${visit.id}`}
                            className="text-pink-600 hover:text-pink-900"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/service-visits/${visit.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12 text-gray-500">
              Calendar view coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
