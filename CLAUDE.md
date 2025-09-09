# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with HMR (available at http://localhost:5173)
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run typecheck` - Run React Router typegen and TypeScript check

## Architecture Overview

This is a **React Router v7** application serving as an admin console for PixelForge Studio. It uses server-side rendering (SSR) by default.

### Core Stack
- **Frontend**: React 19 + React Router v7 with SSR
- **Styling**: TailwindCSS + Radix UI components
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **UI Components**: Custom components built on Radix UI primitives
- **Theme**: Dark/light mode support via next-themes

### Application Structure

**Routing**: File-based routing configured in `app/routes.ts`:
- `/` - Home page (home.tsx)
- `/login` - Authentication
- `/dashboard` - Main admin dashboard
- `/users` - User management with detail pages (`/users/:userId`)
- `/products` - Product management with CRUD operations (`/products/:productId`, `/products/create`, `/products/:productId/edit`)
- `/inquiries` - Inquiry system
- `/system` - System administration and health monitoring

**Context Providers** (configured in `root.tsx`):
- `AuthProvider` - Authentication state management
- `NotificationProvider` - App-wide notifications
- `ThemeProvider` - Dark/light theme management

**Services Layer** (`app/services/`):
- `auth.service.ts` - Authentication operations
- `user.service.ts` - User management
- `product.service.ts` - Product CRUD operations
- `inquiry.service.ts` - Contact/inquiry handling
- `system.service.ts` - System health checks

### Key Configuration

**API Integration**:
- Base URL configured via `VITE_API_BASE_URL` env var (defaults to `http://localhost:8000`)
- API endpoints centralized in `app/lib/constants.ts`
- Standardized API response types in `app/types/api.ts`

**Component Architecture**:
- UI components in `app/components/ui/` (Radix-based)
- Layout components in `app/components/layout/`
- Form components in `app/components/forms/`
- Data display components in `app/components/data-display/`

**Type System**:
- Comprehensive TypeScript types in `app/types/`
- API response interfaces, user types, product types, etc.

## Important Implementation Notes

- The app expects a backend API running on port 8000 by default
- Authentication uses JWT tokens managed by the auth service
- All forms use React Hook Form with Zod validation
- The UI follows shadcn/ui patterns with Radix UI primitives
- Server-side rendering is enabled by default (configured in `react-router.config.ts`)