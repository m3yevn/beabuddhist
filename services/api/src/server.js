import { createApp } from "./app.js";

const port = process.env.PORT || 4000;
const app = await createApp();
app.listen(port, () => {
  console.log(`Be A Buddhist API listening on http://localhost:${port}`);
});
