import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "Math Tutor",
    instructions: "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{type: "code_interpreter"}],
    model: "gpt-4-turbo"
  });

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: "I need to solve the equation `7*lg(x^2) + 13 = 27`. Can you help me?"
    }
  );

  openai.beta.threads.runs.stream(thread.id, {
    assistant_id: assistant.id
  })
    .on("textCreated", (_) => process.stdout.write("\nassistant > "))
    .on("textDelta", (textDelta, _) => process.stdout.write(textDelta.value!))
    .on("toolCallCreated", (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
    .on("toolCallDelta", (toolCallDelta, _) => {
      if (toolCallDelta.type === "code_interpreter") {
        if (toolCallDelta.code_interpreter!.input) {
          process.stdout.write(toolCallDelta.code_interpreter!.input);
        }
        if (toolCallDelta.code_interpreter!.outputs) {
          process.stdout.write("\noutput >\n");
          toolCallDelta.code_interpreter!.outputs.forEach((output) => {
            if (output.type == "logs") {
              process.stdout.write(`\n${output.logs}\n`);
            }
          });
        }
      }
    });
}

console.log(`Using OpenAI API key "${process.env.OPENAI_API_KEY_NAME}"`);
main();
