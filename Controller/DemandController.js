const Demand = require("../Model/DemandModel");
const Release = require("../Model/ReleaseModel");
const { StatusCodes } = require("http-status-codes");

const createDemand = async (req, res) => {
  try {
    // Check if all required properties are provided
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.start_date ||
      !req.body.end_date ||
      !req.body.estimation ||
      !req.body.release
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide all demand information!" });
    }

    // Check if a demand with the same title already exists
    const foundDemand = await Demand.findOne({ title: req.body.title });
    if (foundDemand) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: `${foundDemand.title} already exists.`,
      });
    }

    // Find the release associated with the demand
    const releaseFound = await Release.findOne({ name: req.body.release.name });

    // Creating a new demand instance with data from the request body
    const demand = new Demand({
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      estimation: req.body.estimation,
      release: {
        id: releaseFound.id,
        name: releaseFound.name,
        assignedProject: {
          id: releaseFound.assignedProject.id,
          label: releaseFound.assignedProject.label,
        },
      },
    });
    if (releaseFound.end_date < demand.end_date){
      releaseFound.end_date = demand.end_date; 
     await releaseFound.save();
    }

    // Saving the new demand to the database
    await demand.save();

    // Sending a success response
    res
      .status(StatusCodes.ACCEPTED)
      .send({ message: `${demand.title} was registered successfully!` });
  } catch (error) {
    // Sending an internal server error response if an error occurs
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to retrieve all demands
const getAllDemand = async (req, res) => {
  try {
    // Finding all demands in the database
    const demands = await Demand.find({}).populate({
      path: "release",
      select: "id name assignedProject",
    });

    // Mapping the demands data to the desired format
    const data = demands.map((demand) => {
      return {
        id: demand._id,
        title: demand.title,
        description: demand.description,
        start_date: demand.start_date,
        end_date: demand.end_date,
        estimation: demand.estimation,
        release: {
          id: demand.release._id,
          name: demand.release.name,
          assignedProject: {
            id: demand.release.assignedProject.id,
            label: demand.release.assignedProject.label,
          },
        },
      };
    });

    // Sending the data as JSON response
    res.status(StatusCodes.ACCEPTED).json({ Demands: data });
  } catch (error) {
    // Handling errors
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};
const updateDemand = async (req, res) => {
  try {
 
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.start_date ||
      !req.body.end_date ||
      !req.body.estimation ||
      !req.body.release
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide all demand information!" });
    }

    const releaseFound = await Release.findOne({ name: req.body.release.name });
    if (!releaseFound) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Associated release not found." });
    }

    const update = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      estimation: req.body.estimation,
      release: {
        id: releaseFound._id,
        name: releaseFound.name,
        assignedProject: {
          id: releaseFound.assignedProject.id,
          label: releaseFound.assignedProject.label,
        },
      },
    };


    if (new Date(releaseFound.end_date) < new Date(update.end_date)) {
      const releaseUpdated = await Release.findOneAndUpdate(
        { name: req.body.release.name },
        { $set: { end_date: update.end_date } },
        { new: true }
      );
      if (!releaseUpdated) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Failed to update associated release." });
      }
    }


    const updatedDemand = await Demand.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!updatedDemand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Demand not found." });
    }

    return res.status(StatusCodes.OK).json({ updatedDemand });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to delete a demand
const deleteDemand = async (req, res) => {
  try {
    // Checking if the demand title is provided
    const demandId = req.params.id;
    if (!demandId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing Demand Title." });
    }
    // Finding and deleting the demand with the provided title
    const demand = await Demand.findByIdAndDelete(req.params.id);

    if (!demand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Demand not found." });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Demand was deleted successfully!" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

//assign a release to a demand
const assignToRelease = async (req, res) => {
  try {
    const demandTitle = req.params.title;
    const releaseName = req.body.name;
    // Finding release with provided name
    const releaseFound = await Release.findOne({ name: releaseName });
    if (!releaseFound) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `Release with name ${releaseName} not found` });
    }
    //finding demand with provided title
    demandFound = await Demand.findOne({ title: demandTitle });
    //cheking if the demand already assigned
    if (demandFound.release && demandFound.release.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: `${demandTitle} already assigned`,
      });
    }
    // Creating an update object
    const update = {
      release: {
        id: releaseFound._id,
        name: releaseFound.name,
        assignedProject: {
          id: releaseFound.assignedProject.id,
          label: releaseFound.assignedProject.label,
        },
      },
    };
    //Finding and updating the demand
    await Demand.findOneAndUpdate({ title: demandTitle }, update, {
      new: true,
    });
    // Sending a success response
    return res.status(StatusCodes.ACCEPTED).send({
      message: `Demand ${demandTitle} assigned to release ${releaseName} successfully`,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

module.exports = {
  createDemand,
  getAllDemand,
  updateDemand,
  deleteDemand,
  assignToRelease,
};
