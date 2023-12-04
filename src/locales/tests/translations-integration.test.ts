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
      expectedParagraphContent: "We cannot find the page you’re looking for.",
    },
    {
      path: "404",
      errorCode: 404,
      language: "Welsh",
      cookie: "cy",
      expectedTitle: "Tudalen heb ei darganfod",
      expectedParagraphContent:
        "Ni allwn ddod o hyd i’r dudalen rydych chi’n chwilio amdani.",
    },
    {
      path: "error",
      errorCode: 500,
      language: "English",
      cookie: "en",
      expectedTitle: "There’s a problem with this service",
      expectedParagraphContent: "Try again later.",
    },
    {
      path: "error",
      errorCode: 500,
      language: "Welsh",
      cookie: "cy",
      expectedTitle: "Mae problem gyda’r gwasanaeth hwn",
      expectedParagraphContent: "Rhowch gynnig arall yn nes ymlaen.",
    },
    {
      path: "ipv-callback-session-expiry-error",
      errorCode: 200,
      language: "English",
      cookie: "en",
      expectedTitle: "Sorry, there is a problem",
      expectedParagraphContent:
        "Go back to the service you were trying to use. You can look for the service using your search engine or find it from the GOV.UK homepage.",
    },
    {
      path: "ipv-callback-session-expiry-error",
      errorCode: 200,
      language: "Welsh",
      cookie: "cy",
      expectedTitle: "Mae’n ddrwg gennym, mae problem",
      expectedParagraphContent:
        "Ewch yn ôl i’r gwasanaeth roeddech yn ceisio ei ddefnyddio. Gallwch chwilio am y gwasanaeth gan ddefnyddio eich peiriant chwilio neu dewch o hyd iddo o hafan GOV.UK.",
    },
  ];

  itParam(
    "should render ${value.path} template in ${value.language} if ${value.cookie} cookie is present",
    testData,
    (done: Mocha.Done, value: any) => {
      createApp().then((app) => {
        request(app)
          .get(`/orch-frontend/${value.path}`)
          .set("Cookie", `lng=${value.cookie};`)
          .expect(new RegExp(value.expectedTitle))
          .expect(new RegExp(value.expectedParagraphContent))
          .expect(value.errorCode, done);
      });
    }
  );
});
