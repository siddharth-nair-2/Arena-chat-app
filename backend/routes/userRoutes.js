const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  picUpdate,
  nameUpdate,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/updatePic").put(protect, picUpdate);
router.route("/updateName").put(protect, nameUpdate);

module.exports = router;
