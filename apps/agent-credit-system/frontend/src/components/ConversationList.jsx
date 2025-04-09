import React from 'react';

const ConversationList = ({ conversations, activeConversationId, onSelectConversation, isLoading }) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No conversations found.</p>
      </div>
    );
  }

  const handleConversationClick = (conversationId) => {
    // Prevent clicking on already active conversation or when loading
    if (conversationId !== activeConversationId && !isLoading) {
      onSelectConversation(conversationId);
    }
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isActive = activeConversationId === conversation.conversation_id;
        return (
          <div
            key={conversation.conversation_id}
            className={`p-3 rounded-lg ${
              isActive
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100'
            } ${isLoading && isActive ? 'opacity-70' : ''} ${
              isLoading ? 'cursor-default' : 'cursor-pointer'
            }`}
            onClick={() => handleConversationClick(conversation.conversation_id)}
            aria-selected={isActive}
            role="option"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {conversation.profile_name || ""}
                  {conversation.conversation_id.includes('::') && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({conversation.conversation_id.split('::').pop()})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(conversation.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-gray-200">
                {conversation.channel}
              </div>
            </div>
            {conversation.messages && conversation.messages.length > 0 && (
              <p className="text-sm text-gray-600 mt-2 truncate">
                {conversation.messages[conversation.messages.length - 1].message_content}
              </p>
            )}
            {isLoading && isActive && (
              <div className="mt-2 flex justify-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList; 