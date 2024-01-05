import express, { Application, Request, Response } from "express";
import errorMiddleware from "./middlewares/error.middleware";
import config from "./config";
import dotenv from "dotenv";
import routes from "./routes/ratelimit";
import morgan from "morgan";
import helmet from "helmet";
dotenv.config();
const app: Application = express();

const port = process.env.PORT || 8000;
config.connect();
//parsing incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorMiddleware);
app.use(morgan("dev"));
app.use(helmet());
app.use("/api", routes);
app.use((_req: Request, res: Response) => {
  res
    .status(404)
    .json(
      "Whoops !! you are lost go back to the documentation to find your way back to home again"
    );
});
app.listen(port, () => {
  console.log(`Server is fire at port: ${port}`);
});

export default app;
