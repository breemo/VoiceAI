export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const { text, voiceId, modelId } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing ElevenLabs API key" });
    }

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // 🔹 تحديد صوت افتراضي ونموذج في حال ما اختار المستخدم
    const selectedVoice = voiceId || "EXAVITQu4vr4xnSDxMaL"; // Bella
    const selectedModel = modelId || "eleven_multilingual_v2";

    // ✅ استدعاء ElevenLabs API الصحيح
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: selectedModel,
        voice_settings: {
          stability: 0.35,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ElevenLabs error:", errorText);
      return res.status(response.status).json({ error: "ElevenLabs API failed", details: errorText });
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
