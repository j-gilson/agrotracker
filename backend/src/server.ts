import app from "./app";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:192.168.31.91:${PORT}`);
});
