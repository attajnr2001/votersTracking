import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Constituency from "../models/Constituency.js";
import generateToken from "../utils/generateToken.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
 
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      psCode: user.psCode,
      status: user.status,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, psCode, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    psCode,
    phone,
    // status will be set to 'active' by default
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      psCode: user.psCode,
      phone: user.phone,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.status = user.status === "active" ? "inactive" : "active";
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");

  const usersWithConstituency = await Promise.all(
    users.map(async (user) => {
      const constituency = await Constituency.findOne({ psCode: user.psCode });
      return {
        ...user.toObject(),
        constituencyName: constituency ? constituency.name : "N/A",
      };
    })
  );

  res.json(usersWithConstituency);
});

// In userController.js, add this new function:

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      psCode: updatedUser.psCode,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Don't forget to export this new function
export {
  authUser,
  registerUser,
  logoutUser,
  getUsers,
  toggleUserStatus,
  updateUserProfile,
};
