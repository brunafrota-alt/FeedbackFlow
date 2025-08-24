# TechFlow Feedback System

## Overview

TechFlow is a modern feedback collection and analytics system built with React and Express. The application provides a comprehensive dashboard for collecting, managing, and analyzing customer feedback through star ratings and comments. It features real-time data visualization with charts, statistics overview, and a responsive user interface built with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and local storage hooks for client state
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Charts**: Chart.js for data visualization and analytics

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development Server**: Custom Vite integration for hot reloading in development
- **Storage Interface**: Abstract storage interface with in-memory implementation (ready for database integration)
- **Error Handling**: Centralized error handling middleware

### Data Layer
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Definition**: Shared TypeScript schemas using Zod for validation
- **Current Storage**: In-memory storage with interface designed for easy database migration
- **Data Models**: Feedback entities with rating, name, comment, and timestamp fields

### Development & Build System
- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Strict type checking with path mapping for clean imports
- **ESBuild**: Server-side bundling for production deployment
- **Hot Reload**: Integrated development environment with file watching

### UI/UX Design System
- **Design System**: shadcn/ui with "new-york" style variant
- **Theme**: Neutral color scheme with CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Icons**: Lucide React for consistent iconography
- **Typography**: Inter font family for modern readability

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling and validation
- **wouter**: Lightweight routing solution
- **chart.js**: Data visualization and charts

### UI Component Libraries
- **@radix-ui/react-***: Headless UI primitives for accessibility
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **tailwindcss**: Utility-first CSS framework

### Database & Backend
- **drizzle-orm**: Type-safe ORM for database operations
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for production builds

### Validation & Utilities
- **zod**: Schema validation library
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation
- **clsx & tailwind-merge**: Conditional CSS class utilities