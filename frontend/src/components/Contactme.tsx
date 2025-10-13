import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const Contactme = () => {
    const { data: cv, isLoading: cvLoading } = useQuery({
        queryKey: ["cv"],
        queryFn: async () => {
            const response = await api.get("/cv/active");
            return response.data;
        },
    });

    return (
        <section id="contact">
            <h2>Contact Me</h2>
            <p>Feel free to reach out to me through any of these channels</p>

            <div>
                <div>
                    <h3>Email</h3>
                    <a href="mailto:your-email@example.com">
                        your-email@example.com
                    </a>
                </div>

                <div>
                    <h3>Phone</h3>
                    <a href="tel:+1234567890">
                        +123 456 7890
                    </a>
                </div>

                <div>
                    <h3>LinkedIn</h3>
                    <a href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer">
                        linkedin.com/in/your-linkedin-profile
                    </a>
                </div>

                <div>
                    <h3>Resume</h3>
                    <a href={cv?.file} download>
                        {cvLoading ? 'Loading CV...' : 'Download my CV'}
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Contactme
