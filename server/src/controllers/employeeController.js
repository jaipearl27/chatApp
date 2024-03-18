import { employeeModel } from "../models/employeeModel.js";

export const getAllEmployees = async () => {
  try {
    let employees = await employeeModel.find();
    console.log(employees);

    return {
      success: true,
      message: "Employees Found Successfully",
      employees: employees,
    };
  } catch (error) {
    return {
      success: false,
      message: `Internal Server Error! ${error.message}`,
    };
  }
};


export const getEmployee = async (username) => {
    try {
      let employee = await employeeModel.find({username:username});
  
      return {
        success: true,
        message: "Employee Found Successfully",
        employee: employee,
      };
    } catch (error) {
      return {
        success: false,
        message: `Internal Server Error! ${error.message}`,
      };
    }
};
