# Fullstack Portfolio Webapp with Django, React, Nginx, Postgres and Docker

A modern portfolio webapp built with Django, React, Nginx, Postgres and Docker. This project showcases a full-stack portfolio application with a React UI, Django backend, Nginx Reverse Proxy, Postgres SQL DB all containerized using docker. You can upload your CV, Profile Picture and also update your About Me, Education, Experience, Projects, Awards and Contact me as you like. Since the data is stored in the Porstgres DB with a Django backend you can easily edit, update and add things the way you want to from the admin panel. Checkout my portfolio website in my github profile on how this website can look.

## Features

- React UI with tailwind CSS, Shadcn (not styled)
- Django Backend API with JWT Auth
- Nginx Reverse Proxy
- Postgres DB


## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Query
- React Icons
- Shadcn

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Gunicorn
- Nginx

### DevOps
- Docker
- Docker Compose

## Prerequisites

- Docker
- Docker Compose
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Create environment files:
```bash
# Development
cp .env.dev.example .env.dev
# Production
cp .env.prod.example .env.prod
```

3. Start the development environment:
```bash
docker-compose up
```

4. Create a superuser in the backend container:
```bash
docker exec -it portfolio-backend-1 python manage.py createsuperuser
```
5. Access the Admin Panel at http://localhost:8000/admin and add the required data to db.

6. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Production Deployment in Linux Server

1. Git clone this project

2. Update the production environment variables in `.env.prod`

3. Change the $DOMAIN_NAME in nginx/nginx.conf to your domain name

4. Add the ssl cert and private key as below

ssl_certificate - ssl/live/$DOMAIN_NAME/fullcert.pem;
ssl_certificate_key - ssl/live/$DOMAIN_NAME/privatekey.pem;

5. Build and start the production containers:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Project Structure

```
portfolio/
├── api/                 # Django backend
├── frontend/           # React frontend
├── nginx/             # Nginx configuration
├── .env.dev           # Development environment variables
├── .env.prod          # Production environment variables
├── docker-compose.yml # Development Docker configuration
└── docker-compose.prod.yml # Production Docker configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Binuka Jayaweera - binukajayaweera@gmail.com

Project Link: [https://github.com/binuka200/fullstack-portfolio](https://github.com/binuka200/fullstack-portfolio) 
