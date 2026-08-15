import Navbar from './Navbar';
import './Page.css';

function Guide() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <h1 className="page-title">How to Use This Website</h1>
          <div className="page-divider" />

          <div className="page-content">
            <p style={{ fontSize: '1.1rem', color: '#4b5563' }}>
              Welcome to VK LearnHub! Follow these simple steps to get started with our platform:
            </p>
            
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#7c3aed', fontSize: '1.5rem' }}>👨‍🎓 For Students</h2>
            <ul style={{ lineHeight: '1.8', marginLeft: '1.5rem', color: '#4b5563' }}>
              <li><strong>Step 1:</strong> Click on the <em>Create Your Account</em> button to register and create a new student account.</li>
              <li><strong>Step 2:</strong> Once registered, log in to access your personalized <strong>Student Dashboard</strong>.</li>
              <li><strong>Step 3:</strong> Browse the available courses and view detailed information for each to start learning.</li>
            </ul>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#7c3aed', fontSize: '1.5rem' }}>👨‍🏫 For Instructors</h2>
            <ul style={{ lineHeight: '1.8', marginLeft: '1.5rem', color: '#4b5563' }}>
              <li><strong>Step 1:</strong> Instructor profiles are created by the platform admin. Please contact support to get your account.</li>
              <li><strong>Step 2:</strong> Log in using the <strong>Instructor Login</strong> portal to access your management dashboard.</li>
              <li><strong>Step 3:</strong> Use the <em>Add Course</em> button to publish new courses for students.</li>
              <li><strong>Step 4:</strong> Manage, edit, or delete your existing courses directly from your dashboard.</li>
            </ul>

            <p style={{ marginTop: '2.5rem', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' }}>
              Happy Learning! Dive into our features page if you want to explore more about our platform.
            </p>
          </div>
        </div>
      </main>
      <footer className="page-footer">
        <p>© 2026 VK LearnHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Guide;
