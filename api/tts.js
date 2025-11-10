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

    const selectedVoice = voiceId || "EXAVITQu4vr4xnSDxMaL"; // Bella
    const selectedModel = modelId || "eleven_multilingual_v2";

    // نرسل الطلب مع debug logs
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

    const rawText = await response.text(); // نقرأ الرد دائماً كنص

    if (!response.ok) {
      console.error("❌ ElevenLabs API error:", rawText);
      return res.status(response.status).json({
        error: "ElevenLabs API failed",
        details: rawText,
        debug: { voice: selectedVoice, model: selectedModel },
      });
    }

    // في حال الرد كان ناجح
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(rawText, "binary"));
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server crashed", details: err.message });
  }
}
