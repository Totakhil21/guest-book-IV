import express from 'express';
import mariadb from 'mariadb';
import dotenv from 'dotenv';
import { validateFormData } from './validation.js'; 


dotenv.config();

// Create a MariaDB connection pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT,
    connectionLimit: 5
});

const PORT = process.env.APP_PORT || 3000;

// Function to get database connection
async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log(' Connected to the database!');
        return conn;
    } catch (err) {
        console.log(` Error connecting to the database: ${err}`);
    }
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Home Route: Display Guestbook Form
app.get('/', (req, res) => {
    res.render('guestbook', { errors: [] });
});

//  Admin Route: Display Guestbook Entries
app.get('/admin', async (req, res) => {
    const conn = await connect();
    if (!conn) return res.status(500).send("Database connection failed");

    try {
        const guestbookEntries = await conn.query("SELECT * FROM contacts ORDER BY timestamp DESC");
        res.render('summary', { guestbookEntries });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        conn.release(); //Release connection back to the pool
    }
});

// Handle Form Submission
app.post('/submit', async (req, res) => {
    console.log("Form Submission Received:", req.body);

    const formData = {
        firstName: req.body['first-name'],
        lastName: req.body['last-name'],
        email: req.body.email,
        jobTitle: req.body['job-title'],
        company: req.body.company,
        linkedin: req.body.linkedin,
        meet: req.body.meet,
        other: req.body.other,
        message: req.body.message,
        mailingList: req.body['mailing-list'] ? true : false,
        emailFormat: req.body['email-format']
    };

    console.log("Validating form data...");

    // Get database connection
    const conn = await connect();
    if (!conn) return res.status(500).send("Database connection failed");

    try {
        console.log("Inserting into Database...");

        await conn.query(`
            INSERT INTO contacts 
            (first_name, last_name, email, job_title, company, linkedin, meet, other, message, mailing_list, email_format) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [formData.firstName, formData.lastName, formData.email, formData.jobTitle, formData.company, formData.linkedin, formData.meet, formData.other, formData.message, formData.mailingList, formData.emailFormat]);

        formData.timestamp = new Date().toLocaleString();

        console.log("Data Inserted Successfully:", formData);

        return res.render('confirmation', { entry: formData });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log("Duplicate Email Found:", formData.email);
            return res.render('guestbook', { errors: ["This email is already registered. Please use a different email."] });
        } else {
            console.error("Database Error:", error);
            return res.status(500).send("Internal Server Error");
        }
    } finally {
        conn.release(); 
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
