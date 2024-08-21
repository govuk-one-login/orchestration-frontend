import { expect } from "chai";
import { describe } from "mocha";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const englishTranslations = require("../en/translation.json");
const welshTranslations = require("../cy/translation.json");

export function traverseObjectProperties(
  obj: any,
  func: (key: string, value?: string) => void
): any {
  const properties = Object.keys(obj);
  properties.forEach((i) => {
    if (obj[i] === Object(obj[i])) {
      return traverseObjectProperties(obj[i], func);
    }
    func(i, obj[i]);
  });
}

export function testExpectation(key: string, value: string | undefined): void {
  expect(value).to.not.contain(
    "'",
    "translated values should not contain typographically incorrect quotes (aka 'straight quotes')"
  );
}

describe("locale files", () => {
  it("should not contain any typographically incorrect quotes (aka 'straight quotes') in Welsh translations", () => {
    traverseObjectProperties(welshTranslations, testExpectation);
  });
  it("should not contain any typographically incorrect quotes (aka 'straight quotes') in English translations", () => {
    traverseObjectProperties(englishTranslations, testExpectation);
  });
});

describe("locale file structure", () => {
  const welshTranslationFileKeys: string[] = [];
  const englishTranslationFileKeys: string[] = [];

  traverseObjectProperties(welshTranslations, (key) => {
    welshTranslationFileKeys.push(key);
  });

  traverseObjectProperties(englishTranslations, (key) => {
    englishTranslationFileKeys.push(key);
  });

  it("should be that locale files have the same number of keys", () => {
    expect(englishTranslationFileKeys.length).to.equal(
      welshTranslationFileKeys.length
    );
  });

  it("should be that locale files have the same keys when sorted", () => {
    expect([...englishTranslationFileKeys].sort()).to.eql(
      [...welshTranslationFileKeys].sort()
    );
  });

  it("should be that locale files have the same keys in the same position", () => {
    expect(englishTranslationFileKeys).to.eql(welshTranslationFileKeys);
  });
});
