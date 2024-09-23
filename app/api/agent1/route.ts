import { FunctionTool, OpenAI, OpenAIAgent, Settings } from "llamaindex";
import { NextRequest, NextResponse } from "next/server";
//import "dotenv/config";

export async function POST({ request: NextRequest }) {
  try {
    // llm
    Settings.llm = new OpenAI({
      //apiKey: process.env.OPENAI_API_KEY,
      //baseURL: process.env.OPENAI_BASE_URL,
      model: "gpt-4o-mini",
      //timeout: 5,
      // maxRetries: 2,
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
      message: "Add 101 and 303",
    });

    console.log(response);
    return NextResponse.json(
      //{ output: JSON.stringify(response) },
      { output: response.message.content },
      { status: 200 },
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
//main().catch(console.error);
