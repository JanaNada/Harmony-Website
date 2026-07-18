require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT; // 3000 for frontend

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 