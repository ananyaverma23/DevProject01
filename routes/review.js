const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//Reviews - POST Route
router.post(
    "/", 
    validateReview, 
    isLoggedIn, 
    wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn, 
    isAuthor, 
    wrapAsync(reviewController.destoryReview)
);

module.exports = router;