// NPM dependencies
const express = require("express");
const router = express.Router();
const request = require("request");
const path = require("path");
const cheerio = require("cheerio");

// Model Imports
const Comment = require("../models/Comment.js");
const Article = require("../models/Article.js");

// Index router
router.get("/", (req, res) => res.render("index"));

// Scrape router
router.get("/scrape", (req, res) => {
  // Grabs the body of the HTML with request
  request("https://www.theverge.com/tech", function(error, response, html) {
    // Load into cheerio and save it to $ for shorthand selector
    const $ = cheerio.load(html);

    // Grabs every h2 tag within a div element
    $("div h2").each(function(i, element) {
      // Stores an empty result object
      let result = {};

      // Adds title for each result object
      result.title = $(this).children("a").text();

      // Adds link for each result object
      result.link = $(this).children("a").attr("href");

      // Creates a new Entry using the Article model
      const entry = new Article(result);

      // Saves result to database
      entry.save((error, doc) => console.log(error || doc));
    });

    // Console logs completion of scraping
    console.log("Scraping is complete.")

    res.redirect("/articles");
  });
});

// Exports Scrape router
module.exports = router;