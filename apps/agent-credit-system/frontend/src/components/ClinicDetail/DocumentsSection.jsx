import React, { useState } from 'react';

/**
 * A component for managing clinic documents
 *
 * @param {Object} props
 * @param {Object} props.clinic - The clinic object
 * @param {Array} props.documents - The list of documents
 * @param {boolean} props.documentsTableExists - Whether the documents table exists
 * @param {string} props.documentsTableError - Error message if the documents table doesn't exist
 * @param {Function} props.onAddDocument - Function to call when adding a document
 * @param {Function} props.onUpdateDocument - Function to call when updating a document
 * @param {Function} props.onDeleteDocument - Function to call when deleting a document
 * @param {Function} props.onExtractDocuments - Function to call when extracting documents
 * @param {boolean} props.isSaving - Whether a save operation is in progress
 * @param {boolean} props.isExtracting - Whether document extraction is in progress
 * @param {Object} props.fieldDescriptions - Descriptions for tooltips
 */
const DocumentsSection = ({
  clinic,
  documents,
  documentsTableExists,
  documentsTableError,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  onExtractDocuments,
  isSaving,
  isExtracting,
  fieldDescriptions
}) => {
  const [newDocument, setNewDocument] = useState({ name: '', document: '' });
  const [editingDocument, setEditingDocument] = useState(null);
  const [showAddDocumentForm, setShowAddDocumentForm] = useState(false);

  // Tooltip component for field descriptions
  const Tooltip = ({ text }) => {
    return (
      <div className="group relative inline-block ml-2">
        <div className="cursor-help text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
          {text}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
        </div>
      </div>
    );
  };

  const handleNewDocumentChange = (e) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDocument = () => {
    onAddDocument(newDocument);
    setNewDocument({ name: '', document: '' });
  };

  const handleEditDocument = (document) => {
    setEditingDocument({ ...document });
  };

  const handleEditDocumentChange = (e) => {
    const { name, value } = e.target;
    setEditingDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateDocument = () => {
    onUpdateDocument(editingDocument);
    setEditingDocument(null);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Documents</h3>

      {!documentsTableExists ? (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
          <h4 className="font-medium mb-2">Documents Feature Not Available</h4>
          <p>The documents table does not exist in the database. Please run the database migration to enable this feature.</p>
          {documentsTableError && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
              <strong>Error:</strong> {documentsTableError}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Add New Document Form */}
          <div className="mb-6 p-4 border rounded bg-white">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Manage Documents</h4>
              <div className="flex space-x-2">
                <button
                  onClick={onExtractDocuments}
                  disabled={isExtracting}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center disabled:bg-purple-300"
                >
                  {isExtracting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Extracting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Extract Documents
                    </>
                  )}
                  <Tooltip text={fieldDescriptions.extractDocuments} />
                </button>
                <button
                  onClick={() => setShowAddDocumentForm(!showAddDocumentForm)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  {showAddDocumentForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Hide Form
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Document
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Conditionally render the form */}
            {showAddDocumentForm && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name
                  </label>
                  <select
                    name="name"
                    value={newDocument.name}
                    onChange={handleNewDocumentChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="" disabled>Select document type</option>
                    <option value="default">default</option>
                    <option value="timeslot.json">timeslot.json</option>
                    <option value="doctor.json">doctor.json</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Content
                  </label>
                  <textarea
                    name="document"
                    value={newDocument.document}
                    onChange={handleNewDocumentChange}
                    className="w-full p-2 border rounded"
                    rows="5"
                    placeholder="Enter document content"
                  ></textarea>
                </div>
                <button
                  onClick={handleAddDocument}
                  disabled={isSaving || !newDocument.name || !newDocument.document}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isSaving ? 'Adding...' : 'Add Document'}
                </button>
              </div>
            )}
          </div>

          {/* Document List */}
          <div className="space-y-4">
            <h4 className="text-md font-medium">Existing Documents</h4>

            {documents.length === 0 ? (
              <p className="text-gray-500">No documents found for this clinic.</p>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 border rounded bg-white">
                    {editingDocument && editingDocument.id === doc.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Document Name
                          </label>
                          <select
                            name="name"
                            value={editingDocument.name}
                            onChange={handleEditDocumentChange}
                            className="w-full p-2 border rounded"
                          >
                            <option value="" disabled>Select document type</option>
                            <option value="default">default</option>
                            <option value="timeslot.json">timeslot.json</option>
                            <option value="doctor.json">doctor.json</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Document Content
                          </label>
                          <textarea
                            name="document"
                            value={editingDocument.document}
                            onChange={handleEditDocumentChange}
                            className="w-full p-2 border rounded"
                            rows="5"
                          ></textarea>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdateDocument}
                            disabled={isSaving}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 text-sm"
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingDocument(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{doc.name}</h5>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditDocument(doc)}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteDocument(doc.id)}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{doc.document}</p>
                        <div className="mt-2 text-xs text-gray-400">
                          Last updated: {new Date(doc.updated_at).toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentsSection;
