import { generate } from "../../../lib/groq-chat";

export async function GET() {
  return Response.json({ message: "Hello from Next.js App Router!" });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await generate(body.message, body.conversationHistory);
        
    if (result) {
      return Response.json({
        success: true,
        data: result
      });
    } else {
      return Response.json({
        success: false,
        data: 'No relevant data found'
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({
      success: false,
      error: 'An error occurred while processing your request'
    }, { status: 500 });
  }
}