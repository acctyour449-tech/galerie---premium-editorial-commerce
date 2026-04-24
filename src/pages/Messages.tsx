import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, MessageCircleMore, Store, UserCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationRow {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string | null;
  created_at: string;
  // joined
  buyer: { id: string; name: string | null; avatar_url: string | null };
  seller: { id: string; name: string | null; avatar_url: string | null };
  product: { name: string } | null;
  // last message (added client-side)
  lastMessage?: MessageRow;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({
  url,
  name,
  size = 36,
}: {
  url?: string | null;
  name?: string | null;
  size?: number;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name || ''}
        referrerPolicy="no-referrer"
        className="rounded-full object-cover flex-shrink-0 border border-black/10"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts: string) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Hôm nay';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Messages() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();

  // URL params from ProductDetail "Chat với người bán"
  const paramSellerId = searchParams.get('sellerId') || '';
  const paramProductId = searchParams.get('productId') || '';
  const paramProductName = searchParams.get('productName') || '';
  const paramSellerName = searchParams.get('sellerName') || '';

  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [draft, setDraft] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const bottomRef = useRef<HTMLDivElement>(null);
  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────

  const activeConv = conversations.find(c => c.id === activeConvId) ?? null;

  const counterpart = activeConv
    ? profile?.role === 'buyer'
      ? activeConv.seller
      : activeConv.buyer
    : null;

  // ── Load conversations ─────────────────────────────────────────────────────

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConvs(true);

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id, buyer_id, seller_id, product_id, created_at,
        buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url),
        seller:profiles!conversations_seller_id_fkey(id, name, avatar_url),
        product:products(name)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('loadConversations error:', error);
      setLoadingConvs(false);
      return;
    }

    const rows = (data || []) as ConversationRow[];

    // Fetch last message for each conversation
    const enriched = await Promise.all(
      rows.map(async conv => {
        const { data: msgs } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1);
        return { ...conv, lastMessage: msgs?.[0] };
      })
    );

    setConversations(enriched);
    setLoadingConvs(false);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ── Auto-open / create conversation from URL params ────────────────────────

  useEffect(() => {
    if (!paramSellerId || !user || loadingConvs) return;

    const openOrCreate = async () => {
      // Check if conversation already exists
      const existing = conversations.find(
        c => c.seller_id === paramSellerId
          && c.buyer_id === user.id
          && (paramProductId ? c.product_id === paramProductId : true)
      );

      if (existing) {
        setActiveConvId(existing.id);
        setMobileView('chat');
        return;
      }

      // Create new conversation
      if (user.id === paramSellerId) {
        return;
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          buyer_id: user.id,
          seller_id: paramSellerId,
          product_id: paramProductId || null,
        })
        .select(`
          id, buyer_id, seller_id, product_id, created_at,
          buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(id, name, avatar_url),
          product:products(name)
        `)
        .single();

      if (error) {
        console.error('Create conversation error:', error);
        return;
      }

      const newConv = data as ConversationRow;

      // Auto-send greeting from seller side (system-like first message)
      const { error: greetingError } = await supabase.from('messages').insert({
        conversation_id: newConv.id,
        sender_id: paramSellerId,
        content: `Xin chào! Tôi là người bán. Bạn muốn hỏi về sản phẩm "${paramProductName || 'này'}" phải không?`,
      });

      if (greetingError) {
        console.warn('Auto greeting skipped:', greetingError.message);
      }

      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      setMobileView('chat');
    };

    openOrCreate();
  }, [paramSellerId, paramProductId, paramProductName, user, loadingConvs, conversations]);

  // ── Load messages for active conversation ──────────────────────────────────

  useEffect(() => {
    if (!activeConvId) return;

    const loadMessages = async () => {
      setLoadingMsgs(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConvId)
        .order('created_at', { ascending: true });

      if (!error && data) setMessages(data as MessageRow[]);
      setLoadingMsgs(false);
    };

    loadMessages();

    // Subscribe to realtime new messages
    if (realtimeRef.current) {
      supabase.removeChannel(realtimeRef.current);
    }

    const channel = supabase
      .channel(`messages:${activeConvId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConvId}`,
        },
        payload => {
          const newMsg = payload.new as MessageRow;
          setMessages(prev => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Update last message in sidebar
          setConversations(prev =>
            prev.map(c =>
              c.id === activeConvId ? { ...c, lastMessage: newMsg } : c
            )
          );
        }
      )
      .subscribe();

    realtimeRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId]);

  // ── Scroll to bottom on new messages ──────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ───────────────────────────────────────────────────────────

  const sendMessage = async (text?: string) => {
    const content = (text ?? draft).trim();
    if (!content || !activeConvId || !user) return;

    setSending(true);
    setDraft('');

    const { error } = await supabase.from('messages').insert({
      conversation_id: activeConvId,
      sender_id: user.id,
      content,
    });

    if (error) {
      console.error('Send message error:', error);
      setDraft(content); // restore draft
    }

    setSending(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-32 text-center text-on-surface-variant">
        Vui lòng đăng nhập để xem tin nhắn.
      </div>
    );
  }

  // Group messages by date for display
  const groupedMessages: { date: string; msgs: MessageRow[] }[] = [];
  messages.forEach(msg => {
    const date = formatDate(msg.created_at);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ date, msgs: [msg] });
    }
  });

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-6 hidden md:block">
        <h1 className="text-4xl font-headline font-semibold tracking-tight text-on-surface">Tin nhắn</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Trao đổi trực tiếp giữa người mua và người bán qua thời gian thực.
        </p>
      </div>

      <div
        className="grid rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-ambient"
        style={{ height: 'calc(100vh - 200px)', minHeight: 560, gridTemplateColumns: '300px 1fr' }}
      >
        {/* ── Sidebar: Conversation List ── */}
        <aside
          className={`border-r border-outline-variant/20 flex flex-col bg-surface-container-low overflow-hidden
            ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
          `}
          style={{ gridColumn: 1 }}
        >
          <div className="px-4 py-4 border-b border-outline-variant/15">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
              Cuộc trò chuyện
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={20} className="animate-spin text-on-surface-variant opacity-40" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-on-surface-variant opacity-50">
                Chưa có cuộc trò chuyện nào.
                <br />
                Vào trang sản phẩm để chat với người bán.
              </div>
            ) : (
              conversations.map(conv => {
                const other = profile?.role === 'buyer' ? conv.seller : conv.buyer;
                const isActive = conv.id === activeConvId;
                const lastMsg = conv.lastMessage;

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setMobileView('chat');
                    }}
                    className={`w-full text-left px-4 py-4 flex items-start gap-3 border-b border-outline-variant/10 transition-colors
                      ${isActive ? 'bg-primary/8' : 'hover:bg-surface-container'}
                    `}
                  >
                    <Avatar url={other?.avatar_url} name={other?.name} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm text-on-surface truncate">
                          {other?.name || 'Người dùng'}
                        </p>
                        {lastMsg && (
                          <span className="text-[10px] text-on-surface-variant opacity-50 flex-shrink-0 ml-2">
                            {formatTime(lastMsg.created_at)}
                          </span>
                        )}
                      </div>
                      {conv.product && (
                        <p className="text-[10px] text-primary font-medium truncate">
                          📦 {conv.product.name}
                        </p>
                      )}
                      {lastMsg && (
                        <p className="text-xs text-on-surface-variant opacity-60 truncate mt-0.5">
                          {lastMsg.sender_id === user.id ? 'Bạn: ' : ''}
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Chat Panel ── */}
        <section
          className={`flex flex-col overflow-hidden
            ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
          `}
          style={{ gridColumn: 2 }}
        >
          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant opacity-30 gap-4">
              <MessageCircleMore size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Chọn một cuộc trò chuyện</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <header className="px-5 py-4 border-b border-outline-variant/20 flex items-center gap-3 bg-surface-container-lowest flex-shrink-0">
                <button
                  className="md:hidden p-1 rounded-lg hover:bg-surface-container transition-colors"
                  onClick={() => setMobileView('list')}
                >
                  <ArrowLeft size={18} />
                </button>
                <Avatar url={counterpart?.avatar_url} name={counterpart?.name} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm">
                    {counterpart?.name || 'Người dùng'}
                  </p>
                  {activeConv.product && (
                    <p className="text-[11px] text-on-surface-variant opacity-60 truncate">
                      📦 {activeConv.product.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="text-[10px] font-medium text-on-surface-variant opacity-60 uppercase tracking-widest">
                    Online
                  </span>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 bg-gradient-to-b from-surface-container-lowest to-white/50">
                {loadingMsgs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={20} className="animate-spin text-on-surface-variant opacity-40" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-sm text-on-surface-variant opacity-40 py-8">
                    Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                  </div>
                ) : (
                  groupedMessages.map(({ date, msgs }) => (
                    <div key={date}>
                      {/* Date divider */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-outline-variant/20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40">
                          {date}
                        </span>
                        <div className="flex-1 h-px bg-outline-variant/20" />
                      </div>

                      <div className="space-y-2">
                        {msgs.map((msg, i) => {
                          const isMine = msg.sender_id === user.id;
                          const prevMsg = msgs[i - 1];
                          const showAvatar = !isMine && msg.sender_id !== prevMsg?.sender_id;

                          return (
                            <div
                              key={msg.id}
                              className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                              {/* Avatar for other person (only on first of a sequence) */}
                              {!isMine && (
                                <div className="w-7 flex-shrink-0">
                                  {showAvatar && (
                                    <Avatar url={counterpart?.avatar_url} name={counterpart?.name} size={28} />
                                  )}
                                </div>
                              )}

                              <div
                                className={`max-w-[72%] group ${isMine ? 'items-end' : 'items-start'} flex flex-col`}
                              >
                                <div
                                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                    ${isMine
                                      ? 'bg-primary text-on-primary rounded-br-sm'
                                      : 'bg-surface-container text-on-surface rounded-bl-sm'
                                    }
                                  `}
                                >
                                  {msg.content}
                                </div>
                                <span className="text-[10px] text-on-surface-variant opacity-40 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {formatTime(msg.created_at)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Replies (only for buyer) */}
              {profile?.role === 'buyer' && (
                <div className="px-4 pt-3 flex gap-2 flex-wrap border-t border-outline-variant/10 bg-surface-container-lowest">
                  {[
                    'Sản phẩm còn hàng không?',
                    'Có thể giao trong tuần này không?',
                    'Cho mình hình thực tế nhé.',
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant border border-outline-variant/20 mb-1"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <footer className="px-4 py-3 border-t border-outline-variant/20 flex items-center gap-3 bg-surface-container-lowest flex-shrink-0">
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-surface-container rounded-xl px-4 py-2.5 text-sm outline-none border border-outline-variant/20 focus:border-primary/40 transition-colors"
                  disabled={sending}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!draft.trim() || sending}
                  className="p-2.5 rounded-xl bg-primary text-on-primary hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
}