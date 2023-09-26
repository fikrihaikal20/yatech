<h1 align="center">Yatech API</h1>

> Rest API that provides user authentication using refresh tokens and access tokens for secure and seamless user interactions.

# Tech Stack & Global Requisites

* Node JS (>= 18.12.1)
* Express (>= 4.18.2)
* JWT - Authentication
* MySQL - Database
* Postman - Documentation + Testing

# Install, Configure & Run

Below mentioned are the steps to install, configure & run in your platform/distributions.

```bash
# Clone the repo.
git clone https://github.com/fikrihaikal20/yatech.git;

# Goto the cloned project folder.
cd yatech-api;
```

### Without Docker
```bash

# Note: It is assumed here that you have MySQL running in the background and that you have created the database.

# Install NPM dependencies.
npm install;

# Edit or copy your DotEnv file.
cp .env.example .env;

# Edit database url to connect your localhost
DATABASE_URL="mysql://root:@localhost:3306/yatech"

# Run the app
npm run dev;
```

### With Docker
```bash

# Note: It is assumed here that you have Docker running in the background.

# Run the app in docker as a foreground process
docker-compose up

# Run the app in docker as a background process
docker-compose up -d
```

# Links
- [API Documentation](https://documenter.getpostman.com/view/24707420/2s9YJXaRGB)

# Author

👤 **Muhammad Fikri Haikal**
