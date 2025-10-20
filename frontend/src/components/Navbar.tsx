import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const navbarHeight = 48;
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav>
      <div>
        <div>
          <button onClick={scrollToTop}>
            Your Name
          </button>
        </div>

        <div>
          <button onClick={() => scrollToSection('aboutme')}>
            About Me
          </button>
          <button onClick={() => scrollToSection('experience')}>
            Experience
          </button>
          <button onClick={() => scrollToSection('education')}>
            Education
          </button>
          <button onClick={() => scrollToSection('projects')}>
            Projects
          </button>
          <button onClick={() => scrollToSection('awards')}>
            Awards
          </button>
          <button onClick={() => scrollToSection('contact')}>
            Contact Me
          </button>
        </div>

        <div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? 'Close Menu' : 'Open Menu'}
          </button>
        </div>

        {isMenuOpen && (
          <div>
            <button onClick={() => scrollToSection('aboutme')}>
              About Me
            </button>
            <button onClick={() => scrollToSection('experience')}>
              Experience
            </button>
            <button onClick={() => scrollToSection('education')}>
              Education
            </button>
            <button onClick={() => scrollToSection('projects')}>
              Projects
            </button>
            <button onClick={() => scrollToSection('awards')}>
              Awards
            </button>
            <button onClick={() => scrollToSection('contact')}>
              Contact Me
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 
