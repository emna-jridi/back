const User = require("../Model/UserModel");
const { StatusCodes } = require("http-status-codes");


// Function to retrieve all users
const getAllUsers = async (req, res) => {
  try {
    // Finding all users in the database  
    const users = await User.find({});
    // Mapping the user data to a simpler format
    const data = users.map((user) => {
      return {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    res.status(StatusCodes.ACCEPTED).json({ users: data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};



// Function to update a user
const UpdateUser = async (req, res) => {
  try {
 // Checking if all required properties are provided in the request body
    if (!req.body.email || !req.body.role) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide an email and a position !" });
    }
    const update = { email: req.body.email, role: req.body.role };
      // Finding and updating the employee with the provided email
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      update,
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found." });
    }
    res.status(StatusCodes.OK).json({ updatedUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  try {
    const userEmail = req.params.email;
     // Finding and deleting the employee with the provided email
    const user = await User.findOneAndDelete({ email: userEmail });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found." });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "User was deleted successfully!" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};
module.exports = { getAllUsers, UpdateUser, deleteUser };
