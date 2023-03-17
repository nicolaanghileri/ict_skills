const express = require("express");
const crypto = require("crypto");
const { handleAsync } = require("../util");
const { executeQuery } = require("../db");
const util = require("util");
const pasteRouter = express.Router();
const randomBytesAsync = util.promisify(crypto.randomBytes);

// Example route that can be deleted or adapted.
// This can be called via GET http://localhost:4000/api/paste/blubb
pasteRouter.get(
  "/:var1",
  handleAsync(async (req, res, next) => {
    const results = await executeQuery(
      "SELECT * from paste where access_token = ?",
      ["a8fce094-4c6d-4f04-8588-d35d087c4432"]
    );
    res.send({ foo: "bar", uuid: crypto.randomUUID(), results });
  })
);

async function generateToken() {
  const buf = await randomBytesAsync(32);
  return buf.toString("hex");
}

function isValid(requestBody) {

  const errorResponse = {
    violations: {
      content: {},
      content_type: {},
      encoding: {},
      title: {},
      expiration: {}
    }
  };

  const allowedContentTypes = ["empty", "text/plain", "application/json"];
  const allowedEncodings = ["empty", "UTF-8"];

  const event = new Date(Date.now());
  console.log(event.toString()); // Expected output: "Wed Oct 05 2011 16:48:00 GMT+0200 (CEST)"
  console.log(event.toISOString()); // Expected output: "2023-03-17T22:08:13.943Z"

  const expirationDate = new Date(requestBody.expiration);
  const minExpirationDate = new Date(event.toISOString());

  if(!requestBody.content) {
    errorResponse.violations.content.message = "Attribute is required";
  } else if (requestBody.content.length > 1048576) {
    errorResponse.violations.content.message = "Attribute must be at most 1048576 characters long.";
  } else if (!allowedContentTypes.includes(requestBody.content_type)) {
    errorResponse.violations.content_type.message = "Attribute must be one of empty, text/plain, application/json";
  } else if (!allowedEncodings.includes(requestBody.encoding)) {
    errorResponse.violations.encoding.message = "Attribute must be one of empty, UTF-8";
  } else if (requestBody.title && requestBody.title.length > 50) {
    errorResponse.violations.title.message = "Attribute must be at most 50 characters long.";
  } else if (expirationDate <= minExpirationDate) {
    errorResponse.violations.expiration.message = "Attribute must be greater than " + event.toISOString();
  } else {
    return true;
  }
  return errorResponse;

}


pasteRouter.post(
  "",
  handleAsync(async (req, res, next) => {
    if (!content) {
    } else {
      return res.status(400).json({
        error: "Request body is not valid.",
        invalid: true,
        violations: {
          content: [
            { message: "Attribute is required" },
            { message: "Attribute must be at most 1048576 characters long." },
          ],
          content_type: [
            {
              message:
                "Attribute must be one of empty, text/plain, application/json",
            },
          ],
          encoding: [{ message: "Attribute must be one of empty, UTF-8" }],
          title: [{ message: "Attribute must be at most 50 characters long." }],
          expiration: [
            {
              message:
                "Attribute must be greater than 2022-02-15T12:32:44.725Z.",
            },
          ],
        },
      });
    }

    const id = 0;
    const content = req.body.content;
    const content_type = req.body.content_type;
    const encoding = req.body.encoding;
    const expiration = req.body.expiration;
    const title = req.body.title;

    const created_at = "";
    const updated_at = "";
    const access_token = "";
    const edit_token = "";

    const insert = await executeQuery(
	"INSERT INTO paste (content, content_type, encoding, expiration, title, access_token, edit_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
  [requestBody.content, requestBody.content_type, requestBody.encoding, requestBody.expiration, requestBody.title, requestBody.access_token, requestBody.edit_token]
	);

  })
);


pasteRouter.get(
  "/:access_tokem",
  handleAsync(async (req, res, next) => {

    const token = req.params.access_token;

    // Trasforma l'array di risultati in un array di oggetti JSON con solo le colonne necessarie
    const jsonResults = results.map(result => {
      return {
        id: result.id,
        content: result.content
      }
    });

    // Restituisci l'oggetto JSON come risposta dalla tua API REST
    res.status(200).json(jsonResults);

    try{
      const results = await executeQuery(
        "SELECT * from paste where access_token = ?",
        [token]
      );
      res.send({ foo: "bar", uuid: crypto.randomUUID(), results });
      res.json(results);
    }
  })
);


module.exports = { pasteRouter };
