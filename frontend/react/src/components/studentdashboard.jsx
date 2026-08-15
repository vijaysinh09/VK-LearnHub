import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./studentdashboard.css";

const COURSE_EMOJIS = ["📘","📗","📕","📙","🧪","🎨","🧠","💻","📐","🔬"];

function StudentDashboard() {
  const navigate = useNavigate();
  const loguser = JSON.parse(sessionStorage.getItem("users"));

  const location = useLocation();
  const [activePage, setActivePage] = useState(location.state?.tab || "dashboard");
  const [cards, setCards] = useState({});
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [availCourses, setAvailCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openBot, setOpenBot] = useState(null);
  const [chatMessages, setChatMessages] = useState({
    website: [{ role: "bot", content: "Hi! I am the VK LearnHub Assistant. How can I help you with our platform today?" }],
    general: [{ role: "bot", content: "Hi! I am your General AI Assistant. Ask me anything!" }]
  });
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Derived stats
  const activeCount = myCourses.filter(c => c.status === "active").length;
  const doneCount   = myCourses.filter(c => c.status === "completed").length;
  const totalSpent  = myCourses.reduce((s, c) => s + Number(c.price || 0), 0);
  const progressPct = myCourses.length ? Math.round((doneCount / myCourses.length) * 100) : 0;

  const fetchCards      = () => axios.get("https://vk-learnhub-1.onrender.com/cards").then(r => setCards(r.data)).catch(console.error);
  const fetchMyCourses  = () => axios.get(`https://vk-learnhub-1.onrender.com/enrollments/${loguser?.id}`).then(r => setMyCourses(r.data)).catch(console.error);
  const fetchAllCourses = (page = 1) => {
    axios.get(`https://vk-learnhub-1.onrender.com/courses_pagination?page=${page}&limit=8`)
      .then(r => {
        setAllCourses(r.data.data);
        setTotalPages(r.data.totalPages);
        setCurrentPage(r.data.page);
      }).catch(console.error);
  };

  useEffect(() => {
    if (!loguser) { navigate("/login"); return; }
    fetchCards(); fetchMyCourses(); fetchAllCourses();
  }, []);

  useEffect(() => {
    const enrolledIds = new Set(myCourses.map(c => c.courseId));
    setAvailCourses(allCourses.filter(c => !enrolledIds.has(c.id)));
  }, [allCourses, myCourses]);

  useEffect(() => {
    if (location.state?.tab) {
      setActivePage(location.state.tab);
    }
  }, [location.state]);

  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post("https://vk-learnhub-1.onrender.com/enrollments", {
        student_id: loguser.id,
        course_id: courseId
      });
      alert(res.data.message);
      fetchMyCourses(); fetchAllCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm("Are you sure you want to unenroll from this course?")) return;
    try {
      await axios.delete(`https://vk-learnhub-1.onrender.com/enrollments/${enrollmentId}`);
      fetchMyCourses(); fetchAllCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Unenroll failed");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleSendMessage = async (e, currentMode) => {
    e?.preventDefault();
    if (!chatInput.trim() || !currentMode) return;
    const userMessage = chatInput;
    const newMsgs = [...chatMessages[currentMode], { role: "user", content: userMessage }];
    
    setChatMessages(prev => ({...prev, [currentMode]: newMsgs}));
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await axios.post("https://vk-learnhub-1.onrender.com/chat", { message: userMessage, type: currentMode });
      setChatMessages(prev => ({...prev, [currentMode]: [...newMsgs, { role: "bot", content: res.data.reply }]}));
    } catch (err) {
      setChatMessages(prev => ({...prev, [currentMode]: [...newMsgs, { role: "bot", content: "Sorry, something went wrong." }]}));
    }
    setChatLoading(false);
  };

  if (!loguser) return null;

  const navItems = [
    { id: "dashboard",   icon: "🏠", label: "Dashboard" },
    { id: "courses",     icon: "📚", label: "Available Courses" },
    { id: "enrolled",    icon: "🎯", label: "My Enrollments" },
    { id: "progress",    icon: "📊", label: "My Progress" },
    { id: "payments",    icon: "💳", label: "Payment History" },
    { id: "profile",     icon: "👤", label: "My Profile" },
  ];

  return (
    <div className="sd-layout">
      {/* ── Sidebar ── */}
      <aside className="sd-sidebar">
        <div className="sd-sidebar-brand">
          <div className="sd-brand-logo">🎓</div>
          <div className="sd-brand-title">VK LearnHub</div>
          <div className="sd-brand-sub">Student Portal</div>
        </div>

        <div className="sd-user-strip">
          <div className="sd-avatar">🧑‍🎓</div>
          <div>
            <div className="sd-user-name">{loguser.name}</div>
            <div className="sd-user-role">Student</div>
          </div>
        </div>

        <nav className="sd-nav">
          <div className="sd-nav-section">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`sd-nav-link${activePage === item.id ? " active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="sd-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

        </nav>

        <button className="sd-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="sd-main">

        {/* ══ DASHBOARD HOME ══ */}
        {activePage === "dashboard" && (
          <>
            <div className="sd-page-header">
              <div>
                <h1 className="sd-page-title">Welcome back, {loguser.name}! 👋</h1>
                <p className="sd-page-sub">Here's an overview of your learning journey.</p>
              </div>
            </div>

            {/* Stats */}
            <div className="sd-stats">
              <div className="sd-stat-card purple">
                <div className="sd-stat-icon">📚</div>
                <div className="sd-stat-value">{myCourses.length}</div>
                <div className="sd-stat-label">Enrolled Courses</div>
              </div>
              <div className="sd-stat-card green">
                <div className="sd-stat-icon">✅</div>
                <div className="sd-stat-value">{doneCount}</div>
                <div className="sd-stat-label">Completed</div>
              </div>
              <div className="sd-stat-card blue">
                <div className="sd-stat-icon">⚡</div>
                <div className="sd-stat-value">{activeCount}</div>
                <div className="sd-stat-label">In Progress</div>
              </div>
              <div className="sd-stat-card orange">
                <div className="sd-stat-icon">💰</div>
                <div className="sd-stat-value">₹{totalSpent}</div>
                <div className="sd-stat-label">Total Invested</div>
              </div>
            </div>

            <div className="sd-grid">
              {/* My Courses widget */}
              <div className="sd-widget">
                <div className="sd-widget-header">
                  <div className="sd-widget-title">📘 My Courses</div>
                  <button className="sd-widget-link" style={{background:'none',border:'none',cursor:'pointer'}} onClick={() => setActivePage("enrolled")}>
                    View All →
                  </button>
                </div>
                {myCourses.length === 0 ? (
                  <div className="sd-empty">
                    <div className="sd-empty-icon">🎒</div>
                    You haven't enrolled in any course yet.
                  </div>
                ) : (
                  myCourses.slice(0, 5).map(c => (
                    <div key={c.enrollmentId} style={{padding:'10px 0',borderBottom:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontSize:'13px',fontWeight:600,color:'#1f2937'}}>{c.title}</div>
                      {c.status === 'completed' ? (
                          <span className="badge badge-blue">completed</span>
                      ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/course-learning/${c.courseId}`, { state: { course: c } })}>Start Learning</button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Learning Summary */}
              <div className="sd-widget">
                <div className="sd-widget-header">
                  <div className="sd-widget-title">📊 Learning Summary</div>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:13,color:'#6b7280'}}>
                    <span>Overall Progress</span>
                    <span style={{fontWeight:700,color:'#4C2A78'}}>{progressPct}%</span>
                  </div>
                  <div className="sd-progress-wrap">
                    <div className="sd-progress-fill" style={{width:`${progressPct}%`}} />
                  </div>
                </div>
                <div className="sd-pay-row"><span className="sd-pay-label">Total Enrolled</span><span className="sd-pay-value">{myCourses.length}</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">Active Courses</span><span className="sd-pay-value">{activeCount}</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">Completed</span><span className="sd-pay-value">{doneCount}</span></div>
                <div className="sd-pay-row sd-pay-total"><span className="sd-pay-label">Total Invested</span><span className="sd-pay-value">₹{totalSpent}</span></div>
              </div>

              {/* Recommendations */}
              <div className="sd-widget">
                <div className="sd-widget-header">
                  <div className="sd-widget-title">✨ Recommended For You</div>
                  <button className="sd-widget-link" style={{background:'none',border:'none',cursor:'pointer'}} onClick={() => setActivePage("courses")}>
                    See all →
                  </button>
                </div>
                {availCourses.length === 0 ? (
                  <div className="sd-empty">🎉 You've explored all available courses!</div>
                ) : (
                  <ul className="sd-rec-list">
                    {availCourses.slice(0, 5).map(c => (
                      <li key={c.id} className="sd-rec-item">
                        <span className="sd-rec-title">{c.title}</span>
                        <span className="sd-rec-price">₹{c.price}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Notifications */}
              <div className="sd-widget">
                <div className="sd-widget-header">
                  <div className="sd-widget-title">🔔 Recent Activity</div>
                </div>
                {myCourses.length === 0 ? (
                  <div className="sd-empty">No recent activity.</div>
                ) : (
                  <div className="sd-notif-list">
                    {myCourses.slice(0, 5).map(c => (
                      <div key={c.enrollmentId} className="sd-notif-item">
                        <div className="sd-notif-dot" />
                        <span>Enrolled in <strong>{c.title}</strong> — {c.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform stats */}
              <div className="sd-widget sd-grid-full">
                <div className="sd-widget-header">
                  <div className="sd-widget-title">🌐 Platform Overview</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:12}}>
                  {[
                    {label:'Total Students', value: cards.TotalStudents, icon:'🧑‍🎓'},
                    {label:'Total Courses',  value: cards.TotalCourses,  icon:'📚'},
                    {label:'Instructors',    value: cards.TotalInstructors, icon:'👩‍🏫'},
                    {label:'Total Users',    value: cards.TotalUsers,    icon:'👥'},
                  ].map(s => (
                    <div key={s.label} style={{background:'linear-gradient(135deg,#FAF7FF,#EDE6F5)',borderRadius:14,padding:'20px 14px',textAlign:'center',border:'1px solid #D8CBF0',transition:'transform .2s'}}>
                      <div style={{fontSize:26}}>{s.icon}</div>
                      <div style={{fontSize:24,fontWeight:800,color:'#2E1A47',margin:'6px 0 2px'}}>{s.value}</div>
                      <div style={{fontSize:11,color:'#8B84A0',fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase'}}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ AVAILABLE COURSES ══ */}
        {activePage === "courses" && (
          <>
            <div className="sd-page-header">
              <div>
                <h1 className="sd-page-title">📚 Available Courses</h1>
                <p className="sd-page-sub">Explore and enroll in courses to start learning.</p>
              </div>
              <input
                type="text"
                className="sd-search-input"
                placeholder="Search courses..."
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
              />
            </div>

            {(() => {
              const filteredAvailCourses = availCourses.filter(c =>
                c.title.toLowerCase().includes(courseSearch.toLowerCase())
              );
              if (filteredAvailCourses.length === 0) {
                return (
                  <div className="sd-widget">
                    <div className="sd-empty">
                      <div className="sd-empty-icon">🎉</div>
                      {availCourses.length === 0 ? "You are enrolled in all available courses!" : "No courses found matching your search."}
                    </div>
                  </div>
                );
              }
              return (
                <div className="sd-course-grid">
                  {filteredAvailCourses.map((c, i) => (
                    <div key={c.id} className="sd-course-card">
                      <div className="sd-course-title">{c.title}</div>
                      <div className="sd-course-desc">{c.description}</div>
                      <div className="sd-course-meta">
                        <span>⏱ {c.duration}</span>
                      </div>
                      <div className="sd-course-price">₹{c.price}</div>
                      <div className="sd-course-actions">
                        <Link
                          to={`/coursedetails/${c.id}`}
                          className="btn btn-outline btn-sm"
                          style={{flex:1, textAlign:'center'}}
                        >
                          Course Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px', paddingBottom: '30px', gap: '8px' }}>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === 1}
                  onClick={() => fetchAllCourses(currentPage - 1)}
                >
                  Previous
                </button>
                <span style={{ padding: '8px 16px', background: '#f3f4f6', borderRadius: '6px', fontWeight: 'bold' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="btn btn-outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => fetchAllCourses(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* ══ MY ENROLLMENTS ══ */}
        {activePage === "enrolled" && (
          <>
            <div className="sd-page-header">
              <div>
                <h1 className="sd-page-title">🎯 My Enrollments</h1>
                <p className="sd-page-sub">Manage your enrolled courses.</p>
              </div>
            </div>
            <div className="sd-widget">
              {myCourses.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon">🎒</div>
                  You haven't enrolled in any course yet.
                  <br/>
                  <button className="btn btn-primary btn-sm" style={{marginTop:12}} onClick={() => setActivePage("courses")}>
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="sd-table-wrap">
                  <table className="sd-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Course</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Enrolled On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myCourses.map((c, i) => (
                        <tr key={c.enrollmentId}>
                          <td style={{color:'#9ca3af'}}>{i+1}</td>
                          <td style={{fontWeight:600}}>{c.title}</td>
                          <td>{c.duration}</td>
                          <td style={{fontWeight:700,color:'#4C2A78'}}>₹{c.price}</td>
                          <td>{c.enrolled_at ? new Date(c.enrolled_at).toLocaleDateString('en-IN') : 'N/A'}</td>
                          <td>
                            <span className={`badge ${c.status==='completed'?'badge-blue':'badge-green'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {c.status !== 'completed' && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => navigate(`/course-learning/${c.courseId}`, { state: { course: c } })}
                                >
                                  Start Learning
                                </button>
                              )}
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleUnenroll(c.enrollmentId)}
                              >
                                Unenroll
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

        {/* ══ PROGRESS ══ */}
        {activePage === "progress" && (
          <>
            <div className="sd-page-header">
              <div>
                <h1 className="sd-page-title">📊 My Learning Progress</h1>
                <p className="sd-page-sub">Track your progress across all enrolled courses.</p>
              </div>
            </div>

            <div className="sd-stats" style={{marginBottom:24}}>
              <div className="sd-stat-card purple">
                <div className="sd-stat-icon">📚</div>
                <div className="sd-stat-value">{myCourses.length}</div>
                <div className="sd-stat-label">Total Enrolled</div>
              </div>
              <div className="sd-stat-card green">
                <div className="sd-stat-icon">✅</div>
                <div className="sd-stat-value">{doneCount}</div>
                <div className="sd-stat-label">Completed</div>
              </div>
              <div className="sd-stat-card blue">
                <div className="sd-stat-icon">⚡</div>
                <div className="sd-stat-value">{activeCount}</div>
                <div className="sd-stat-label">In Progress</div>
              </div>
              <div className="sd-stat-card orange">
                <div className="sd-stat-icon">🏆</div>
                <div className="sd-stat-value">{progressPct}%</div>
                <div className="sd-stat-label">Completion Rate</div>
              </div>
            </div>

            <div className="sd-widget">
              <div className="sd-widget-header">
                <div className="sd-widget-title">📈 Overall Progress</div>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:14,color:'#6b7280'}}>
                  <span>Completion Rate</span>
                  <strong style={{color:'#4C2A78'}}>{progressPct}%</strong>
                </div>
                <div className="sd-progress-wrap" style={{height:14}}>
                  <div className="sd-progress-fill" style={{width:`${progressPct}%`}} />
                </div>
              </div>

              {myCourses.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon">🎒</div>
                  Enroll in courses to track your progress.
                </div>
              ) : (
                myCourses.map((c, i) => {
                  const pct = c.status === "completed" ? 100 : Math.floor(30 + (i * 17) % 50);
                  return (
                    <div key={c.enrollmentId} style={{marginBottom:18}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:13,fontWeight:600,color:'#374151'}}>{c.title}</span>
                        <span style={{fontSize:12,fontWeight:700,color:'#4C2A78'}}>{pct}%</span>
                      </div>
                      <div className="sd-progress-wrap">
                        <div className="sd-progress-fill" style={{width:`${pct}%`}} />
                      </div>
                      <div style={{marginTop:4,fontSize:11,color:'#9ca3af'}}>Status: {c.status}</div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ══ PAYMENT HISTORY ══ */}
        {activePage === "payments" && (
          <>
            <div className="sd-page-header">
              <div>
                <h1 className="sd-page-title">💳 Payment History</h1>
                <p className="sd-page-sub">Record of all your course investments.</p>
              </div>
            </div>

            <div className="sd-widget">
              {myCourses.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon">💰</div>
                  No payment records yet.
                </div>
              ) : (
                <>
                  <div className="sd-table-wrap">
                    <table className="sd-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Course</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myCourses.map((c, i) => (
                          <tr key={c.enrollmentId}>
                            <td style={{color:'#9ca3af'}}>{i+1}</td>
                            <td style={{fontWeight:600}}>{c.title}</td>
                            <td style={{fontWeight:700,color:'#4C2A78'}}>₹{c.price}</td>
                            <td>{c.enrolled_at ? new Date(c.enrolled_at).toLocaleDateString('en-IN') : 'N/A'}</td>
                            <td><span className="badge badge-green">Paid</span></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2} style={{padding:'12px 14px',fontWeight:700,color:'#374151'}}>Total Paid</td>
                          <td colSpan={3} style={{padding:'12px 14px',fontWeight:800,color:'#2E1A47',fontSize:18}}>₹{totalSpent}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ══ PROFILE ══ */}
        {activePage === "profile" && (
          <>
            <div className="sd-page-header">
              <div>
                <h1 className="sd-page-title">👤 My Profile</h1>
                <p className="sd-page-sub">Your account information and learning summary.</p>
              </div>
            </div>

            <div className="sd-profile-card">
              <div className="sd-profile-avatar">🧑‍🎓</div>
              <div>
                <div className="sd-profile-name">{loguser.name}</div>
                <div className="sd-profile-email">{loguser.email}</div>
                <span className="sd-profile-role">Student</span>
              </div>
            </div>

            <div className="sd-grid">
              <div className="sd-widget">
                <div className="sd-widget-header">
                  <div className="sd-widget-title">📋 Account Details</div>
                </div>
                <div className="sd-pay-row"><span className="sd-pay-label">Full Name</span><span className="sd-pay-value">{loguser.name}</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">Email</span><span className="sd-pay-value">{loguser.email}</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">Role</span><span className="sd-pay-value">Student</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">User ID</span><span className="sd-pay-value">#{loguser.id}</span></div>
              </div>

              <div className="sd-widget">
                <div className="sd-widget-header">
                  <div className="sd-widget-title">🏆 Learning Stats</div>
                </div>
                <div className="sd-pay-row"><span className="sd-pay-label">Courses Enrolled</span><span className="sd-pay-value">{myCourses.length}</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">Active Courses</span><span className="sd-pay-value">{activeCount}</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">Completed</span><span className="sd-pay-value">{doneCount}</span></div>
                <div className="sd-pay-row"><span className="sd-pay-label">Completion Rate</span><span className="sd-pay-value">{progressPct}%</span></div>
                <div className="sd-pay-row sd-pay-total"><span className="sd-pay-label">Total Invested</span><span className="sd-pay-value">₹{totalSpent}</span></div>
              </div>
            </div>
          </>
        )}

      </main>

      {/* ── Floating Chatbot ── */}
      <div className="sd-chatbot-container">
        
        {/* Chat Window */}
        {openBot && (
          <div className="sd-chat-window">
            <div className="sd-chat-header" style={{ background: openBot === 'website' ? '#7e22ce' : '#10b981' }}>
              <span style={{ fontWeight: 600 }}>
                {openBot === 'website' ? '🎓 VK LearnHub Assistant' : '🌐 General AI Assistant'}
              </span>
              <button onClick={() => setOpenBot(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>✖</button>
            </div>
            <div className="sd-chat-body">
              {chatMessages[openBot].map((msg, i) => (
                <div key={i} className={`sd-chat-msg ${msg.role}`} style={
                  msg.role === 'user' 
                    ? { background: openBot === 'website' ? '#7e22ce' : '#10b981', color: '#fff', borderColor: 'transparent' }
                    : {}
                }>
                  {msg.content}
                </div>
              ))}
              {chatLoading && <div className="sd-chat-msg bot">Thinking...</div>}
            </div>
            <form className="sd-chat-input-area" onSubmit={(e) => handleSendMessage(e, openBot)}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                className="sd-chat-input"
              />
              <button type="submit" className="sd-chat-send" style={{ background: openBot === 'website' ? '#7e22ce' : '#10b981' }}>➤</button>
            </form>
          </div>
        )}

        {/* Floating Buttons */}
        {!openBot && (
          <div className="sd-chat-buttons">
            <div className="sd-chat-btn-wrapper tooltip-left" data-tooltip="General AI (Ask me anything)">
              <button className="sd-chat-toggle general" onClick={() => setOpenBot('general')}>
                🌐
              </button>
            </div>
            <div className="sd-chat-btn-wrapper tooltip-left" data-tooltip="VK LearnHub Assistant (Platform Help)">
              <button className="sd-chat-toggle website" onClick={() => setOpenBot('website')}>
                🎓
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default StudentDashboard;
