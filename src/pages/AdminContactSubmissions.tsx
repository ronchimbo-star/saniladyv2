import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

interface ContactSubmission {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  service_type: string | null;
  status: string;
  viewed_by_admin: boolean;
  archived: boolean;
  archived_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminContactSubmissions() {
  const { user, isAdmin: userIsAdmin } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [viewArchived, setViewArchived] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!userIsAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchSubmissions();
  }, [user, userIsAdmin, navigate]);

  useEffect(() => {
    if (user && userIsAdmin) {
      fetchSubmissions();
    }
  }, [viewArchived]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('archived', viewArchived)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);

      const unviewed = (data || []).filter(s => !s.viewed_by_admin && !s.archived).length;
      setUnviewedCount(unviewed);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (submissionId: string) => {
    try {
      await supabase
        .from('contact_submissions')
        .update({ viewed_by_admin: true })
        .eq('id', submissionId);

      fetchSubmissions();
    } catch (error) {
      console.error('Error marking submission as viewed:', error);
    }
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.admin_notes || '');
    setSubmissionStatus(submission.status || 'pending');
    if (!submission.viewed_by_admin) {
      markAsViewed(submission.id);
    }
  };

  const handleUpdateSubmission = async () => {
    if (!selectedSubmission) return;

    try {
      await supabase
        .from('contact_submissions')
        .update({
          admin_notes: adminNotes,
          status: submissionStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedSubmission.id);

      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const handleArchiveSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to archive this contact submission?')) return;

    try {
      await supabase
        .from('contact_submissions')
        .update({
          archived: true,
          archived_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      fetchSubmissions();
    } catch (error) {
      console.error('Error archiving submission:', error);
    }
  };

  const handleUnarchiveSubmission = async (submissionId: string) => {
    try {
      await supabase
        .from('contact_submissions')
        .update({
          archived: false,
          archived_at: null,
        })
        .eq('id', submissionId);

      fetchSubmissions();
    } catch (error) {
      console.error('Error unarchiving submission:', error);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to permanently delete this contact submission? This action cannot be undone.')) return;

    try {
      await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', submissionId);

      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  if (!userIsAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/sanilady-favicon-v2.png" alt="SaniLady" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-800">SaniLady</span>
          </div>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📋</span>
              <span>Quote Requests</span>
            </Link>
            <a href="#" className="flex items-center justify-between px-4 py-3 bg-pink-50 text-pink-600 rounded-lg font-medium">
              <div className="flex items-center space-x-3">
                <span>💬</span>
                <span>Contact Messages</span>
              </div>
              {unviewedCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {unviewedCount}
                </span>
              )}
            </a>
            <Link to="/admin/customers" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>👥</span>
              <span>Customers</span>
            </Link>
            <Link to="/admin/subscriptions" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>🔄</span>
              <span>Subscriptions</span>
            </Link>
            <Link to="/admin/service-visits" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📅</span>
              <span>Service Visits</span>
            </Link>
            <Link to="/admin/waste-transfer-notes" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📝</span>
              <span>Waste Transfer Notes</span>
            </Link>
            <Link to="/admin/news" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📰</span>
              <span>News Articles</span>
            </Link>
            <Link to="/admin/testimonials" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>💭</span>
              <span>Testimonials</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>⚙️</span>
              <span>Site Settings</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Messages</h1>
          <p className="text-gray-600">Manage and respond to customer contact submissions</p>
        </div>

        {unviewedCount > 0 && !viewArchived && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  You have {unviewedCount} new contact message{unviewedCount !== 1 ? 's' : ''} waiting for review
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setViewArchived(false)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !viewArchived
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Active Messages
          </button>
          <button
            onClick={() => setViewArchived(true)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewArchived
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Archived Messages
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">{viewArchived ? '📦' : '💬'}</div>
            <p className="text-gray-600">
              {viewArchived ? 'No archived contact messages' : 'No contact messages yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className={!submission.viewed_by_admin ? 'bg-pink-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : submission.status === 'responded'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {submission.status || 'pending'}
                      </span>
                      {!submission.viewed_by_admin && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.name}
                      </div>
                      <div className="text-sm text-gray-500">{submission.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {submission.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {submission.subject || 'No subject'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewSubmission(submission)}
                          className="text-pink-600 hover:text-pink-900"
                        >
                          View
                        </button>
                        {!viewArchived ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveSubmission(submission.id);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Archive
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnarchiveSubmission(submission.id);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Restore
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubmission(submission.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Contact Message Details</h2>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-lg mb-3 text-pink-600">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedSubmission.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedSubmission.email}</p>
                      </div>
                      {selectedSubmission.phone && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{selectedSubmission.phone}</p>
                        </div>
                      )}
                      {selectedSubmission.company && (
                        <div>
                          <p className="text-sm text-gray-600">Company</p>
                          <p className="font-medium">{selectedSubmission.company}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-lg mb-3 text-pink-600">Message Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium capitalize">{selectedSubmission.type}</p>
                      </div>
                      {selectedSubmission.subject && (
                        <div>
                          <p className="text-sm text-gray-600">Subject</p>
                          <p className="font-medium">{selectedSubmission.subject}</p>
                        </div>
                      )}
                      {selectedSubmission.service_type && (
                        <div>
                          <p className="text-sm text-gray-600">Service Type</p>
                          <p className="font-medium capitalize">{selectedSubmission.service_type}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Message</p>
                        <p className="font-medium whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                          {selectedSubmission.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={submissionStatus}
                      onChange={(e) => setSubmissionStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="responded">Responded</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="Add notes about this contact submission..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleUpdateSubmission}
                      className="flex-1 bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white py-3 rounded-lg font-semibold hover:shadow-lg"
                    >
                      Update Message
                    </button>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
