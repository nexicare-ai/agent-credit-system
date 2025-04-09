import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { clinicService } from '../services/api';
import SearchBar from '../components/SearchBar';
import ConversationList from '../components/ConversationList';
import ConversationDetail from '../components/ConversationDetail';
import Pagination from '../components/Pagination';

const Conversations = () => {
  const { clinicId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [sendToClinicMessage, setSendToClinicMessage] = useState('');
  const [showSendToClinicModal, setShowSendToClinicModal] = useState(false);
  const [sendingToClinic, setSendingToClinic] = useState(false);
  const [clinicName, setClinicName] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  
  // Refresh state
  const [showConversationsRefresh, setShowConversationsRefresh] = useState(false);
  const [showMessagesRefresh, setShowMessagesRefresh] = useState(false);
  const [lastConversationsRefresh, setLastConversationsRefresh] = useState(Date.now());
  const [lastMessagesRefresh, setLastMessagesRefresh] = useState(Date.now());
  
  // Refresh timers
  const conversationsRefreshTimerRef = useRef(null);
  const messagesRefreshTimerRef = useRef(null);
  
  // Get page from URL or default to 1
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const conversationId = searchParams.get('conversation') || '';
  
  const [pagination, setPagination] = useState({
    page: page,
    totalPages: 1,
  });

  // Add formatted time strings for the refresh buttons
  const [lastConversationsRefreshTime, setLastConversationsRefreshTime] = useState('');
  const [lastMessagesRefreshTime, setLastMessagesRefreshTime] = useState('');
    
  // Update the refresh time strings whenever the timestamps change
  useEffect(() => {
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    setLastConversationsRefreshTime(formatTime(lastConversationsRefresh));
    setLastMessagesRefreshTime(formatTime(lastMessagesRefresh));
  }, [lastConversationsRefresh, lastMessagesRefresh]);
  
  // Update pagination state when URL params change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: page
    }));
  }, [page]);

  // Fetch clinic details to get the name
  useEffect(() => {
    if (clinicId) {
      const fetchClinicDetails = async () => {
        try {
          const data = await clinicService.getClinicDetails(clinicId);
          setClinicName(data.clinic.name || '');
        } catch (err) {
          console.error(`Error fetching clinic details: ${err}`);
        }
      };
      
      fetchClinicDetails();
    }
  }, [clinicId]);

  // Set up refresh button timers
  useEffect(() => {
    // Function to check if refresh button should be shown (after 30 seconds)
    const checkConversationsRefreshTime = () => {
      if (Date.now() - lastConversationsRefresh >= 30000) {
        setShowConversationsRefresh(true);
      }
    };
    
    const checkMessagesRefreshTime = () => {
      if (Date.now() - lastMessagesRefresh >= 30000) {
        setShowMessagesRefresh(true);
      }
    };
    
    // Set up timers to check every second
    conversationsRefreshTimerRef.current = setInterval(checkConversationsRefreshTime, 1000);
    messagesRefreshTimerRef.current = setInterval(checkMessagesRefreshTime, 1000);
    
    // Cleanup function
    return () => {
      if (conversationsRefreshTimerRef.current) {
        clearInterval(conversationsRefreshTimerRef.current);
      }
      if (messagesRefreshTimerRef.current) {
        clearInterval(messagesRefreshTimerRef.current);
      }
    };
  }, [lastConversationsRefresh, lastMessagesRefresh]);

  const fetchConversations = async (pageToFetch = pagination.page, preserveExisting = false) => {
    try {
      setLoading(true);
      const data = await clinicService.getClinicConversations(
        clinicId,
        pageToFetch,
        10,
        search
      );
      
      // Update conversations without affecting the current active conversation
      setConversations(data.conversations || []);
      setPagination({
        page: data.page,
        totalPages: data.total_pages,
      });

      // Check if the specified conversation exists in current page
      const hasSpecifiedConversation = conversationId && data.conversations.some(
        c => c.conversation_id === conversationId
      );

      // If we have a specified conversation but it's not in current page
      if (conversationId && !hasSpecifiedConversation && !preserveExisting) {
        // Search through all pages until we find the conversation
        let foundConversation = false;
        for (let i = 1; i <= data.total_pages && !foundConversation; i++) {
          if (i !== pageToFetch) {
            const pageData = await clinicService.getClinicConversations(clinicId, i, 10, search);
            const conversation = pageData.conversations.find(c => c.conversation_id === conversationId);
            if (conversation) {
              foundConversation = true;
              setActiveConversation(conversation);
              fetchConversationMessages(conversationId);
              // Update page to where we found the conversation
              setSearchParams({
                page: i.toString(),
                ...(search ? { search } : {}),
                conversation: conversationId
              });
              // Update conversations list to show the page with our target conversation
              setConversations(pageData.conversations || []);
              setPagination({
                page: i,
                totalPages: pageData.total_pages,
              });
            }
          }
        }
      } else if (conversationId && !preserveExisting) {
        // Conversation found in current page
        const conversation = data.conversations.find(c => c.conversation_id === conversationId);
        if (conversation) {
          setActiveConversation(conversation);
          fetchConversationMessages(conversationId);
        }
      } else if (!activeConversation && data.conversations && data.conversations.length > 0 && !preserveExisting) {
        // Only set first conversation as active if there isn't already an active one
        setActiveConversation(data.conversations[0]);
        setSearchParams({
          page: data.page.toString(),
          ...(search ? { search } : {}),
          conversation: data.conversations[0].conversation_id,
        });
        fetchConversationMessages(data.conversations[0].conversation_id);
      }
      
      // Update last refresh time and hide refresh button
      const now = Date.now();
      setLastConversationsRefresh(now);
      setLastConversationsRefreshTime(new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setShowConversationsRefresh(false);
    } catch (err) {
      console.error(`Error fetching conversations for clinic ${clinicId}:`, err);
      setError('Failed to load conversations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversations when clinicId, page, or search changes
  useEffect(() => {
    if (clinicId) {
      fetchConversations(page);
    }
  }, [clinicId, page, search]);

  const fetchConversationMessages = async (convId) => {
    try {
      setMessagesLoading(true);
      const data = await clinicService.getConversationMessages(convId);
      setConversationMessages(data.messages || []);
      
      // Update the active conversation with the messages
      setActiveConversation(prev => {
        if (prev && prev.conversation_id === convId) {
          return { ...prev, messages: data.messages || [] };
        }
        return prev;
      });

      // After fetching messages, fetch appointments and events for this conversation
      fetchConversationAppointments(convId);
      fetchConversationEvents(convId);
      
      // Update last refresh time and hide refresh button
      const now = Date.now();
      setLastMessagesRefresh(now);
      setLastMessagesRefreshTime(new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setShowMessagesRefresh(false);
    } catch (err) {
      console.error(`Error fetching messages for conversation ${convId}:`, err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchConversationAppointments = async (convId) => {
    try {
      setAppointmentsLoading(true);
      const data = await clinicService.getConversationAppointments(convId);
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(`Error fetching appointments for conversation ${convId}:`, err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchConversationEvents = async (convId) => {
    try {
      setEventsLoading(true);
      const data = await clinicService.getConversationEvents(convId);
      setEvents(data.events || []);
    } catch (err) {
      console.error(`Error fetching events for conversation ${convId}:`, err);
    } finally {
      setEventsLoading(false);
    }
  };

  // Handler for "Send to Clinic" button click
  const handleSendToClinic = (conversationId) => {
    // Create a template message with appointment details
    let templateMessage = `預約詳情：\n診所：`;
    
    // Check if we have appointment data
    if (appointments && appointments.length > 0) {
      const latestAppointment = appointments[0]; // Assuming appointments are sorted by date already
      templateMessage += `${clinicName}\n`;
      templateMessage += `日期：${latestAppointment.appointment_date || 'XXXX'}\n`;
      templateMessage += `時間：${latestAppointment.appointment_time || 'XXXX'}\n`;
      templateMessage += `醫生：${latestAppointment.doctor || 'XXXX'}\n\n`;
    } else {
      templateMessage += `XXXX\n`;
      templateMessage += `日期：XXXX\n`;
      templateMessage += `時間：XXXX\n`;
      templateMessage += `醫生：XXXX\n\n`;
    }
    
    templateMessage += `病人資料：\n姓名：XXXX\n其他資料：XXXX\n備註：XXXX`;
    
    setShowSendToClinicModal(true);
    setSendToClinicMessage(templateMessage);
  };

  // Handler for submitting the send to clinic message
  const handleSubmitSendToClinic = async () => {
    if (!activeConversation || !sendToClinicMessage.trim()) return;
    
    // Create confirmation message with preview
    const confirmMessage = `確定要發送以下訊息給診所嗎？\n\n${sendToClinicMessage}`;
    
    // Show confirmation alert
    if (window.confirm(confirmMessage)) {
      try {
        setSendingToClinic(true);
        await clinicService.notifyClinicByHuman(
          activeConversation.conversation_id, 
          sendToClinicMessage
        );
        
        alert('訊息已成功發送給診所。');
        setShowSendToClinicModal(false);
        setSendToClinicMessage('');
        
        // Refresh conversation messages
        fetchConversationMessages(activeConversation.conversation_id);
      } catch (err) {
        console.error('Error sending message to clinic:', err);
        alert(`發送訊息時出錯: ${err.message || '未知錯誤'}`);
      } finally {
        setSendingToClinic(false);
      }
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchParams({
      page: '1',
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(conversationId ? { conversation: conversationId } : {}),
    });
  };

  const handlePageChange = (newPage) => {
    // Update URL params which will trigger the useEffect
    setSearchParams({
      page: newPage.toString(),
      ...(search ? { search } : {}),
      ...(conversationId ? { conversation: conversationId } : {}),
    });
  };

  const handleSelectConversation = (selectedConversationId) => {
    // Prevent double-clicks and selecting the same conversation again
    if (messagesLoading || selectedConversationId === activeConversation?.conversation_id) {
      return;
    }
    
    const conversation = conversations.find(
      (c) => c.conversation_id === selectedConversationId
    );
    if (conversation) {
      setActiveConversation(conversation);
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        conversation: selectedConversationId,
      });
      fetchConversationMessages(selectedConversationId);
    }
  };

  // Helper to combine messages, appointments, and events in chronological order
  const getCombinedTimelineItems = () => {
    if (!activeConversation || !activeConversation.messages) return [];
    
    const allItems = [...activeConversation.messages];
    
    // Map appointments to a message-like format for timeline display
    appointments.forEach(appointment => {
      allItems.push({
        id: `appointment-${appointment.id}`,
        message_content: `Notified Clinic [Appointment Request]: ${appointment.appointment_date} at ${appointment.appointment_time} with ${appointment.doctor}`,
        timestamp: appointment.created_at,
        is_appointment: true,
        appointment_status: appointment.status,
        appointment: appointment
      });
    });
    
    // Map events to a message-like format for timeline display
    events.forEach(event => {
      allItems.push({
        id: `event-${event.id}`,
        message_content: event.value,
        timestamp: event.timestamp,
        is_event: true,
        event_type: event.key,
      });
    });
    
    // Sort all items by timestamp
    return allItems.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Handle manual refresh of conversations list
  const handleRefreshConversations = () => {
    // Preserve existing state by passing true
    fetchConversations(pagination.page, true);
  };
  
  // Handle manual refresh of messages
  const handleRefreshMessages = () => {
    if (activeConversation) {
      fetchConversationMessages(activeConversation.conversation_id);
    }
  };

  // Mobile view state
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Check if mobile view is active
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobileView();
    
    // Add event listener
    window.addEventListener('resize', checkMobileView);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);
  
  // Automatically collapse list on mobile when a conversation is selected
  useEffect(() => {
    if (isMobileView && activeConversation) {
      setIsListCollapsed(true);
    }
  }, [activeConversation, isMobileView]);

  // Helper to toggle conversation list collapse state
  const toggleListCollapse = () => {
    setIsListCollapsed(!isListCollapsed);
  };

  // Helper to determine message role
  const getMessageRole = (message) => {
    if (message.role) return message.role;
    
    // If message has direction property
    if (message.direction === 'inbound') return 'user';
    if (message.direction === 'outbound') return 'assistant';
    
    // Otherwise determine based on from_number
    return message.from_number === activeConversation?.to_number ? 'assistant' : 'user';
  };

  // Generate and download CSV export of test cases
  const handleExportTestCases = () => {
    if (!activeConversation || !activeConversation.messages) {
      alert('No conversation selected to export');
      return;
    }

    const testCaseData = [];
    const messages = activeConversation.messages;
    const userMessages = messages.filter(m => getMessageRole(m) === 'user');
    const assistantMessages = messages.filter(m => getMessageRole(m) === 'assistant');

    // Process each user message
    userMessages.forEach((userMsg) => {
      // Find the corresponding assistant message that follows this user message
      let assistantMsg = null;
      for (const msg of assistantMessages) {
        if (new Date(msg.timestamp) > new Date(userMsg.timestamp)) {
          assistantMsg = msg;
          break;
        }
      }
      
      if (!assistantMsg) return;
      
      // Add to test case data
      testCaseData.push({
        conversation: activeConversation.conversation_id,
        userMessage: userMsg.message_content,
        aiMessage: assistantMsg.message_content,
        humanAnnotation: '' // Since we removed suggestions, this will be empty
      });
    });

    generateCsvFile(testCaseData);
  };
  
  // Helper to generate and download CSV file
  const generateCsvFile = (data) => {
    if (!data.length) {
      alert('No data available to export');
      return;
    }
    
    const lines = ["conversation,user message,ai message"];
    
    data.forEach(item => {
      const conversationId = item.conversation;
      const userMessage = item.userMessage.includes('\n') || item.userMessage.includes(',') || item.userMessage.includes('"') 
        ? `"${item.userMessage.replace(/"/g, '""')}"` 
        : item.userMessage;
      const aiMessage = item.aiMessage.includes('\n') || item.aiMessage.includes(',') || item.aiMessage.includes('"')
        ? `"${item.aiMessage.replace(/"/g, '""')}"` 
        : item.aiMessage;
      const humanAnnotation = '';
      
      lines.push(`${conversationId},${userMessage},${aiMessage},${humanAnnotation}`);
    });
    
    const csvContent = lines.join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `test-${activeConversation.conversation_id}-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Set export function to window for ConversationDetail to access
  useEffect(() => {
    window.exportTestCases = handleExportTestCases;
    return () => {
      delete window.exportTestCases;
    };
  }, [activeConversation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left side: Conversation list with collapsible functionality */}
        {(!isMobileView || !isListCollapsed) && (
          <div className={`md:col-span-1 flex flex-col bg-white rounded-lg shadow-md p-3 ${isMobileView ? 'mb-4' : ''}`}>
            {/* Mobile view header with collapse toggle - when expanded */}
             {isMobileView && (
              <div 
                className="flex justify-between items-center mb-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                onClick={toggleListCollapse}
              >
                <h3 className="font-medium text-gray-800">
                  <span>Conversations</span>
                </h3>
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {conversations.length > 0 ? (
              <>
                <div className="flex-grow overflow-auto">
                  {showConversationsRefresh && (
                    <div className="bg-blue-50 p-2 mb-2 rounded flex justify-center">
                      <button 
                        onClick={handleRefreshConversations}
                        className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Refresh - last update: {lastConversationsRefreshTime}
                      </button>
                    </div>
                  )}
                  <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversation?.conversation_id}
                    onSelectConversation={handleSelectConversation}
                    isLoading={messagesLoading}
                  />
                </div>
                
                {/* Pagination for the conversation list */}
                <div className="mt-4 bg-white p-3 rounded-lg">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    search={search}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No conversations found.</p>
                {search && (
                  <button
                    className="mt-4 px-4 py-2 bg-[#075e54] text-white rounded"
                    onClick={() => handleSearch('')}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Right side: Title, back button, and conversation detail */}
        <div className="md:col-span-2 flex flex-col h-full">
          {/* Title and back link in the same box */}
          <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#075e54]">
                {clinicName ? `${clinicName} - ` : ''}Conversations
              </h2>
              <Link
                to={`/clinics/${clinicId}`}
                className="text-[#075e54] hover:text-[#128c7e] font-medium"
              >
                ← Back to clinic
              </Link>
            </div>
          </div>
          
          {/* Mobile collapsed view header - shows when collapsed */}
          {isMobileView && isListCollapsed && activeConversation && (
            <div 
              className="bg-white p-3 mb-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={toggleListCollapse}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-700">
                  {activeConversation.profile_name ? activeConversation.profile_name.charAt(0).toUpperCase() : '#'}
                </span>
                <span className="font-medium">
                  {activeConversation.profile_name || activeConversation.conversation_id.split('::').pop()}
                </span>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Conversation detail */}
          {conversations.length > 0 ? (
            <div className="flex-grow flex flex-col">
              <div className="flex-grow">
                <ConversationDetail 
                  conversation={{
                    ...activeConversation,
                    messages: getCombinedTimelineItems()
                  }}
                  isLoading={messagesLoading || appointmentsLoading || eventsLoading}
                  onSendToClinic={handleSendToClinic}
                  showRefreshButton={showMessagesRefresh}
                  onRefresh={handleRefreshMessages}
                  lastRefreshTime={lastMessagesRefreshTime}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Send to clinic modal */}
      {showSendToClinicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Notify Clinic</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="10"
                value={sendToClinicMessage}
                onChange={(e) => setSendToClinicMessage(e.target.value)}
                placeholder="Enter message to send to the clinic staff"
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSendToClinicModal(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                disabled={sendingToClinic}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSendToClinic}
                disabled={!sendToClinicMessage.trim() || sendingToClinic}
                className="px-4 py-2 bg-[#075e54] text-white rounded hover:bg-[#128c7e] disabled:opacity-50"
              >
                {sendingToClinic ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations; 