if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const mongoUrl = process.env.ATLASDB_URL;

main().then((res) => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(mongoUrl);
}

const sessionStore = MongoStore.create({
    mongoUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60
});

sessionStore.on("error", (err) => {
    console.log("ERROR in Mongo Session Store", err);
});

const sessionOptions = {
    store: sessionStore,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*100,
        httpOnly: true 
    }
}

// app.get("/", (req, res) => {
//     res.send("hii I'm Root.");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());          
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let {status=500, message="Something went wrong!"} = err;
    res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080.");
});
