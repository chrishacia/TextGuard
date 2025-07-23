import React from 'react';

const About: React.FC = () => {
  return (
    <div>
      <h1>About TextGuard</h1>
      <p>
        TextGuard was created as a simple proof of concept, in part as a part of an interview process.
        <br />
        This is not a full‑fledged spam detection system so much as it is just a demonstration.
      </p>
      <p>
        It is built with TypeScript, React, and Vite, and uses Bootstrap for styling.
      </p>
      <p>
        <a
          href="https://chrishacia.com"
          title="Christopher Hacia's website"
          target="_blank"
          rel="noopener noreferrer"
        >
          Christopher Hacia
        </a>
      </p>
    </div>
  );
};

export default About;