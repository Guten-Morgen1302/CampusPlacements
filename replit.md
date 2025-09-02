# Training & Placement Cell Platform

## Overview

This is a comprehensive Training & Placement Cell Platform built to connect students, recruiters, and college administrators. The system features AI-powered tools for resume analysis, interview practice, job matching, and virtual job fairs. It's designed with a modern cyberpunk aesthetic and provides role-based dashboards for different user types.

The platform combines React frontend with Express backend, utilizing PostgreSQL for data persistence and WebSocket for real-time features. The system emphasizes student-first design while being recruiter-friendly and admin-efficient.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with custom cyberpunk theme and shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Comprehensive component library based on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and interactions
- **Design System**: Modern glassmorphism with neon accent colors (cyan, purple, pink)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Real-time Communication**: WebSocket server for live chat and job fair interactions
- **File Structure**: Modular architecture with separate route handlers and storage layer
- **API Design**: RESTful endpoints with proper error handling and middleware

### Database Schema
- **Users**: Core user table with role-based access (student, recruiter, admin)
- **Student Profiles**: Extended profile information including academic details, skills, achievements
- **Recruiter Profiles**: Company information and recruitment preferences
- **Jobs & Applications**: Job postings and application tracking system
- **Interview Sessions**: AI-powered mock interview data and feedback
- **Resume Analysis**: AI resume scanning results and recommendations
- **Chat System**: Real-time messaging between users
- **Job Fair Events**: Virtual job fair management and attendance tracking

### Authentication & Session Management
- **Authentication**: Replit OAuth integration for secure user authentication
- **Session Storage**: PostgreSQL-based session storage with configurable TTL
- **User Management**: Role-based access control with profile differentiation
- **Security**: HTTP-only cookies with secure flag for session management

### AI Features Architecture
- **Resume Scanner**: Planned BERT/Sentence-BERT integration for ATS optimization
- **Interview Practice**: AI-powered mock interviews with real-time feedback
- **Job Matching**: Hybrid recommendation system using Matrix Factorization and embeddings
- **Skill Gap Analysis**: Resume-to-job description comparison with learning recommendations

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, TypeScript, Vite for modern frontend development
- **UI Framework**: Extensive Radix UI component collection for accessible components
- **Database**: Neon Database (PostgreSQL) with connection pooling
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations

### Authentication & Session Management
- **Replit Auth**: OpenID Connect integration for user authentication
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Security**: Passport.js integration for authentication strategies

### Real-time Features
- **WebSockets**: Native WebSocket support for real-time chat and job fair features
- **Connection Management**: WebSocket server integration with HTTP server

### Development & Build Tools
- **Build System**: Vite with TypeScript support and hot module replacement
- **Code Quality**: ESBuild for production builds with tree shaking
- **Development Environment**: Replit-specific plugins for development experience

### Styling & Animation
- **CSS Framework**: Tailwind CSS with custom configuration
- **Component Variants**: class-variance-authority for component styling patterns
- **Animations**: Framer Motion for complex animations and transitions
- **Icons**: Lucide React for consistent iconography

### Data Fetching & State
- **HTTP Client**: Custom fetch wrapper with credential handling
- **Server State**: TanStack Query for caching and synchronization
- **Form Handling**: React Hook Form with Zod validation integration

The system is designed to scale horizontally with proper database indexing and connection pooling, while maintaining real-time capabilities through WebSocket connections.