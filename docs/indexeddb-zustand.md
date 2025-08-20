
# Using IndexedDB with Zustand for Chat Storage

This document outlines how to use IndexedDB for persistent client-side storage and Zustand for state management in your chat application.

## 1. IndexedDB Explained

IndexedDB is a low-level API for client-side storage of large amounts of structured data, including files and blobs. It's a transactional database system, similar to SQL-based RDBMSs. However, unlike SQL RDBMSs, which use fixed-column tables, IndexedDB is a JavaScript-based object-oriented database.

### Key Concepts:

*   **Database:** A container for all your data. You create a database with a specific name and version.
*   **Object Store:** A container for your data, similar to a table in a relational database. Each object store has a unique name within the database.
*   **Index:** A way to organize data in an object store, allowing for efficient searching and sorting.
*   **Transaction:** A wrapper around your database operations, ensuring data integrity. All read and write operations must be part of a transaction.
*   **Cursor:** A way to iterate over records in an object store.

### Why use IndexedDB for chat?

*   **Large Storage Capacity:** IndexedDB offers significantly more storage than `localStorage` (typically 5MB), allowing you to store extensive chat histories.
*   **Asynchronous API:** It's non-blocking, so it won't freeze the user interface while performing database operations.
*   **Offline Support:** By storing chat data in IndexedDB, your application can work offline, and messages can be synced when the connection is restored.

### Using the `idb` Library

The raw IndexedDB API can be complex and verbose. The `idb` library by Jake Archibald provides a thin, promise-based wrapper around IndexedDB, making it much easier to use.

**Example with `idb`:**

```typescript
import { openDB } from 'idb';

const dbPromise = openDB('chat-db', 1, {
  upgrade(db) {
    db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
  },
});

export async function addMessage(message) {
  const db = await dbPromise;
  await db.add('messages', message);
}

export async function getMessages() {
  const db = await dbPromise;
  return db.getAll('messages');
}
```

## 2. Zustand Explained

Zustand is a small, fast, and scalable state management solution for React. It uses a minimalistic API based on hooks and doesn't require you to wrap your application in a context provider.

### Key Features:

*   **Simple API:** Create a store by defining your state and the actions that modify it.
*   **Hooks-based:** Access your state and actions directly in your components using a single hook.
*   **No Boilerplate:** No need for actions, reducers, or dispatchers.
*   **Middleware Support:** Extend Zustand's functionality with middleware for things like logging, persistence, or integration with other tools.

### Basic Usage:

```typescript
import {create} from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
}));

function Chat() {
  const { messages, addMessage } = useChatStore();
  // ...
}
```

## 3. Using IndexedDB with Zustand

The best way to combine IndexedDB and Zustand is to use Zustand for your application's real-time state and IndexedDB as the persistent storage layer.

### Strategy:

1.  **Create an IndexedDB service:** Encapsulate all your IndexedDB logic in a dedicated module (e.g., `lib/db.ts`). This module will use the `idb` library and expose functions for interacting with the database (e.g., `addMessage`, `getMessages`).

2.  **Create a Zustand store:** Your Zustand store will hold the chat messages currently displayed in the UI.

3.  **Connect the store to the database:**
    *   **Initialization:** When the application loads, fetch the messages from IndexedDB and initialize your Zustand store with this data.
    *   **Actions:** When an action is performed (e.g., sending a new message), the action in your Zustand store will first call the corresponding function in your IndexedDB service to persist the data. After the data is successfully saved, the action will update the in-memory state in the Zustand store.

### Example Implementation for Multiple Chats:

Here's how you can structure your code to handle multiple chats.

**`lib/db.ts`**

This file will manage all IndexedDB interactions. We'll have one object store for `chats`.

```typescript
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
```

**`store/chat-store.ts`**

This Zustand store will manage the state of your chats.

```typescript
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
    createChat: () => Promise<void>;
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
      if (get().activeChatId === null && chats.length > 0) {
        set({ activeChatId: chats[0].id });
      }
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

```

**In your main App component or layout:**

```tsx
import { useEffect } from 'react';
import { useChatStore } from '@/store/chat-store';

function AppLayout({ children }) {
  const { loadChats } = useChatStore((state) => state.actions);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return (
    <div>
      {children}
    </div>
  );
}
```

This setup provides a robust way to manage multiple chats with persistent storage, ensuring a smooth user experience.

### How to use in your application

- **Creating a new chat:**
To create a new chat, simply call the `createChat` action from the `useChatStore`. By default, the chat will be titled "New Chat".
```tsx
const { createChat } = useChatStore((state) => state.actions);

<Button onClick={createChat}>New Chat</Button>
```

- **Renaming a chat:**
To rename a chat, call the `renameChat` action with the `chatId` and the `newTitle`.
```tsx
const { renameChat } = useChatStore((state) => state.actions);

// Example: Rename chat with id 'chat_1' to 'My awesome chat'
renameChat('chat_1', 'My awesome chat');
```
