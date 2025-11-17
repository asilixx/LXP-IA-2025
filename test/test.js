import ollama from 'ollama'

const response = await ollama.chat({
  model: 'gemma3',
  messages: [{ role: 'user', content: 'pourquoi le diel est bleu?' }],
})
console.log(response.message.content)