const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("TeraBox Downloader API is running!");
});

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("terabox")) {
    return res.status(400).json({ error: "Invalid TeraBox link" });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    const regex = /"downloadUrl":"(.*?)"/;
    const match = html.match(regex);

    if (match && match[1]) {
      const decodedURL = decodeURIComponent(match[1]).replace(/\\u002F/g, '/');
      res.json({ download: decodedURL });
    } else {
      res.status(404).json({ error: "Download link not found" });
    }

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch link" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
