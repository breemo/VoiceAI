const API_KEY = process.env.ELEVENLABS_API_KEY || "API_KEY_NOT_FOUND";

document.getElementById("generateBtn").addEventListener("click", async () => {
  const text = document.getElementById("textInput").value;
  const voice = document.getElementById("voice").value;
  const audioPlayer = document.getElementById("audioPlayer");

  if (!text.trim()) {
    alert("من فضلك اكتب النص أولاً 🎤");
    return;
  }

  audioPlayer.src = "";
  document.getElementById("generateBtn").innerText = "⏳ جاري التوليد...";

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_id: "eleven_multilingual_v2",
          text,
        }),
      }
    );

    if (!response.ok) throw new Error("حدث خطأ أثناء توليد الصوت 😔");

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audioPlayer.src = url;
    audioPlayer.play();
  } catch (error) {
    alert(error.message);
  }

  document.getElementById("generateBtn").innerText = "🔊 توليد الصوت";
});
