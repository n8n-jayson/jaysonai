const express = require('express');
const path = require('path');

const app = express();

// express.static handles Accept-Ranges / partial content for video by default
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Portfolio site running on port ${PORT}`));
