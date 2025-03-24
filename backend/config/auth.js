require("dotenv").config({ path: "./.env" });
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Ensure the secret key is loaded properly
const secretKey = process.env.ENCRYPT_PASSWORD;

if (!secretKey) {
  throw new Error("ENCRYPT_PASSWORD is not defined in the environment variables.");
}

// Generate a secure key
const key = crypto.createHash("sha256").update(secretKey, "utf8").digest();

// Generate a fixed IV (for consistent encryption) or use a random IV per encryption
const generateIV = () => crypto.randomBytes(16);

// Token for signing in
const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Token for email verification
const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

// Middleware to check authentication
const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) throw new Error("No authorization token provided.");
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Middleware to check if user is Admin
const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ role: "Admin" });
    if (!admin) throw new Error("User is not Admin");
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Encrypt data
const handleEncryptData = (data) => {
  try {
    const iv = generateIV(); // Generate a new IV for each encryption
    const dataToEncrypt = typeof data === "string" ? data : JSON.stringify(data);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encryptedData = cipher.update(dataToEncrypt, "utf8", "hex");
    encryptedData += cipher.final("hex");

    return {
      data: encryptedData,
      iv: iv.toString("hex"), // Store the IV to decrypt later
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Data encryption failed.");
  }
};

module.exports = {
  isAuth,
  isAdmin,
  signInToken,
  tokenForVerify,
  handleEncryptData,
};
