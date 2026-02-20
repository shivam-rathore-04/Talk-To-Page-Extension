# 1. Use an official, lightweight Python image
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy your requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of your backend code into the container
COPY . .

# 5. Tell Northflank which port to open
EXPOSE 8000

# 6. The command to start your server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]