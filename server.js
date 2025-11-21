const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.post('/api/firefly/transactions', async (req, res) => {
  const { body } = req;
  const fireflyUrl = process.env.FIREFLY_III_URL;
  const fireflyPat = process.env.FIREFLY_III_PAT;

  if (!fireflyUrl || !fireflyPat) {
    return res.status(500).json({ error: 'Firefly III URL or PAT not configured.' });
  }

  try {
    const response = await fetch(`${fireflyUrl}/api/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fireflyPat}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error proxying request to Firefly III' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
});
});
});
});
});
});
});
});
