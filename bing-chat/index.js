import express from "express";
import bodyParser from "body-parser";
import { BingAIClient } from "@waylaidwanderer/chatgpt-api";

const app = express();
const port = 3003;

const cookie = "_Ucookie";

const options = {
  host: "",
  userToken: "token",
  cookies: cookie,
  proxy: "",
  debug: true,
};

let bingAIClient = new BingAIClient(options);

app.use(bodyParser.json());

app.post("/send-message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let response = await bingAIClient.sendMessage(
      "format this recipe in the original language" + message,
      {
        toneStyle: "fast", // balanced or creative, precise, fast
      }
    );

    const cleaned = response.response
      .replace(/[*#]/g, "")
      .replace(/(\d+\.\s*)|(-\s*)/g, "");
    console.log(cleaned);

    res.json({ message: cleaned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${process.env.PORT || port}`);
});
