const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.submitSignUpForm = async (req, res) => {
    try {
    let {username, email, password} = req.body;
    const newUser = new User({username, email});
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", `Hello ${registeredUser.username} , Welcome to King The Land!`)
        res.redirect("/listings");
    })
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.submitLoginForm = async (req, res) => {
    req.flash("success", "Welcome back to King The Land!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You've been logged out!");
        res.redirect("/listings");
    })
}