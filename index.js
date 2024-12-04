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

    // Route from landing page 1 to volunteer form
    app.get("/volunteer", (req, res) => {
        res.render("volunteer");
    });    

    // Route to submit volunteer form
    app.post("/volunteer", (req, res) => {
        knex("team_members").insert({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            referral_source: req.body.referral_source,
            sewing_level: req.body.sewing_level,
            monthly_hours: parseInt(req.body.monthly_hours),
            city: req.body.city.toUpperCase(),
            travel: req.body.travel,
            take_charge: req.body.take_charge ? "Y" : "N",
            status: "Pending",
        }).then (() => {
            res.redirect("/volunteer");
        }).catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route from landing page 1 to request form
    app.get("/request", (req, res) => {
        res.render("request");
    });

    // Route to submit request form
    app.post("/request", (req, res) => {
        knex("events").insert({
            description: req.body.description,
            anticipated_participants: parseInt(req.body.anticipated_participants),
            under_ten: parseInt(req.body.under_ten),
            possible_date: req.body.possible_date,
            type: req.body.event_type,
            street_address: req.body.street_address,
            city: req.body.city.toUpperCase(),
            state: req.body.state,
            zip: req.body.zip,
            start_time: req.body.start_time,
            duration: req.body.duration,
            contact_name: req.body.contact_name,
            contact_phone: req.body.contact_phone,
            contact_email: req.body.contact_email,
            machines: parseInt(req.body.machines),
            sewers: parseInt(req.body.sewers),
            story: req.body.story ? "Yes" : "No",
            status: "Pending"
        }).then (() => {
            res.redirect("/request");
        }).catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
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
        knex.select().from("team_members")
        .orderBy('volunteer_id')
        .where('status', 'Active')
        .then(members => {
            res.render("users", {members});
        });
    });

    // Route to edit users
    app.get("/editUser/:volunteer_id", isAdmin, (req, res) => {
        knex.select().from("team_members").where("volunteer_id", req.params.volunteer_id).then(members => {
            res.render("editUser", {members})
    }).catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to submit edits
        app.post("/editUser", (req, res) => {
        knex("team_members").where("volunteer_id", parseFloat(req.body.volunteer_id)).update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            referral_source: req.body.referral_source,
            sewing_level: req.body.sewer,
            monthly_hours: req.body.monthly_hours_available,
            city: req.body.city.toUpperCase(),
            travel: req.body.travel,
            take_charge: req.body.take_charge === "Y",
            status: req.body.status,
        }).then (() => {
            res.redirect("/users");
        }).catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to add user
    app.get("/addUser", isAdmin, (req, res) => {
        res.render("addUser");
    });

    // Route to submit added user
        app.post("/addUser", (req, res) => {
        knex("team_members").insert({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            referral_source: req.body.referral_source,
            sewing_level: req.body.sewer,
            monthly_hours: req.body.monthly_hours,
            city: req.body.city.toUpperCase(),
            travel: req.body.travel,
            take_charge: req.body.take_charge === "Y",
            status: req.body.status,
        }).then(() => {
            res.redirect("/users");
        }).catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // delete users
    app.post("/deleteUser/:volunteer_id", (req, res) => {
        knex("team_members").where("volunteer_id", req.params.volunteer_id).del().then(() => {
            res.redirect("/users");
        }).catch(err => {
            console.log(err);
            res.status(500).json({err});
        });
    });

    // Route to view user
    app.get("/viewUser/:volunteer_id", isAdmin, (req, res) => {
        knex.select().from("team_members").where("volunteer_id", req.params.volunteer_id).then(members => {
            res.render("viewUser", {members})
    }).catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

// Volunteers

    // Route from landing page 2 to display volunteers
    app.get("/showVolunteers", isAdmin, (req, res) => {
        knex.select()
        .from("team_members")
        .orderBy('volunteer_id')
        .where('status', 'Pending')
        .then(members => {
            res.render("showVolunteers", {members});
        })
    });

    // Route to edit volunteers
    app.get('/editVolunteer/:volunteer_id', isAdmin, (req, res) => {
        let volunteer_id = req.params.volunteer_id;
        // Query the events by ID first
        knex('team_members')
            .where('volunteer_id', volunteer_id)
            .first()
            .then(showVolunteer => {
            if (!showVolunteer) {
                return res.status(404).send('Volunteer not found');
            }
            res.render('editVolunteer', { showVolunteer });
            })
        .catch(error => {
            console.error('Error fetching events:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to submit edits
    app.post('/editVolunteer/:volunteer_id', (req, res) => {
        const volunteer_id = req.params.volunteer_id;
    
        // Access each value directly from req.body
        const first_name = req.body.first_name; 
        const last_name = req.body.last_name;
        const phone = req.body.phone;
        const email = req.body.email;
        const referral_source = req.body.referral_source; 
        const address = req.body.address;
        const sewing_level = req.body.sewing_level;
        const monthly_hours = req.body.monthly_hours;
        const city = req.body.city.toUpperCase();
        const travel = req.body.travel;
        const take_charge = req.body.take_charge;
        const status = req.body.status;
    
        // Update the team members in the database
        knex('team_members')
            .where('volunteer_id', volunteer_id)
            .update({
            first_name:first_name,
            last_name:last_name,
            phone:phone,
            email:email,
            referral_source:referral_source,
            address: address,
            sewing_level: sewing_level,
            monthly_hours: monthly_hours,
            city: city,
            travel: travel,
            take_charge: take_charge ? "Y" : "N",
            status: status,
        })
        .then(() => {
            res.redirect('/showVolunteers'); // Redirect to the list of events after saving
        })
        .catch(error => {
            console.error('Error updating event:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to add volunteers
    app.get("/addVolunteer", isAdmin, (req, res) => {
        res.render("addVolunteer");
    });

    // Route to submit added volunteers
    app.post("/addVolunteer", (req, res) => {
        knex("team_members").insert({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            referral_source: req.body.referral_source,
            sewing_level: req.body.sewer,
            monthly_hours: req.body.monthly_hours,
            city: req.body.city.toUpperCase(),
            travel: req.body.travel,
            take_charge: req.body.take_charge ? "Y" : "N",
            status: req.body.status,
        }).then(() => {
            res.redirect("/showVolunteers");
        }).catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to view volunteers
    app.get("/viewVolunteer/:volunteer_id", isAdmin, (req, res) => {
        let volunteer_id = req.params.volunteer_id;
        knex('team_members')
        .where('volunteer_id', volunteer_id)
        .first()
        .then(showVolunteers => {
            if (!showVolunteers) {
            return res.status(404).send('Not found');
            }
            res.render('viewVolunteer', { showVolunteers });
            })
            .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
            });
    });
    // Route to delete volunteers
    app.post("/deleteVolunteer/:volunteer_id", (req, res) => {
        knex("team_members").where("volunteer_id", req.params.volunteer_id).del().then(() => {
            res.redirect("/showVolunteers");
        }).catch(err => {
            console.log(err);
            res.status(500).json({err});
        });
    });

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
            'events.street_address',
            'events.city',
            'events.state',
            'events.zip',
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
        .orderBy('possible_date', 'desc')
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
    app.get('/editRequest/:event_id', isAdmin, (req, res) => {
        let event_id = req.params.event_id;
        // Query the events by ID first
        knex('events')
            .where('event_id', event_id)
            .first()
            .then(eventRequests => {
            if (!eventRequests) {
                return res.status(404).send('Event not found');
            }
            res.render('editRequest', { eventRequests });
            })
        .catch(error => {
            console.error('Error fetching events:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to submit edits
    app.post('/editRequest/:event_id', (req, res) => {
        const event_id = req.params.event_id;
    
        // Access each value directly from req.body
        const description = req.body.description; 
        const anticipated_participants = parseInt(req.body.anticipated_participants);
        const under_ten = parseInt(req.body.under_ten);
        const possible_date = req.body.possible_date;
        const type = req.body.type; 
        const street_address = req.body.street_address || '';
        const city = req.body.city.toUpperCase() || '';
        const state = req.body.state || '';
        const zip = req.body.zip || '';
        const start_time = req.body.start_time;
        const duration = req.body.duration;
        const contact_name = req.body.contact_name;
        const contact_phone = req.body.contact_phone;
        const contact_email = req.body.contact_email;
        const machines = parseInt(req.body.machines);
        const sewers = parseInt(req.body.sewers);
        const story = req.body.story;
        const members_needed = parseInt(req.body.members_needed) || null;
        const status = req.body.status;
        const notes = req.body.notes;
    
        // Update the events in the database
        knex('events')
            .where('event_id', event_id)
            .update({
                description: description, 
                    anticipated_participants: anticipated_participants,
                    under_ten: under_ten,
                    possible_date: possible_date,
                    type: type,
                    street_address: street_address,
                    city: city,
                    state: state,
                    zip: zip,
                    start_time: start_time, 
                    duration: duration, 
                    contact_name: contact_name,
                    contact_phone: contact_phone,
                    contact_email: contact_email,
                    machines: machines,
                    sewers: sewers,
                    story: story,
                    members_needed: members_needed,
                    status: status,
                    notes: notes
        })
        .then(() => {
            res.redirect('/eventRequests'); // Redirect to the list of events after saving
        })
        .catch(error => {
            console.error('Error updating event:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to add eventRequests
    app.get("/addRequest", isAdmin, (req, res) => {
        res.render("addRequest");
    });

    // Route to submit added eventRequests
    app.post("/addRequest", (req, res) => {
        // Extract form values from req.body
        const description = req.body.description || ''; // Default to empty string if not provided
        const anticipated_participants = parseInt(req.body.anticipated_participants, 10) || 0; // Default to empty string if not provided
        const under_ten = parseInt(req.body.under_ten, 10) || 0; // Convert to integer
        const possible_date = req.body.possible_date || new Date().toISOString().split('T')[0];
        const type = req.body.type || 'Sewing'; // Default to 'U' for Unknown
        const street_address = req.body.street_address || '';
        const city = req.body.city.toUpperCase() || '';
        const state = req.body.state || '';
        const zip = req.body.zip || '';
        const start_time = req.body.start_time ;
        const duration = req.body.duration || '';
        const contact_name = req.body.contact_name || '';
        const contact_phone = req.body.contact_phone || '';
        const contact_email = req.body.contact_email || '';
        const machines = parseInt(req.body.machines, 10) || 0;
        const sewers = parseInt(req.body.sewers, 10) || 0;
        const story = req.body.story || '';
        const members_needed = parseInt(req.body.members_needed, 10) || null;
        const status = "Pending"
        const notes = req.body.notes || '';
        
        // Insert the new event into the database
        knex('events')
            .insert({
                description: description, // Ensure description is uppercase
                anticipated_participants: anticipated_participants,
                under_ten: under_ten,
                possible_date: possible_date,
                type: type,
                street_address: street_address,
                city: city,
                state: state,
                zip: zip,
                start_time: start_time, 
                duration: duration, 
                contact_name: contact_name,
                contact_phone: contact_phone,
                contact_email: contact_email,
                machines: machines,
                sewers: sewers,
                story: story,
                members_needed: members_needed,
                status: status,
                notes: notes
            })
            .then(() => {
                res.redirect('/eventRequests'); // Redirect to the eventRequests list page after adding
            })
            .catch(error => {
                console.error('Error adding event request:', error);
                res.status(500).send('Internal Server Error');
            });
    });

    // Route to view eventRequests
    app.get('/viewRequest/:event_id', isAdmin, (req, res) => {
        let event_id = req.params.event_id;
        knex('events')
            .where('event_id', event_id)
            .first()
            .then(eventRequests => {
            if (!eventRequests) {
                return res.status(404).send('Not found');
            }
            res.render('viewRequest', { eventRequests });
                })
            .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
            });
        });


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
            'events.street_address',
            'events.city',
            'events.state',
            'events.zip',
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
        .orderBy('event_id')
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
    app.get('/editScheduled/:event_id', isAdmin, (req, res) => {
        let event_id = req.params.event_id;
        // Query the events by ID first
        knex('events')
            .where('event_id', event_id)
            .first()
            .then(scheduledEvents => {
            if (!scheduledEvents) {
                return res.status(404).send('Event not found');
            }
            res.render('editScheduled', { scheduledEvents });
            })
        .catch(error => {
            console.error('Error fetching events:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to submit edits
    app.post('/editScheduled/:event_id', (req, res) => {
        const event_id = req.params.event_id;
    
        // Access each value directly from req.body
        const description = req.body.description; // Default to empty string if not provided
        const anticipated_participants = parseInt(req.body.anticipated_participants);
        const under_ten = parseInt(req.body.under_ten);
        const possible_date = req.body.possible_date;
        const type = req.body.type; // Default to 'U' for Unknown
        const street_address = req.body.street_address || '';
        const city = req.body.city.toUpperCase() || '';
        const state = req.body.state || '';
        const zip = req.body.zip || '';
        const start_time = req.body.start_time;
        const duration = req.body.duration;
        const contact_name = req.body.contact_name;
        const contact_phone = req.body.contact_phone;
        const contact_email = req.body.contact_email;
        const machines = parseInt(req.body.machines);
        const sewers = parseInt(req.body.sewers);
        const story = req.body.story;
        const members_needed = parseInt(req.body.members_needed) || null;
        const status = req.body.status;
        const notes = req.body.notes;
    
        // Update the events in the database
        knex('events')
            .where('event_id', event_id)
            .update({
            description: description, 
                anticipated_participants: anticipated_participants,
                under_ten: under_ten,
                possible_date: possible_date,
                type: type,
                street_address: street_address,
                city: city,
                state: state,
                zip: zip,
                start_time: start_time, 
                duration: duration, 
                contact_name: contact_name,
                contact_phone: contact_phone,
                contact_email: contact_email,
                machines: machines,
                sewers: sewers,
                story: story,
                members_needed: members_needed,
                status: status,
                notes: notes
            })
            .then(() => {
            res.redirect('/scheduledEvents'); // Redirect to the list of events after saving
            })
            .catch(error => {
            console.error('Error updating event:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to add schedules events
    app.get("/addScheduled", isAdmin, (req, res) => {
        res.render("addScheduled");
    });

    // Route to submit added scheduled events
    app.post("/addScheduled", (req, res) => {
        const description = req.body.description || ''; 
        const anticipated_participants = parseInt(req.body.anticipated_participants, 10) || 0; 
        const under_ten = parseInt(req.body.under_ten, 10) || 0; // Convert to integer
        const actual_date = req.body.actual_date || new Date().toISOString().split('T')[0];
        const type = req.body.type || 'Sewing'; 
        const street_address = req.body.street_address || '';
        const city = req.body.city.toUpperCase() || '';
        const state = req.body.state || '';
        const zip = req.body.zip || '';
        const start_time = req.body.start_time ;
        const duration = req.body.duration || '';
        const contact_name = req.body.contact_name || '';
        const contact_phone = req.body.contact_phone || '';
        const contact_email = req.body.contact_email || '';
        const machines = parseInt(req.body.machines, 10) || 0;
        const sewers = parseInt(req.body.sewers, 10) || 0;
        const story = req.body.story || '';
        const members_needed = parseInt(req.body.members_needed, 10) || null;
        const status = "Approved"
        const notes = req.body.notes || '';
        
        // Insert the new event into the database
        knex('events')
            .insert({
                description: description, 
                anticipated_participants: anticipated_participants,
                under_ten: under_ten,
                actual_date: actual_date,
                type: type,
                street_address: street_address,
                city: city,
                state: state,
                zip: zip,
                start_time: start_time, 
                duration: duration, 
                contact_name: contact_name,
                contact_phone: contact_phone,
                contact_email: contact_email,
                machines: machines,
                sewers: sewers,
                story: story,
                members_needed: members_needed,
                status: status,
                notes: notes
            })
            .then(() => {
                res.redirect('/scheduledEvents'); // Redirect to the scheduledEvents list page after adding
            })
            .catch(error => {
                console.error('Error adding event:', error);
                res.status(500).send('Internal Server Error');
            });
    });

    // Route to view scheduled events
    app.get('/viewScheduled/:event_id', isAdmin, (req, res) => {
        let event_id = req.params.event_id;
        knex('events')
            .where('event_id', event_id)
            .first()
            .then(scheduledEvents => {
            if (!scheduledEvents) {
                return res.status(404).send('Not found');
            }
            res.render('viewScheduled', { scheduledEvents });
                })
            .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
            });
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
            'events.street_address',
            'events.city',
            'events.state',
            'events.zip',
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
        .orderBy('event_id')
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
    app.get('/editPast/:event_id', isAdmin, (req, res) => {
        let event_id = req.params.event_id;
        // Query the events by ID first
        knex('events')
            .where('event_id', event_id)
            .first()
            .then(pastEvents => {
            if (!pastEvents) {
                return res.status(404).send('Event not found');
            }
            res.render('editPast', { pastEvents });
            })
        .catch(error => {
            console.error('Error fetching events:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to submit edits
    app.post('/editPast/:event_id', (req, res) => {
        const event_id = req.params.event_id;
    
        // Access each value directly from req.body
        const description = req.body.description; // Default to empty string if not provided
        const anticipated_participants = parseInt(req.body.anticipated_participants);
        const under_ten = parseInt(req.body.under_ten);
        const possible_date = req.body.possible_date;
        const type = req.body.type; // Default to 'U' for Unknown
        const street_address = req.body.street_address || '';
        const city = req.body.city.toUpperCase() || '';
        const state = req.body.state || '';
        const zip = req.body.zip || '';
        const start_time = req.body.start_time;
        const duration = req.body.duration;
        const contact_name = req.body.contact_name;
        const contact_phone = req.body.contact_phone;
        const contact_email = req.body.contact_email;
        const machines = parseInt(req.body.machines);
        const sewers = parseInt(req.body.sewers);
        const story = req.body.story;
        const actual_date = req.body.actual_date;
        const actual_participants = parseInt(req.body.actual_participants);
        const pockets = parseInt(req.body.pockets);
        const collars = parseInt(req.body.collars);
        const envelopes = parseInt(req.body.envelopes);
        const vests = parseInt(req.body.vests);
        const members_needed = parseInt(req.body.members_needed) || null;
        const status = req.body.status;
        const notes = req.body.notes;
    
        // Update the events in the database
        knex('events')
            .where('event_id', event_id)
            .update({
            description: description, 
                anticipated_participants: anticipated_participants,
                under_ten: under_ten,
                possible_date: possible_date,
                type: type,
                street_address: street_address,
                city: city,
                state: state,
                zip:zip,
                start_time: start_time, 
                duration: duration, 
                contact_name: contact_name,
                contact_phone: contact_phone,
                contact_email: contact_email,
                machines: machines,
                sewers: sewers,
                story: story,
                actual_date: actual_date,
                actual_participants : actual_participants,
                pockets: pockets,
                collars: collars,
                envelopes: envelopes,
                vests: vests,
                members_needed: members_needed,
                status: status,
                notes: notes
            })
            .then(() => {
                res.redirect('/pastEvents'); // Redirect to the list of past events after saving
            })
            .catch(error => {
            console.error('Error updating event:', error);
            res.status(500).send('Internal Server Error');
        });
    });

    // Route to add past events
    app.get("/addPast", isAdmin, (req, res) => {
        res.render("addPast");
    });

    // Route to submit added past events
    app.post("/addPast", (req, res) => {
        // Extract form values from req.body
        const description = req.body.description || ''; // Default to empty string if not provided
        const anticipated_participants = parseInt(req.body.anticipated_participants, 10) || 0; // Default to empty string if not provided
        const under_ten = parseInt(req.body.under_ten, 10) || 0; // Convert to integer
        const possible_date = req.body.possible_date || new Date().toISOString().split('T')[0];
        const type = req.body.type || 'Sewing'; // Default to 'U' for Unknown
        const street_address = req.body.street_address || '';
        const city = req.body.city.toUpperCase() || '';
        const state = req.body.state || '';
        const zip = req.body.zip || '';
        const start_time = req.body.start_time ;
        const duration = req.body.duration || '';
        const contact_name = req.body.contact_name || '';
        const contact_phone = req.body.contact_phone || '';
        const contact_email = req.body.contact_email || '';
        const machines = parseInt(req.body.machines, 10) || 0;
        const sewers = parseInt(req.body.sewers, 10) || 0;
        const story = req.body.story || '';
        const actual_date = req.body.actual_date || new Date().toISOString().split('T')[0];
        const actual_participants = parseInt(req.body.actual_participants, 10) || 0;
        const pockets = parseInt(req.body.pockets, 10) || 0;
        const collars = parseInt(req.body.collars, 10) || 0;
        const envelopes = parseInt(req.body.envelopes, 10) || 0;
        const vests = parseInt(req.body.vests, 10) || 0;
        const members_needed = parseInt(req.body.members_needed, 10) || null;
        const status = "Completed"
        const notes = req.body.notes || '';
        
        // Insert the new event into the database
        knex('events')
            .insert({
                description: description, // Ensure description is uppercase
                anticipated_participants: anticipated_participants,
                under_ten: under_ten,
                possible_date: possible_date,
                type: type,
                street_address: street_address,
                city: city,
                state: state,
                zip: zip,
                start_time: start_time, 
                duration: duration, 
                contact_name: contact_name,
                contact_phone: contact_phone,
                contact_email: contact_email,
                machines: machines,
                sewers: sewers,
                story: story,
                actual_date: actual_date,
                actual_participants : actual_participants,
                pockets: pockets,
                collars: collars,
                envelopes: envelopes,
                vests: vests,
                members_needed: members_needed,
                status: status,
                notes: notes
            })
            .then(() => {
                res.redirect('/pastEvents'); // Redirect to the pastEvents list page after adding
            })
            .catch(error => {
                console.error('Error adding event:', error);
                res.status(500).send('Internal Server Error');
            });
    });

    app.get('/viewPast/:event_id', isAdmin, (req, res) => {
        let event_id = req.params.event_id;
        knex('events')
            .where('event_id', event_id)
            .first()
            .then(pastEvents => {
                if (!pastEvents) {
                return res.status(404).send('Not found');
                }
                res.render('viewPast', { pastEvents });
                })
                .catch(error => {
                console.error('Error fetching data:', error);
                res.status(500).send('Internal Server Error');
                });
        });

    // Route from view past events to display past events

app.listen(port, () => console.log("Listening"));
