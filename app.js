const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;


/* =======================
   MONGODB CONNECTION
======================= */

mongoose.set("bufferCommands", false);

async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/archeryDB");
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log("🚀 Server running at http://localhost:" + PORT);
    });

  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error);
  }
}

startServer();
/* =======================
   SCHEMAS
======================= */
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);
const archerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  category: String,
  bowType: String,
  coach: String
});

const coachSchema = new mongoose.Schema({
  name: String,
  experience: String,
  specialization: String
});

const sessionSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Archer = mongoose.model("Archer", archerSchema);
const Coach = mongoose.model("Coach", coachSchema);
const SessionModel = mongoose.model("Session", sessionSchema);
const Contact = mongoose.model("Contact", contactSchema);

/* =======================
   MIDDLEWARE
======================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: "archerySecretKey",
  resave: false,
  saveUninitialized: true
}));

/* =======================
   COMMON STYLE
======================= */
const pageStyle = `
<style>
body {
  margin: 0;
  min-height: 100vh;
  background: url('/bg.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: Segoe UI, sans-serif;
  color: white;
}
.overlay {
  background: rgba(0,0,0,0.75);
  min-height: 100vh;
  padding: 30px;
}
.card-custom {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  padding: 20px;
}
table {
  background: white !important;
}

table th {
  background: #343a40;
  color: white !important;
}

table td {
  color: black !important;
}
}
th, td {
  color: white !important;
}
.navbar {
  justify-content: flex-start !important;
}
.navbar a {
  margin-right: 10px;
}
.image-box {
  width: 100%;
  max-width: 300px;
  height: 220px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
}
.archery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.image-box:hover .archery-img {
  transform: scale(1.1);
}
</style>
`;
/* =======================
   REGISTER PAGE
======================= */
app.get("/register", (req, res) => {
  res.send(`
  <html>
  <head>
  <title>Register</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <div class="overlay d-flex justify-content-center align-items-center">
    <div class="card-custom" style="width:400px">
      <h3 class="text-center">📝 Register</h3>
      <form method="POST" action="/register">
        <input class="form-control mb-3" name="username" placeholder="Username" required>
        <input class="form-control mb-3" type="email" name="email" placeholder="Email" required>
        <input class="form-control mb-3" type="password" name="password" placeholder="Password" required>
        <button class="btn btn-success w-100">Register</button>
      </form>
      <div class="text-center mt-3">
        <a href="/" class="text-warning">Already have account? Login</a>
      </div>
    </div>
  </div>
  </body>
  </html>
  `);
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("<h3>User already exists. <a href='/register'>Try Again</a></h3>");
    }

    await User.create({ username, email, password });

    res.send("<h3>Registration Successful ✅ <a href='/'>Login Now</a></h3>");

  } catch (error) {
    res.send("Error during registration");
  }
});

/* =======================
   LOGIN
======================= */
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
  <title>Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <div class="overlay d-flex justify-content-center align-items-center">
    <div class="card-custom" style="width:350px">
      <h3 class="text-center">🏹 Archery Club</h3>
      <form method="POST" action="/login">
        <input class="form-control mb-3" name="username" placeholder="Username" required>
        <input class="form-control mb-3" type="password" name="password" placeholder="Password" required>
        <button class="btn btn-success w-100">Login</button>
        <div class="text-center mt-3">
  <a href="/register" class="text-warning">New User? Register Here</a>
