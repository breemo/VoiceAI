export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST instead." });
  }

  const { text, voice, model } = req.body;

  if (!text || !voice || !model) {
    return res.status(400).json({ error: "Missing required fields: text, voice, or model." });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration missing ELEVENLABS_API_KEY." });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability: 0.35,
          similarity_boost: 0.8,
        },
      }),
    });

    // إذا رجعت ElevenLabs خطأ، بنعرضه بالتفصيل
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ ElevenLabs Error:", errorData);
      return res.status(response.status).json({
        error: "ElevenLabs API returned an error.",
        details: errorData,
      });
    }

    // لو تم توليد الصوت بنجاح
    const audioBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Server failed to process TTS request.", details: err.message });
  }
}
