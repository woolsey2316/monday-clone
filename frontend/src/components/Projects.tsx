import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Projects = () => {
    const { data: projects, isLoading, error } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await api.get("/projects");
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
        <section id="projects">
            <h2>Projects</h2>
            {projects.results.map((project) => (
                <div key={project.id}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div>
                        {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                View Project
                            </a>
                        )}
                        {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                View Code
                            </a>
                        )}
                    </div>
                    {project.images && project.images.length > 0 && (
                        <div>
                            {project.images.map((image) => (
                                <div key={image.id}>
                                    <img src={image.image} alt={image.caption || project.title} />
                                    {image.caption && <p>{image.caption}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </section>
    )
}

export default Projects