</div>
      </form>
    </div>
  </div>
  <footer class="text-center mt-4 p-3 bg-dark text-white">
  © 2026 Archery Management System | Developed by Swaranjali Shinde, Nikita Kadam, Mayuri Pawar, Nisha Thopate
  </footer>
  </body>
  </html>
  `);
});

app.post("/login", (req, res) => {
  req.session.user = req.body.username;
  res.redirect("/admin");
});

/* =======================
   ADMIN DASHBOARD
======================= */
app.get("/admin", async (req, res) => {
  if (!req.session.user) return res.redirect("/");

  const totalArchers = await Archer.countDocuments();
  const totalCoaches = await Coach.countDocuments();
  const totalSessions = await SessionModel.countDocuments();

  res.send(`
  <html>
  <head>
  <title>Admin</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <nav class="navbar navbar-dark bg-dark px-3">
    <a href="/admin" class="btn btn-light btn-sm">Dashboard</a>
    <a href="/archers" class="btn btn-warning btn-sm">Archers</a>
    <a href="/coaches" class="btn btn-info btn-sm">Coaches</a>
    <a href="/sessions" class="btn btn-success btn-sm">Sessions</a>
    <a href="/about" class="btn btn-primary btn-sm">About</a>
    <a href="/contact" class="btn btn-success btn-sm">Contact</a>
    <a href="/logout" class="btn btn-danger btn-sm">Logout</a>
  </nav>
  <div class="overlay">
    <div class="row text-center">
      <div class="col-md-4">
        <div class="card-custom">
          <h5>Total Archers</h5>
          <h2>${totalArchers}</h2>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card-custom">
          <h5>Total Coaches</h5>
          <h2>${totalCoaches}</h2>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card-custom">
          <h5>Total Sessions</h5>
          <h2>${totalSessions}</h2>
        </div>
      </div>
    </div>
  </div>
  </body>
  </html>
  `);
});

/* =======================
   ARCHERS
======================= */
app.get("/archers", async (req, res) => {
  const archers = await Archer.find();
  const coaches = await Coach.find();

  let rows = archers.map(a => `
    <tr>
      <td>${a.name}</td>
      <td>${a.age}</td>
      <td>${a.category}</td>
      <td>${a.bowType}</td>
      <td>
        <a href="/delete-archer/${a._id}" class="btn btn-danger btn-sm">Delete</a>
      </td>
    </tr>
  `).join("");

  res.send(`
  <html>
  <head>
  <title>Archers</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <div class="overlay">
    <h2>🏹 Archer Management</h2>

    <form method="POST" action="/add-archer" class="row g-2 mb-3">
      <div class="col"><input name="name" class="form-control" placeholder="Name" required></div>
      <div class="col"><input name="age" type="number" class="form-control" placeholder="Age" required></div>
      <div class="col">
        <select name="category" class="form-control">
          <option>Under-14</option>
          <option>Under-17</option>
          <option>Senior</option>
        </select>
      </div>
      <div class="col">
        <select name="bowType" class="form-control">
          <option>Recurve</option>
          <option>Compound</option>
          <option>Indian Round</option>
        </select>
      </div>
      <div class="col">
        <select name="coach" class="form-control">
          <option value="">Select Coach</option>
          ${coaches.map(c => `<option value="${c.name}">${c.name}</option>`).join("")}
        </select>
      </div>
      <div class="col"><button class="btn btn-success">Add</button></div>
    </form>

    <table class="table table-bordered">
      <tr><th>Name</th><th>Age</th><th>Category</th><th>Bow Type</th><th>Action</th></tr>
      ${rows}
    </table>

    <a href="/admin" class="btn btn-warning">Back</a>
  </div>
  <footer class="text-center mt-4 p-3 bg-dark text-white">
  © 2026 Archery Management System | Developed by Swaranjali Shinde, Nikita Kadam, Mayuri Pawar, Nisha Thopate
  </footer>
  </body>
  </html>
  `);
});

app.post("/add-archer", async (req, res) => {
  await Archer.create(req.body);
  res.redirect("/archers");
});

app.get("/delete-archer/:id", async (req, res) => {
  await Archer.findByIdAndDelete(req.params.id);
  res.redirect("/archers");
});

/* =======================
   COACHES
======================= */
app.get("/coaches", async (req, res) => {
  const coaches = await Coach.find();

  let rows = coaches.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.experience}</td>
      <td>${c.specialization}</td>
      <td>
        <a href="/delete-coach/${c._id}" class="btn btn-danger btn-sm">Delete</a>
      </td>
    </tr>
  `).join("");

  res.send(`
  <html>
  <head>
  <title>Coaches</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <div class="overlay">
    <h2>👨‍🏫 Coach Management</h2>

    <form method="POST" action="/add-coach" class="row g-2 mb-3">
      <div class="col"><input name="name" class="form-control" placeholder="Name" required></div>
      <div class="col"><input name="experience" class="form-control" placeholder="Experience (Years)" required></div>
      <div class="col">
        <select name="specialization" class="form-control">
          <option>Recurve</option>
          <option>Compound</option>
          <option>Indian Round</option>
        </select>
      </div>
      <div class="col"><button class="btn btn-success">Add</button></div>
    </form>

    <table class="table table-bordered">
      <tr><th>Name</th><th>Experience</th><th>Specialization</th><th>Action</th></tr>
      ${rows}
    </table>

    <a href="/admin" class="btn btn-warning">Back</a>
  </div>
  <footer class="text-center mt-4 p-3 bg-dark text-white">
  © 2026 Archery Management System | Developed by Swaranjali Shinde, Nikita Kadam, Mayuri Pawar, Nisha Thopate
  </footer>
  </body>
  </html>
  `);
});

