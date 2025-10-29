const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

router.get("/image", countryController.getSummaryImage);

router.post("/refresh", countryController.refreshCountries);

router.get("/", countryController.refreshCountries);
router.get("/:name", countryController.getCountryByName);
router.delete("/:name", countryController.deleteCountry);

module.exports = router;