const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div>
        <div>
          <a href="https://github.com/your-github-profile" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
        <p>© {currentYear} Your Name. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer 
