import { CirclePlus, Pin, Signal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLGOzJnzEr-QG9mKwJxlK6TAEGSPb67rxzvdstGpVKJ2V2kQUot3O40H2_dh2glnE6qg/exec';

export interface Message {
  id: string,
  timestamp: string,
  username: string,
  message: string,
  parentId: string | null,
  isAdmin: boolean,
  isPinned: boolean,
  isLiked: boolean
}

interface MessageWithReplies extends Message {
  replies: Message[]
}

const emojiMap: Record<string, string> = {
  bunny_0: "/images/b/bunny_0.png"
};

function parseEmojis(text: string): (string | React.JSX.Element)[] {
  const parts = text.split(/(:[a-zA-Z0-9_]+:)/g); // split by :word:
  return parts.map((part, i) => {
    const match = part.match(/^:([a-zA-Z0-9_]+):$/);
    if (match) {
      const emojiKey = match[1];
      const emoji = emojiMap[emojiKey];
      if (emoji) {
        return <img key={i} src={emoji} alt={emojiKey} className="emoji" />;
      }
    }
    return part;
  });
}

interface ChatBoxProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, setMessages }) => {
  const MESSAGES_PER_PAGE = 5;
  const [sending, setSending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [username, setUsername] = useState('');
  const [messageText, setMessageText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?limit=100`);
      const data = await response.json();
      setMessages(data.messages || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!username.trim() || !messageText.trim()) {
      alert('Please enter both name and message');
      return;
    }

    const sanitizedUsername = username.trim().substring(0, 50);
    const sanitizedMessage = messageText.trim().substring(0, 1000);
    setSending(true);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
          username: sanitizedUsername,
          message: sanitizedMessage,
          parentId: replyingTo?.id || null
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        setMessageText('');
        setReplyingTo(null);
        setSending(false);
        loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }

    loadMessages();
  };

  const toggleThread = (messageId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedThreads(newExpanded);
  };

  const organizeMessages = (): MessageWithReplies[] => {
    const topLevel: MessageWithReplies[] = [];
    const repliesMap = new Map<string, Message[]>();

    messages.forEach(msg => {
      if (msg.parentId) {
        if (!repliesMap.has(msg.parentId)) {
          repliesMap.set(msg.parentId, []);
        }
        repliesMap.get(msg.parentId)!.push(msg);
      } else {
        topLevel.push({ ...msg, replies: [] });
      }
    });

    topLevel.forEach(msg => {
      msg.replies = repliesMap.get(msg.id) || [];
      msg.replies.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    });
    const timeSorted = topLevel.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return timeSorted.sort((a, b) => {
      if (!a.isPinned && !b.isPinned) return 0;
      if (a.isPinned && b.isPinned) {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      return a.isPinned ? -1 : 1;
    })
  };

  const messagesOrganized = organizeMessages();
  const pageCount = Math.ceil(messagesOrganized.length / MESSAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * MESSAGES_PER_PAGE;
  const endIndex = startIndex + MESSAGES_PER_PAGE;
  const currentMessages = messagesOrganized.slice(startIndex, endIndex);

  const MessageItem: React.FC<{ msg: MessageWithReplies; isReply?: boolean }> = ({ msg, isReply = false }) => {
    const timestamp: string = formatDate(new Date(msg.timestamp));
    const hasReplies = msg.replies.length > 0;
    const expanded = expandedThreads.has(msg.id);

    return (
      <div className={`c-message ${isReply ? `reply` : `m`}`}>
        <div className="cm-author">
          {msg.isPinned && <Pin size={16} style={{marginRight: "2px"}}/>}
          <span className="cma-name">{isReply ? `↪ ${msg.username}`: msg.username}</span>
          {msg.isAdmin && <span className="cma-admin">web</span>}
          <div className="line-container">
            <div className="line" style={{ backgroundColor: "var(--main)", flexGrow: "0" }}></div>
          </div>
          <div className="cma-time">{!msg.isPinned ? timestamp : "pinned"}</div>
        </div>
        <div className="cm-body">
          {parseEmojis(msg.message)}
        </div>
        <div className="cm-actions">
          {msg.isLiked && <div className="cma-liked"><span className="like">❤<span className="cmal-detail">liked by mini</span></span>
           
           </div>}
          <div style={{ flexGrow: "1" }}></div>
          {(!isReply) && <button onClick={() => setReplyingTo(msg)} disabled={msg.isPinned || sending} className="cm-reply">reply</button>}
          {hasReplies && (
            <button onClick={() => toggleThread(msg.id)} className="cm-treply">
              {expanded ? `hide replies (${msg.replies.length})` : `view replies (${msg.replies.length})`}
            </button>
          )}
        </div>

        {expanded && hasReplies && (
          <div className="cm-replies">
            {msg.replies.map((r) => (
              <MessageItem key={r.id} msg={{ ...r, replies: [] }} isReply />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="chatbox">
        <div className="mmm-header container c-header">
          <div>chat</div>
          <div className="line-container">
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className="icon-row">
              <Signal size={16} />
              <CirclePlus size={16} />
          </div>
        </div>
        <div className="c-messages container-4">
          {loading ? <div className="c-loading"> loading.. </div> : (
            currentMessages.map((msg) => <MessageItem key={msg.id} msg={msg} />
            )
          )}

          

          <div ref={messagesEndRef} className="cm-end"></div>
          <div className="cm-pages">
            <div className="line-container">
              <div className="line" style={{ backgroundColor: "var(--main)"}}></div>
            </div>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="cmp-btn"
            >
              {`<`}
            </button>

            <span className="cmp-info">
              {currentPage}/{pageCount || 1}
            </span>

            <button
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
              className="cmp-btn"
            >
              {`>`}
            </button>
            <div className="line-container">
              <div className="line" style={{ backgroundColor: "var(--main)"}}></div>
            </div>
          </div>
        </div>

        <div className="c-input">
          {replyingTo && (
            <div className="c-replying">
              replying to&nbsp;{replyingTo.username}
              <button onClick={() => setReplyingTo(null)}>cancel</button>
            </div>
          )}
          
          <div className="ci-fields container-2">
            <input
              type="text"
              placeholder="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="cif-name"
            />
            <textarea
              placeholder="message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="cif-message"
            />
            <button onClick={sendMessage} className="cif-send" disabled={sending}>send</button>
          </div>
          
        </div>
      </div>    
    </>
  )
}

function formatDate(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const month = pad(date.getMonth() + 1); 
  const day = pad(date.getDate());
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${month}/${day}/${year} - ${hours}:${minutes}`;
}

export default ChatBox;