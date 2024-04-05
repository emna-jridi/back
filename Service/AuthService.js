const config = require("../Config/AppConfig");
const ROLES = require("../Config/ConstConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../Config/AppConfig");
const { StatusCodes } = require("http-status-codes");


// Function to check if the provided plain password matches the hashed password
const passwordIsValid = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

// Function to validate user type
const validUserType = (role) => {
  const allowedUserTypes = [ROLES.RA, ROLES.RPA, ROLES.RTA];
  return allowedUserTypes.includes(role);
};


// Function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, config.secret, {
    algorithm: "HS256",
    expiresIn: 86400,
  });
};



// Middleware function to authorize user based on role
const authorization = (roles) => async (req, res, next) => {

  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No token provided" });
    }

const token = authHeader.split(" ")[1];
    // Verify and decode token
    const decoded = jwt.verify(token, Config.secret);
    const { id, role } = decoded;
    // Check if user type matches the required role
    if (!roles.includes(role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not authorized to access this resource." });
    }
    // Set user information in request object
    req.user = { userId: id, role };
    // Call next middleware
    next();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error during the authentication." });
  }
};

const authorizationTwoRoles = (role1, role2) => async (req, res, next) => {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    // Verify and decode token
    const decoded = jwt.verify(token, Config.secret);
    const { id, role } = decoded;
    // Check if user type matches one of the required roles
    if (role !== role1 && role !== role2) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not authorized to access this resource." });
    }
    // Set user information in request object
    req.user = { userId: id, role };
    // Call next middleware
    next();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error during the authentication." });
  }
};
const authorizationAdminOrRPA= authorizationTwoRoles(ROLES.RA, ROLES.RPA)
const authorizationAdminOrRTA = authorizationTwoRoles(ROLES.RA, ROLES.RTA);
const authorizationAdmin = authorization(ROLES.RA);
const authorizationRTA = authorization(ROLES.RTA);
const authorizationRPA = authorization(ROLES.RPA);

const authorizationAllRoles = authorization(Object.values(ROLES));
module.exports = {
  passwordIsValid,
  validUserType,
  generateToken,
 authorizationAdminOrRPA,
  authorizationAdmin,
  authorizationRTA,
  authorizationRPA,
  authorizationAllRoles,
authorizationAdminOrRTA,

};
