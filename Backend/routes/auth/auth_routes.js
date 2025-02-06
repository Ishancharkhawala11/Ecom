
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  verify_otp,
  reset_password
} = require("../../controllers/auth/AuthController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot",forgotPassword );
router.post("/verify",verify_otp );
router.post('/reset',reset_password)
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
