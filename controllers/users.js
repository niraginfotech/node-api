const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const createUser = asyncWrapper(async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  if (!(email && password && first_name && last_name)) {
    next(createCustomError(`Please enter the required Field`, 400));
  }

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    next(createCustomError(`User Already Exist. Please Login`, 409));
  }

  //Encrypt user password
  encryptedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstname: first_name,
    lastname: last_name,
    email: email,
    password: encryptedPassword,
  });

  // Create token
  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.TOKEN_KEY || "demo-app",
    {
      expiresIn: "2h",
    }
  );

  // save user token
  user.token = token;

  res.status(201).json({ user });
});

const logIn = asyncWrapper(async (req, res, next) => {
  // Get user input
  const { email, password } = req.body;

  // Validate user input
  if (!(email && password)) {
    next(createCustomError(`All input is required`, 400));
  }
  // Validate if user exist in our database
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY || "demo-app",
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;

    // user
    res.status(200).json(user);
  }
  next(createCustomError(`Invalid Credentials`, 400));
});

module.exports = {
  createUser,
  logIn
};
