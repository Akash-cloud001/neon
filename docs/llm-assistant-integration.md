
# LLM Assistant Integration Guide

This document outlines the integration of a personal AI assistant, "Neon," into the Next.js application. The assistant uses the Groq API for language model processing and the Tavily API for web search capabilities.

## Architecture

The integration follows a standard client-server model within the Next.js framework:

1.  **Frontend**: The chat interface, built with React, captures user input and displays the conversation. It is located at `src/app/chat/[id]/page.jsx`.
2.  **API Route**: A dedicated backend API route at `src/app/api/chat/route.ts` receives requests from the frontend.
3.  **Backend Logic**: The API route contains the core logic to process the user's message. It securely accesses API keys from environment variables and communicates with the external Groq and Tavily services.
4.  **External Services**:
    *   **Groq**: Provides the core LLM for generating responses.
    *   **Tavily**: Provides the web search functionality.

This architecture ensures that sensitive API keys are never exposed to the client-side browser.

## Setup and Configuration

To use the assistant, you must configure the required API keys.

### 1. Create the Environment File

Create a new file named `.env.local` in the root directory of the project.

### 2. Add API Keys

Add your API keys to the `.env.local` file as follows:

```
GROQ_API_KEY="your_groq_api_key_here"
TAVILY_API_KEY="your_tavily_api_key_here"
```

**Note**: The `.env.local` file is included in the project's `.gitignore` and should never be committed to version control.

## How to Use

1.  Ensure you have completed the setup steps above.
2.  Run the application in development mode:
    ```bash
    npm run dev
    ```
3.  Navigate to the chat interface in your browser.
4.  Start a conversation with Neon. If you ask a question that requires current information, the assistant will automatically use its web search tool.

