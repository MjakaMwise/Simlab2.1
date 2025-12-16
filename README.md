# Simlab 2.1 - STEM Platform

A comprehensive STEM (Science, Technology, Engineering, Mathematics) education platform built with Next.js, React, TypeScript, and Supabase. Simlab provides an interactive learning environment for students, teachers, staff, and administrators to collaborate on science and technology education.

## Overview

Simlab is a modern web application designed to support STEM education delivery across schools and educational institutions. The platform offers role-based dashboards, authentication, real-time data management, and a responsive design that works across all devices.

## Features

- Role-based access control with six user types (Super Admin, Teacher, Teaching Staff, Student, Parent)
- Interactive dashboards tailored for each user role
- Real-time authentication and session management
- Responsive design with dark/light theme support
- Beautiful glass-morphism UI components
- Database-driven content management
- Secure API integration with Supabase
- Program and school management
- Gallery for showcasing student work
- Contact and feedback system

## Technology Stack

### Frontend
- Next.js 14.2.33 - React framework for production
- React 18.3.1 - UI library
- TypeScript 5.5.3 - Type-safe JavaScript
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- Lucide React 0.344.0 - Icon library

### Backend & Database
- Supabase - Open source Firebase alternative
- PostgreSQL - Database management
- Row Level Security (RLS) - Data protection

### Development Tools
- ESLint - Code quality and linting
- PostCSS - CSS transformation
- Autoprefixer - CSS vendor prefixing

## Project Structure

```
simlab/
├── app/                          # Next.js app directory
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── register-student/
│   ├── components/              # Reusable React components
│   │   ├── Navigation.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Button.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── Notification.tsx
│   │   ├── Footer.tsx
│   │   └── BubblingFlask.tsx
│   ├── dashboard/               # Dashboard pages by role
│   │   ├── student/
│   │   ├── teacher/
│   │   ├── staff/
│   │   ├── parent/
│   │   └── admin/
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── gallery/                 # Gallery page
│   ├── program/                 # Program page
│   ├── schools/                 # Schools page
│   ├── register/                # Registration page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── lib/                          # Utility functions and services
│   ├── supabase.ts              # Supabase client
│   ├── database.ts              # Database queries
│   ├── types.ts                 # TypeScript type definitions
│   ├── contexts/
│   │   └── theme-context.tsx    # Theme context provider
│   └── services/
│       ├── auth-service.ts      # Authentication service
│       └── content-service.ts   # Content management service
├── supabase/                     # Database migrations
│   └── migrations/              # SQL migration files
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── .gitignore                   # Git ignore rules
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MjakaMwise/Simlab2.1.git
cd Simlab2.1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint code quality checks
- `npm run typecheck` - Run TypeScript type checking

## Authentication

The platform supports multiple authentication methods through Supabase:

- Email/password authentication
- Session management with JWT tokens
- Row-level security for data protection
- Automatic role assignment based on user type

### User Roles

1. Super Admin - Full platform access and management
2. Teacher - Classroom management and student interaction
3. Teaching Staff - Support staff functionality
4. Student - Access to learning materials and programs
5. Parent - Student progress tracking and communication
6. Unregistered Users - Limited access to public pages

## Database Schema

The application uses PostgreSQL with Supabase and includes tables for:

- Users and authentication
- User profiles with role information
- Programs and courses
- Schools and institutions
- Gallery content
- Contact submissions
- Activity tracking

See `supabase/migrations/` for complete schema definitions.

## Components

### Navigation
Global navigation bar with theme toggle and role-based menu items.

### DashboardLayout
Base layout component for dashboard pages with sidebar navigation.

### GlassCard
Reusable card component with glass-morphism design.

### ThemeToggle
Light/dark mode toggle component.

### Notification
Toast notification component for user feedback.

### BubblingFlask
Animated SVG component for visual decoration.

## Configuration Files

- `next.config.js` - Next.js framework configuration
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `postcss.config.js` - CSS post-processing configuration
- `eslint.config.js` - Code linting rules

## Security Considerations

- Row-level security (RLS) enabled on all database tables
- Secure authentication with Supabase Auth
- Environment variables for sensitive data
- Input validation and sanitization
- CORS and CSRF protection
- Regular security updates

## Performance Optimizations

- Server-side rendering with Next.js
- Image optimization
- Code splitting and lazy loading
- Efficient database queries
- CSS-in-JS optimization with Tailwind

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Create a feature branch from main
2. Commit changes with clear messages
3. Push to your fork
4. Create a pull request with description

## Development Status

The project includes status documents:
- `AUTH_INTEGRATION_COMPLETE.md` - Authentication implementation status
- `DASHBOARDS_COMPLETE.md` - Dashboard features status
- `SECURITY_FIXES_COMPLETE.md` - Security improvements applied
- `IMPLEMENTATION_STATUS.md` - Overall implementation progress

## License

This project is proprietary and confidential. All rights reserved.

## Support

For issues, questions, or feedback, please contact the development team or open an issue on the GitHub repository.

## Acknowledgments

Built with modern web technologies and best practices for educational platforms. The platform leverages Supabase for backend services and Next.js for optimal performance.

---

**Simlab 2.1** - Empowering STEM Education Through Technology
