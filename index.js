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

app.get("/", (req, res) => {
    res.render("/");
});

app.get("/login", (req, res) => {
    res.render("/login");
});

app.get("/request", (req, res) => {
    res.render("/request");
});

app.post("/request", (req, res) => {
    //post information for updating the pending events table
});

app.get("/volunteer", (req, res) => {
    res.render("/volunteer");
});

app.post("/volunteer", (req, res) => {
    //post information for updating the volunteer table
});

app.get("/donate", (req, res) => {
    res.render("/donate");
});

app.get("/addPast", (req, res) => {
    res.render("/addPast");
});

app.post("/addPast", (req, res) => {
    //post information for updating events table (status:completed)
});

app.get("/addRequest", (req, res) => {
    res.render("/addRequest");
});

app.post("/addRequest", (req, res) => {
    //post information for updating events table (status:pending)
});

app.get("/addScheduled", (req, res) => {
    res.render("/addScheduled");
});

app.post("/addScheduled", (req, res) => {
    //post information for updating events table (status:scheduled)
});

app.post("/editPast", (req, res) => {
    //post information for updating events table (status:completed)
});

app.get("/editRequest", (req, res) => {
    res.render("/editRequest");
});

app.post("/editRequest", (req, res) => {
    //post information for updating events table (status:pending)
});

app.get("/editScheduled", (req, res) => {
    res.render("/editScheduled");
});

app.post("/editScheduled", (req, res) => {
    //post information for updating events table (status:scheduled)
});

app.get("/editUser", (req, res) => {
    res.render("/editUser");
});

app.post("/editUser", (req, res) => {
    //post information for updating users table
});

app.get("/addVolunteer", (req, res) => {
    res.render("/addPast");
});

app.post("/addVolunteer", (req, res) => {
    //post information for updating volunteer table
});

app.get("/editUser", (req, res) => {
    res.render("/editUser");
});

app.post("/editUser", (req, res) => {
    //insert information for updating user table
});

app.get("/editVolunteer", (req, res) => {
    res.render("/editUser");
});

app.post("/editVolunteer", (req, res) => {
    //insert information for updating volunteer
});

// Pre-login pages

    //Route to go to landing page 1

    // Route from landing page 1 to donate

    // Route from donate to landing page 1

    // Route to submit donations

    // Route from landing page 1 to volunteer form

    // Route to submit volunteer form

    // Route from landing page 1 to request form

    // Route to submit request form

    // Route from landing page 1 to login page

//Login

    // Route to submit login and redirect to landing page 2

// Users

    //Route from landing page 2 to display users

    // Route to edit users

    // Route to submit edits

    // Route to add user

    // Route to submit added user

    // Route to view user

    // Route from view user to display user

    // Route to delete users

// Volunteers

    // Route from landing page 2 to display volunteers

    // Route to edit volunteers

    // Route to submit edits

    // Route to add volunteers

    // Route to submit added volunteers

    // Route to view volunteers

    // Route from view volunteers to display volunteers

    // Route to delete volunteers

// Event Requests

    // Route from landing page 2 to eventRequests

    //Route to edit eventRequests

    // Route to submit edits

    // Route to add eventRequests

    // Route to submit added eventRequests

    // Route to view eventRequests

    // Route from view eventRequests to display eventRequests

// Scheduled Events

    // Route from landing page 2 to scheduled Events
    
    //Route to edit scheduled Events

    // Route to submit edits

    // Route to add schedules events

    // Route to submit added scheduled events

    // Route to view scheduled events

    // Route from view scheduled events to display scheduled events

// Past Events
    
    // Route from landing page 2 to past events

    //Route to edit past events

    // Route to submit edits

    // Route to add past events

    // Route to submit added past events

    // Route to view past events

    // Route from view past events to display past events