app.post("/add-coach", async (req, res) => {
  await Coach.create(req.body);
  res.redirect("/coaches");
});

app.get("/delete-coach/:id", async (req, res) => {
  await Coach.findByIdAndDelete(req.params.id);
  res.redirect("/coaches");
});

/* =======================
   SESSIONS
======================= */
app.get("/sessions", async (req, res) => {
  const sessions = await SessionModel.find();

  let rows = sessions.map(s => `
    <tr>
      <td>${s.title}</td>
      <td>${s.date}</td>
      <td>${s.location}</td>
      <td>
        <a href="/delete-session/${s._id}" class="btn btn-danger btn-sm">Delete</a>
      </td>
    </tr>
  `).join("");

  res.send(`
  <html>
  <head>
  <title>Sessions</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <div class="overlay">
    <h2>📅 Session Management</h2>

    <form method="POST" action="/add-session" class="row g-2 mb-3">
      <div class="col"><input name="title" class="form-control" placeholder="Title" required></div>
      <div class="col"><input type="date" name="date" class="form-control" required></div>
      <div class="col"><input name="location" class="form-control" placeholder="Location" required></div>
      <div class="col"><button class="btn btn-success">Add</button></div>
    </form>

    <table class="table table-bordered">
      <tr><th>Title</th><th>Date</th><th>Location</th><th>Action</th></tr>
      ${rows}
    </table>

    <a href="/admin" class="btn btn-warning">Back</a>
  </div>
  <footer class="text-center mt-4 p-3 bg-dark text-white">
  © 2026 Archery Management System | Developed by Swaranjali Shinde, Nikita Kadam, Mayuri Pawar, Nisha Thopate
  </footer>
  </body>
  </html>
  `);
});

app.post("/add-session", async (req, res) => {
  await SessionModel.create(req.body);
  res.redirect("/sessions");
});

app.get("/delete-session/:id", async (req, res) => {
  await SessionModel.findByIdAndDelete(req.params.id);
  res.redirect("/sessions");
});

