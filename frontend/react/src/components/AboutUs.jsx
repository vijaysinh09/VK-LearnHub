import Navbar from './Navbar';
import './Page.css';

function AboutUs() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <h1 className="page-title">About Us</h1>
          <div className="page-divider" />

          <div className="page-content">
            <p>
              VK LearnHub is an online education platform built with the goal of
              making quality learning accessible to everyone. We believe that skill
              development should not be limited by geography, schedule, or financial
              constraints. Our platform is designed to give every learner a fair
              opportunity to grow at their own pace, from wherever they are.
            </p>

            <p>
              We started with a small collection of technology courses and a simple
              idea: connect capable instructors with motivated students through a
              clean, easy-to-use platform. Since then, we have grown to offer
              courses across a wide range of subjects, from programming and data
              science to business, communication, and design.
            </p>

            <p>
              Our instructors are working professionals and educators who bring
              real-world experience into their teaching. Each course on our platform
              goes through a review process to ensure the content is accurate,
              up-to-date, and genuinely useful for learners. We take quality
              seriously because we know your time is valuable.
            </p>

            <p>
              At VK LearnHub, students are at the center of everything we do. We
              continuously work to improve the learning experience — from how courses
              are structured to how progress is tracked and how support is provided.
              Our goal is to make every session on our platform productive and
              worthwhile.
            </p>

            <p>
              We are committed to building a trusted, long-term learning community.
              Whether you are a student exploring a new field, a professional
              upskilling for career growth, or someone returning to education after
              a break, VK LearnHub is here to support your journey.
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

export default AboutUs;
