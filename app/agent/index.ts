import { FunctionTool, OpenAI, OpenAIAgent, Settings } from "llamaindex";
import "dotenv/config";

async function main() {
  console.log(process.env.OPENAI_API_KEY);
  console.log(process.env.OPENAI_BASE_URL);
  // llm
  Settings.llm = new OpenAI({
    //apiKey: process.env.OPENAI_API_KEY,
    //baseURL: process.env.OPENAI_BASE_URL,
    model: "gpt-4o-mini",
    //timeout: 5,
    //maxRetries: 2,
    // Add logging for debugging
    callbackManager: {
      onBeforeRequest: (request) => {
        console.log("Sending request to:", request.url);
      },
    },
  });

  // log
  Settings.callbackManager.on("llm-tool-call", (event) => {
    console.log(event.detail);
  });
  Settings.callbackManager.on("llm-tool-result", (event) => {
    console.log(event.detail);
  });

  // sum function
  const sumNumbers = ({ a, b }: { a: number; b: number }) => {
    return `${a + b}`;
  };
  // sum tool
  const sumTool = FunctionTool.from(sumNumbers, {
    name: "sumNumbers",
    description: "use this tool to Sum two numbers",
    parameters: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "First number",
        },
        b: {
          type: "number",
          description: "Second number",
        },
      },
    },
  });

  // divide function
  const divideNumbers = ({ a, b }: { a: number; b: number }) => {
    return `${a / b}`;
  };

  const divideTool = FunctionTool.from(divideNumbers, {
    name: "divideNumbers",
    description:
      "use this tool to process one number is divided by another number",
    parameters: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "First number",
        },
        b: {
          type: "number",
          description: "Second number",
        },
      },
    },
  });

  const tools = [sumTool, divideTool];

  const agent = new OpenAIAgent({ tools });

  let response = await agent.chat({
    //message: "Add 101 and 303",
    message: "How much is 5 + 7? then divide by 2",
  });

  console.log(response.message.content);
}

main().catch(console.error);
