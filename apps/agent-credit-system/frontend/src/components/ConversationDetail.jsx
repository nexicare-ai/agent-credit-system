import React, { useEffect, useRef, useState } from 'react';

const ConversationDetail = ({
  conversation,
  isLoading,
  onSendToClinic,
  showRefreshButton,
  onRefresh,
  lastRefreshTime
}) => {
  // Create a ref for the messages container
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [message, setMessage] = useState('');
  // Track whether we should scroll to bottom
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  // Track last messages length to determine if new messages arrived
  const lastMessagesLengthRef = useRef(0);

  // Function to instantly teleport to bottom (no smooth scrolling)
  const teleportToBottom = () => {
    if (messagesContainerRef.current && shouldScrollToBottom) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Teleport to bottom when component mounts or conversation changes
  useEffect(() => {
    // Only scroll to bottom for new conversation
    setShouldScrollToBottom(true);
    teleportToBottom();

    // Reset last messages length
    if (conversation?.messages) {
      lastMessagesLengthRef.current = conversation.messages.length;
    }
  }, [conversation?.conversation_id]);

  // Teleport to bottom only when new messages arrive
  useEffect(() => {
    if (conversation?.messages) {
      // Only scroll if new messages have been added
      if (conversation.messages.length > lastMessagesLengthRef.current) {
        teleportToBottom();
      }

      // Update last messages length
      lastMessagesLengthRef.current = conversation.messages.length;
    }
  }, [conversation?.messages]);

  // Function to format message content by replacing newlines with <br/> tags
  const formatMessageContent = (content) => {
    if (!content) return '';

    // Replace all occurrences of \n or \r\n with <br/>
    const formattedContent = content
      .replace(/\r\n/g, '<br/>')
      .replace(/\n/g, '<br/>')
      .replace(/\r/g, '<br/>');

    return (
      <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
    );
  };

  if (!conversation) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center">
        <p className="text-gray-500">Select a conversation to view details</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-[70vh] w-full bg-white rounded-lg overflow-hidden shadow-md">
        {/* WhatsApp-like header */}
        <div className="bg-[#075e54] text-white p-3 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            {conversation.profile_name ? conversation.profile_name.charAt(0).toUpperCase() : '#'}
          </div>
          <div>
            <h3 className="font-semibold">
              {conversation.profile_name || conversation.conversation_id}
            </h3>
            <p className="text-xs opacity-80">
              {conversation.channel || 'Unknown channel'}
            </p>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#075e54] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation.messages || conversation.messages.length === 0) {
    return (
      <div className="flex flex-col h-[70vh] w-full bg-white rounded-lg overflow-hidden shadow-md">
        {/* WhatsApp-like header */}
        <div className="bg-[#075e54] text-white p-3 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
            {conversation.profile_name ? conversation.profile_name.charAt(0).toUpperCase() : '#'}
          </div>
          <div>
            <h3 className="font-semibold">
              {conversation.profile_name || conversation.conversation_id}
            </h3>
            <p className="text-xs opacity-80">
              {conversation.channel || 'Unknown channel'}
            </p>
          </div>
        </div>

        {/* No messages indicator */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No messages in this conversation</p>
        </div>
      </div>
    );
  }

  // Determine message direction based on from_number and to_number
  const getMessageDirection = (message) => {
    if (!message) return 'outbound';

    // If the message has a direction property, use it
    if (message.direction) return message.direction;

    // Otherwise, determine direction based on role or from_number
    if (message.role === 'assistant' || message.role === 'system' || message.role === 'mctb') {
      return 'outbound';
    } else if (message.role === 'user') {
      return 'inbound';
    }

    // Fallback to checking from_number (this depends on your specific data structure)
    // You might need to adjust this logic based on your actual data
    return message.from_number === conversation.to_number ? 'outbound' : 'inbound';
  };

  return (
    <div className="flex flex-col h-[70vh] w-full bg-white rounded-lg overflow-hidden shadow-md">
     {/* WhatsApp-like header with test case controls */}
      <div className="bg-[#075e54] text-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              {conversation.profile_name ? conversation.profile_name.charAt(0).toUpperCase() : '#'}
            </div>
            <div>
              <h3 className="font-semibold">
                {conversation.profile_name || conversation.conversation_id}
              </h3>
              <p className="text-xs opacity-80">
                {conversation.channel || 'Unknown channel'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.exportTestCases && window.exportTestCases()}
              className="px-3 py-1 rounded text-sm font-medium flex items-center bg-indigo-600 hover:bg-indigo-700 text-white"
              title="Export Test Cases"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export test case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat area with white background and scroll handler */}
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-white"
        onScroll={(e) => {
          // Determine if user has scrolled up
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
          setShouldScrollToBottom(isAtBottom);
        }}
      >
        {conversation?.messages?.map((message) => {
          // Special case for appointment messages
          if (message.is_appointment) {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg max-w-[85%] shadow">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <p className="text-sm text-blue-800 font-medium">{formatMessageContent(message.message_content)}</p>
                  </div>
                  <div className="mt-1 text-xs text-blue-600 text-right">
                    <span className="bg-blue-100 px-2 py-1 rounded capitalize">{message.appointment_status}</span>
                    <span className="ml-2">{new Date(message.timestamp).toLocaleString()}</span>
                    {message.appointment?.has_notified &&
                      <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded">
                        Notified ✓
                      </span>
                    }
                  </div>
                </div>
              </div>
            );
          }

          // Special case for event messages (notify_clinic_by_human)
          if (message.is_event) {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg max-w-[85%] shadow">
                  <div className="flex items-center">
                    <span className="mr-2">📢</span>
                    <p className="text-sm text-green-800 font-medium">{formatMessageContent(message.message_content)}</p>
                  </div>
                  <div className="mt-1 text-xs text-green-600 text-right">
                    <span className="bg-green-100 px-2 py-1 rounded">Notified Clinic by Human</span>
                    <span className="ml-2">{new Date(message.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          }

          // Regular message handling
          const messageDirection = getMessageDirection(message);

          return (
            <div
              key={message.id}
              className={`flex ${messageDirection === 'outbound' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[85%] shadow ${
                  messageDirection === 'outbound'
                    ? 'bg-[#dcf8c6]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-sm">{formatMessageContent(message.message_content)}</p>
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}

        {/* Refresh button after messages - without changing scroll position */}
        {showRefreshButton && (
          <div className="bg-blue-50 p-2 mt-4 rounded flex justify-center">
            <button
              onClick={onRefresh}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh - last update: {lastRefreshTime}
            </button>
          </div>
        )}
      </div>

      {/* WhatsApp-like input area with Notify Clinic button */}
      <div className="bg-[#f0f0f0] p-2 flex items-center">
        <button
          onClick={() => onSendToClinic(conversation.conversation_id)}
          className="mr-2 bg-[#128c7e] bg-opacity-80 text-white px-2 py-1 rounded text-sm hover:bg-opacity-100"
        >
          Notify Clinic
        </button>
        <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center">
          <input
            type="text"
            className="flex-1 outline-none"
            placeholder="Type a message"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;