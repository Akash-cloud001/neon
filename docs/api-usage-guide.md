# How to Use the Chat API

This guide explains how to connect your frontend to the backend chat API endpoint at `/api/chat`.

## Endpoint

**URL**: `/api/chat`

**Method**: `POST`

## Description

This endpoint processes a conversation by streaming a response from a Large Language Model (LLM). It accepts the user's entire chat history and their personal API keys, orchestrates calls to the LLM and other tools (like web search), and streams the final response back to the client.

## Request Body

The request must be a JSON object with the following structure:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "What is the weather in London?"
    }
  ],
  "apiKeys": {
    "groqApiKey": "your_decrypted_groq_api_key",
    "tavilyApiKey": "your_decrypted_tavily_api_key"
  }
}
```

### Fields:

-   `messages` (required): An array of message objects, following the standard format for conversational AI. The `role` can be `system`, `user`, or `assistant`.
-   `apiKeys` (required): An object containing the user's decrypted API keys.
    -   `groqApiKey` (string, required): The user's Groq API key.
    -   `tavilyApiKey` (string, required): The user's Tavily API key.

## Response

The API returns a `StreamingTextResponse`. Your client code will need to read this stream to get the real-time output from the assistant.

## Example: Frontend `fetch` Call

Here is a complete example of how to call the API from your React frontend using `fetch` and the `ai/react` library's stream-handling capabilities.

First, ensure you have the `ai` package installed (`npm install ai`).

```jsx
// Example usage in a React component

'use client';

import { useChat } from 'ai/react';

export default function ChatComponent() {
  // The useChat hook handles all the state management for you.
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    // We need to add the API keys to the request body
    body: {
      apiKeys: {
        // You must get these decrypted keys from your session store
        groqApiKey: 'YOUR_DECRYPTED_GROQ_KEY',
        tavilyApiKey: 'YOUR_DECRYPTED_TAVILY_KEY',
      },
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          <strong>{`${m.role}: `}</strong>
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

### Explanation:

1.  **`useChat` Hook**: The `useChat` hook from the `ai/react` library is the simplest way to interact with the streaming API. It handles all the complexity of reading the stream, managing message state, and handling user input.
2.  **`api` option**: You specify the endpoint URL, which is `/api/chat`.
3.  **`body` option**: This is crucial. You pass an object containing the `apiKeys` field. The `useChat` hook will automatically merge this body with the `messages` array when it makes the `POST` request.
4.  **Getting Keys**: In the example, the keys are hardcoded as placeholders. In your actual implementation, you will fetch these decrypted keys from your `session-store` before rendering the component or making the request.

This setup provides a robust and efficient way to connect your frontend to the powerful backend you've just built.
