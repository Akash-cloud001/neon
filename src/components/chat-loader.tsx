'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/store/chat-store';

export function ChatLoader({ children }: { children: React.ReactNode }) {
  const actions = useChatStore((state) => state.actions);
  const loading = useChatStore((state) => state.loading);

  useEffect(() => {
    actions.loadChats();
  }, [actions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading chats...</p>
      </div>
    );
  }

  return <>{children}</>;
}