const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/newForm.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const detailListing = 
    await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");

    if(!detailListing) {
        req.flash("error", "Listing does not exist.");
        res.redirect("/listings")
    }
    console.log(detailListing);
    res.render("listings/show.ejs", {detailListing});
}

module.exports.createNewListing = async (req, res) => {
    let filename = req.file.filename;
    let url = req.file.path;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename, url};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exist.");
        res.redirect("/listings")
    }
    let ogImageUrl = listing.image.url;
    ogImageUrl = ogImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, ogImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    //update and save new image if it exists
    if(typeof req.file != "undefined") {
        let filename = req.file.filename;
        let url = req.file.path;
        listing.image = {filename, url};
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", `${deletedListing.title} Deleted!`);
    res.redirect("/listings");
}