require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const http = require("http"); // ✅ Import HTTP module
const { Server } = require("socket.io"); // ✅ Import Server from socket.io

const { connectDB } = require("../config/db");
const productRoutes = require("../routes/productRoutes");
const customerRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const couponRoutes = require("../routes/couponRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const { isAuth, isAdmin } = require("../config/auth");

const {
  getGlobalSetting,
  getStoreCustomizationSetting,
} = require("../lib/notification/setting");

// ✅ Connect to Database
connectDB();

// ✅ Initialize Express app
const app = express();
app.set("trust proxy", 1);

// ✅ Middlewares
app.use(express.json({ limit: "4mb" }));
app.use(helmet());
app.options("*", cors()); // Include before other routes
app.use(cors());

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:4100",
      // "https://admin-kachabazar.vercel.app",
      // "https://dashtar-admin.vercel.app",
      // "https://kachabazar-store.vercel.app",
      // "https://kachabazar-admin.netlify.app",
      // "https://dashtar-admin.netlify.app",
      // "https://kachabazar-store-nine.vercel.app",
    ],
    methods: ["PUT", "GET", "POST", "DELETE", "PATCH", "OPTIONS"],
    credentials: false,
    transports: ["websocket"],
  },
});

// ✅ Handle Socket.io Connections
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected!`);

  socket.on("notification", async (data) => {
    console.log("Received notification:", data);
    try {
      let updatedData = data;

      if (data?.option === "storeCustomizationSetting") {
        const storeCustomizationSetting = await getStoreCustomizationSetting(data);
        updatedData = { ...data, storeCustomizationSetting };
      }
      if (data?.option === "globalSetting") {
        const globalSetting = await getGlobalSetting(data);
        updatedData = { ...data, globalSetting };
      }
      io.emit("notification", updatedData);
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected!`);
  });
});

// ✅ API Routes
app.get("/", (req, res) => res.send("App works properly!"));
app.use("/api/products/", productRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/coupon/", couponRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/order/", isAuth, customerOrderRoutes);
app.use("/api/attributes/", attributeRoutes);
app.use("/api/setting/", settingRoutes);
app.use("/api/currency/", isAuth, currencyRoutes);
app.use("/api/language/", languageRoutes);
app.use("/api/notification/", isAuth, notificationRoutes);
app.use("/api/admin/", adminRoutes);
app.use("/api/orders/", orderRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

// ✅ Serve Static Files
app.use("/static", express.static("public"));

// ✅ Handle Frontend Routing (For React Apps)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5055;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//Update
//update
//update