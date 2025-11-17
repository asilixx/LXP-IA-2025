const button = document.getElementById('askBtn');
const input = document.getElementById('question');
const output = document.getElementById('answer');

button.addEventListener('click', async () => {
  const message = input.value;
  output.textContent = 'Chargement…';

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        "prompt": message,
        "stream": false,
        "model": "gemma3"
       })
    });

    const data = await res.json();
    output.textContent = data.response;
    console.log(data)
  } catch (err) {
    output.textContent = 'Erreur : ' + err.message;
  }
});
