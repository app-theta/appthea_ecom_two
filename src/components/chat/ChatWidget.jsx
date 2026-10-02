import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '../Icons';
import { useChat } from '../../context/ChatContext';
import ChatPanel from './ChatPanel';

const onChatPage = (pathname) => pathname.startsWith('/account/chat');

/**
 * The chat window (when the store has live chat). Everyone can open it; a guest is asked to
 * log in. Its button sits with the other floating buttons (ChatFab). Hidden on the account's
 * own chat page.
 */
export default function ChatWidget() {
  const { enabled, isOpen, setOpen } = useChat();
  const { pathname } = useLocation();
  const hidden = onChatPage(pathname);

  // Esc closes the window
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setOpen]);

  useEffect(() => { if (hidden) setOpen(false); }, [hidden, setOpen]);

  if (!enabled || hidden || !isOpen) return null;

  return (
    <div className="chat-popup" role="dialog" aria-label="Chat with the store">
      <ChatPanel variant="popup" onClose={() => setOpen(false)} />
    </div>
  );
}

/** The floating chat button, with the unread count. */
export function ChatFab() {
  const { enabled, isOpen, setOpen, unread } = useChat();
  const { pathname } = useLocation();

  if (!enabled || onChatPage(pathname)) return null;

  return (
    <button type="button" className={`fab chat-fab ${isOpen ? 'is-open' : ''}`} onClick={() => setOpen(!isOpen)}
            aria-label={isOpen ? 'Close chat' : 'Chat with the store'}>
      {isOpen ? <Icon.close /> : <Icon.chat />}
      {!isOpen && unread > 0 && <span className="cart-count chat-fab__count">{unread > 99 ? '99+' : unread}</span>}
    </button>
  );
}
