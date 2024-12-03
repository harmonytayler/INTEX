// Require express
let express = require("express");

// Create an express object
let app = express();

// Require path
let path = require("path");

// Set the port
const port = 3000;

// Set view engine to ejs
app.set("view engine", "ejs");

// Sets the path to the views folder
app.set("views", path.join(__dirname, "views"));

// Make it possible to pull info from url
app.use(express.urlencoded({extended: true}));

//Make it possible to use CSS stylesheet in "public" folder
app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, 'public')));

// Link to the database
const knex = require("knex")({
    client: "pg",
    connection:{
        host:"localhost",
        user: "postgres",
        password: "admin",
        database: "turtle",
        port: 5432
    }
});

// Pre-login pages

    //Route to go to landing page 1
    app.get("/", (req, res) => {
        res.render("landing1");
    });

    //Route to get to about page
    app.get("/about", (req, res) => {
        res.render("about");
    });

    // Route from landing page 1 to donate
    app.get("/donate", (req, res) => {
        res.render("donate");
    });

    // Route from donate to landing page 1

    // Route to submit donations

    // Route from landing page 1 to volunteer form
    app.get("/volunteer", (req, res) => {
        res.render("volunteer");
    });    

    // Route to submit volunteer form
    app.post("/volunteer", (req, res) => {
        //post information for updating the volunteer table
    });

    // Route from landing page 1 to request form
    app.get("/request", (req, res) => {
        res.render("request");
    });

    // Route to submit request form
    app.post("/request", (req, res) => {
        //post information for updating the pending events table
    });

    // Route from landing page 1 to login page
    app.get("/login", (req, res) => {
        res.render("login");
    });

//Login

    // Route to submit login and redirect to landing page 2
    app.get("/login", (req, res) => {
    res.render("login");
});

// Users

    //Route from landing page 2 to display users
    app.get("/users", (req, res) => {
        res.render("users");
    });

    // Route to edit users
    app.get("/editUser", (req, res) => {
        res.render("editUser");
    });

    // Route to submit edits
    app.post("/editUser", (req, res) => {
        //Insert information for updating user
    });

    // Route to add user
    app.get("/addUser", (req, res) => {
        res.render("addUser");
    });

    // Route to submit added user
    app.post("/addUser", (req, res) => {
        //Insert information for adding user
    });

    // Route to view user
    app.get("/viewUser", (req, res) => {
        res.render("viewUser");
    });

    // Route from view user to display user

    // Route to delete users

// Volunteers

    // Route from landing page 2 to display volunteers
    app.get("/showVolunteers", (req, res) => {
        res.render("showVolunteers");
    });

    // Route to edit volunteers
    app.get("/editVolunteer", (req, res) => {
        res.render("editVolunteer");
    });

    // Route to submit edits
    app.post("/editVolunteer", (req, res) => {
        //Insert information for updating volunteer
    });

    // Route to add volunteers
    app.get("/addVolunteer", (req, res) => {
        res.render("addVolunteer");
    });

    // Route to submit added volunteers
    app.get("/addVolunteer", (req, res) => {
        //Insert information for adding volunteer
    });

    // Route to view volunteers
    app.get("/viewVolunteer", (req, res) => {
        res.render("viewVolunteer");
    });

    // Route from view volunteers to display volunteers

    // Route to delete volunteers

// Event Requests

    // Route from landing page 2 to eventRequests
    app.get("/eventRequests", (req, res) => {
        res.render("eventRequests");
    });

    //Route to edit eventRequests
    app.get("/editRequest", (req, res) => {
        res.render("editRequest");
    });

    // Route to submit edits
    app.post("/editRequest", (req, res) => {
        //Insert information for updating request
    });

    // Route to add eventRequests
    app.get("/addRequest", (req, res) => {
        res.render("addRequest");
    });

    // Route to submit added eventRequests
    app.post("/addRequest", (req, res) => {
        //Insert information for adding request
    });

    // Route to view eventRequests
    app.get("/viewRequest", (req, res) => {
        res.render("viewRequest");
    });

    // Route from view eventRequests to display eventRequests

// Scheduled Events

    // Route from landing page 2 to scheduled Events
    app.get("/scheduledEvents", (req, res) => {
        res.render("scheduledEvents");
    });
    
    //Route to edit scheduled Events
    app.get("/editScheduled", (req, res) => {
        res.render("editScheduled");
    });

    // Route to submit edits
    app.post("/editScheduled", (req, res) => {
        //Insert information for updating scheduled event
    });

    // Route to add schedules events
    app.get("/addScheduled", (req, res) => {
        res.render("addScheduled");
    });

    // Route to submit added scheduled events
    app.post("/addScheduled", (req, res) => {
        //Insert information for adding scheduled event
    });

    // Route to view scheduled events
    app.get("/viewScheduled", (req, res) => {
        res.render("viewScheduled");
    });

    // Route from view scheduled events to display scheduled events

// Past Events
    
    // Route from landing page 2 to past events
    app.get("/pastEvents", (req, res) => {
        res.render("pastEvents");
    });

    //Route to edit past events
    app.get("/editPast", (req, res) => {
        res.render("editPast");
    });

    // Route to submit edits
    app.post("/editPast", (req, res) => {
        //Insert information for updating past event
    });

    // Route to add past events
    app.get("/addPast", (req, res) => {
        res.render("addPast");
    });

    // Route to submit added past events
    app.post("/addPast", (req, res) => {
        //Insert information for adding past event
    });

    // Route to view past events
    app.get("/viewPast", (req, res) => {
        res.render("viewPast");
    });

    // Route from view past events to display past events

app.listen(port, () => console.log("Listening"));
