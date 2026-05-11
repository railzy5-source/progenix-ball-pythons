
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Snake } from "../types";

// Initialize Gemini Client
// The API key is injected via vite.config.ts from the environment variable API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper for exponential backoff
const runWithRetry = async <T>(operation: () => Promise<T>, retries = 3, baseDelay = 1000): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      // Check for Missing Key or Invalid Request first (400) - Do not retry
      if (error?.status === 400 || error?.code === 400) {
          console.error("Gemini API 400 Error (Likely Invalid/Missing API Key):", error);
          throw new Error("Invalid API Key or Bad Request. Please check configuration.");
      }

      // Identify 503 errors (Service Unavailable / Overloaded)
      const isOverloaded = 
        error?.status === 503 || 
        error?.code === 503 || 
        (error?.message && (error.message.includes('503') || error.message.includes('Overloaded') || error.message.includes('high demand')));

      if (isOverloaded && i < retries - 1) {
        const delay = baseDelay * Math.pow(2, i); // 1s, 2s, 4s
        console.warn(`Gemini overloaded (503). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Propagate other errors or if max retries reached
    }
  }
  throw new Error("Max retries exceeded");
};

export const aiService = {
  
  /**
   * Generates a sales description for a specific snake.
   */
  async generateSalesCopy(snake: Snake): Promise<string> {
    try {
        // Extract Logs
        const feedingLogs = snake.logs
            .filter(l => l.type === 'Feeding')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map(l => `- ${l.date}: ${(l as any).item} (${(l as any).result})`);

        const weightLogs = snake.logs
            .filter(l => l.type === 'Weight')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map(l => `- ${l.date}: ${(l as any).weight}g`);

        const sheddingLogs = snake.logs
            .filter(l => l.type === 'Shedding')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3)
            .map(l => `- ${l.date}: ${(l as any).quality}`);

        const prompt = `
        You are a passionate, private hobbyist Ball Python breeder writing a listing for surplus stock on MorphMarket or social media.
        
        Animal Details:
        - ID: ${snake.id}
        - Sex: ${snake.sex}
        - Genetics: ${snake.genetics.join(", ")}
        - Current Weight: ${snake.currentWeight}g
        - Hatch Date: ${snake.dob || 'Unknown'}
        - Diet: ${snake.feeding.preySize} (Frequency: every ${snake.feeding.frequency} days)
        - Price: ${snake.price ? '£' + snake.price : 'Contact for Price'}
        
        Feeding History (Last 10):
        ${feedingLogs.length > 0 ? feedingLogs.join("\n") : "No records."}
        
        Weight History (Last 5):
        ${weightLogs.length > 0 ? weightLogs.join("\n") : "No records."}
        
        Shedding History (Last 3):
        ${sheddingLogs.length > 0 ? sheddingLogs.join("\n") : "No records."}
        
        Task:
        Write a detailed, honest, and passionate description.
        1. Highlight the genetics clearly.
        2. Specifically mention their feeding habits based on the logs (e.g., "Smashing weaner rats every week", "Never misses a meal").
        3. Mention their health/shedding if good.
        4. State clearly this is surplus from a private collection.
        5. Keep it approx 150 words. 
        6. Use relevant reptile emojis.
        `;

        const response = await runWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        }));

        return response.text || "Could not generate description.";
    } catch (error) {
        console.error("AI Generation Error:", error);
        return "⚠️ Service unavailable. Please check your API Key or try again later.";
    }
  },

  /**
   * Performs a strategic "Roast" / Gap analysis of the collection.
   */
  async getStrategicAnalysis(snakes: Snake[]): Promise<string> {
    try {
        const collection = snakes
            .filter(s => s.status !== 'Sold')
            .map(s => `- ${s.sex} ${s.id}: ${s.genetics.join(", ")} (${s.currentWeight}g)`);

        const prompt = `
        Act as a ruthless and highly strategic high-end Ball Python investment advisor.
        Analyze my current collection inventory and provide a strategic critique.
        
        My Collection:
        ${collection.join("\n")}
        
        Task:
        1. **Ratio Analysis**: Analyze my Male:Female ratio. Am I male heavy? Do I have enough females to support my males?
        2. **Genetic Gaps**: Identify clear missing pieces. (e.g. "You have 3 Clown males but zero Clown females" or "You have 5 recessive projects but no double-hets").
        3. **Power Rankings**: Identify the top 2 "Power Animals" in the collection that should be the focus.
        4. **Sell/Hold Advice**: Point out any animals that might be "dead weight" genetically compared to the rest of the group.
        
        Tone: Professional, direct, analytical. Use bold headers.
        `;

        const response = await runWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        }));

        return response.text || "Could not analyze collection.";
    } catch (error) {
        console.error("AI Analysis Error:", error);
        return "⚠️ Service unavailable. Please check your API Key or try again later.";
    }
  },

  /**
   * Generates a newsletter based on available snakes.
   */
  async generateNewsletter(snakes: Snake[]): Promise<string> {
    try {
        const availableSnakes = snakes
            .filter(s => s.status === 'For Sale')
            .map(s => `- ${s.id}: ${s.genetics.join(", ")} (${s.sex}, ${s.currentWeight}g, £${s.price || 'POA'})`);

        if (availableSnakes.length === 0) {
            return "No animals currently marked 'For Sale'. Add some to your collection first to generate a newsletter.";
        }

        const prompt = `
        You are a private hobbyist breeder named 'Progenix Ball Pythons'.
        Write an update email to people following your breeding projects.
        
        Context:
        - We have new surplus availability.
        - Focus on quality, health, and genetics.
        
        Available Animals Highlight:
        ${availableSnakes.join("\n")}
        
        Task:
        1. Create a catchy Subject Line.
        2. Write a warm intro thanking followers.
        3. Highlight 2-3 of the best animals from the list above as examples.
        4. Include a Call to Action (e.g., "Reply to this email").
        5. Keep the tone passionate and personal, not corporate.
        `;

        const response = await runWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        }));

        return response.text || "Could not generate newsletter.";
    } catch (error) {
        console.error("AI Generation Error:", error);
        return "⚠️ Service unavailable. Please check your API Key or try again later.";
    }
  },

  /**
   * Analyzes holdback candidates and suggests the best keeper.
   */
  async analyzeHoldbackCandidates(snakes: Snake[]): Promise<string> {
    try {
        const candidates = snakes.map(s =>
            `- ID: ${s.id}\n  Sex: ${s.sex}\n  Genetics: ${s.genetics.join(", ")}\n  Weight: ${s.currentWeight}g\n  Feeding: ${s.feeding.preySize} (every ${s.feeding.frequency} days)`
        ).join("\n\n");

        const prompt = `
        You are an expert Ball Python breeder. I need help deciding which hatchling to keep (Holdback) from this group for future breeding projects.

        Candidates:
        ${candidates}

        Task:
        1. Compare them based on Genetic Value (Power), Sex (Females are long term investments, Males are fast breeders), and Growth/Health.
        2. Pick the WINNER.
        3. Explain your reasoning clearly.
        4. Provide a brief pros/cons list for the others.
        
        Format as clear text.
        `;

        const response = await runWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        }));

        return response.text || "Could not analyze candidates.";
    } catch (error) {
        console.error("AI Analysis Error:", error);
        return "⚠️ Service unavailable. Please check your API Key or try again later.";
    }
  },

  /**
   * Generates a multi-step breeding plan to achieve a target morph.
   */
  async generateBreedingPlan(targetMorph: string, snakes: Snake[]): Promise<string> {
    try {
      const activeCollection = snakes
        .filter(s => s.status !== 'Sold')
        .map(s => `- ${s.id} (${s.sex}): ${s.genetics.join(", ")}`);

      const prompt = `
      You are a world-class ball python geneticist and breeding strategist.
      
      My current collection is:
      ${activeCollection.join("\n")}
      
      Task:
      The user wants to produce a "${targetMorph}". 
      Analyze my collection and create the most efficient, step-by-step breeding plan to achieve this goal. 
      
      Your plan may take multiple generations. Be very clear about which animals to pair (using their IDs) and what the goal of each pairing is (e.g., 'to produce a Het Clown female to hold back').
      
      If it is absolutely impossible to produce the target morph with the current collection, state that clearly and list the key genes that I am missing and would need to acquire.
      
      Format the output as a numbered list of steps. Keep the tone of an expert giving advice.
      `;

      const response = await runWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      }));

      return response.text || "Could not generate a breeding plan.";
    } catch (error) {
      console.error("AI Plan Generation Error:", error);
      return "⚠️ Service unavailable. Please check your API Key or try again later.";
    }
  },
};
