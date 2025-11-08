import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_MODEL = "gpt2"; // bạn có thể đổi sang model khác

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 100 } })
    });
    const data = await response.json();
    let reply = data[0]?.generated_text || "No response.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
