export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ التحقق من وجود المفتاح في بيئة Vercel
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing ElevenLabs API key" });
    }

    const { text, voiceId = "EXAVITQu4vr4xnSDxMaL", modelId = "eleven_multilingual_v2" } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    // 🔹 نرسل الطلب إلى ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ElevenLabs API error:", errorText);
      return res.status(response.status).json({ error: "ElevenLabs API failed", details: errorText });
    }

    // ✅ نقرأ الصوت كـ Buffer ونرسله مباشرة كـ ملف صوتي
    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server crashed", details: err.message });
  }
}
fix: stable tts api for vercel
