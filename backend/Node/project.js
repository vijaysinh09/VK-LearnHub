const express=require("express");
const mysql=require("mysql2");
const bcrypt=require("bcrypt");
const transporter=require("./mailer");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const dotenv=require("dotenv");
const OpenAI=require("openai");

dotenv.config({ path: require('path').resolve(__dirname, '../.env') });
dotenv.config(); // fallback in case they run from Node/


const app=express();
app.use(express.json());
app.use(cors());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "My Chatbot",
    },
});

app.post("/chat", async (req, res) => {
    try {
        const { message, type } = req.body;

        let messages = [];
        if (type === 'website') {
            messages.push({
                role: "system",
                content: "You are an AI assistant strictly for VK LearnHub, an online education platform. Only answer questions related to VK LearnHub, its courses, enrollments, or platform features. If a user asks anything outside of this scope, politely decline and state you are only here to help with VK LearnHub."
            });
        }
        messages.push({ role: "user", content: message });

        const response = await client.chat.completions.create({
            model: "openrouter/free",
            messages: messages
        });

        res.json({
            reply: response.choices[0].message.content,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            reply: "Something Went Wrong",
        });
    }
});


const db=mysql.createConnection
({
    host : process.env.DB_HOST || "localhost",
    port : process.env.DB_PORT || 3306,
    user : process.env.DB_USER || "root",
    password : process.env.DB_PASSWORD || "",
    database : process.env.DB_NAME || "course_management",
    ssl: { rejectUnauthorized: false }
}).promise();

console.log("database connected successfully");


app.get("/users",async(req,res)=>
{

    try
    {
        const sql="select id,name,email,role,created_at from users";
        const[result]=await db.query(sql);
        res.json(result);
    }
    catch(err)
    { 
           res.status(500).json({
           message:err.message
           }); 
    }
});

app.get("/users/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const sql="select id,name,email,role from users where id=?";
        const[result]=await db.query(sql,[id]);

        if(result.length===0) 
        {
            return res.status(404).json({
                message:"user not found"
            });
        }

        res.json(result[0]);
    }
    catch(err)
    { 
        res.status(500).json({
            message:err.message
        }); 
    }
});

app.put("/users/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const{name,email,password,role}=req.body;
        const passhash=await bcrypt.hash(password,10);
        const sql="update users set name=?,email=?,password=?,role=? where id=?";
        const[result]=await db.query(sql,[name,email,passhash,role,id]);

        if(result.affectedRows===0) 
        {
            return res.status(404).json({
               message:"user not found"
            });
        }

        res.json({message:"user updated successfully"});
    }

    catch(err)
    { 
        res.status(500).json({
            message:err.message
        }); 
    }
});

app.delete("/users/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const sql="delete from users where id=?";
        const[result]=await db.query(sql,[id]);

        if(result.affectedRows===0) 
        {
            return res.status(404).json({
                message:"user not found"
            });
        }

        res.json({message:"user deleted successfully"});
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});



app.post("/register",async(req,res)=>
{
    try
    {
        const{name,email,password}=req.body;
        const sql="select * from users where email=?";
        const[result]=await db.query(sql,[email]);

        if(result.length>0) 
        { 
            return res.status(400).json({
                message:"email already exists"
            });
        }

        const hashpass=await bcrypt.hash(password,10);
        
        const isql="insert into users(name,email,password,role)values(?,?,?,?)";
        await db.query(isql,[name,email,hashpass,"student"]);

        try
        {
            await transporter.sendMail
            ({
                from:`"VK LearnHub" <b59b32001@smtp-brevo.com>`,

                to:email,

                subject:"Registration Successful – VK LearnHub",

                html:
                `
                <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f5f0ff;padding:32px;border-radius:16px;">

                  <h2 style="color:#7c3aed;">Welcome, ${name}! 🎉</h2>

                  <p style="color:#374151;">You have successfully registered on the <strong>VK LearnHub</strong>.</p>

                  <table style="margin-top:16px;background:#fff;border-radius:8px;padding:16px;width:100%;">

                    <tr>
                    <td style="color:#6b7280;">Name</td><td><strong>${name}</strong></td>
                    </tr>

                    <tr>
                    <td style="color:#6b7280;">Email</td><td><strong>${email}</strong></td>
                    </tr>

                    <tr>
                    <td style="color:#6b7280;">Role</td><td><strong>Student</strong></td>
                    </tr>

                  </table>

                  <p style="margin-top:24px;color:#6b7280;font-size:13px;">Start exploring courses and enroll today!</p>
                </div>

                `
            });
            console.log("registration email sent successfully");
        }

        catch(err)
        { console.log("failed to send email",err.message); 

        }

        res.json({message:"registration successful"});
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});

app.post("/register-instructor",async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const sql="select * from users where email=?";
        const[result]=await db.query(sql,[email]);
        if(result.length>0) return res.status(400).json({message:"email already exists"});

        const hashpass=await bcrypt.hash(password,10);
        // Registering user with 'instructor' role
        const isql="insert into users(name,email,password,role)values(?,?,?,?)";
        await db.query(isql,[name,email,hashpass,"instructor"]);

        res.json({message:"instructor registration successful"});
    }
    catch(err){ res.status(500).json({message:err.message}); }
});

