import app from "./app";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://192.168.1.105:${PORT}`);
});
