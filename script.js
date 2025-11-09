async function generateSpeech() {
  const text = document.getElementById("text").value;
  const voice = document.getElementById("voice").value;
  const model = document.getElementById("model").value;

  document.getElementById("status").innerText = "⏳ جاري توليد الصوت...";

  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice, model }),
    });

    if (!response.ok) throw new Error("خطأ في الاتصال مع الخادم");

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    const audio = document.getElementById("audioPlayer");
    audio.src = audioUrl;
    audio.play();

    document.getElementById("status").innerText = "✅ تم توليد الصوت بنجاح!";
  } catch (err) {
    alert("⚠️ فشل توليد الصوت: " + err.message);
    document.getElementById("status").innerText = "";
  }
}
