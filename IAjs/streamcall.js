const URL = "https://ollama.api.homelab.chalumoid.fr/v1/chat/completions";
const TOKEN = "sk-6VAwClwYxrltMQORMz2m6w";

const body = {
  model: "gemma3:4b",
  messages: [
    {
      role: "system",
      content: "You are concise and helpful.",
    },
    {
      role: "user",
      content: "Give me a 2-sentence summary of why trains are efficient.",
    },
  ],
  keep_alive: -1,
  stream: true, // important for chunks
};

async function streamLitellm() {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const decoder = new TextDecoder();

  for await (const chunk of res.body) {
    const text = decoder.decode(chunk, { stream: true });
    const lines = text.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;

      const payload = line.slice(5).trim(); // remove "data:"
      if (payload === "[DONE]") return;

      const json = JSON.parse(payload);
      const delta = json.choices?.[0]?.delta?.content;

      if (delta) {
        console.log(delta);
      }
    }
  }
}

streamLitellm();
