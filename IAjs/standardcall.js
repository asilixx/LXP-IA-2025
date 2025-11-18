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
      content: "Give me a 6-sentence summary of why trains are efficient.",
    },
  ],
  keep_alive: -1,
  stream: false,
};

async function demoLitellmCall() {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

demoLitellmCall().then((data) => {
  console.log(data);
  console.log(data.choices[0].message.content); // get the actual message
});
