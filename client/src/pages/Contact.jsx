const Contact = () => (
  <div className="page container">
    <h1>Contact Us</h1>
    <p>We love feedback. Reach out and we will respond within one business day.</p>
    <div className="contact-grid">
      <div className="panel">
        <h2>Email</h2>
        <p>
          <a href="mailto:support@clickduplicator.app">support@clickduplicator.app</a>
        </p>
        <p>Dedicated inbox for campaign questions and onboarding help.</p>
      </div>
      <div className="panel">
        <h2>Live Chat</h2>
        <p>Available Monday ? Friday, 9am to 5pm PST.</p>
        <p>
          Visit our <a href="https://example.com/support">support centre</a> to start a chat session.
        </p>
      </div>
      <div className="panel">
        <h2>Community</h2>
        <p>
          Join the conversation in our <a href="https://example.com/community">Customer Community</a> to swap ideas and
          see upcoming releases.
        </p>
      </div>
    </div>
  </div>
);

export default Contact;
