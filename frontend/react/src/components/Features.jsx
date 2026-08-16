import Navbar from "./Navbar";
import "./Page.css";

function Features() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <h1 className="page-title">Features</h1>
          <div className="page-divider" />

          <div className="page-content">
            <p>
              VK LearnHub offers a straightforward and comfortable learning
              environment. Once you register and log in, you get immediate
              access to a growing catalogue of courses. Each course page shows a
              clear description, duration, and pricing information so you can
              make an informed decision before enrolling.
            </p>

            <p>
              Courses are taught by experienced instructors who structure their
              content in a logical, easy-to-follow manner. The platform lets you
              enrol in multiple courses at the same time, so you can learn at
              your own pace and manage your schedule freely. There are no fixed
              class timings — you decide when and how much to study.
            </p>

            <p>
              Your personal student dashboard gives you a clear view of every
              course you have enrolled in, along with your current progress and
              enrollment status. The dashboard is designed to be simple and
              distraction-free, so you can focus entirely on your learning.
            </p>

            <p>
              For instructors and instructoristrators, the platform includes a
              dedicated management panel. From there, courses can be added,
              edited, or removed, and student enrollments can be monitored and
              updated. This makes it easy to keep the course catalogue fresh and
              relevant.
            </p>

            <p>
              VK LearnHub is built to be accessible from any modern web browser,
              on both desktop and mobile devices. The interface is clean and
              responsive, ensuring a smooth experience regardless of the screen
              size. We keep things simple so that the focus remains entirely on
              learning, not on navigating a complicated system.
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

export default Features;
