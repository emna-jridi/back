const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ROLES = require("../Config/ConstConfig");
const {
  passwordIsValid,
  validUserType,
  generateToken,
} = require("../Service/AuthService");
const Employee = require("../Model/EmployeeModel");
const cookieParser = require("cookie-parser");

// Login controller
const login = async (req, res) => {
  try {
    // Check if email and password are provided
    if (!req.body.email || !req.body.password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide an email and password !" });
    }
    // Find user by email
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "user does not exist." });
    }

    // Validate password
    if (!passwordIsValid(req.body.password, foundUser.password)) {
      return res.status(StatusCodes.FORBIDDEN).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    // Check if State is valid

    if (foundUser.state === false) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "User does not have permission to connect.",
        state: foundUser.state,
      });
    }
    // Generate token and send response
    const accessToken = generateToken(foundUser.id, foundUser.role);
    //const refreshToken = generateRefreshToken(foundUser.id, foundUser.role)
    // res.cookie('accessToken', accessToken, { maxAge: 86400  })
    //res.cookie('refreshToken', refreshToken, { maxAge: 604800, httpOnly: true, secure: true, sameSite: 'strict' })

    res.status(StatusCodes.ACCEPTED).json({
      message: "User logged in successfully.",
      accessToken: accessToken,
      state: foundUser.state,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error during the authentication." });
  }
};

// reateNewPwd controller
const createNewPwd = async (req, res) => {
  try {
    token = req.params.token;
    const { email, password } = req.body;
    // Vérifier la validité du token??

    const foundUser = await User.findOne({
      email,
      // resetPasswordToken: token,
      // resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(foundUser);
    if (!foundUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid or expired token." });
    }

    foundUser.password = bcrypt.hashSync(password, 8);
    foundUser.resetPasswordToken = undefined;
    foundUser.resetPasswordExpires = undefined;

    await foundUser.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error resetting password." });
  }
};


const forgotPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide an email!" });
    }

    // Find user by email
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User does not exist." });
    }
    console.log(foundUser);

    const generatePasswordResetToken = () => {
      return crypto.randomBytes(20).toString("hex");
    };
    const token = generatePasswordResetToken();

    // Set reset token and expiration in the user document
    foundUser.resetPasswordToken = token;
    foundUser.resetPasswordExpires = new Date();
    foundUser.resetPasswordExpires.setHours(
      foundUser.resetPasswordExpires.getHours() + 1
    );
    await foundUser.save();
    const resetLink = `http://localhost:3000/NewPassword/${token}`;
    const sendPasswordResetEmail = async (email, token) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "jridiemna04@gmail.com",
          pass: "gtwj bvda ontj rdwb",
        },
      });
      const mailOptions = {
        from: "jridiemna04@gmail.com", // Sender email address
        to: email, // Recipient email address
        subject: "Password Reset", // Email subject
        text: `Hello,\n\nYou requested a password reset. Please click the following link to reset your password: 
        ${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you did not request this reset, please ignore this email.\n\nRegards,\n`,
      };
      await transporter.sendMail(mailOptions);
    };

    await sendPasswordResetEmail(req.body.email, token);

    res.status(StatusCodes.OK).json({
      message: "Password reset instructions have been sent to your email.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while processing forgot password request." });
  }
};

const logout = async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Successfully logged out " });
};

const adminExists = async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: ROLES.RA });
    if (adminUser) {
      return res.json({ exists: true });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking admin user:", error);
    return res.status(500).json({ message: "Error checking admin user." });
  }
};

const emailExist = async (req, res) => {
  try {
    const email = req.params.email;
    const employee = await Employee.findOne({ email });
    if (employee) {
      return res.json({ exists: true, type: "employee" });
    }
    const agent = await User.findOne({ email });
    if (agent) {
      return res.json({ exists: true, type: "agent" });
    }

    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 
module.exports = {
  login,
  createNewPwd,
  logout,
  adminExists,
  emailExist,
  forgotPassword,
};
