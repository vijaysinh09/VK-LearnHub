import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./InstructorDashboard.css";

function InstructorDashboard() {
  const navigate = useNavigate();
  const loguser = JSON.parse(sessionStorage.getItem("users"));

  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  // Search/filter states
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [enrollSearch, setEnrollSearch] = useState("");

  // Modal states
  const [modal, setModal] = useState(null); // {type:'addCourse'|'editCourse'|'editUser'|'editEnrollment', data:{}}

  // Course form
  const [courseForm, setCourseForm] = useState({ title:"", description:"", duration:"", price:"", instructor_id:"" });

  const fetchStats       = () => axios.get("https://vk-learnhub-1.onrender.com/instructor/stats").then(r => setStats(r.data)).catch(console.error);
  const fetchStudents    = () => axios.get("https://vk-learnhub-1.onrender.com/users").then(r => setStudents(r.data)).catch(console.error);
  const fetchCourses     = () => axios.get("https://vk-learnhub-1.onrender.com/courses").then(r => setCourses(r.data)).catch(console.error);
  const fetchEnrollments = () => axios.get("https://vk-learnhub-1.onrender.com/instructor/enrollments").then(r => setEnrollments(r.data)).catch(console.error);

  // useEffect(() => {
  //   if (!loguser || loguser.role !== "instructor") { navigate("/instructor-login"); return; }
  //   fetchStats(); fetchStudents(); fetchCourses(); fetchEnrollments();
  // }, []);

  useEffect(() => {
    if (!loguser || loguser.role !== "instructor") { navigate("/instructor-login"); return; }
    fetchStats(); fetchStudents(); fetchCourses(); fetchEnrollments();
  }, []);

  const handleLogout = () => { sessionStorage.clear(); navigate("/instructor-login"); };

  // ─── Student actions ───
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await axios.delete(`https://vk-learnhub-1.onrender.com/users/${id}`);
      fetchStudents(); fetchStats();
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const updateUser = async () => {
    try {
      const { id, name, email, role } = modal.data;
      await axios.put(`https://vk-learnhub-1.onrender.com/instructor/users/${id}`, { name, email, role });
      alert("User updated successfully");
      setModal(null); fetchStudents();
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  // ─── Course actions ───
  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`https://vk-learnhub-1.onrender.com/courses/${id}`);
      fetchCourses(); fetchStats();
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const saveCourse = async () => {
    try {
      if (modal.type === "addCourse") {
        await axios.post("https://vk-learnhub-1.onrender.com/courses", courseForm);
        alert("Course added successfully");
      } else {
        await axios.put(`https://vk-learnhub-1.onrender.com/courses/${courseForm.id}`, courseForm);
        alert("Course updated successfully");
      }
      setModal(null); fetchCourses(); fetchStats();
    } catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  const openAddCourse = () => {
    setCourseForm({ title:"", description:"", duration:"", price:"", instructor_id: loguser.id });
    setModal({ type: "addCourse" });
  };

  const openEditCourse = (c) => {
    setCourseForm({ ...c });
    setModal({ type: "editCourse" });
  };

  // ─── Enrollment actions ───
  const deleteEnrollment = async (id) => {
    if (!window.confirm("Remove this enrollment?")) return;
    try {
      await axios.delete(`https://vk-learnhub-1.onrender.com/enrollments/${id}`);
      fetchEnrollments(); fetchStats();
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const updateEnrollmentStatus = async (id, status) => {
    try {
      await axios.put(`https://vk-learnhub-1.onrender.com/instructor/enrollments/${id}`, { status });
      fetchEnrollments();
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  if (!loguser || loguser.role !== "instructor") return null;

  const navItems = [
    { id: "dashboard",   icon: "📊", label: "Dashboard" },
    { id: "students",    icon: "👥", label: "Manage Users" },
    { id: "courses",     icon: "📚", label: "Manage Courses" },
    { id: "enrollments", icon: "🎯", label: "Enrollments" },
    { id: "reports",     icon: "📈", label: "Reports & Stats" },
  ];

  // Filtered lists
  const filteredStudents    = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );
  const filteredCourses     = courses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );
  const filteredEnrollments = enrollments.filter(e =>
    e.studentName.toLowerCase().includes(enrollSearch.toLowerCase()) ||
    e.courseTitle.toLowerCase().includes(enrollSearch.toLowerCase())
  );

  const totalRevenue = stats.totalRevenue || 0;

  return (
    <div className="ad-layout">
      {/* ── Sidebar ── */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand">
          <div className="ad-brand-logo">🛡️</div>
          <div className="ad-brand-title">VK LearnHub</div>
          <div className="ad-brand-sub">Instrutcor Control Panel</div>
        </div>

        <div className="ad-user-strip">
          <div className="ad-avatar">👨‍💼</div>
          <div>
            <div className="ad-user-name">{loguser.name}</div>
            <div className="ad-user-role">Instructor</div>
          </div>
        </div>

        <nav className="ad-nav">
          <div className="ad-nav-section">Management</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`ad-nav-link${activePage === item.id ? " active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="ad-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="ad-main">

        {/* ══ DASHBOARD ══ */}
        {activePage === "dashboard" && (
          <>
            <div className="ad-page-header">
              <div>
                <h1 className="ad-page-title">Instructor Dashboard 🛡️</h1>
                <p className="ad-page-sub">Welcome back, {loguser.name}. Here's your platform overview.</p>
              </div>
            </div>

            <div className="ad-stats">
              <div className="ad-stat-card purple">
                <div className="ad-stat-icon">👥</div>
                <div className="ad-stat-value">{stats.totalStudents || 0}</div>
                <div className="ad-stat-label">Total Students</div>
              </div>
              <div className="ad-stat-card blue">
                <div className="ad-stat-icon">📚</div>
                <div className="ad-stat-value">{stats.totalCourses || 0}</div>
                <div className="ad-stat-label">Total Courses</div>
              </div>
              <div className="ad-stat-card green">
                <div className="ad-stat-icon">🎯</div>
                <div className="ad-stat-value">{stats.totalEnrollments || 0}</div>
                <div className="ad-stat-label">Total Enrollments</div>
              </div>
              <div className="ad-stat-card orange">
                <div className="ad-stat-icon">⚡</div>
                <div className="ad-stat-value">{stats.activeEnrollments || 0}</div>
                <div className="ad-stat-label">Active</div>
              </div>
              <div className="ad-stat-card teal">
                <div className="ad-stat-icon">✅</div>
                <div className="ad-stat-value">{stats.completedEnrollments || 0}</div>
                <div className="ad-stat-label">Completed</div>
              </div>
              <div className="ad-stat-card red">
                <div className="ad-stat-icon">💰</div>
                <div className="ad-stat-value">₹{Number(totalRevenue).toLocaleString('en-IN')}</div>
                <div className="ad-stat-label">Total Revenue</div>
              </div>
            </div>

            {/* Quick tables */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              {/* Recent Enrollments */}
              <div className="ad-widget">
                <div className="ad-widget-header">
                  <div className="ad-widget-title">🕐 Recent Enrollments</div>
                  <button className="btn btn-primary btn-sm" onClick={() => setActivePage("enrollments")}>View All</button>
                </div>
                {enrollments.length === 0 ? (
                  <div className="ad-empty"><div className="ad-empty-icon">📋</div>No enrollments yet.</div>
                ) : (
                  <div className="ad-activity-list">
                    {enrollments.slice(0, 5).map(e => (
                      <div key={e.enrollmentId} className="ad-activity-item">
                        <div className="ad-activity-dot" />
                        <div>
                          <div className="ad-activity-text">
                            <strong>{e.studentName}</strong> enrolled in <strong>{e.courseTitle}</strong>
                          </div>
                          <div className="ad-activity-time">
                            {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('en-IN') : 'N/A'} — {e.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Courses */}
              <div className="ad-widget">
                <div className="ad-widget-header">
                  <div className="ad-widget-title">📚 Course Overview</div>
                  <button className="btn btn-primary btn-sm" onClick={() => setActivePage("courses")}>Manage</button>
                </div>
                {courses.length === 0 ? (
                  <div className="ad-empty"><div className="ad-empty-icon">📦</div>No courses yet.</div>
                ) : (
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr><th>Course</th><th>Duration</th><th>Price</th></tr>
                      </thead>
                      <tbody>
                        {courses.slice(0, 5).map(c => (
                          <tr key={c.id}>
                            <td style={{fontWeight:600}}>{c.title}</td>
                            <td>{c.duration}</td>
                            <td style={{fontWeight:700,color:'#7e22ce'}}>₹{c.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══ MANAGE STUDENTS ══ */}
        {activePage === "students" && (
          <>
            <div className="ad-page-header">
              <div>
                <h1 className="ad-page-title">👥 Manage Students</h1>
                <p className="ad-page-sub">{students.length} registered users in the system.</p>
              </div>
              <input
                className="ad-search"
                placeholder="🔍 Search by name or email…"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
              />
            </div>

            <div className="ad-widget">
              {filteredStudents.length === 0 ? (
                <div className="ad-empty"><div className="ad-empty-icon">👤</div>No users found.</div>
              ) : (
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s, i) => (
                        <tr key={s.id}>
                          <td style={{color:'#9ca3af'}}>{i+1}</td>
                          <td style={{fontWeight:600}}>{s.name}</td>
                          <td>{s.email}</td>
                          <td>
                            <span className={`badge ${s.role==='instructor'?'badge-purple':s.role==='instructor'?'badge-blue':'badge-green'}`}>
                              {s.role}
                            </span>
                          </td>
                          <td>
                            <div className="ad-actions">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setModal({ type:"editUser", data:{...s} })}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteUser(s.id)}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ MANAGE COURSES ══ */}
        {activePage === "courses" && (
          <>
            <div className="ad-page-header">
              <div>
                <h1 className="ad-page-title">📚 Manage Courses</h1>
                <p className="ad-page-sub">{courses.length} courses in the system.</p>
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
                <input
                  className="ad-search"
                  placeholder="🔍 Search courses…"
                  value={courseSearch}
                  onChange={e => setCourseSearch(e.target.value)}
                />
                <button className="btn btn-primary" onClick={openAddCourse}>
                  + Add Course
                </button>
              </div>
            </div>

            <div className="ad-widget">
              {filteredCourses.length === 0 ? (
                <div className="ad-empty"><div className="ad-empty-icon">📦</div>No courses found.</div>
              ) : (
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((c, i) => (
                        <tr key={c.id}>
                          <td style={{color:'#9ca3af'}}>{i+1}</td>
                          <td style={{fontWeight:600,maxWidth:160}}>{c.title}</td>
                          <td style={{maxWidth:200,fontSize:12,color:'#6b7280',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                            {c.description}
                          </td>
                          <td>{c.duration}</td>
                          <td style={{fontWeight:700,color:'#7e22ce'}}>₹{c.price}</td>
                          <td>
                            <div className="ad-actions">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => openEditCourse(c)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteCourse(c.id)}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ ENROLLMENTS ══ */}
        {activePage === "enrollments" && (
          <>
            <div className="ad-page-header">
              <div>
                <h1 className="ad-page-title">🎯 Enrollments</h1>
                <p className="ad-page-sub">{enrollments.length} total enrollments.</p>
              </div>
              <input
                className="ad-search"
                placeholder="🔍 Search by student or course…"
                value={enrollSearch}
                onChange={e => setEnrollSearch(e.target.value)}
              />
            </div>

            <div className="ad-widget">
              {filteredEnrollments.length === 0 ? (
                <div className="ad-empty"><div className="ad-empty-icon">🎯</div>No enrollments found.</div>
              ) : (
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnrollments.map((e, i) => (
                        <tr key={e.enrollmentId}>
                          <td style={{color:'#9ca3af'}}>{i+1}</td>
                          <td>
                            <div style={{fontWeight:600}}>{e.studentName}</div>
                            <div style={{fontSize:11,color:'#9ca3af'}}>{e.studentEmail}</div>
                          </td>
                          <td style={{fontWeight:600}}>{e.courseTitle}</td>
                          <td style={{fontWeight:700,color:'#7e22ce'}}>₹{e.coursePrice}</td>
                          <td>{e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('en-IN') : 'N/A'}</td>
                          <td>
                            <select
                              style={{padding:'4px 8px',borderRadius:8,border:'1px solid #e5e7eb',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}
                              value={e.status}
                              onChange={ev => updateEnrollmentStatus(e.enrollmentId, ev.target.value)}
                            >
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteEnrollment(e.enrollmentId)}
                            >
                              🗑 Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ REPORTS ══ */}
        {activePage === "reports" && (
          <>
            <div className="ad-page-header">
              <div>
                <h1 className="ad-page-title">📈 Reports & Analytics</h1>
                <p className="ad-page-sub">Platform performance overview.</p>
              </div>
            </div>

            <div className="ad-stats">
              <div className="ad-stat-card purple">
                <div className="ad-stat-icon">👥</div>
                <div className="ad-stat-value">{stats.totalStudents || 0}</div>
                <div className="ad-stat-label">Students</div>
              </div>
              <div className="ad-stat-card blue">
                <div className="ad-stat-icon">📚</div>
                <div className="ad-stat-value">{stats.totalCourses || 0}</div>
                <div className="ad-stat-label">Courses</div>
              </div>
              <div className="ad-stat-card green">
                <div className="ad-stat-icon">🎯</div>
                <div className="ad-stat-value">{stats.totalEnrollments || 0}</div>
                <div className="ad-stat-label">Enrollments</div>
              </div>
              <div className="ad-stat-card teal">
                <div className="ad-stat-icon">✅</div>
                <div className="ad-stat-value">{stats.completedEnrollments || 0}</div>
                <div className="ad-stat-label">Completed</div>
              </div>
              <div className="ad-stat-card orange">
                <div className="ad-stat-icon">⚡</div>
                <div className="ad-stat-value">{stats.activeEnrollments || 0}</div>
                <div className="ad-stat-label">Active</div>
              </div>
              <div className="ad-stat-card red">
                <div className="ad-stat-icon">💰</div>
                <div className="ad-stat-value">₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
                <div className="ad-stat-label">Revenue</div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              <div className="ad-widget">
                <div className="ad-widget-header">
                  <div className="ad-widget-title">📊 Enrollment Breakdown</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  {[
                    { label:'Active Enrollments',    val: stats.activeEnrollments || 0,    total: stats.totalEnrollments || 1, color:'#10b981' },
                    { label:'Completed Enrollments', val: stats.completedEnrollments || 0, total: stats.totalEnrollments || 1, color:'#3b82f6' },
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13,color:'#6b7280'}}>
                        <span>{r.label}</span>
                        <strong>{r.val} ({Math.round((r.val/r.total)*100) || 0}%)</strong>
                      </div>
                      <div style={{background:'#f3f4f6',borderRadius:999,height:10,overflow:'hidden'}}>
                        <div style={{width:`${Math.round((r.val/r.total)*100)||0}%`,height:'100%',borderRadius:999,background:r.color,transition:'width .5s ease'}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ad-widget">
                <div className="ad-widget-header">
                  <div className="ad-widget-title">🏆 Top Courses by Enrollment</div>
                </div>
                {enrollments.length === 0 ? (
                  <div className="ad-empty">No data yet.</div>
                ) : (() => {
                  const counts = {};
                  enrollments.forEach(e => { counts[e.courseTitle] = (counts[e.courseTitle]||0)+1; });
                  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
                  return sorted.map(([title, count]) => (
                    <div key={title} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f3f4f6',fontSize:14}}>
                      <span style={{fontWeight:600,color:'#374151'}}>{title}</span>
                      <span style={{background:'#f3e8ff',color:'#7e22ce',borderRadius:999,padding:'2px 10px',fontWeight:700,fontSize:12}}>{count} enrolled</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </>
        )}

      </main>

      {/* ── Modals ── */}

      {/* Edit User Modal */}
      {modal?.type === "editUser" && (
        <div className="ad-modal-overlay" onClick={() => setModal(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <h3 className="ad-modal-title">✏️ Edit User</h3>
            <div className="ad-modal-field">
              <label className="ad-modal-label">Full Name</label>
              <input className="ad-modal-input" value={modal.data.name}
                onChange={e => setModal({...modal, data:{...modal.data, name:e.target.value}})} />
            </div>
            <div className="ad-modal-field">
              <label className="ad-modal-label">Email</label>
              <input className="ad-modal-input" type="email" value={modal.data.email}
                onChange={e => setModal({...modal, data:{...modal.data, email:e.target.value}})} />
            </div>
            <div className="ad-modal-field">
              <label className="ad-modal-label">Role</label>
              <select className="ad-modal-select" value={modal.data.role}
                onChange={e => setModal({...modal, data:{...modal.data, role:e.target.value}})}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <div className="ad-modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={updateUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {(modal?.type === "addCourse" || modal?.type === "editCourse") && (
        <div className="ad-modal-overlay" onClick={() => setModal(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <h3 className="ad-modal-title">{modal.type === "addCourse" ? "➕ Add New Course" : "✏️ Edit Course"}</h3>
            {[
              { label:"Course Title",    name:"title",         type:"text",   ph:"e.g. Web Development" },
              { label:"Description",     name:"description",   type:"text",   ph:"Short course description" },
              { label:"Duration",        name:"duration",      type:"text",   ph:"e.g. 8 weeks" },
              { label:"Price (₹)",       name:"price",         type:"number", ph:"e.g. 4999" },
              { label:"Instructor ID",   name:"instructor_id", type:"number", ph:"Instructor's user ID" },
            ].map(f => (
              <div className="ad-modal-field" key={f.name}>
                <label className="ad-modal-label">{f.label}</label>
                <input
                  className="ad-modal-input"
                  type={f.type}
                  placeholder={f.ph}
                  value={courseForm[f.name]}
                  onChange={e => setCourseForm({...courseForm, [f.name]:e.target.value})}
                />
              </div>
            ))}
            <div className="ad-modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveCourse}>
                {modal.type === "addCourse" ? "Add Course" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default InstructorDashboard;

