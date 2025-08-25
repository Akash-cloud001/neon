import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

// Define the database schema
interface ChatDB extends DBSchema {
  chats: {
    key: string;
    value: {
      id: string;
      title: string;
      createdAt: Date;
      messages: {
        id: string;
        sender: 'user' | 'ai';
        text: string;
        createdAt: Date;
      }[];
    };
  };
  user_settings: {
    key: string;
    value: {
      modelName: string;
      apiKey: string;
    };
  };
  ai_tools: {
    key: string;
    value: {
      toolName: string;
      apiKey: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<ChatDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<ChatDB>('chat-database', 4, { // Incremented version to 4
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('chats', { keyPath: 'id' });
      }
      if (oldVersion < 2) {
        db.createObjectStore('user_settings', { keyPath: 'key' });
      }
      if (oldVersion < 3) {
        if (db.objectStoreNames.contains('user_settings')) {
          db.deleteObjectStore('user_settings');
        }
        db.createObjectStore('user_settings');
      }
      if (oldVersion < 4) {
        // In version 4, we modify user_settings and create ai_tools
        if (db.objectStoreNames.contains('user_settings')) {
          db.deleteObjectStore('user_settings');
        }
        db.createObjectStore('user_settings', { keyPath: 'modelName' });
        db.createObjectStore('ai_tools', { keyPath: 'toolName' });
      }
    },
  });
}

// --- CHAT DATABASE FUNCTIONS ---
export const chatDB = {
  async getAllChats() {
    if (!dbPromise) return [];
    return (await dbPromise).getAll('chats');
  },
  async getChat(id: string) {
    if (!dbPromise) return undefined;
    return (await dbPromise).get('chats', id);
  },
  async addChat(chat: Omit<ChatDB['chats']['value'], 'id'>) {
    if (!dbPromise) throw new Error('Database not initialized');
    const id = uuidv4();
    const newChat = { ...chat, id };
    await (await dbPromise).add('chats', newChat);
    return newChat;
  },
  async updateChat(chat: ChatDB['chats']['value']) {
    if (!dbPromise) throw new Error('Database not initialized');
    return (await dbPromise).put('chats', chat);
  },
  async deleteChat(id: string) {
    if (!dbPromise) throw new Error('Database not initialized');
    return (await dbPromise).delete('chats', id);
  },
  async addMessage(chatId: string, message: ChatDB['chats']['value']['messages'][0]) {
    if (!dbPromise) throw new Error('Database not initialized');
    const chat = await this.getChat(chatId);
    if (chat) {
      chat.messages.push(message);
      await this.updateChat(chat);
    }
  },
  async getAllMessages(chatId: string) {
    if (!dbPromise) throw new Error('Database not initialized');
    const chat = await this.getChat(chatId);
    return chat ? chat.messages : [];
  },
  async updateMessage(chatId: string, updatedMessage: ChatDB['chats']['value']['messages'][0]) {
    if (!dbPromise) throw new Error('Database not initialized');
    const chat = await this.getChat(chatId);
    if (chat) {
      const messageIndex = chat.messages.findIndex(m => m.id === updatedMessage.id);
      if (messageIndex > -1) {
        chat.messages[messageIndex] = updatedMessage;
        await this.updateChat(chat);
      }
    }
  },
  async deleteMessage(chatId: string, messageId: string) {
    if (!dbPromise) throw new Error('Database not initialized');
    const chat = await this.getChat(chatId);
    if (chat) {
      chat.messages = chat.messages.filter(m => m.id !== messageId);
      await this.updateChat(chat);
    }
  },
};

// --- SETTINGS DATABASE FUNCTIONS ---
export const settingsDB = {
  async getModel(modelName: string) {
    if (!dbPromise) return undefined;
    return (await dbPromise).get('user_settings', modelName);
  },
  async getAllModels() {
    if (!dbPromise) return [];
    return (await dbPromise).getAll('user_settings');
  },
  async saveModel(model: { modelName: string, apiKey: string }) {
    if (!dbPromise) throw new Error('Database not initialized');
    return (await dbPromise).put('user_settings', model);
  },
};

// --- TOOLS DATABASE FUNCTIONS ---
export const toolsDB = {
  async getTool(toolName: string) {
    if (!dbPromise) return undefined;
    return (await dbPromise).get('ai_tools', toolName);
  },

  async saveTool(tool: { toolName: string, apiKey: string }) {
    if (!dbPromise) throw new Error('Database not initialized');
    return (await dbPromise).put('ai_tools', tool);
  },
};