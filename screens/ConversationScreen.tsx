import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Phone, Video, Send, Smile, Mic, 
  Plus, Camera, Image as ImageIcon, MapPin, 
  FileText, User, X, PhoneOff, MicOff, Play, Pause,
  Check, CheckCheck, Reply
} from 'lucide-react';
import { ScreenName, ChatUser } from '../types';

interface ConversationScreenProps {
  onNavigate: (screen: ScreenName) => void;
  user?: ChatUser;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
  reaction?: string | null;
  status?: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice';
  mediaUrl?: string;
  duration?: string; // For voice messages
  replyTo?: {
    id: number;
    text: string;
    sender: 'me' | 'them';
    type: 'text' | 'image' | 'voice';
  };
}

const REACTION_OPTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍'];
const EMOJI_LIST = ['😀', '😂', '😍', '🥺', '😎', '👍', '👎', '❤️', '🔥', '🎉', '👋', '🤔', '😴', '😭', '🤯', '✨', '💩', '👻', '👀', '🙌'];

const ConversationScreen: React.FC<ConversationScreenProps> = ({ onNavigate, user }) => {
  // Chat State
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey! How's it going?", sender: 'them', time: '10:00 AM', reaction: null, type: 'text' },
    { id: 2, text: "Pretty good! Just working on some designs. You?", sender: 'me', time: '10:05 AM', reaction: '❤️', status: 'read', type: 'text' },
    { id: 3, text: "Same here. Are you going to the event tonight?", sender: 'them', time: '10:15 AM', reaction: null, type: 'text' },
  ]);
  
  // UI State
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // Calling State
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [callDuration, setCallDuration] = useState(0);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Audio Playback State (Simple toggle for demo)
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  
  // Reaction State
  const [activeReactionMenuId, setActiveReactionMenuId] = useState<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Scroll & Layout Effects ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, replyingTo]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [messageText]);

  // --- Call Timer ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callStatus === 'connected') {
      interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // --- Recording Timer ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Fallback user if none passed
  const chatUser = user || { 
      id: 0, 
      name: 'Alex Johnson', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      isOnline: true 
  };

  // --- Message Handling ---

  const handleSend = (e?: React.FormEvent, type: 'text' | 'image' | 'voice' = 'text', content: string = '', duration?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = type === 'text' ? messageText : content;
    if (!textToSend.trim() && type === 'text') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: type === 'text' ? textToSend : (type === 'voice' ? 'Voice Message' : 'Photo'),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reaction: null,
      status: 'sent',
      type: type,
      mediaUrl: type === 'image' ? content : undefined,
      duration: duration,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.sender,
        type: replyingTo.type
      } : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    if (type === 'text') setMessageText('');
    setShowEmojiPicker(false);
    setShowAttachments(false);
    setReplyingTo(null); // Clear reply state

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate Reply
    simulateReply();
  };

  const simulateReply = () => {
    setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "That looks great! Let's talk more about it later.",
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reaction: null,
                type: 'text'
            }]);
        }, 2000);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageDoubleTap = (msg: Message) => {
    setReplyingTo(msg);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // --- Feature Handlers ---

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setCallStatus('calling');
    setTimeout(() => setCallStatus('connected'), 2000); // Simulate connect
  };

  const endCall = () => {
    setCallStatus('idle');
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop and Send
      setIsRecording(false);
      handleSend(undefined, 'voice', '', formatDuration(recordingTime));
      setRecordingTime(0);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleAttachment = (option: string) => {
    if (option === 'camera' || option === 'image') {
       // Simulate sending an image
       handleSend(undefined, 'image', 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=400&fit=crop');
    }
    // Add other handlers for location/file if needed
    setShowAttachments(false);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessageText(prev => prev + emoji);
  };

  // --- Reaction Logic ---
  const handleReactionStart = (id: number) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setActiveReactionMenuId(id);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  };

  const handleReactionEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const applyReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        return { ...msg, reaction: msg.reaction === emoji ? null : emoji };
      }
      return msg;
    }));
    setActiveReactionMenuId(null);
  };

  const closeMenus = () => {
    setActiveReactionMenuId(null);
    setShowAttachments(false);
    setShowEmojiPicker(false);
  };

  // --- Render Components ---

  const renderMessageContent = (msg: Message, isMe: boolean) => {
    if (msg.type === 'image') {
      return (
        <div className="rounded-xl overflow-hidden mb-1">
          <img src={msg.mediaUrl} alt="Shared" className="max-w-[200px] w-full h-auto object-cover" />
        </div>
      );
    }

    if (msg.type === 'voice') {
      const isPlaying = playingAudioId === msg.id;
      return (
        <div className="flex items-center gap-3 min-w-[140px] py-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setPlayingAudioId(isPlaying ? null : msg.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isMe ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <div className="flex flex-col gap-1 flex-1">
            <div className={`h-1 rounded-full w-full ${isMe ? 'bg-white/30' : 'bg-gray-200'}`}>
              <div 
                className={`h-full rounded-full ${isMe ? 'bg-white' : 'bg-primary'} transition-all duration-1000`} 
                style={{ width: isPlaying ? '100%' : '0%' }}
              ></div>
            </div>
            <span className={`text-[10px] ${isMe ? 'text-white/80' : 'text-gray-500'}`}>{msg.duration || '0:12'}</span>
          </div>
        </div>
      );
    }

    return <p className="leading-snug text-[15px] whitespace-pre-wrap pointer-events-none">{msg.text}</p>;
  };

  const renderReplyPreview = () => {
    if (!replyingTo) return null;
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 animate-fade-in mx-2 mt-1 rounded-t-2xl">
         <div className="flex flex-col border-l-4 border-primary pl-2">
            <span className="text-xs font-bold text-primary">
              Replying to {replyingTo.sender === 'me' ? 'You' : chatUser.name}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-[200px]">
              {replyingTo.type === 'image' ? 'Photo' : replyingTo.type === 'voice' ? 'Voice Message' : replyingTo.text}
            </span>
         </div>
         <button onClick={() => setReplyingTo(null)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500">
            <X size={16} />
         </button>
      </div>
    );
  };

  return (
    <div 
      className="flex flex-col h-screen bg-white font-sans relative overflow-hidden"
      onClick={closeMenus}
    >
      {/* --- Call Overlay --- */}
      {callStatus !== 'idle' && (
        <div className="absolute inset-0 z-50 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-fade-in">
           <div className="flex-1 flex flex-col items-center justify-center w-full">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative z-10">
                   <img src={chatUser.image} alt={chatUser.name} className="w-full h-full object-cover" />
                </div>
                {/* Pulse Waves */}
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping z-0"></div>
                <div className="absolute inset-[-20px] bg-primary/10 rounded-full animate-pulse z-0"></div>
              </div>
              
              <h2 className="text-3xl font-bold mb-2">{chatUser.name}</h2>
              <p className="text-lg text-gray-300 animate-pulse">
                {callStatus === 'calling' ? 'Calling...' : (callType === 'video' ? 'Video Call' : 'Audio Call')}
              </p>
              {callStatus === 'connected' && (
                <p className="text-sm font-mono mt-2 text-gray-400">{formatDuration(callDuration)}</p>
              )}
           </div>

           <div className="pb-16 flex items-center gap-8">
              <button className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                 <MicOff size={28} />
              </button>
              <button 
                onClick={endCall}
                className="p-5 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 transform hover:scale-105"
              >
                 <PhoneOff size={32} fill="currentColor" />
              </button>
              <button className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                 <Video size={28} />
              </button>
           </div>
        </div>
      )}

      {/* --- Main Chat Header --- */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('chat')}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-900 transition-colors"
          >
            <ChevronLeft size={26} />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                    <img src={chatUser.image} alt={chatUser.name} className="w-full h-full object-cover" />
                </div>
                {chatUser.isOnline && (
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
            </div>
            <div>
               <h3 className="font-bold text-gray-900 text-base leading-tight">{chatUser.name}</h3>
               <span className="text-xs text-green-600 font-medium">Active now</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-primary">
           <button onClick={() => startCall('audio')} className="hover:bg-gray-100 p-2.5 rounded-full transition-colors text-primary"><Phone size={22} /></button>
           <button onClick={() => startCall('video')} className="hover:bg-gray-100 p-2.5 rounded-full transition-colors text-primary"><Video size={26} /></button>
        </div>
      </div>

      {/* --- Messages Area --- */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth scrollbar-hide bg-white">
        <div className="flex flex-col">
           <div className="flex justify-center my-6">
              <span className="text-gray-400 text-[11px] font-bold px-4 py-1.5 uppercase tracking-widest">Today</span>
           </div>

           {messages.map((msg, index) => {
             const isMe = msg.sender === 'me';
             const isMenuOpen = activeReactionMenuId === msg.id;
             const nextMessage = messages[index + 1];
             const prevMessage = messages[index - 1];
             const isLastInGroup = !nextMessage || nextMessage.sender !== msg.sender;
             const marginBottom = isLastInGroup ? 'mb-6' : 'mb-[2px]';
             const borderRadiusClass = isMe
                ? `rounded-2xl ${isLastInGroup ? 'rounded-br-[4px]' : 'rounded-br-xl'}`
                : `rounded-2xl ${isLastInGroup ? 'rounded-bl-[4px]' : 'rounded-bl-xl'}`;

             return (
               <div 
                 key={msg.id} 
                 className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${marginBottom} group relative select-none`}
               >
                  {!isMe && (
                    <div className="w-8 mr-2 flex-shrink-0 flex items-end">
                       {isLastInGroup ? (
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 mb-0.5">
                             <img src={chatUser.image} alt={chatUser.name} className="w-full h-full object-cover" />
                          </div>
                       ) : (
                          <div className="w-7" /> 
                       )}
                    </div>
                  )}

                  <div className={`relative max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                     {isMenuOpen && (
                       <div 
                        className={`
                          absolute -top-12 z-30 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] px-3 py-2 flex gap-2 animate-pop-in border border-gray-50
                          ${isMe ? 'right-0' : 'left-0'}
                        `}
                        onClick={(e) => e.stopPropagation()}
                       >
                         {REACTION_OPTIONS.map((emoji) => (
                           <button
                             key={emoji}
                             onClick={() => applyReaction(msg.id, emoji)}
                             className="text-xl hover:scale-125 transition-transform active:scale-95 leading-none"
                           >
                             {emoji}
                           </button>
                         ))}
                       </div>
                     )}

                     <div 
                        onDoubleClick={() => handleMessageDoubleTap(msg)}
                        onMouseDown={() => handleReactionStart(msg.id)}
                        onMouseUp={handleReactionEnd}
                        onMouseLeave={handleReactionEnd}
                        onTouchStart={() => handleReactionStart(msg.id)}
                        onTouchEnd={handleReactionEnd}
                        className={`
                          px-4 py-2 relative shadow-sm transition-all duration-200 cursor-pointer active:brightness-95
                          ${borderRadiusClass}
                          ${isMe 
                              ? 'bg-primary text-white' 
                              : 'bg-[#F2F2F7] text-gray-900'
                          }
                        `}
                      >
                        {msg.replyTo && (
                          <div className={`mb-1 pl-2 border-l-2 ${isMe ? 'border-white/40' : 'border-primary/40'} text-xs opacity-80`}>
                             <p className="font-bold">{msg.replyTo.sender === 'me' ? 'You' : chatUser.name}</p>
                             <p className="truncate max-w-[150px]">{msg.replyTo.type === 'image' ? 'Photo' : msg.replyTo.type === 'voice' ? 'Voice Message' : msg.replyTo.text}</p>
                          </div>
                        )}
                        {renderMessageContent(msg, isMe)}
                     </div>
                     
                     {msg.reaction && (
                       <div 
                         className={`
                           absolute -bottom-2 z-10 bg-white rounded-full p-0.5 px-1 shadow-sm border border-gray-100 text-xs animate-pop-in
                           ${isMe ? 'right-0 translate-x-1' : 'left-0 -translate-x-1'}
                         `}
                       >
                         {msg.reaction}
                       </div>
                     )}
                     
                     {isLastInGroup && (
                        <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                             <span className="text-[10px] font-medium text-gray-400">{msg.time}</span>
                             {isMe && msg.status && (
                                <div className="ml-0.5 flex items-center">
                                  {msg.status === 'sent' && <Check size={12} className="text-gray-400" />}
                                  {msg.status === 'delivered' && <CheckCheck size={12} className="text-gray-400" />}
                                  {msg.status === 'read' && <CheckCheck size={12} className="text-primary" />}
                                </div>
                             )}
                        </div>
                     )}
                  </div>
               </div>
             );
           })}

           {isTyping && (
              <div className="flex w-full justify-start mb-4 animate-fade-in pl-1">
                  <div className="w-8 mr-2 flex-shrink-0 flex items-end">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 mb-0.5">
                          <img src={chatUser.image} alt={chatUser.name} className="w-full h-full object-cover" />
                      </div>
                  </div>
                  <div className="bg-[#F2F2F7] px-4 py-3 rounded-2xl rounded-bl-[4px] shadow-sm flex items-center gap-1.5 h-[38px]">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-0"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                  </div>
              </div>
           )}

           <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* --- Attachments Menu --- */}
      {showAttachments && (
        <div className="absolute bottom-20 left-4 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 grid grid-cols-2 gap-2 animate-pop-in">
           {[
             { id: 'image', icon: ImageIcon, label: 'Gallery', color: 'bg-purple-100 text-purple-600' },
             { id: 'camera', icon: Camera, label: 'Camera', color: 'bg-blue-100 text-blue-600' },
             { id: 'location', icon: MapPin, label: 'Location', color: 'bg-green-100 text-green-600' },
             { id: 'contact', icon: User, label: 'Contact', color: 'bg-orange-100 text-orange-600' },
           ].map((item) => (
             <button
               key={item.id}
               onClick={(e) => { e.stopPropagation(); handleAttachment(item.id); }}
               className="flex flex-col items-center justify-center p-3 w-20 h-20 rounded-xl hover:bg-gray-50 transition-colors gap-1"
             >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                   <item.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
             </button>
           ))}
        </div>
      )}

      {/* --- Emoji Picker --- */}
      {showEmojiPicker && (
         <div className="absolute bottom-20 right-0 left-0 mx-4 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-fade-in-up">
            <div className="grid grid-cols-8 gap-2">
               {EMOJI_LIST.map(emoji => (
                  <button 
                    key={emoji} 
                    onClick={(e) => { e.stopPropagation(); handleEmojiClick(emoji); }}
                    className="text-2xl hover:bg-gray-100 rounded-lg p-1 transition-colors"
                  >
                     {emoji}
                  </button>
               ))}
            </div>
         </div>
      )}

      {/* --- Input Area --- */}
      <div className="bg-white border-t border-gray-50 pb-6 safe-area-pb">
         {/* Reply Preview Bar */}
         {renderReplyPreview()}

         <div className="p-2">
            {isRecording ? (
              // Recording Interface
              <div className="flex items-center gap-4 max-w-4xl mx-auto px-2 py-1.5 animate-fade-in">
                  <div className="flex-1 bg-red-50 rounded-full px-4 py-3 flex items-center justify-between border border-red-100">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-500 font-mono font-bold">{formatDuration(recordingTime)}</span>
                    </div>
                    <span className="text-xs text-red-400 font-bold uppercase tracking-widest">Recording</span>
                  </div>
                  <button 
                    onClick={cancelRecording}
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <button 
                    onClick={toggleRecording}
                    className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primaryDark transition-colors transform scale-110"
                  >
                    <Send size={24} />
                  </button>
              </div>
            ) : (
              // Standard Text Interface
              <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto px-1">
                  
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setShowAttachments(!showAttachments); setShowEmojiPicker(false); }}
                    className={`p-2.5 rounded-full transition-all active:scale-90 flex-shrink-0 mb-0.5 ${showAttachments ? 'bg-gray-200 text-gray-800 rotate-45' : 'bg-gray-50 text-primary hover:bg-gray-100'}`}
                  >
                      <Plus size={24} strokeWidth={2.5} />
                  </button>

                  {/* Text Input */}
                  <div className="flex-1 relative bg-[#F2F2F7] rounded-[24px] focus-within:ring-1 focus-within:ring-gray-300 focus-within:bg-white transition-all duration-200 border border-transparent">
                    <textarea 
                      ref={textareaRef}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={replyingTo ? "Reply..." : "Message..."}
                      className="w-full bg-transparent border-none py-2.5 pl-4 pr-10 text-[16px] text-gray-900 focus:outline-none resize-none max-h-32 min-h-[44px] leading-relaxed scrollbar-hide"
                      rows={1}
                    />
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); setShowAttachments(false); }}
                        className="absolute right-2 bottom-1.5 p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Smile size={24} />
                    </button>
                  </div>

                  {/* Right Side Actions */}
                  {messageText.trim() ? (
                    <button 
                      type="submit" 
                      className="p-2.5 bg-primary text-white rounded-full shadow-md hover:bg-primaryDark active:scale-90 transition-all mb-0.5 animate-pop-in"
                    >
                        <Send size={20} className="ml-0.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 mb-0.5 animate-fade-in">
                        <button 
                          type="button" 
                          onClick={() => handleAttachment('camera')}
                          className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                        >
                          <Camera size={26} strokeWidth={2} />
                        </button>
                        <button 
                          type="button" 
                          onClick={toggleRecording}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors active:scale-90"
                        >
                          <Mic size={24} strokeWidth={2} />
                        </button>
                    </div>
                  )}
              </form>
            )}
         </div>
      </div>
    </div>
  );
};

export default ConversationScreen;