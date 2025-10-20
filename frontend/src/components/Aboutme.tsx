import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Aboutme = () => {
  const { data: aboutme, isLoading, error } = useQuery({
    queryKey: ["aboutme"],
    queryFn: async () => {
      const response = await api.get("/aboutme");
      return response.data;
    },
  });

  if (isLoading) return (
    <div>loading...</div>
  );

  if (error) return (
    <div>Error: {error.message}</div>
  );

  return (
    <div>
      <section id="aboutme">
        <div>
          <h2>About Me</h2>

          <p>
            {aboutme.results[0].description}
          </p>
        </div>
      </section>
    </div>
  )
}

export default Aboutme
