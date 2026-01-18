# 🚀 Localhost Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

## Setup Steps

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
npm install
```

### 2. Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update your `.env` file with your actual values:
```env
# Database Configuration - Your Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_A3icnZdtF4Ub@ep-young-violet-a1zzmqt0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Server Configuration
NODE_ENV=development
PORT=5000

# Session Configuration (generate a new secret for production)
SESSION_SECRET=48da381ba51f0ff28875f1c0ef529c0e0006a199d72e5df93bd3ce7bf75b92e2

# Firebase Configuration (if using Firebase Auth)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Application Configuration
APP_URL=http://localhost:5000
REPLIT_DEV_DOMAIN=localhost:5000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 3. Database Setup
```bash
# Push database schema to your Neon database
npm run db:push

# (Optional) Open Drizzle Studio to view your database
npm run db:studio
```

### 4. Create Upload Directory
```bash
mkdir -p uploads/resumes
```

### 5. Start Development Server
```bash
# Start the development server
npm run dev

# The server will start on http://localhost:5000
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema to Neon
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run check` - Run TypeScript type checking

## Access the Application

Once the server is running:
- **Main Application**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5000/admin (login with admin@placenet.com)
- **Student Portal**: http://localhost:5000/student
- **Recruiter Portal**: http://localhost:5000/recruiter

## Default Admin Login
- Email: `admin@placenet.com`
- Password: Use Firebase Auth or any authentication method you've configured

## File Upload Setup
The application stores uploaded files (resumes, etc.) in the `uploads/` directory. Make sure this directory exists and has proper write permissions.

## Database Configuration
The application is configured to work with your Neon PostgreSQL database. The SSL configuration is automatically handled based on the database URL.

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can change it in your `.env` file:
```env
PORT=3000
```

### Database Connection Issues
1. Verify your Neon database URL is correct
2. Check that your Neon database allows connections from your IP
3. Ensure your `.env` file is properly configured

### WebSocket Connection Issues
WebSocket connections work automatically with the server. If you have issues:
1. Check that no firewall is blocking the connection
2. Verify the server is running on the correct port

## Development Tips

1. **Hot Reload**: The development server supports hot reload for both frontend and backend changes
2. **Database Changes**: Run `npm run db:push` after making schema changes
3. **Environment Variables**: Restart the server after changing `.env` variables
4. **File Uploads**: Uploaded files are stored locally in the `uploads/` directory

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in your environment
2. Run `npm run build` to build the application
3. Use `npm run start` to start the production server
4. Configure proper SSL certificates for HTTPS
5. Set up proper file storage (AWS S3, etc.) for uploads

## Need Help?

- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure your Neon database is accessible and configured properly