app.post("/login",async(req,res)=>
{
    try
    {
        const{email,password}=req.body;
        const sql="select * from users where email=?";
        const[result]=await db.query(sql,[email]);

        if(result.length===0) 
        {

          return res.status(401).json({
          message:"invalid email or password"
          });

        }

        const loginuser=result[0];
        const matchpass=await bcrypt.compare(password,loginuser.password);
        if(!matchpass) return res.status(401).json({message:"invalid email or password"});

        res.json
        ({
            message:"login successful",
            user:{
                id:loginuser.id,
                name:loginuser.name,
                email:loginuser.email,
                role:loginuser.role
            }
        });
    }
    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});



app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.post("/courses",async(req,res)=>
{
    try
    {
        const{title,description,duration,price,instructor_id}=req.body;
        const sql="insert into courses(title,description,duration,price,instructor_id)values(?,?,?,?,?)";
        await db.query(sql,[title,description,duration,price,instructor_id]);
        res.json({message:"course inserted successfully"});
    }
    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});


app.get("/courses",async(req,res)=>
{
    try
    {
        const sql="select * from courses";
        const[result]=await db.query(sql);
        res.json(result);
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});

app.get("/courses/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const sql="select * from courses where id=?";
        const[result]=await db.query(sql,[id]);

        if(result.length===0)
        {
            return res.status(404).json({
             message:"course not found"
            });
        }
        res.json(result[0]);
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        });
    }
});

app.put("/courses/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const{title,description,duration,price,instructor_id}=req.body;
        const sql="update courses set title=?,description=?,duration=?,price=?,instructor_id=? where id=?";
        const[result]=await db.query(sql,[title,description,duration,price,instructor_id,id]);

        if(result.affectedRows===0)
        { 
            return res.status(404).json({
            message:"course not found"
            });
        }

        res.json({
        message:"course updated successfully"
        });
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});

app.delete("/courses/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const sql="delete from courses where id=?";
        const[result]=await db.query(sql,[id]);

        if(result.affectedRows===0)
        {
            return res.status(404).json({message:"course not found"});
        }

        res.json({message:"course deleted successfully"});
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        });
    }
});

app.get("/courses/instructor/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const sql="select * from courses where instructor_id=?";
        const[result]=await db.query(sql,[id]);
        res.json(result);
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});

app.get("/coursedetails/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const sql="select courses.title AS CourseName,courses.description AS Information,courses.duration AS Period,courses.price AS Amount,users.name AS Instructor from courses join users on courses.instructor_id=users.id where courses.id=?";
        const[result]=await db.query(sql,[id]);

        if(result.length===0) 
        {
            return res.status(404).json({
            message:"Course not found"
            });
        }

        res.json(result[0]);
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});


app.get("/cards",async(req,res)=>
{
    try
    {
        const sql="select(select count(*)from users) AS TotalUsers,(select count(*)from courses) AS TotalCourses,(select count(*)from users WHERE role='instructor') AS TotalInstructors,(select count(*)from users WHERE role='student') AS TotalStudents";
        const[result]=await db.query(sql);
        res.json(result[0]);
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});



app.get("/instructor/stats",async(req,res)=>
{
    try
    {
        const sql=`
                  select
                  (select count(*) from users where role='student') AS totalStudents,
                  (select count(*) from courses) AS totalCourses,
                  (select count(*) from enrollments) AS totalEnrollments,
                  (select count(*) from enrollments where status='active') AS activeEnrollments,
                  (select count(*) from enrollments where status='completed') AS completedEnrollments,
                  (select COALESCE(sum(c.price),0) from enrollments e join courses c on e.course_id=c.id) AS totalRevenue
                `;
        const[result]=await db.query(sql);
        res.json(result[0]);
    }
    catch(err)
    { 
        res.status(500).json({
            message:err.message
        }); 
    }
});



app.get("/instructor/enrollments",async(req,res)=>
{
    try
    {
        const sql=`
                 select e.id AS enrollmentId, e.status, e.enrolled_at,
                 u.id AS studentId, u.name AS studentName, u.email AS studentEmail,
                 c.id AS courseId, c.title AS courseTitle, c.price AS coursePrice, c.duration AS courseDuration
                 from enrollments e
                 join users u on e.student_id=u.id
                 join courses c on e.course_id=c.id
                 order by e.enrolled_at DESC

                `;
        const[result]=await db.query(sql);

        res.json(result);
    }

    catch(err)
    {
         res.status(500).json({
         message:err.message
        }); 
    }
});


app.put("/instructor/enrollments/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const{status}=req.body;
        const sql="update enrollments set status=? where id=?";
        const[result]=await db.query(sql,[status,id]);

        if(result.affectedRows===0) 
        {
            return res.status(404).json({message:"enrollment not found"});
        }
        res.json({message:"enrollment updated successfully"});
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }

});


