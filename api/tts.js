export default function handler(req, res) {
  return res.status(200).json({
    message: "Server is running",
    keyFound: !!process.env.ELEVENLABS_API_KEY
  });
}