/* =======================
   ABOUT US
======================= */
app.get("/about", (req, res) => {
  res.send(`
  <html>
  <head>
  <title>About Us</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <div class="overlay">
    <div class="container">
      <h2 class="text-center mb-4">🏹 About Archery Management System</h2>
      <!-- Content omitted for brevity, keep your same HTML here -->
       <!-- About Archery -->
      <div class="card-custom mb-4">
        <h4>📖 About Archery</h4>

        <p>
        Archery is a precision sport that involves shooting arrows at a target 
        using a bow. The goal is to hit the center of the target to score maximum points.
        </p>

        <p>
        It is one of the oldest sports in history and is also part of the 
        Olympic Games. Archery requires focus, discipline, physical control, 
        and mental strength.
        </p>

        <p>
        Archery is the sport, practice, or skill of using a bow to shoot arrows. 
        Historically, archery has been used for hunting and combat. 
        In modern times, it is mainly a competitive sport.
        </p>

        <h4 class="mt-3">🪜 What Are 7 Steps of Archery?</h4>
        <p>
        Stance, Nock, Grip/Set-up, Draw, Anchor, Aim, Release/Follow-through.
        </p>
      </div>

      <!-- Types of Bows -->
      <div class="card-custom mb-4">
        <h5 class="mt-2">🎯 Types of Bows</h5>

        <div class="row mt-4">

          <div class="col-md-6 col-lg-4 text-center mb-4">
            <div class="image-box">
              <img src="/Recurve bow.jpg" class="archery-img">
            </div>
            <p><strong>Recurve Bow</strong> – Used in Olympic competitions.</p>
          </div>

          <div class="col-md-6 col-lg-4 text-center mb-4">
            <div class="image-box">
              <img src="/compound.jpg" class="archery-img">
            </div>
            <p><strong>Compound Bow</strong> – Uses pulley system for accuracy.</p>
          </div>

          <div class="col-md-6 col-lg-4 text-center mb-4">
            <div class="image-box">
              <img src="/Indain bow.jpg" class="archery-img">
            </div>
            <p><strong>Indian Round</strong> – Traditional format.</p>
          </div>

          <div class="col-md-6 col-lg-4 text-center mb-4">
            <div class="image-box">
              <img src="/Archery.jpg" class="archery-img">
            </div>
            <p><strong>Archery Equipment Diagram</strong></p>
          </div>

          <div class="col-md-6 col-lg-4 text-center mb-4">
            <div class="image-box">
              <img src="/target.jpg" class="archery-img">
            </div>
            <p><strong>Archery Target</strong> – Aim for the center.</p>
          </div>

        </div>
      </div>

      <!-- Scoring System -->
      <div class="card-custom mb-4">
        <h4>🎯 Archery Scoring System</h4>
        <p>
        Target has 10 scoring rings. Center gives 10 points.
        Outer rings score from 1 to 9. Highest total wins.
        </p>
      </div>

      <!-- Why Choose -->
      <div class="card-custom mb-4">
        <h4>🏆 Why Choose Our Academy?</h4>
        <ul>
          <li>Experienced and Certified Coaches</li>
          <li>Modern Training Equipment</li>
          <li>Regular Practice & Performance Tracking</li>
          <li>Safe and Professional Environment</li>
        </ul>
      </div>

      <!-- Evolution -->
      <div class="card-custom mb-4">
        <h4>📸 Evolution of Archery</h4>
        <div class="row mt-3">

          <div class="col-md-4 text-center mb-4">
            <img src="/acient1.jpg" class="archery-img">
            <p><strong>Ancient Archery</strong><br>
            Used in hunting and warfare.</p>
          </div>

          <div class="col-md-4 text-center mb-4">
            <img src="/meddieval.jpg" class="archery-img">
            <p><strong>Medieval Archery</strong><br>
            Longbows used in battles.</p>
          </div>

          <div class="col-md-4 text-center mb-4">
            <img src="/modern.jpg" class="archery-img">
            <p><strong>Modern Archery</strong><br>
            Olympic precision sport.</p>
          </div>

        </div>
      </div>

      <!-- About Project -->
     <div class="card-custom mb-4">
  <h4>💻 About This Project</h4>

  <p>
  The Archery Club Management System is a web-based application 
  developed to manage archers, coaches, and training sessions efficiently.
  </p>

  <h5>🔑 Key Features</h5>
  <ul>
    <li>Archer Registration (Age, Category, Bow Type)</li>
    <li>Coach Management (Experience, Specialization)</li>
    <li>Training Session Scheduling (Date & Location)</li>
    <li>Attendance Tracking</li>
    <li>Admin Dashboard with Statistics</li>
  </ul>

  <h5>🛠 Technology Used</h5>
  <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>Bootstrap 5</li>
    <li>Session Authentication</li>
  </ul>

  <h5>🎓 Purpose</h5>
  <p>
  This system helps sports academies and training centers manage 
  their operations digitally, reduce paperwork, and improve efficiency.
  </p>

</div>
  </div>

  <footer class="text-center mt-4 p-3 bg-dark text-white">
  © 2026 Archery Management System | Developed by Swaranjali shinde, Nikita kadam, Mayuri pawar, Nisha thopate
  </footer>
    </div>
  </div>
  </body>
  </html>
  `);
});

/* =======================
   CONTACT US
======================= */
app.get("/contact", (req, res) => {
  res.send(`
  <html>
  <head>
  <title>Contact Us</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  ${pageStyle}
  </head>
  <body>
  <div class="overlay">
    <div class="container">
      <h2 class="text-center mb-4">📞 Contact Us</h2>
      <div class="card-custom mb-4">
        <form method="POST" action="/contact">
          <div class="mb-3"><label class="form-label">Full Name</label><input type="text" name="name" class="form-control" required></div>
          <div class="mb-3"><label class="form-label">Email Address</label><input type="email" name="email" class="form-control" required></div>
          <div class="mb-3"><label class="form-label">Phone Number</label><input type="text" name="phone" class="form-control"></div>
          <div class="mb-3"><label class="form-label">Message</label><textarea name="message" rows="4" class="form-control" required></textarea></div>
          <button type="submit" class="btn btn-success">Send Message</button>
          <a href="/admin" class="btn btn-warning ms-2">Back</a>
        </form>
      </div>
    </div>
  </div>
  </body>
  </html>
  `);
});

app.post("/contact", async (req, res) => {
  await Contact.create(req.body);
  res.send(`
    <h2>Message Sent Successfully</h2>
    <a href="/admin">Back</a>
  `);
});

/* LOGOUT */
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

