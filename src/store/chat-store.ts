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
  activeChat: Chat | null;
  actions: {
    loadChats: () => Promise<void>;
    createChat: () => Promise<Chat>;
    renameChat: (id: string, title: string) => Promise<void>;
    deleteChat: (id: string) => Promise<void>;
    setActiveChatId: (id: string) => void;
    addMessage: (text: string, sender: 'user' | 'ai', messageId?: string) => Promise<void>;
    loadMessages: (chatId: string) => Promise<void>;
    updateMessage: (chatId: string, message: Message) => Promise<void>;
    updateMessageContent: (messageId: string, content: string) => Promise<void>;
    deleteMessage: (chatId: string, messageId: string) => Promise<void>;
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  loading: true,
  activeChat: null,
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
        activeChat: newChat
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
            const newActiveChat = newActiveChatId ? newChats.find(chat => chat.id === newActiveChatId) : null;
            return { chats: newChats, activeChatId: newActiveChatId, activeChat: newActiveChat };
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
    async setActiveChatId(id:string) {
      if (id === get().activeChatId) return;
      const chat = await chatDB.getChat(id);
      set({ activeChatId: id, activeChat: chat });
    },
    async addMessage(text, sender, messageId) {
      const { activeChatId } = get();
      if (!activeChatId) return;

      const newMessage = {
        id: messageId || uuidv4(),
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
        activeChat: state.activeChat ? { ...state.activeChat, messages: [...state.activeChat.messages, newMessage] } : null
      }));
    },
    async loadMessages(chatId) {
      const messages = await chatDB.getAllMessages(chatId);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages }
            : chat
        ),
      }));
    },
    async updateMessage(chatId, message) {
      await chatDB.updateMessage(chatId, message);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: chat.messages.map(m => m.id === message.id ? message : m) }
            : chat
        ),
        activeChat: state.activeChat && state.activeChat.id === chatId 
          ? { ...state.activeChat, messages: state.activeChat.messages.map(m => m.id === message.id ? message : m) }
          : state.activeChat
      }));
    },
    async updateMessageContent(messageId, content) {
      const { activeChatId } = get();
      if (!activeChatId) return;

      // Find the message in the active chat
      const state = get();
      const message = state.activeChat?.messages.find(m => m.id === messageId);
      if (!message) return;

      const updatedMessage = { ...message, text: content };
      await this.updateMessage(activeChatId, updatedMessage);
    },
    async deleteMessage(chatId, messageId) {
      await chatDB.deleteMessage(chatId, messageId);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: chat.messages.filter(m => m.id !== messageId) }
            : chat
        ),
      }));
    },
  },
}));
