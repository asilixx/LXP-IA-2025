## Lancer Ollama :

```ps
ollama serve
```

ctrl + C pour éteindre

## Charger un modèle en mémoire

```ps
curl http://localhost:11434/api/generate -d '{"model": "gemma3", "keep_alive": -1}'
```