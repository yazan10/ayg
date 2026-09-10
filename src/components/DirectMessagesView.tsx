import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChatSkeleton } from './skeletons/ChatSkeleton';
import { useSkeletonLoading } from '../hooks/useSkeletonLoading';
import { ChatTransition } from './ui/ChatTransition';
import { ReportModal } from './ui/ReportModal';
import { BlockConfirmModal } from './ui/BlockConfirmModal';
import { useCall } from '../context/CallContext';
import { 
  Search, 
  Send, 
  Heart, 
  Image as ImageIcon, 
  Mic, 
  Phone, 
  Video, 
  Info, 
  ChevronLeft,
  ArrowRight,
  Smile,
  CheckCheck,
  Flag,
  Ban
} from 'lucide-react';

export const DirectMessagesView: React.FC = () => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    sendMessage, 
    toggleLikeMessage, 
    currentUser,
    stores,
    users,
    startDirectMessage,
    lang 
  } = useStore();

  const { startCall } = useCall();
  const isLoading = useSkeletonLoading(1000, [conversations.length]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const prevConvRef = useRef<string | null>(null);

  // Wave transition when switching chats - smooth, not too slow nor too fast
  useEffect(() => {
    if (prevConvRef.current && prevConvRef.current !== activeConversationId && activeConversationId) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 750);
      return () => clearTimeout(timer);
    }
    prevConvRef.current = activeConversationId;
  }, [activeConversationId]);

  const { getFilteredConversations, blockUser, unblockUser, isBlocked, reportTarget } = useStore() as any;
  const filteredBase = getFilteredConversations ? getFilteredConversations() : conversations;
  const currentConv = filteredBase.find((c: any) => c.id === activeConversationId);

  const filteredConversations = filteredBase.filter((c: any) => 
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participantUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || !messageText.trim()) return;
    sendMessage(activeConversationId, messageText);
    setMessageText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs h-[calc(100vh-8rem)] min-h-[600px] flex">
      {/* Conversations Sidebar (Always visible on desktop, conditionally on mobile) */}
      <div className={`w-full md:w-80 lg:w-96 border-e border-neutral-200 flex flex-col ${
        activeConversationId ? 'hidden md:flex' : 'flex'
      }`}>
        {/* User Direct Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-black">@{currentUser.username}</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">aygram DM</span>
          </div>
        </div>

        {/* Search Conversations */}
        <div className="p-3 border-b border-neutral-100">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث في الرسائل...' : 'Search messages...'}
              className="w-full ps-9 pe-3 py-2 bg-neutral-100 text-black rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Quick Contacts Bar (Suggested stores to DM) */}
        <div className="p-3 border-b border-neutral-100 overflow-x-auto flex gap-3 scrollbar-none">
          {stores.slice(0, 5).map(s => (
            <button
              key={s.id}
              onClick={() => startDirectMessage({
                id: s.id,
                username: s.username,
                name: lang === 'ar' ? s.name : s.nameEn,
                avatar: s.avatar,
                verified: s.verified
              })}
              className="flex flex-col items-center gap-1 shrink-0 group"
            >
              <div className="w-12 h-12 rounded-full p-0.5 border-2 border-blue-500 group-hover:scale-105 transition-transform">
                <img src={s.avatar} alt={s.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[10px] text-black font-medium truncate max-w-[54px]">
                {s.username}
              </span>
            </button>
          ))}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2">
          {isLoading ? (
            <ChatSkeleton count={5} />
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-xs">
              {lang === 'ar' ? 'لا توجد محادثات تطابق بحثك' : 'No conversations found'}
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/80 border-s-4 border-blue-600' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-black truncate flex items-center gap-1">
                        <span>{conv.participantName}</span>
                        {conv.participantVerified && (
                          <span className="text-blue-500 text-[10px]">✓</span>
                        )}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Active Conversation Window */}
      <div className={`flex-1 flex flex-col bg-neutral-50/50 relative overflow-hidden ${
        !activeConversationId ? 'hidden md:flex items-center justify-center' : 'flex'
      }`}>
        <ChatTransition isVisible={isTransitioning} />
        {!currentConv ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-black">
              {lang === 'ar' ? 'رسائلك المباشرة في aygram' : 'Your aygram Direct Messages'}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm">
              {lang === 'ar' 
                ? 'تواصل مع المتاجر والبائعين وصناع المحتوى مباشرة واطلب الاستفسارات فورياً.' 
                : 'Send private messages and chat directly with verified merchants & creators.'}
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-3.5 bg-white border-b border-neutral-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900"
                >
                  <ArrowRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
                  <img src={currentConv.participantAvatar} alt={currentConv.participantName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                    <span>{currentConv.participantName}</span>
                    {currentConv.participantVerified && <span className="text-blue-500 text-[10px]">✓</span>}
                  </h4>
                  <span className="text-[10px] text-neutral-400">@{currentConv.participantUsername}</span>
                </div>
              </div>

              {/* Chat action icons - Calls + Block/Report */}
              <div className="flex items-center gap-1.5 text-neutral-600">
                <button
                  onClick={() => {
                    if (currentConv) {
                      startCall(
                        {
                          id: currentConv.participantId,
                          name: currentConv.participantName,
                          username: currentConv.participantUsername,
                          avatar: currentConv.participantAvatar,
                          verified: currentConv.participantVerified,
                        },
                        'audio'
                      );
                    }
                  }}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full transition-colors border border-emerald-200"
                  title="مكالمة صوتية"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (currentConv) {
                      startCall(
                        {
                          id: currentConv.participantId,
                          name: currentConv.participantName,
                          username: currentConv.participantUsername,
                          avatar: currentConv.participantAvatar,
                          verified: currentConv.participantVerified,
                        },
                        'video'
                      );
                    }
                  }}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors border border-blue-200"
                  title="مكالمة فيديو"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button onClick={() => setShowReport(true)} className="p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-full transition-colors" title="إبلاغ">
                  <Flag className="w-4 h-4" />
                </button>
                <button onClick={() => setShowBlock(true)} className="p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-full transition-colors" title="حظر">
                  <Ban className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors" title="معلومات">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col justify-end">
              {currentConv.messages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={currentConv.participantAvatar}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                    )}

                    <div className="relative group max-w-[75%] sm:max-w-md">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-black border border-neutral-200 rounded-bl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-blue-100' : 'text-neutral-400'}`}>
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>

                      {/* Heart reaction badge if liked */}
                      {msg.isLiked && (
                        <span className="absolute -bottom-2 end-2 bg-white rounded-full p-0.5 shadow-sm border border-neutral-200">
                          <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        </span>
                      )}

                      {/* Hover action to like message */}
                      <button
                        onClick={() => toggleLikeMessage(currentConv.id, msg.id)}
                        className="absolute top-1/2 -translate-y-1/2 -start-7 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-neutral-200 transition-opacity"
                        title="إعجاب"
                      >
                        <Heart className="w-3.5 h-3.5 text-neutral-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            {currentConv && isBlocked(currentConv.participantId) ? (
              <div className="p-4 bg-red-50 border-t border-red-200 text-center space-y-2">
                <p className="text-xs font-bold text-red-700 flex items-center justify-center gap-1.5">
                  <Ban className="w-4 h-4" />
                  {lang === 'ar' ? 'لقد قمت بحظر هذا الحساب — لا يمكنك المراسلة' : 'You blocked this account — messaging disabled'}
                </p>
                <button
                  onClick={() => unblockUser(currentConv.participantId)}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  {lang === 'ar' ? 'إلغاء الحظر' : 'Unblock'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                <div className="flex items-center gap-1 text-neutral-400">
                  <button type="button" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <Smile className="w-5 h-5 text-neutral-500" />
                  </button>
                  <button type="button" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <ImageIcon className="w-5 h-5 text-neutral-500" />
                  </button>
                  <button type="button" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <Mic className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب رسالة خاصة...' : 'Write a direct message...'}
                  className="flex-1 px-4 py-2 bg-neutral-100 text-black rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />

                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-xs disabled:opacity-40 hover:bg-blue-700 transition-colors shrink-0"
                >
                  {lang === 'ar' ? 'إرسال' : 'Send'}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      {/* Block & Report Modals for current conversation */}
      {currentConv && (
        <>
          <ReportModal
            isOpen={showReport}
            onClose={() => setShowReport(false)}
            onSubmit={(reason, desc) => {
              reportTarget(currentConv.participantId, 'user', reason, desc, currentConv.participantName, currentConv.participantUsername);
              setShowReport(false);
            }}
            targetName={currentConv.participantName}
            targetUsername={currentConv.participantUsername}
            targetAvatar={currentConv.participantAvatar}
            targetType="user"
            lang={lang}
          />
          <BlockConfirmModal
            isOpen={showBlock}
            onClose={() => setShowBlock(false)}
            onConfirm={() => {
              if (isBlocked(currentConv.participantId)) {
                unblockUser(currentConv.participantId);
              } else {
                blockUser(currentConv.participantId);
              }
              setShowBlock(false);
            }}
            isBlocked={isBlocked(currentConv.participantId)}
            userName={currentConv.participantName}
            username={currentConv.participantUsername}
            avatar={currentConv.participantAvatar}
            lang={lang}
          />
        </>
      )}
    </div>
  );
};
