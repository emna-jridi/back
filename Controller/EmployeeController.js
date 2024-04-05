const Employee = require("../Model/EmployeeModel");
const { StatusCodes } = require("http-status-codes");

// Function to create a new employee
const createEmployee = async (req, res) => {
  try {
    const foundEmployee = await Employee.findOne({ email: req.body.email });
    // Checking if an employee with the provided email already exists
    if (foundEmployee) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: `${foundEmployee.fullName} already exists.` });
    }
    // Creating a new employee instance with data from the request body
    const employee = new Employee({
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      civilState: req.body.civilState,
      dependents: req.body.dependents,
      contract: req.body.contract,
      position: req.body.position,
      entryDate: req.body.entryDate,
      salary: req.body.salary,
      RIB: req.body.RIB,
      cnssNumber: req.body.cnssNumber,
      emergencyNumber: req.body.emergencyNumber,
      hierarchicalSuperior: req.body.hierarchicalSuperior,
      leaveBalance: req.body.leaveBalance,
      lastNegotiationDate: req.body.lastNegotiationDate,
      rank: req.body.rank,
    });

    // Checking if all required properties are provided
    // if (!employee.fullName || !employee.email || !employee.position || !employee.rank || !employee.entryDate) {
    //     return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide all employee information!" });
    // }
    // Saving the new employee to the database
    await employee.save();
    // Sending a success response
    res
      .status(StatusCodes.ACCEPTED)
      .send({ message: `${employee.fullName} was registered successfully!` });

    // Sending an internal server error response if an error occurs
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to retrieve all employees
const getAllEmployee = async (req, res) => {
  try {
    // Finding all employees in the database
    const employees = await Employee.find({});
    // Mapping the employee data to a simpler format
    const data = employees.map((employee) => {
      return {
        id : employee._id,
        fullName: employee.fullName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        civilState: employee.civilState,
        dependents: employee.dependents,
        contract: employee.contract,
        position: employee.position,
        entryDate: employee.entryDate,
        salary: employee.salary,
        RIB: employee.RIB,
        cnssNumber: employee.cnssNumber,
        emergencyNumber: employee.emergencyNumber,
        hierarchicalSuperior: employee.hierarchicalSuperior,
        leaveBalance: employee.leaveBalance,
        lastNegotiationDate: employee.lastNegotiationDate,
        rank: employee.rank,
      };
    });
    res.status(StatusCodes.ACCEPTED).json({ employees: data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to update an employee
const updateEmpolyee = async (req, res) => {
  try {
    // Checking if all required properties are provided in the request body
    if (!req.body.fullName || !req.body.position || !req.body.rank) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Please provide all employee information!" });
    }
    // Creating an update object with data from the request body
    
    const update = {
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        civilState: req.body.civilState,
        dependents: req.body.dependents,
        contract: req.body.contract,
        position: req.body.position,
        entryDate: req.body.entryDate,
        salary: req.body.salary,
        RIB: req.body.RIB,
        cnssNumber: req.body.cnssNumber,
        emergencyNumber: req.body.emergencyNumber,
        hierarchicalSuperior: req.body.hierarchicalSuperior,
        leaveBalance: req.body.leaveBalance,
        lastNegotiationDate: req.body.lastNegotiationDate,
        rank: req.body.rank,
    };
    // Finding and updating the employee with the provided email
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!updatedEmployee) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Employee not found." });
    }
    // Sending a success response with the updated employee data
    res.status(StatusCodes.OK).json({ updatedEmployee });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

// Function to delete an employee
const deleteEmployee = async (req, res) => {
  try {
    // Checking if the employee email is provided
    const employeId = req.params.id;
    console.log(employeId);
    if (!employeId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing employee email." });
    }
    // Finding and deleting the employee with the provided email
    const employee = await Employee.findByIdAndDelete(employeId);

    if (!employee) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Employee not found." });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Employee was deleted successfully!" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getAllEmployee,
  updateEmpolyee,
  deleteEmployee,
};
