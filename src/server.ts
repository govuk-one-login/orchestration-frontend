import { createApp } from "./app";
import dotenv from "dotenv";
import { logger } from "./utils/logger";

dotenv.config();

const port: number | string = process.env.PORT || 3000;
(async () => {
  const app = await createApp();

  app.listen(port, () => {
    logger.info("TEST APP TO REDIRECT FOR NEW SESSION : DEV ONLY");
    logger.info(`RUNNING ON http://localhost:${port}`);
  });
})();
