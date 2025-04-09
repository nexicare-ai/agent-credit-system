import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { testingService } from '../../services/api';

/**
 * A component for testing the agent API
 *
 * @param {Object} props
 * @param {Object} props.clinic - The clinic object
 */
const ApiTestSection = ({ clinic }) => {
  // API Test section states
  const [sessionId, setSessionId] = useState(() => {
    const savedSessionId = localStorage.getItem('agent_test_session_id');
    return savedSessionId || `test_${uuidv4()}`;
  });
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const chatEndRef = useRef(null);

  // Save conversation states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [conversationName, setConversationName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Save session ID to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('agent_test_session_id', sessionId);
  }, [sessionId]);

  // Scroll to bottom of chat when history changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Load saved conversations when component mounts
  useEffect(() => {
    loadSavedConversations();
  }, [clinic.id]);

  // API Test section handlers
  const generateNewSessionId = () => {
    const newSessionId = `test_${uuidv4()}`;
    setSessionId(newSessionId);
    setChatHistory([]);
  };

  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  // Load saved conversations
  const loadSavedConversations = async () => {
    if (!clinic.id) return;

    setLoadingSaved(true);
    try {
      const result = await testingService.getSavedConversations(clinic.id);
      if (result.success) {
        setSavedConversations(result.conversations || []);
      } else {
        console.error('Failed to load saved conversations:', result.error);
      }
    } catch (error) {
      console.error('Error loading saved conversations:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  // Handle save conversation
  const handleSaveConversation = async (e) => {
    e.preventDefault();

    if (!conversationName.trim() || isSaving || chatHistory.length === 0) return;

    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const result = await testingService.saveConversation(
        clinic.id,
        sessionId,
        conversationName.trim(),
        chatHistory
      );

      if (result.success) {
        // Show success message with file path
        setSaveSuccess({
          message: 'Conversation saved successfully',
          filePath: result.file_path
        });

        // Close modal after a delay
        setTimeout(() => {
          setShowSaveModal(false);
          setConversationName('');
          setSaveSuccess(null);
        }, 3000);

        // Refresh saved conversations list
        await loadSavedConversations();
      } else {
        alert(`Failed to save conversation: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      alert(`Error saving conversation: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    if (!userMessage.trim() || isSubmitting) return;

    const message = userMessage.trim();
    setUserMessage('');
    setApiError(null);

    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);

    // Create conversation ID using session ID and clinic ID
    const conversationId = `${sessionId}_${clinic.id}::${clinic.contact_number}`;

    try {
      setIsSubmitting(true);

      const requestData = {
        conversation_id: conversationId,
        clid: clinic.id,
        clinic_name: clinic.name,
        question: message,
        version: clinic.concierge_version || 'v2'
      };

      const data = await testingService.testAgentPrediction(requestData);

      if (data.success) {
        // Add agent response to chat history
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setApiError(data.error || 'Failed to get response from agent');
        // Add error message to chat history
        setChatHistory(prev => [...prev, {
          role: 'system',
          content: `Error: ${data.error || 'Failed to get response from agent'}`
        }]);
      }
    } catch (err) {
      console.error('Error calling agent API:', err);
      setApiError(err.message || 'Failed to call agent API');
      // Add error message to chat history
      setChatHistory(prev => [...prev, {
        role: 'system',
        content: `Error: ${err.message || 'Failed to call agent API'}`
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Test Agent API</h3>

      <div className="bg-white p-4 border rounded">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Session ID
            </label>
            <div className="flex space-x-2">
              <button
                onClick={generateNewSessionId}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generate New Session
              </button>
            </div>
          </div>
          <div className="flex">
            <input
              type="text"
              value={sessionId}
              readOnly
              className="w-full p-2 border rounded bg-gray-50 text-gray-700 text-sm font-mono"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            This session ID will be used to track the conversation with the agent API.
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Conversation
            </label>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500">
                Using clinic: <span className="font-medium">{clinic.id}</span>
              </div>
              {chatHistory.length > 0 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Conversation
                </button>
              )}
            </div>
          </div>

          <div className="border rounded h-64 overflow-y-auto p-3 bg-gray-50 mb-3">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <p>No messages yet. Start a conversation with the agent.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-blue-100 ml-auto'
                        : message.role === 'assistant'
                          ? 'bg-gray-100'
                          : 'bg-red-100 text-red-700 mx-auto'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Agent' : 'System'}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitMessage} className="flex space-x-2">
            <input
              type="text"
              value={userMessage}
              onChange={handleUserMessageChange}
              placeholder="Type your message here..."
              className="flex-grow p-2 border rounded"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !userMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
          </form>
        </div>

        {/* Saved Conversations Section */}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Saved Conversations</h4>
            <button
              onClick={loadSavedConversations}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
              disabled={loadingSaved}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 mr-1 ${loadingSaved ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto">
            {loadingSaved ? (
              <div className="text-center py-4 text-sm text-gray-500">
                Loading saved conversations...
              </div>
            ) : savedConversations.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No saved conversations yet.
              </div>
            ) : (
              <ul className="divide-y">
                {savedConversations.map((conv) => (
                  <li key={conv.id} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{conv.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(conv.created_at).toLocaleString()} • {conv.message_count} messages
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // Load this conversation
                          setSessionId(conv.session_id);
                          setChatHistory(conv.chat_history);
                        }}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Load
                      </button>
                      {conv.url && (
                        <a
                          href={conv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <div className="font-medium mb-1">API Request Format:</div>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
{`POST /api/testing/agent/prediction
{
    "conversation_id": "${sessionId}_${clinic.id}::${clinic.contact_number}",
    "clid": "${clinic.id}",
    "clinic_name": "${clinic.name}",
    "question": "Your message here",
    "version": "${clinic.concierge_version || 'v2'}"
}`}
          </pre>
        </div>
      </div>

      {/* Save Conversation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Conversation</h3>

            {saveSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-4">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">{saveSuccess.message}</span>
                </div>
                <div className="text-sm">
                  <p>File saved to: <span className="font-mono">{saveSuccess.filePath}</span></p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveConversation}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conversation Name
                  </label>
                  <input
                    type="text"
                    value={conversationName}
                    onChange={(e) => setConversationName(e.target.value)}
                    placeholder="Enter a name for this conversation"
                    className="w-full p-2 border rounded"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The conversation will be saved to Google Cloud Storage at:
                    <span className="font-mono block mt-1">nexi_test_conversations/{clinic.id}/{conversationName || 'your_conversation_name'}</span>
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSaveModal(false);
                      setConversationName('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !conversationName.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestSection;
