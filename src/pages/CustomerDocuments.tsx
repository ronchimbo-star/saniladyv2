import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface WasteTransferNote {
  id: string;
  reference_number: string;
  issue_date: string;
  collection_address: string;
  waste_classification: string;
  waste_quantity: string;
  document_path: string | null;
  created_at: string;
}

interface Document {
  id: string;
  document_type: string;
  document_path: string;
  reference_number: string;
  issue_date: string;
  created_at: string;
}

export default function CustomerDocuments() {
  const { user } = useAuth();
  const [wasteTransferNotes, setWasteTransferNotes] = useState<WasteTransferNote[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  async function fetchDocuments() {
    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (customerError) throw customerError;

      if (customerData) {
        const [wtnRes, docsRes] = await Promise.all([
          supabase
            .from('waste_transfer_notes')
            .select('*')
            .eq('customer_id', customerData.id)
            .order('issue_date', { ascending: false }),
          supabase
            .from('documents')
            .select('*')
            .eq('customer_id', customerData.id)
            .order('issue_date', { ascending: false }),
        ]);

        if (wtnRes.error) throw wtnRes.error;
        if (docsRes.error) throw docsRes.error;

        setWasteTransferNotes(wtnRes.data || []);
        setDocuments(docsRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'Invoice';
      case 'receipt':
        return 'Receipt';
      case 'waste_carrier_note':
        return 'Waste Transfer Note';
      case 'certificate':
        return 'Certificate';
      default:
        return 'Document';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
      case 'receipt':
        return '💳';
      case 'waste_carrier_note':
        return '♻️';
      case 'certificate':
        return '📜';
      default:
        return '📄';
    }
  };

  const getClassificationLabel = (classification: string) => {
    switch (classification) {
      case 'sanitary_waste':
        return 'Sanitary Waste';
      case 'general_waste':
        return 'General Waste';
      case 'recyclable':
        return 'Recyclable';
      case 'hazardous':
        return 'Hazardous';
      case 'clinical':
        return 'Clinical';
      default:
        return classification;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading documents...</p>
        </div>
      </div>
    );
  }

  const totalDocuments = wasteTransferNotes.length + documents.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/dashboard" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Document Center</h1>
          <p className="text-gray-600 mt-2">Access and download all your service documents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Documents</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{totalDocuments}</p>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Waste Transfer Notes</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{wasteTransferNotes.length}</p>
              </div>
              <div className="text-4xl">♻️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Other Documents</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{documents.length}</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </div>
        </div>

        {totalDocuments === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Documents Yet</h2>
            <p className="text-gray-600">
              Your service documents will appear here once they are generated.
            </p>
          </div>
        ) : (
          <>
            {wasteTransferNotes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Waste Transfer Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wasteTransferNotes.map((wtn) => (
                    <div key={wtn.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl">♻️</div>
                          <span className="text-xs font-medium text-gray-500">
                            {new Date(wtn.issue_date).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">{wtn.reference_number}</h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>
                            <span className="font-medium">Type:</span> {getClassificationLabel(wtn.waste_classification)}
                          </p>
                          <p>
                            <span className="font-medium">Quantity:</span> {wtn.waste_quantity}
                          </p>
                          <p className="text-xs truncate">
                            <span className="font-medium">Location:</span> {wtn.collection_address}
                          </p>
                        </div>
                        <button
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          onClick={() => alert('PDF download will be implemented next')}
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Other Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl">{getDocumentTypeIcon(doc.document_type)}</div>
                          <span className="text-xs font-medium text-gray-500">
                            {new Date(doc.issue_date).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">{doc.reference_number}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          <span className="font-medium">Type:</span> {getDocumentTypeLabel(doc.document_type)}
                        </p>
                        <button
                          className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                          onClick={() => alert('PDF download will be implemented next')}
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Your Documents</h3>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Waste transfer notes are generated after each service visit</li>
            <li>All documents are stored securely and available for download at any time</li>
            <li>We recommend keeping copies for your compliance records</li>
            <li>Documents are retained for the legally required period</li>
            <li>If you need a specific document, please contact support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
