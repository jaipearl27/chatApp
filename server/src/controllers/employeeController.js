import { employeeModel } from "../models/employeeModel.js";
import { getActiveUsers } from "../utils/users.js";

async function getAllEmployees() {
  try {
    let employees = await employeeModel.find();
    return {
      status: true,
      message: "Employees Found Successfully",
      employees: employees,
    };
  } catch (error) {
    return {
      status: false,
      message: `Internal Server Error! ${error.message}`,
    };
  }
}

async function getEmployee(req, res) {
  try {
    const {searchString} = req.params
    const employee = await employeeModel.find({ 
      $or: [
        { userName: { $regex: searchString, $options: 'i' } },
        { firstName: { $regex: searchString, $options: 'i' } },
      ]
     });
    if(!employee.length){
      res.status(200).json({
        status: true, 
        message: "Employee not found"
      })
    } else {

      let filteredEmployee = [] 
      for(let i =0; i < employee.length; i++){
        filteredEmployee.push(
          {
            _id: employee[i]?._id,
            firstName: employee[i]?.firstName,
            lastName: employee[i]?.lastName,
            email: employee[i]?.email,
            userName: employee[i]?.userName,
            mobileNumber: employee[i]?.mobileNumber,
            avatar: employee[i]?.avatar,
          }
        )
        
      }
      // console.log(filteredEmployee )
      let activeUsersData = getActiveUsers(filteredEmployee)
      // console.log(activeUsersData)

      res.status(200).json({
        status: true,
        message: "Employee Found Successfully",
        employee: filteredEmployee,
        activeUsers:activeUsersData
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Internal Server Error! ${error.message}`,
    })
  }
}

export { getEmployee, getAllEmployees };
