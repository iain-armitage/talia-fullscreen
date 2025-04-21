import React, { useState } from "react";

function App() {
  const [openaiKey, setOpenaiKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const speakText = (text) => {
    if (!elevenLabsKey) return;
    fetch("https://api.elevenlabs.io/v1/text-to-speech/9OC22F2ZpN4W2KGMOQQV", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsKey,
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })
    .then(res => res.blob())
    .then(blob => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    });
  };

  const sendMessage = async () => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No reply.";
    setResponse(reply);
    speakText(reply);
  };

  const startMic = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1>Talia Lawson</h1>
        <input value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} placeholder="OpenAI API Key" style={{ width: "100%" }} />
        <input value={elevenLabsKey} onChange={e => setElevenLabsKey(e.target.value)} placeholder="ElevenLabs API Key" style={{ width: "100%", marginTop: "0.5rem" }} />
        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say something..."
          style={{ width: "100%", marginTop: "1rem" }}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={sendMessage}>Send</button>
          <button onClick={startMic} style={{ marginLeft: "1rem" }}>🎙️ Speak</button>
        </div>
        <p><strong>Response:</strong> {response}</p>
      </div>
      <div style={{ flex: 1, backgroundColor: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="/talia-avatar.png" alt="Talia Avatar" style={{ maxHeight: "80%", borderRadius: "1rem" }} />
      </div>
    </div>
  );
}

export default App;
