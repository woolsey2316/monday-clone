import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Education = () => {
    const { data: education, isLoading, error } = useQuery({
        queryKey: ["education"],
        queryFn: async () => {
            const response = await api.get("/education");
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
        <section id="education">
            <h2>Education</h2>
            {education.results.map((edu) => (
                <div key={edu.id}>
                    <h3>{edu.degree}</h3>
                    <p>School: {edu.school}</p>
                    {edu.grade && <p>Grade: {edu.grade}</p>}
                    <p>Years: {edu.years}</p>
                    <p>{edu.description}</p>
                </div>
            ))}
        </section>
    )
}

export default Education
