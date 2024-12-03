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

const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'password', // Replace with a strong, secure key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use true if using HTTPS
}));

const ADMIN_PASSWORD = 'password';

function isAdmin(req, res, next) {
    if (req.session.isAdmin) {
        return next(); // Allow access
    }
    res.redirect('/login'); // Redirect to login page
}

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

// Login

app.get('/login', (req, res) => {
    if (req.session.isAdmin) {
        // Redirect to admin dashboard if already logged in
        return res.redirect('/landing2');
    }
    res.render('login'); // Show login page
});

app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        req.session.isAdmin = true; // Mark user as logged in
        return res.redirect('/landing2');
    }
    res.render('login', { error: 'Invalid password' }); // Show error
});

app.get('/landing2', isAdmin, (req, res) => {
    res.render('landing2');
});

// Users

    //Route from landing page 2 to display users
    app.get("/users", isAdmin, (req, res) => {
        res.render("users");
    });

    // Route to edit users
    app.get("/editUser", isAdmin, (req, res) => {
        res.render("editUser");
    });

    // Route to submit edits
    app.post("/editUser", (req, res) => {
        //Insert information for updating user
    });

    // Route to add user
    app.get("/addUser", isAdmin, (req, res) => {
        res.render("addUser");
    });

    // Route to submit added user
    app.post("/addUser", (req, res) => {
        //Insert information for adding user
    });

    // Route to view user
    app.get("/viewUser", isAdmin, (req, res) => {
        res.render("viewUser");
    });

    // Route from view user to display user

    // Route to delete users

// Volunteers

    // Route from landing page 2 to display volunteers
    app.get("/showVolunteers", isAdmin, (req, res) => {
        res.render("showVolunteers");
    });

    // Route to edit volunteers
    app.get("/editVolunteer", isAdmin, (req, res) => {
        res.render("editVolunteer");
    });

    // Route to submit edits
    app.post("/editVolunteer", (req, res) => {
        //Insert information for updating volunteer
    });

    // Route to add volunteers
    app.get("/addVolunteer", isAdmin, (req, res) => {
        res.render("addVolunteer");
    });

    // Route to submit added volunteers
    app.post("/addVolunteer", (req, res) => {
        //Insert information for adding volunteer
    });

    // Route to view volunteers
    app.get("/viewVolunteer", isAdmin, (req, res) => {
        res.render("viewVolunteer");
    });

    // Route from view volunteers to display volunteers

    // Route to delete volunteers

// Event Requests

    // Route from landing page 2 to eventRequests
    app.get("/eventRequests", isAdmin, (req, res) => {
        knex('events')
        .select(
            'events.event_id',
            'events.description',
            'events.anticipated_participants',
            'events.under_ten',
            'events.possible_date',
            'events.type',
            'events.address',
            'events.start_time',
            'events.duration',
            'events.contact_name',
            'events.contact_phone',
            'events.contact_email',
            'events.machines',
            'events.sewers',
            'events.story',
            'events.actual_date',
            'events.actual_participants',
            'events.pockets',
            'events.collars',
            'events.envelopes',
            'events.vests',
            'events.members_needed',
            'events.status',
            'events.notes'
        )
         //Shows all data from the events table in order by date
        .where('status','Pending')
        .orderBy('actual_date', 'desc')
        .then(eventRequests => {
            // Render the eventRequests and pass the data
            res.render('eventRequests', { eventRequests });
        })
        .catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    //Route to edit eventRequests
    app.get("/editRequest", isAdmin, (req, res) => {
        res.render("editRequest");
    });

    // Route to submit edits
    app.post("/editRequest", (req, res) => {
        //Insert information for updating request
    });

    // Route to add eventRequests
    app.get("/addRequest", isAdmin, (req, res) => {
        res.render("addRequest");
    });

    // Route to submit added eventRequests
    app.post("/addRequest", (req, res) => {
        //Insert information for adding request
    });

    // Route to view eventRequests
    app.get("/viewRequest", isAdmin, (req, res) => {
        res.render("viewRequest");
    });

    // Route from view eventRequests to display eventRequests


// Scheduled Events

    // Route from landing page 2 to scheduled Events
    app.get("/scheduledEvents", isAdmin, (req, res) => {
        knex('events')
        .select(
            'events.event_id',
            'events.description',
            'events.anticipated_participants',
            'events.under_ten',
            'events.possible_date',
            'events.type',
            'events.address',
            'events.start_time',
            'events.duration',
            'events.contact_name',
            'events.contact_phone',
            'events.contact_email',
            'events.machines',
            'events.sewers',
            'events.story',
            'events.actual_date',
            'events.actual_participants',
            'events.pockets',
            'events.collars',
            'events.envelopes',
            'events.vests',
            'events.members_needed',
            'events.status',
            'events.notes'
        )
         //Shows all data from the events table in order by date
        .where('status','Approved')
        .orderBy('actual_date', 'desc')
        .then(scheduledEvents => {
            // Render the scheduledEvents and pass the data
            res.render('scheduledEvents', { scheduledEvents });
        })
        .catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });
    
    //Route to edit scheduled Events
    app.get("/editScheduled", isAdmin, (req, res) => {
        res.render("editScheduled");
    });

    // Route to submit edits
    app.post("/editScheduled", (req, res) => {
        //Insert information for updating scheduled event
    });

    // Route to add schedules events
    app.get("/addScheduled", isAdmin, (req, res) => {
        res.render("addScheduled");
    });

    // Route to submit added scheduled events
    app.post("/addScheduled", (req, res) => {
        //Insert information for adding scheduled event
    });

    // Route to view scheduled events
    app.get("/viewScheduled", isAdmin, (req, res) => {
        res.render("viewScheduled");
    });

    // Route from view scheduled events to display scheduled events

// Past Events
    
    // Route from landing page 2 to past events
    app.get("/pastEvents", isAdmin, (req, res) => {
        knex('events')
        .select(
            'events.event_id',
            'events.description',
            'events.anticipated_participants',
            'events.under_ten',
            'events.possible_date',
            'events.type',
            'events.address',
            'events.start_time',
            'events.duration',
            'events.contact_name',
            'events.contact_phone',
            'events.contact_email',
            'events.machines',
            'events.sewers',
            'events.story',
            'events.actual_date',
            'events.actual_participants',
            'events.pockets',
            'events.collars',
            'events.envelopes',
            'events.vests',
            'events.members_needed',
            'events.status',
            'events.notes'
        )
         //Shows all data from the events table in order by date
        .where('status','Completed')
        .orderBy('actual_date', 'desc')
        .then(pastEvents => {
            // Render the pastEvents and pass the data
            res.render('pastEvents', { pastEvents });
        })
        .catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    //Route to edit past events
    app.get("/editPast", isAdmin, (req, res) => {
        res.render("editPast");
    });

    // Route to submit edits
    app.post("/editPast", (req, res) => {
        //Insert information for updating past event
    });

    // Route to add past events
    app.get("/addPast", isAdmin, (req, res) => {
        res.render("addPast");
    });

    // Route to submit added past events
    app.post("/addPast", (req, res) => {
        //Insert information for adding past event
    });

    // Route to view past events
    app.get("/viewPast", isAdmin, (req, res) => {
        res.render("viewPast");
    });

    // Route from view past events to display past events

app.listen(port, () => console.log("Listening"));
