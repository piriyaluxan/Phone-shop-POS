const User = require("../models/User");

// Auto-generate next userId for a role
const generateUserId = async (role) => {
  const prefix = role === "admin" ? "ADM" : "OP";
  const count = await User.countDocuments({ role });
  return `${prefix}-${String(count + 1).padStart(3, "0")}`;
};

// GET /api/users  — list all users (admin sees everyone)
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("createdBy", "name userId")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users  — admin creates a user
const createUser = async (req, res) => {
  try {
    const { name, password, role = "retail_operator", customUserId } = req.body;

    if (!name || !password)
      return res
        .status(400)
        .json({ message: "Name and password are required" });

    // Use custom ID if provided, otherwise auto-generate
    const userId = customUserId
      ? customUserId.toUpperCase()
      : await generateUserId(role);

    const exists = await User.findOne({ userId });
    if (exists)
      return res
        .status(400)
        .json({ message: `User ID "${userId}" already exists` });

    const user = await User.create({
      userId,
      name,
      password,
      role,
      createdBy: req.user._id,
    });

    res.status(201).json({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id  — admin edits name, password, isActive
const updateUser = async (req, res) => {
  try {
    const { name, password, isActive } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (isActive !== undefined) update.isActive = isActive;
    if (password) update.password = password; // pre-hook hashes it

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id  — hard delete (admin only, can't delete self)
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