app.post("/enrollments",async(req,res)=>
{
    try
    {
        const{student_id,course_id}=req.body;
        const sql="select * from enrollments where student_id=? and course_id=?";
        const[exist]=await db.query(sql,[student_id,course_id]);

        if(exist.length>0)
        {
            return res.status(400).json({
            message:"already enrolled in this course"
            });
        }

        const isql="insert into enrollments(student_id,course_id) values(?,?)";
        await db.query(isql,[student_id,course_id]);
        res.json({message:"enrolled successfully"});
    }

    catch(err)
    { 
        res.status(500).json({message:err.message}); 
    }
});

app.get("/enrollments/:studentId",async(req,res)=>
{
    try
    {
        const{studentId}=req.params;

        const sql=`
                     select e.id AS enrollmentId, e.status, e.enrolled_at,
                     c.id AS courseId, c.title, c.description, c.duration, c.price
                     from enrollments e
                     join courses c on e.course_id=c.id
                     where e.student_id=?
                     order by e.enrolled_at DESC
                  `;
        const[result]=await db.query(sql,[studentId]);
        res.json(result);
    }

    catch(err)
    {
         res.status(500).json({
            message:err.message
        }); 
    }
});

app.delete("/enrollments/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const sql="delete from enrollments where id=?";
        await db.query(sql,[id]);

        res.json({message:"unenrolled successfully"});
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});


app.post("/enrollments/complete", async (req, res) => {
    try {
        const { student_id, course_id, student_name, student_email, course_title } = req.body;
        
        // Update database status
        const sql = "update enrollments set status='completed' where student_id=? and course_id=?";
        const [result] = await db.query(sql, [student_id, course_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        // Send email
        try {
            await transporter.sendMail({
                from: `"VK LearnHub" <b59b32001@smtp-brevo.com>`,
                to: student_email,
                subject: "Course Completion Certificate – VK LearnHub",
                html: `
                <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fdfdfd;padding:40px;border:10px solid #7e22ce;border-radius:8px;text-align:center;">
                  <h1 style="color:#7c3aed;margin-bottom:10px;">CERTIFICATE OF COMPLETION</h1>
                  <p style="color:#6b7280;font-size:16px;">This is to certify that</p>
                  <h2 style="color:#111827;font-size:28px;margin:20px 0;">${student_name}</h2>
                  <p style="color:#6b7280;font-size:16px;">has successfully completed the course</p>
                  <h3 style="color:#374151;font-size:22px;margin:20px 0;">${course_title}</h3>
                  <p style="color:#6b7280;font-size:14px;margin-top:40px;">VK LearnHub Education Platform</p>
                </div>
                `
            });
            console.log("Certificate email sent successfully");
        } catch (err) {
            console.log("failed to send certificate email", err.message); 
        }

        res.json({ message: "Course marked as completed!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.put("/instructor/users/:id",async(req,res)=>
{
    try
    {
        const{id}=req.params;
        const{name,email,role}=req.body;
        const sql="update users set name=?,email=?,role=? where id=?";
        const[result]=await db.query(sql,[name,email,role,id]);

        if(result.affectedRows===0) 
        {
            return res.status(404).json({
            message:"user not found"
            });
        }

        res.json({message:"user updated successfully"});
    }

    catch(err)
    { 
        res.status(500).json({
        message:err.message
        }); 
    }
});

// Courses Bulk Upload API
app.post("/courses/bulkupload", async (req, res) => {
    try {
        const courses = req.body.courses || [];
        if (!Array.isArray(courses) || courses.length === 0) {
            return res.status(400).json({ message: "No courses provided for bulk upload" });
        }

        const values = courses.map((c) => [c.title, c.description, c.duration, c.price, c.instructor_id]);
        const sql = "insert into courses(title,description,duration,price,instructor_id) values ?";

        await db.query(sql, [values]);

        res.json({ message: "Courses Bulk Upload Done !!" });
    } catch (err) {
        console.error("/courses/bulkupload error:", err);
        res.status(500).json({ message: err.message || "Bulk upload failed" });
    }
});

// Courses Pagination API
app.get("/courses_pagination", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const countQuery = "SELECT COUNT(*) AS total FROM courses";
        const [countResult] = await db.query(countQuery);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        const sql = "SELECT * FROM courses LIMIT ? OFFSET ?";
        const [result] = await db.query(sql, [limit, offset]);

        res.json({
            data: result,
            total,
            page,
            limit,
            totalPages
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.listen(5000,()=>
{
    console.log("server is running on port 5000");
});
