import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Awards = () => {
  const { data: awards, isLoading, error } = useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const response = await api.get("/awards");
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
    <section id="awards">
      <h2>Awards & Achievements</h2>
      {awards.results.map((award) => (
        <div key={award.id}>
          <h3>{award.title}</h3>
          <p>{award.description}</p>
          {award.image && (
            <img src={award.image} alt={award.title} />
          )}
        </div>
      ))}
    </section>
  )
}

export default Awards
