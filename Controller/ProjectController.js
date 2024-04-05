const Project = require("../Model/ProjectModel");
const Employee = require("../Model/EmployeeModel");
const { StatusCodes } = require("http-status-codes");



// Function to create a new demand
const createProject = async (req, res) => {
    try {
        console.log(req.body.label);
        const foundProject = await Project.findOne({ label: req.body.label });
        // Checking if a project with the provided label already exists
        if (foundProject) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: `${foundProject.label} already exists.` });
        }
        // Creating a new project instance with data from the request body
        const project = new Project({
            label: req.body.label,
            description: req.body.description,
        });
       
        // Checking if all required properties are provided
        if (!project.label || !project.description) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all project information!" });
        }
        // Saving the new demand to the database
        await project.save();
        // Sending a success response
        res
            .status(StatusCodes.ACCEPTED)
            .send({ message: `${project.label} was registered successfully!` });
        // Sending an internal server error response if an error occurs
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

//populate() => Récupère les donnees de bd
// Function to retrieve all project
const getAllProject = async (req, res) => {
    try {
        // Finding all projects in the database
        const projects = await Project.find({}).populate(
            "assignedEmployee",
            "-_id email"
        );
        // Mapping the project data to a simpler format
        const data = projects.map((project) => {
            return {
                id : project._id, 
                label: project.label,
                description: project.description,
                assignedEmployee: project.assignedEmployee,
            };
        });
        res.status(StatusCodes.ACCEPTED).json({ Projects: data });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to update an employee
const updateProject = async (req, res) => {
    try {
        // Checking if all required properties are provided in the request body
        if (!req.body.label || !req.body.description) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Please provide all project information!" });
        }
        console.log(req.params.id);
        // Creating an update object with data from the request body
        const update = {
            label: req.body.label,
            description: req.body.description,
        };
        // Finding and updating the project with the provided email
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );
        if (!updatedProject) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Project not found." });
        }
        // Sending a success response with the updated project data
        res.status(StatusCodes.OK).json({ updatedProject });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

// Function to delete a project
const deleteProject = async (req, res) => {
    try {
        // Checking if the project email is provided
        const projectId = req.params.id;
        if (!projectId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Missing project label." });
        }
        // Finding and deleting the project with the provided label
        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Project not found." });
        }
        res
            .status(StatusCodes.OK)
            .json({ message: "Project was deleted successfully!" });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};

//assign a project to an employee via ID and email
const assignToEmployee = async (req, res) => {
    try {
        employeeEmail = req.body.email;
        projectLabel = req.params.label;
        // Finding release with provided email
        const employee = await Employee.findOne({ email: employeeEmail });
        if (!employee) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: `Employee with email ${employeeEmail} not found` });
        }
        //finding project with provided label
        projectFound = await Project.findOne({ label: projectLabel });
        if (projectFound.assignedEmployee) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${projectFound.label} already assigned`,
            });
        }
        // Creating an update object
        let update = {
            assignedEmployee: {
                id: employee._id,
                email: employee.email,
            },
        };
        //Finding and updating the project
        await Project.findOneAndUpdate({ label: projectLabel }, update, {
            new: true,
        });
        // Sending a success response
        return res.status(StatusCodes.ACCEPTED).send({
            message: `Project assigned to employee ${employeeEmail} successfully`,
        });
    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: error.message });
    }
};


const projectExists = async (req, res) => {
    try {
        const label = req.params.label;
        const project = await Project.findOne({ label });
        if (project) {
            return res.status(StatusCodes.ACCEPTED).json({ exists: true, project });
        }
        return res.status(StatusCodes.ACCEPTED).json({ exists: false });
    } catch (error) {
        console.error("Error checking project existence:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
}


module.exports = {
    createProject,
    getAllProject,
    updateProject,
    deleteProject,
    assignToEmployee,
    projectExists,
};
