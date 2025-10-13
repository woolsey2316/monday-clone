import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Hero = () => {
  const { data: cv, isLoading, error } = useQuery({
    queryKey: ["cv"],
    queryFn: async () => {
      const response = await api.get("/cv/active");
      return response.data;
    },
  });
  const { data: profileImage, isLoading: profileImageLoading, error: profileImageError } = useQuery({
    queryKey: ["profileImage"],
    queryFn: async () => {
      const response = await api.get("/profileimage/active");
      return response.data;
    },
  });

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading || profileImageLoading) return (
    <div>Loading...</div>
  );

  if (error || profileImageError) return (
    <div>Error: {error?.message || profileImageError?.message}</div>
  );

  return (
    <section id="hero">
      <div>
        <div>
          <p>Welcome to my portfolio</p>
          <h1>Hi, I'm Your Name</h1>
          <p>Short description about yourself</p>
          <div>
            <button onClick={scrollToContact}>Contact Me</button>
            <a href={cv?.file} download>Download CV</a>
          </div>
          <div>
            <a href="https://github.com/your-github-profile" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div>
          <img src={profileImage?.image} alt="Your Name" />
        </div>
      </div>
    </section>
  )
}

export default Hero
