import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Experience = () => {
  const { data: experiences, isLoading, error } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const response = await api.get("/experience");
      return response.data;
    },
  });

  if (isLoading) return (
    <div>Loading...</div>
  );

  if (error) return (
    <div>Error: {error.message}</div>
  );

  return (
    <section id="experience">
      <h2>Experience</h2>
      {experiences.results.map((experience) => (
        <div key={experience.id}>
          <h3>{experience.title}</h3>
          <p>Company: {experience.company}</p>
          {experience.location && <p>Location: {experience.location}</p>}
          <p>Years: {experience.years}</p>
          <p>{experience.description}</p>
        </div>
      ))}
    </section>
  )
}

export default Experience
