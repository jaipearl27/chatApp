import express from "express";
import { getEmployee } from "../../src/controllers/employeeController.js";

const employeeRoutes = express.Router();
employeeRoutes.route("/employee/:searchString").get(getEmployee);
// router.route("/signupOtp").post(sendSignUpOtp);
export default employeeRoutes;
