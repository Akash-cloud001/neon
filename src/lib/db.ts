import { openDB, DBSchema } from 'idb';
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
}

// Open the database
const dbPromise = openDB<ChatDB>('chat-database', 1, {
  upgrade(db) {
    db.createObjectStore('chats', { keyPath: 'id' });
  },
});

// Database interaction functions
export const chatDB = {
  async getAllChats() {
    return (await dbPromise).getAll('chats');
  },
  async getChat(id: string) {
    return (await dbPromise).get('chats', id);
  },
  async addChat(chat: Omit<ChatDB['chats']['value'], 'id'>) {
    const id = uuidv4();
    const newChat = { ...chat, id };
    await (await dbPromise).add('chats', newChat);
    return newChat;
  },
  async updateChat(chat: ChatDB['chats']['value']) {
    return (await dbPromise).put('chats', chat);
  },
  async deleteChat(id: string) {
    return (await dbPromise).delete('chats', id);
  },
  async addMessage(chatId: string, message: ChatDB['chats']['value']['messages'][0]) {
    const chat = await this.getChat(chatId);
    if (chat) {
      chat.messages.push(message);
      await this.updateChat(chat);
    }
  },
};
