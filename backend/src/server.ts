import app from "./app";

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:10.17.40.247:${PORT}`);
});
