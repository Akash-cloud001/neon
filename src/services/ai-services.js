import { Groq } from "groq-sdk";
import { tavily } from "@tavily/core";
import { settingsDB, toolsDB } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

// access the api keys from the DB
const groqModel = await settingsDB.getModel("groq");
const tavilyTool = await toolsDB.getTool("tavily");



// grab the user message from the DB
// const userMessage = await settingsDB.getSetting('userMessage')

// need passphrase to decrypt the api keys
const passphrase = await settingsDB.getSetting("passphrase");
const decryptedGroqApiKey = decrypt(groqModel.apiKey, passphrase);
const decryptedTavilyApiKey = decrypt(tavilyTool.apiKey, passphrase);


// class AiWrapper {
//   model= null;
//   constructor(modelName){
//     this.modelName = modelName;
//   }

//   async getModel(){
//     const mod = await settingsDB.getModel(this.modelName);
//     //! switch cases to get the current user prefeered modal and return it's instance.
//     switch (mod.name) {
//       case 'llama-3.3-70b-versatile':
//         return new GroqClient(mod.name, mod.apiKey);
//         break;
    
//       default:
//         break;
//     }
//   }

// }

class GroqClient {
    #systemMessage = [];
    constructor(modelName, apiKey, tavilyApiKey){
        this.modelName = modelName;
        this.apiKey = apiKey;
        this.client = new Groq({apikey: this.apiKey})
        this.tavilyClient = tavily({apikey: tavilyApiKey})
        this.#systemMessage.push({
            role: "system",
            content: `You are Neon, a helpful personal assistant. You answer questions accurately and helpfully.
            
                You have access to the following tools:
                - webSearch: Use this to search for current information, real-time data, recent events, or any information you don't have in your knowledge base.
                
                Current date and time: ${new Date().toLocaleString()}
                
                Always provide complete, helpful responses. If you use web search, synthesize the information to give a comprehensive answer.`,
        })
    }

    async callModel(message){
        try {
            await this.addUserMessage(message);
            const response = await this.processAssistantResponse(systemMessage, 5)
            return {
                success:true,
                response:response
            }
        } catch (error) {
            console.error("An error occurred:", error);
            return {
                success:false,
                error:error.message
            }
        }
    }


    async addUserMessage(message){
        this.#systemMessage.push({
            role: "user",
            content: message
        })
    }

    async processAssistantResponse(messages, maxIterations = 5) {
        let iterations = 0;
      
        while (iterations < maxIterations) {
          iterations++;
          
          try {
            const completion = await this.client.chat.completions.create({
              model: this.modelName,
              temperature: 0.1,
              messages: messages,
              stream: true,
              tools: [
                {
                  type: "function",
                  function: {
                    name: "webSearch",
                    description: "Search the internet for current information, real-time data, recent events, or specific facts.",
                    parameters: {
                      type: "object",
                      properties: {
                        query: {
                          type: "string",
                          description: "The search query to find relevant information",
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
            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
              console.log("🔍 Searching for information...");
              
              // Execute all tool calls
              for (const toolCall of assistantMessage.tool_calls) {
                const toolName = toolCall.function.name;
                const toolArgs = JSON.parse(toolCall.function.arguments);
      
                if (toolName === "webSearch") {
                  try {
                    const searchResult = await this.webSearch(toolArgs);
                    
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
                      content: "I encountered an error while searching. Please try rephrasing your question.",
                    });
                  }
                }
              }
              
              // Continue the loop to get the assistant's response after tool execution
              continue;
            }
      
            // If no tool calls, this is the final response
            if (assistantMessage.content) {
              console.log(`Neon: ${assistantMessage.content}`);
              return assistantMessage.content;
            }
      
          } catch (error) {

            console.error("Error getting assistant response:", error);
            console.log("Neon: I'm sorry, I encountered an error. Please try again.");
            return {
                success:false,
                error:error.message
            }
          }
        }
      
        console.log("Neon: I'm having trouble processing your request after several attempts. Please try rephrasing your question.");
    }

    async webSearch({ query }) {
        console.log(`🔍 Searching for: "${query}"`);
        
        try {
          const response = await this.tavilyClient.search(query, {
            max_results: 5,
            include_raw_content: false,
          });
      
          if (!response.results || response.results.length === 0) {
            return "No search results found for your query.";
          }
      
          // Format search results for the assistant
          const formattedResults = response.results
            .map((result, index) => 
              `[${index + 1}] ${result.title}\n${result.content}\nSource: ${result.url}\n`
            )
            .join("\n---\n");
          return `Search results for "${query}":\n\n${formattedResults}`;
          
        } catch (error) {
            console.error("Tavily search error:", error);
            return {
                success:false,
                error:error.message
            }
        }
    }
}
