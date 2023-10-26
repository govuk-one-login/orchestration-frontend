import request from "supertest";
import {createApp} from "../../app";
import itParam from "mocha-param";

describe("translations", () => {

    const testData = [
        {
            language: "English",
            cookie: "en",
            expectedTitle: "Page not found",
            expectedParagraph1: "We cannot find the page you’re looking for."
        },
        {
            language: "Welsh",
            cookie: "cy",
            expectedTitle: "Tudalen heb ei darganfod",
            expectedParagraph1: "Ni allwn ddod o hyd i’r dudalen rydych chi’n chwilio amdani."
        }
    ]

    itParam("should render 404 template in ${value.language} if ${value.cookie} cookie is present", testData, (done: Mocha.Done, value: any) => {
        createApp().then(app => {
            request(app)
                .get("/404")
                .set("Cookie", `lng=${value.cookie};`)
                .expect(new RegExp(value.expectedTitle))
                .expect(new RegExp(value.expectedParagraph1))
                .expect(404, done)

        })
    });
})