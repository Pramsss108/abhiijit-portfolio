import portfolioData from './portfolio_data.json';

const HF_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";
// HF retired api-inference.huggingface.co; chat completions now go through the Inference Providers router
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // Or specify abhiijit.works
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 2. Only allow POST requests
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
      const { messages } = await request.json();

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: "Invalid messages format" }), { status: 400 });
      }

      // 3. Inject the "Brain" (In-Context Learning)
      const systemPrompt = {
        role: "system",
        content: `You are the AI assistant for Abhijit Pramanik's portfolio website. 
You answer questions about his experience, services, and skills concisely and professionally.
Here is the extracted JSON data representing his experience and capabilities:
${JSON.stringify(portfolioData, null, 2)}
Only use the information provided in the JSON to answer questions. If you don't know the answer, politely redirect the user to contact Abhijit.`
      };

      // 4. Construct the Hugging Face Payload
      const hfPayload = {
        model: HF_MODEL,
        messages: [systemPrompt, ...messages],
        max_tokens: 300,
        temperature: 0.7
      };

      // 5. Call Hugging Face Inference API
      const hfResponse = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(hfPayload)
      });

      if (!hfResponse.ok) {
        const err = await hfResponse.text();
        console.error("HF Error:", err);
        return new Response(JSON.stringify({ error: "AI Engine is currently unavailable." }), { status: 502 });
      }

      const hfData = await hfResponse.json();

      // 6. Return response to the frontend with CORS headers
      return new Response(JSON.stringify(hfData), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  },
};
