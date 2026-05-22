# WARP Documentation

## Project Overview
This project implements a backend service that supports user authentication through OAuth. It provides endpoints for user signup and login, allowing users to authenticate using various OAuth providers.

## Features
- User signup and login using OAuth strategies.
- Middleware for protecting routes that require authentication.
- Configuration for multiple OAuth providers.

## File Structure
- **src/controllers/authController.js**: Contains the `AuthController` class for handling authentication logic.
- **src/routes/authRoutes.js**: Defines the authentication routes for signup and login.
- **src/middleware/authMiddleware.js**: Middleware functions for checking authentication tokens.
- **src/config/oauthConfig.js**: Configuration settings for OAuth providers.
- **src/models/userModel.js**: Defines the user schema for the database.

## Setup Instructions
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file with the necessary environment variables for database connection and OAuth credentials.
4. Start the application using `node index.js`.

## Usage
- **Signup**: Send a POST request to `/auth/signup` with user details.
- **Login**: Send a POST request to `/auth/login` with user credentials.

## Notes
- Ensure that you have the required OAuth credentials from the providers you wish to use.
- Update the `.env` file with your database connection string and OAuth credentials.

## Future Improvements
- Implement additional OAuth providers.
- Enhance error handling and logging.
- Add unit tests for the authentication logic.