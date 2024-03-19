import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { mongoConnect } from "./src/configs/mongoDB.js";

// importing controllers
import { configureOneToOneNamespace } from "./src/sockets/oneToOne.js";

// importing routes
import employeeRoutes from "./src/routes/employeesRoute.js";


const app = express();
const PORT = process.env.PORT || 6969;

// -------------------------------------------CORS HANDLING---------------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposedHeaders: ["*", "Authorization"],
  })
);

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// connecting MongoDB

mongoConnect();

// root get request
app.get("/", (req, res) => {
  res.send(`Not allowed you simp, go back.`);
});

// employees route
app.use("/api/employees", employeeRoutes)


// configuring sockets for the app
const oneToOneNamespace = configureOneToOneNamespace(server)

// starting sever to listen on the specified port
server.listen(PORT, () => console.log(`Server started on ${PORT}`));
