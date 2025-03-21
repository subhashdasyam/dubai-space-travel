# Dubai to Stars: Space Travel Booking Platform - Backend

This is the backend API for the Dubai to Stars Space Travel Booking Platform, built with FastAPI and Supabase.

## Technology Stack

- **FastAPI**: Modern, fast, web framework for building APIs with Python
- **Supabase**: Open-source Firebase alternative (PostgreSQL-based)
- **Python 3.9+**: Core programming language
- **JWT**: JSON Web Token for authentication
- **OpenAI GPT-4o**: AI integration for intelligent responses and recommendations
- **Docker**: Containerization for deployment

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose
- Supabase account
- OpenAI API key

### Environment Setup

Create a `.env` file in the backend directory with the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
```

### Database Setup

1. Create a new Supabase project
2. Set up the following tables:
   - users
   - destinations
   - accommodations
   - packages
   - bookings

Schema definitions can be found in the documentation or inferred from the models.

### Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t dubai-space-api .
docker run -p 8000:8000 dubai-space-api
```

## API Endpoints

The API is organized into the following modules:

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and receive JWT token
- `GET /api/auth/me`: Get current user information
- `PUT /api/auth/preferences`: Update user preferences

### Destinations

- `GET /api/destinations`: Get all destinations
- `GET /api/destinations/{destination_id}`: Get destination details
- `GET /api/destinations/{destination_id}/popular-times`: Get popular booking times

### Accommodations

- `GET /api/accommodations`: Get all accommodations (with optional filters)
- `GET /api/accommodations/{accommodation_id}`: Get accommodation details
- `GET /api/accommodations/{accommodation_id}/availability`: Check availability
- `GET /api/accommodations/{accommodation_id}/reviews`: Get accommodation reviews

### Packages

- `GET /api/packages`: Get all travel packages
- `GET /api/packages/{package_id}`: Get package details
- `GET /api/packages/compare`: Compare multiple packages
- `GET /api/packages/calculate-price`: Calculate package price

### Bookings

- `POST /api/bookings`: Create a new booking
- `GET /api/bookings`: Get user's bookings
- `GET /api/bookings/{booking_id}`: Get booking details
- `PUT /api/bookings/{booking_id}`: Update a booking
- `DELETE /api/bookings/{booking_id}`: Cancel a booking
- `GET /api/bookings/{booking_id}/invoice`: Get booking invoice

### AI Assistant

- `POST /api/ai/recommendations`: Get personalized recommendations
- `POST /api/ai/packing-list`: Generate a packing list
- `POST /api/ai/ask`: Ask a question about space travel
- `POST /api/ai/trip-planner`: Generate a trip itinerary

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT authentication for protected endpoints
- Password hashing with bcrypt
- Environment variables for sensitive information
- CORS configuration for frontend integration

## Documentation

API documentation is automatically generated and available at `/docs` when running the server.