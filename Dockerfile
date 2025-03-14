FROM python:3.9-slim

WORKDIR /app

RUN pip install Flask psycopg2-binary Flask-Cors

EXPOSE 5000

CMD ["python", "app.py"]