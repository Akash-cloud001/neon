import { Groq } from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function generate(userMessage) {
  const messages = [
    // {
    //   role: "system",
    //   content: `You are Neon, a helpful personal assistant. You answer questions accurately and helpfully.
            
    //         You have access to the following tools:
    //         - webSearch: Use this to search for current information, real-time data, recent events, or any information you don't have in your knowledge base.
            
    //         Current date and time: ${new Date().toLocaleString()}
            
    //         Always provide complete, helpful responses. If you use web search, synthesize the information to give a comprehensive answer.`,
    // },
    {
      role: "system",
      content: `You are Neon, a helpful personal assistant. You answer questions accurately and helpfully.
        If you know the answer to a question, answer it directly in plain English.
        If the answer requires real-time, local, or up-to-date information, or if you don't know the answer, use the available tools to find it.
        You have access to the following tool:
        
        webSearch(query: string): Use this to search the internet for current or unknown information.
        Decide when to use your own knowledge and when to use the tool.
        
        Do not mention the tool unless needed

        Example:
        Q: What is the capital of France?
        A: The capital of France is Paris.

        Q: What's the weather in Mumbai right now?
        A: (use the search tool to find the latest weather)

        Q: Who is the Prime Minister of India?
        A: The current Prime Minister of India is Narendra Modi.

        Q: Tell me the latest IT news.
        A: (use the search tool to get the latest news)

        current date and time: ${new Date().toUTCString()}

        Always provide complete, helpful responses. If you use web search, synthesize the information to give a comprehensive answer.
      `,
    },
  ];

  try {
    // Add user message to conversation history
    messages.push({
      role: "user",
      content: userMessage,
    });

    const result = await processAssistantResponse(messages);
    return result; // Make sure to return the result
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Throw error instead of returning undefined
  }
}

async function processAssistantResponse(messages, maxIterations = 5) {
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the internet for current information, real-time data, recent events, or specific facts.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description:
                      "The search query to find relevant information",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      const assistantMessage = completion.choices[0].message;

      // Always add the assistant's message to history first
      messages.push(assistantMessage);

      // Check if the assistant wants to use tools
      if (
        assistantMessage.tool_calls &&
        assistantMessage.tool_calls.length > 0
      ) {
        // Execute all tool calls
        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          if (toolName === "webSearch") {
            try {
              const searchResult = await webSearch(toolArgs);

              // Add tool result to messages
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: searchResult,
              });
            } catch (error) {
              console.error("Search error:", error);
              messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content:
                  "I encountered an error while searching. Please try rephrasing your question.",
              });
            }
          }
        }

        // Continue the loop to get the assistant's response after tool execution
        continue;
      }

      // If no tool calls, this is the final response
      if (assistantMessage.content) {
        return assistantMessage.content; // Return the content
      }
    } catch (error) {
      console.error("Error getting assistant response:", error);
      const errorMessage =
        "I'm sorry, I encountered an error. Please try again.";
      return errorMessage; // Return error message instead of the error object
    }
  }

  const maxAttemptsMessage =
    "I'm having trouble processing your request after several attempts. Please try rephrasing your question.";
  return maxAttemptsMessage; // Return the message instead of just logging
}

async function webSearch({ query }) {
  try {
    const response = await tvly.search(query, {
      max_results: 5,
      include_raw_content: false,
    });

    if (!response.results || response.results.length === 0) {
      return "No search results found for your query.";
    }

    // Format search results for the assistant
    const formattedResults = response.results
      .map(
        (result, index) =>
          `[${index + 1}] ${result.title}\n${result.content}\nSource: ${
            result.url
          }\n`
      )
      .join("\n---\n");
    return `Search results for "${query}":\n\n${formattedResults}`;
  } catch (error) {
    console.error("Tavily search error:", error);
    throw new Error("Failed to perform web search");
  }
}
