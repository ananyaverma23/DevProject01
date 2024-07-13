const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

const listingController = require("../controllers/listing.js");

router
    .route("/")
    .get(                                          
        wrapAsync(listingController.index)       //Index Route
    )
    .post(                                          
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createNewListing)    //Create route for submit the form data.
    )


//Form Route to create NEW Listing
router.get(
    "/new",
    isLoggedIn, 
    listingController.renderNewForm
);    

router
    .route("/:id")
    .get(                                          
        wrapAsync(listingController.showListing)    //Show Route
    )
    .put(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,  
        isOwner, 
        wrapAsync(listingController.updateListing)   //Update Route 
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)   //Delete Route
    )

//Edit Route
router.get(
    "/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.editListing)
);

module.exports = router;