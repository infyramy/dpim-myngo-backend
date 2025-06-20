# myNGO Backend - Fully Independent API Service

**🚀 Completely independent Express.js REST API backend for the myNGO platform.**

This backend service is now **fully separated** and has no dependencies on any frontend code or shared files. It can be deployed, developed, and maintained independently.

## ✨ Features

- **Express.js** REST API with TypeScript
- **JWT** authentication with refresh tokens
- **PostgreSQL** database with Knex.js ORM
- **Input validation** with express-validator
- **Rate limiting** and security middleware
- **Database migrations** support
- **Role-based access control** (Admin, User, Operator, SuperAdmin)
- **File upload** handling
- **Email service** integration ready
- **Health check** endpoint
- **Complete type safety** with TypeScript

## 🏗️ Project Structure

```
myngo-backend/
├── src/
│   ├── controllers/     # API controllers for different routes
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Custom middleware (auth, validation)
│   ├── config/          # Database and app configuration
│   ├── utils/           # Utility functions (JWT, response helpers)
│   ├── types/           # TypeScript type definitions
│   ├── services/        # Business logic services (email, etc.)
│   ├── migrations/      # Database migration files
│   └── scripts/         # Utility scripts
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── env.example          # Environment variables template
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0 or pnpm >= 8.0.0
- PostgreSQL database

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Configure your database** in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=myngo_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run migrate` - Run database migrations

## 🔒 Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myngo_db
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
```

## 🛣️ API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/send-otp` - Send OTP for verification
- `POST /auth/verify-otp` - Verify OTP

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Profile
- `GET /profile` - Get current user profile
- `PUT /profile` - Update current user profile

### States
- `GET /states` - Get all states
- `GET /states/with-admins` - Get states with admin information
- `POST /states/assign-admin` - Assign admin to state
- `PUT /states/:id/admin` - Update state admin
- `DELETE /states/:id/admin` - Remove state admin

### Businesses
- `GET /businesses` - Get all businesses
- `POST /businesses` - Create new business
- `GET /businesses/:id` - Get business by ID
- `PUT /businesses/:id` - Update business
- `DELETE /businesses/:id` - Delete business

### Products
- `GET /products` - Get products (user's own products)
- `GET /products/all` - Get all products (for matching)
- `POST /products` - Create new product
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /products/tags` - Get all available tags

### Members
- `GET /members` - Get all members
- `POST /members` - Create new member
- `GET /members/:id` - Get member by ID
- `PUT /members/:id` - Update member
- `DELETE /members/:id` - Delete member

### Applications
- `GET /applications` - Get applications
- `POST /applications` - Create new application
- `GET /applications/:id` - Get application by ID
- `PUT /applications/:id` - Update application status

### Dashboards
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /operator-dashboard/stats` - Get operator dashboard stats
- `GET /admin-dashboard/stats` - Get admin dashboard stats

### Health Check
- `GET /health` - Health check endpoint

## 🗄️ Database

The API uses PostgreSQL with Knex.js for query building and migrations.

### Key Tables
- `users` - User accounts and authentication
- `states` - Malaysian states and their admins
- `businesses` - Business profiles and information
- `products` - Business products and services
- `tags` - Product categorization tags
- `members` - Community members
- `applications` - Program applications and status

### Migrations
Database migrations are located in `src/migrations/` and can be run with:
```bash
npm run migrate
```

## 🔐 Authentication & Authorization

The API uses JWT-based authentication with the following roles:

- **SuperAdmin**: Full system access
- **Admin**: NGO-specific administration
- **Operator**: Day-to-day operations
- **User**: Business owners and community members

### Protected Routes
Most routes require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Build image
docker build -t myngo-backend .

# Run container
docker run -p 3001:3001 myngo-backend
```

### Environment Setup
Ensure all environment variables are properly configured for production:
- Use strong JWT secrets
- Configure proper database credentials
- Set up email service (SMTP)
- Configure CORS for your frontend domain

## 🔧 Development

### Adding New Endpoints

1. **Create controller** in `src/controllers/`
2. **Define routes** in `src/routes/`
3. **Add types** in `src/types/`
4. **Update middleware** if needed
5. **Write tests** for new functionality

### Database Changes

1. **Create migration** in `src/migrations/`
2. **Update types** to match schema changes
3. **Run migration** with `npm run migrate`

## 📈 Production Considerations

- **Database**: Use connection pooling for better performance
- **Logging**: Implement proper logging (Winston, Bunyan)
- **Monitoring**: Add health checks and metrics
- **Security**: Regular security audits and updates
- **Caching**: Implement Redis for session storage and caching
- **Rate Limiting**: Adjust rate limits based on usage patterns

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**This backend is now completely independent and can be deployed separately from any frontend application!** 🎉 