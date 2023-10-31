import request from "supertest";
import { createApp } from "../../app";
import itParam from "mocha-param";

describe("translations", () => {
  const testData = [
    {
        path: "404",
        errorCode: 404,
        language: "English",
        cookie: "en",
        expectedTitle: "Page not found",
        expectedParagraph1: "We cannot find the page you’re looking for."
    },
    {
        path: "404",
        errorCode: 404,
        language: "Welsh",
        cookie: "cy",
        expectedTitle: "Tudalen heb ei darganfod",
        expectedParagraph1: "Ni allwn ddod o hyd i’r dudalen rydych chi’n chwilio amdani."
    },
    {
        path: "error",
        errorCode: 500,
        language: "English",
        cookie: "en",
        expectedTitle: "There’s a problem with this service",
        expectedParagraph1: "Try again later."
    },
    {
        path: "error",
        errorCode: 500,
        language: "Welsh",
        cookie: "cy",
        expectedTitle: "Mae problem gyda’r gwasanaeth hwn",
        expectedParagraph1: "Rhowch gynnig arall yn nes ymlaen."
    }
  ]

  itParam("should render ${value.path} template in ${value.language} if ${value.cookie} cookie is present", testData, (done: Mocha.Done, value: any) => {
    createApp().then(app => {
      request(app)
        .get(`/${value.path}`)
        .set("Cookie", `lng=${value.cookie};`)
        .expect(new RegExp(value.expectedTitle))
        .expect(new RegExp(value.expectedParagraph1))
        .expect(value.errorCode, done)
    })
  });
})
