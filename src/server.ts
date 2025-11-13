import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 InsightDoc Server running at ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed", error);
  }
};
startServer();
