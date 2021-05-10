const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  const hashedpassword = await bcrypt.hash(password, 12);
  try {
    const newUser = await User.create({ username, password: hashedpassword });
    req.session.user=newUser

    res.status(201).json({ status: "success", data: { user: newUser } });
  } catch (e) {
    res.status(400).json({ status: "failed" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not found" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (isCorrect) {
      req.session.user = user;

      res.status(200).json({ status: "success" });
    } else {
      res.status(200).json({ status: "fail", message: "incorrect password" });
    }
  } catch (e) {
    res.status(400).json({ status: "failed" });
  }
};
