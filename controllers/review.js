const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let detailListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    detailListing.reviews.push(newReview);

    await newReview.save();
    await detailListing.save();
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${detailListing._id}`);
};

module.exports.destoryReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted.");

    res.redirect(`/listings/${id}`)
};