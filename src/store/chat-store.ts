import {create} from 'zustand';
import { chatDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: Date;
}

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  loading: boolean;
  actions: {
    loadChats: () => Promise<void>;
    createChat: () => Promise<Chat>;
    renameChat: (id: string, title: string) => Promise<void>;
    deleteChat: (id: string) => Promise<void>;
    setActiveChatId: (id: string | null) => void;
    addMessage: (text: string, sender: 'user' | 'ai') => Promise<void>;
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  loading: true,
  actions: {
    async loadChats() {
      set({ loading: true });
      const chats = await chatDB.getAllChats();
      set({ chats, loading: false });
      // if (get().activeChatId === null && chats.length > 0) {
      //   set({ activeChatId: chats[0].id });
      // }
    },
    async createChat() {
      const newChat = await chatDB.addChat({
        title: 'New Chat',
        createdAt: new Date(),
        messages: [],
      });
      set((state) => ({
        chats: [...state.chats, newChat],
        activeChatId: newChat.id,
      }));
      return newChat;
    },
    async deleteChat(id) {
        await chatDB.deleteChat(id);
        set(state => {
            const newChats = state.chats.filter(chat => chat.id !== id);
            let newActiveChatId = state.activeChatId;
            if (state.activeChatId === id) {
                newActiveChatId = newChats.length > 0 ? newChats[0].id : null;
            }
            return { chats: newChats, activeChatId: newActiveChatId };
        });
    },
    async renameChat(id, title) {
        const chat = get().chats.find(chat => chat.id === id);
        if (chat) {
            const updatedChat = { ...chat, title };
            await chatDB.updateChat(updatedChat);
            set(state => ({
                chats: state.chats.map(c => c.id === id ? updatedChat : c)
            }));
        }
    },
    setActiveChatId(id) {
      set({ activeChatId: id });
    },
    async addMessage(text, sender) {
      const { activeChatId } = get();
      if (!activeChatId) return;

      const newMessage = {
        id: uuidv4(),
        text,
        sender,
        createdAt: new Date(),
      };

      await chatDB.addMessage(activeChatId, newMessage);

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        ),
      }));
    },
  },
}));
