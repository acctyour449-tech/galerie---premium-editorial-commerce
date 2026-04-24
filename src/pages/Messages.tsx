import { useEffect, useMemo, useState } from 'react';
import { Send, MessageCircleMore, Store, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserPreferences } from '../context/UserPreferencesContext';

type Role = 'buyer' | 'seller';

interface ConversationMessage {
  id: string;
  sender: Role;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  name: string;
  counterpartRole: Role;
  topic: string;
  online: boolean;
  messages: ConversationMessage[];
}

const initialThreads: Conversation[] = [
  {
    id: 'thread-atelier',
    name: 'Atelier Nord',
    counterpartRole: 'seller',
    topic: 'Hỏi về thời gian giao ghế lounge',
    online: true,
    messages: [
      {
        id: 'm1',
        sender: 'buyer',
        content: 'Chào shop, sản phẩm này có giao trong tuần này không?',
        createdAt: '09:30',
      },
      {
        id: 'm2',
        sender: 'seller',
        content: 'Có ạ. Bên em có thể giao trong 2-3 ngày tại nội thành.',
        createdAt: '09:36',
      },
    ],
  },
  {
    id: 'thread-premium-support',
    name: 'Premium Support',
    counterpartRole: 'seller',
    topic: 'Đổi địa chỉ đơn #GLR-1205',
    online: false,
    messages: [
      {
        id: 'm3',
        sender: 'seller',
        content: 'Bạn có thể gửi lại địa chỉ mới để hệ thống cập nhật giúp bạn nhé.',
        createdAt: 'Hôm qua',
      },
    ],
  },
];

const quickReplies = [
  'Shop ơi, có thể hỗ trợ thêm hình ảnh thực tế không?',
  'Cho mình xin ETA giao hàng nhé.',
  'Mình muốn đổi size/màu cho đơn này.',
];

export default function Messages() {
  const { user, profile } = useAuth();
  const { preferences } = useUserPreferences();

  const storageKey = useMemo(
    () => `galerie:messages:${user?.id || 'guest'}`,
    [user?.id]
  );

  const [threads, setThreads] = useState<Conversation[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as Conversation[]) : initialThreads;
    } catch {
      return initialThreads;
    }
  });
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setThreads(raw ? (JSON.parse(raw) as Conversation[]) : initialThreads);
    } catch {
      setThreads(initialThreads);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(threads));
  }, [threads, storageKey]);

  const activeThread = useMemo(
    () => threads.find(thread => thread.id === activeThreadId) || threads[0],
    [threads, activeThreadId]
  );

  const onSend = (valueFromQuickReply?: string) => {
    const value = (valueFromQuickReply ?? draft).trim();
    if (!value || !activeThread) return;

    setThreads(prev =>
      prev.map(thread =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: profile?.role || 'buyer',
                  content: value,
                  createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            }
          : thread
      )
    );

    if (preferences.chatSound) {
      window.navigator.vibrate?.(10);
    }

    if (!valueFromQuickReply) {
      setDraft('');
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12 animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-semibold tracking-tight">Trung tâm tin nhắn</h1>
        <p className="text-on-surface-variant mt-2 text-sm">
          Trao đổi trực tiếp giữa người mua và người bán để chốt đơn nhanh hơn, minh bạch hơn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden min-h-[640px]">
        <aside className="border-r border-outline-variant/20 bg-surface-container-low">
          {threads.map(thread => {
            const unread = thread.id !== activeThreadId && thread.messages[thread.messages.length - 1]?.sender !== profile?.role;
            return (
              <button
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full text-left px-5 py-4 border-b border-outline-variant/10 transition-colors ${
                  activeThreadId === thread.id ? 'bg-primary/10' : 'hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-on-surface">{thread.name}</p>
                  {unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{thread.topic}</p>
              </button>
            );
          })}
        </aside>

        <section className="flex flex-col">
          <header className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-3">
              {activeThread.counterpartRole === 'seller' ? <Store size={18} /> : <UserCircle2 size={18} />}
              <div>
                <p className="font-semibold">{activeThread.name}</p>
                <p className="text-xs text-on-surface-variant">{activeThread.online ? 'Đang hoạt động' : 'Phản hồi trong 1 giờ'}</p>
              </div>
            </div>
            <span className="text-xs rounded-full px-3 py-1 bg-surface-container text-on-surface-variant">{activeThread.topic}</span>
          </header>

          <div className="flex-1 p-6 space-y-4 bg-gradient-to-b from-white to-surface-container-lowest overflow-y-auto">
            {activeThread.messages.map(msg => {
              const mine = msg.sender === profile?.role;
              return (
                <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      mine ? 'bg-primary text-on-primary rounded-br-md' : 'bg-surface-container rounded-bl-md'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-[10px] mt-1 block ${mine ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{msg.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="p-4 border-t border-outline-variant/20 flex flex-col gap-3 bg-surface-container-low">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map(reply => (
                <button
                  key={reply}
                  onClick={() => onSend(reply)}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-white transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <MessageCircleMore size={18} className="text-on-surface-variant" />
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') onSend();
                }}
                placeholder="Nhập tin nhắn cho người bán / người mua..."
                className="flex-1 bg-white rounded-lg px-4 py-3 text-sm outline-none border border-outline-variant/20 focus:border-primary"
              />
              <button
                onClick={() => onSend()}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
              >
                Gửi <Send size={16} />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}