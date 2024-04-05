const Agent = require("../Model/UserModel");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const ROLES = require("../Config/ConstConfig");

// Function to create a new Agent
const createAgent = async (req, res) => {
  try {
    // Checking if an Agent with the provided email already exists
    const foundAgent = await Agent.findOne({ email: req.body.email });
    if (foundAgent) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: `${foundAgent.fullName} already exists.` });
    }
    // Creating a new Agent instance with data from the request body
    const agent = new Agent({
    
      fullName: req.body.fullName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      state: req.body.state,
      role: req.body.role,
    });
    // Saving the new Agent to the database
    await agent.save();
    // Sending a success response
    res
      .status(StatusCodes.ACCEPTED)
      .send({ message: `${agent.fullName} was registered successfully!` });
    // Sending an internal server error response if an error occurs
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to retrieve all Agents
const getAllAgent = async (req, res) => {
  try {
    // Finding all Agents in the database
    const agents = await Agent.find({ role: { $in: [ROLES.RPA, ROLES.RTA] } });
    // Mapping the Agent data to a simpler format
    const data = agents.map((agent) => {
      return {
        id : agent._id, 
        fullName: agent.fullName,
        email: agent.email,
        role: agent.role,
        state: agent.state,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      };
    });
    res.status(StatusCodes.ACCEPTED).json({ agents: data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to update an Agent
const updateAgent = async (req, res) => {
  try {
    
    // Checking if all required properties are provided in the request body
    if (!req.body.email || !req.body.role || !req.body.fullName
    ) {
    return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "Please provide a full Name ,an email and role !" });
    }
    // Creating an update object with data from the request body
    const update = {
      fullName: req.body.fullName,
      email: req.body.email,
      state: req.body.state,
      role: req.body.role,

      //Add tables for agents and employees in admin interfacepassword: req.body.password,
      updatedAt: new Date(),
    };
        // Finding and updating the Agent with the provided email
    const updatedAgent = await Agent.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!updatedAgent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found." });
    }
    // Sending a success response with the updated Agent data
    return res.status(StatusCodes.OK).json({ updatedAgent });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to delete an Agent
const deleteAgent = async (req, res) => {
  try {
    // Checking if the Agent email is provided
    const agentId = req.params.id;
  
    const agent = await Agent.findByIdAndDelete(agentId);
    if (!agent) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Agent not found." });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Agent was deleted successfully!" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userDetails = await Agent.findOne({ _id: userId });
    res.status(StatusCodes.ACCEPTED).json(userDetails);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

module.exports = {
  createAgent,
  getAllAgent,
  updateAgent,
  deleteAgent,
  getUserDetails,
};
