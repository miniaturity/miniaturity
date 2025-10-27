import { useEffect, useRef, useState } from "react";

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby8DlypbE-5XYq0b9flJtgWCdp76AtlqsvSa4R5VsJM9Jv-qCF_wFyMRBqARG2E6-wKqA/exec';

interface Message {
  id: string,
  timestamp: string,
  username: string,
  message: string,
  parentId: string | null,
  isAdmin: boolean,
}

interface MessageWithReplies extends Message {
  replies: Message[]
}

interface ChatBoxProps {
  mainCol: string,
}



const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [messageText, setMessageText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
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
        loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
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

    return topLevel.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const MessageItem: React.FC<{ msg: Message; isReply?: boolean }> = ({ msg, isReply = false }) => {
    
    
    return (
      <div className={isReply ? `c-message` : `c-reply`}>
        
      </div>
    )
  }

  return (
    <>
    
    </>
  )
}

export default ChatBox;