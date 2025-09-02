# Overview

This is a real-time traffic incident monitoring dashboard that fetches and displays data from the Waze API for the Warsaw area. The application tracks accidents and cars on shoulders, providing a live dashboard with automatic refresh capabilities and detailed incident information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: Custom query client with automatic refetch every 15 seconds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful endpoints for incident data
- **Error Handling**: Centralized error middleware with structured responses
- **Logging**: Custom request logging with duration tracking

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Defined in shared folder for consistent types across client and server
- **Connection**: Neon Database serverless PostgreSQL
- **Migration**: Drizzle Kit for database schema management
- **Fallback**: In-memory storage implementation for development

## Database Schema
- **Users Table**: Basic user management with username/password
- **Incidents Table**: Traffic incident storage with location, severity, type, and timestamps
- **Incident Types**: ACCIDENT and SHOULDER categories
- **Geolocation**: Latitude/longitude coordinates for mapping

## API Integration
- **External API**: Waze live traffic data via XML/RSS feeds
- **Data Processing**: XML to JSON conversion with xml2js parser
- **Real-time Updates**: 15-second refresh intervals for live data
- **Coverage Area**: Warsaw metropolitan area with defined coordinate boundaries
- **Data Persistence**: Incidents stored locally after fetching from Waze API

## Key Features
- **Real-time Dashboard**: Live incident monitoring with countdown timer
- **Incident Classification**: Separate tracking of accidents vs shoulder incidents
- **Statistics Display**: Total counts and system status indicators
- **Manual Refresh**: User-triggered data updates
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Error Handling**: Graceful degradation with offline status indicators

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm & drizzle-kit**: Type-safe database ORM and migration tools
- **express**: Web framework for API server
- **xml2js**: XML parsing for Waze API data processing

## Frontend UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library
- **date-fns**: Date manipulation and formatting

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety across the entire application
- **@replit/vite-plugin-***: Replit-specific development enhancements