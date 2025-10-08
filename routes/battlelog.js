import express from 'express';
import 'dotenv/config';

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    const url = 'https://api.clashroyale.com/v1/players/%23220LPCU0C/battlelog';

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.CR_TOKEN}`,
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'CR API error', details: text });
    }

    const data = await resp.json();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: String(e) });
  }
});

export default router;
