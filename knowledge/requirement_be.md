# Task Manager Backend API Requirements

## Technology Stack
- .NET 6 Web API
- PostgreSQL Database
- Entity Framework Core for PostgreSQL (Npgsql.EntityFrameworkCore.PostgreSQL)
- JWT Authentication
- ASP.NET Core Identity

## Database Design

### Tables

1. Users
   - Id (UUID)
   - Username (string)
   - Email (string)
   - PasswordHash (string)
   - FirstName (string)
   - LastName (string)
   - CreatedAt (timestamp)
   - UpdatedAt (timestamp)

2. Roles
   - Id (UUID)
   - Name (string)
   - Description (string)
   - CreatedAt (timestamp)
   - UpdatedAt (timestamp)

3. UserRoles
   - UserId (UUID - FK to Users)
   - RoleId (UUID - FK to Roles)
   - CreatedAt (timestamp)
   - UpdatedAt (timestamp)

4. Tasks
   - Id (UUID)
   - Title (string)
   - Description (text)
   - DueDate (timestamp)
   - Priority (enum: Low, Medium, High)
   - Status (enum: Todo, InProgress, Done)
   - CreatedBy (UUID - FK to Users)
   - AssignedTo (UUID - FK to Users)
   - CreatedAt (timestamp)
   - UpdatedAt (timestamp)

5. Categories
   - Id (UUID)
   - Name (string)
   - Description (string)
   - CreatedBy (UUID - FK to Users)
   - CreatedAt (timestamp)
   - UpdatedAt (timestamp)

6. TaskCategories
   - TaskId (UUID - FK to Tasks)
   - CategoryId (UUID - FK to Categories)

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh-token
- POST /api/auth/logout

### Users
- GET /api/users
- GET /api/users/{id}
- PUT /api/users/{id}
- DELETE /api/users/{id}

### Tasks
- GET /api/tasks
- GET /api/tasks/{id}
- POST /api/tasks
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}
- GET /api/tasks/user/{userId}
- GET /api/tasks/category/{categoryId}

### Categories
- GET /api/categories
- GET /api/categories/{id}
- POST /api/categories
- PUT /api/categories/{id}
- DELETE /api/categories/{id}

## Security Requirements

1. Authentication
   - JWT-based authentication
   - Token expiration and refresh token mechanism
   - Password hashing using bcrypt
   - Email verification

2. Authorization
   - Role-based access control:
     - Admin (Superuser):
       - Full access to all endpoints
       - Can manage users, roles, tasks, and categories
       - Can view and modify all tasks regardless of ownership
     - User:
       - Can create tasks
       - Can only view and update tasks they created
       - Can view categories
       - Can view their own user profile
   - Resource-based authorization with ownership validation
   - Task ownership validation enforced at middleware level

3. Data Protection
   - Input validation and sanitization
   - XSS protection
   - CORS configuration
   - Rate limiting
   - SSL/TLS encryption

## Required NuGet Packages
- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.AspNetCore.Identity.EntityFrameworkCore
- Npgsql.EntityFrameworkCore.PostgreSQL
- Microsoft.EntityFrameworkCore.Tools
- Microsoft.EntityFrameworkCore.Design
- AutoMapper
- FluentValidation
- Serilog

## Additional Features
- Pagination for list endpoints
- Filtering and sorting capabilities
- Soft delete implementation
- Audit logging
- Request/Response logging
- API versioning
- Swagger/OpenAPI documentation
