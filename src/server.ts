import {createApp} from "./app";
import dotenv from "dotenv";

dotenv.config();

const port: number | string = process.env.PORT || 3000;
(async () => {
    const app = await createApp();

    app.listen(port, () => {
        console.log("TEST APP TO REDIRECT FOR NEW SESSION : DEV ONLY");
        console.log(`RUNNING ON http://localhost:${port}`);
    });
})()

