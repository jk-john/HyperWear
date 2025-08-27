# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm postbuild` - Generate sitemap (runs automatically after build)

### Code Quality

- `pnpm lint` - Run Next.js linting
- `pnpm format` - Format code with Prettier

### Database and Scripts

- `pnpm db:seed` - Seed the database with initial data
- `pnpm upload:video` - Upload videos to Supabase storage

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router and React 19
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth with PKCE flow
- **Payments**: Stripe integration
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (cart state) + React Context (HypePrice)
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components built on Radix UI primitives

### Key Architecture Patterns

#### Authentication Flow

- Uses Supabase Auth with middleware for session management
- Protected routes redirect to `/sign-in` if user is not authenticated
- User profiles are automatically created via database triggers

#### E-commerce Structure

- Products stored in Supabase with dynamic pricing
- Shopping cart uses Zustand with localStorage persistence
- Orders have expiration timers and status tracking (pending → paid → shipped)
- Stripe webhook handles payment verification

#### Database Schema

- `products` - Product catalog with images and variants
- `orders` - Order tracking with expiration and status
- `order_items` - Individual items within orders
- `subscribers` - Email subscription management
- `profiles` - User profile data linked to auth users

#### State Management

- **Cart**: Zustand store with localStorage persistence (`stores/cart.ts`)
- **HypePrice**: React Context for live price ticker (`context/HypePriceContext.tsx`)
- **Form State**: React Hook Form for individual forms

### Directory Structure

#### App Router Structure (`/app`)

- `(auth)/` - Authentication pages (sign-in, sign-up, password reset)
- `(root)/` - Main application pages including dashboard and products
- `checkout/` - Checkout flow with Stripe integration
- `api/` - API routes for webhooks, subscriptions, and external integrations

#### Core Components (`/components`)

- UI components follow shadcn/ui patterns with Radix UI primitives
- `emails/` - React Email templates for transactional emails
- `header/` - Navigation and search components
- `ui/` - Reusable UI components with consistent styling

#### Utilities and Services

- `utils/supabase/` - Supabase client configurations (client, server, middleware)
- `lib/` - Utility functions including image processing and external API integrations
- `types/` - TypeScript type definitions generated from Supabase schema

### Image Handling

- Images stored in Supabase Storage with CDN
- Remote patterns configured for Supabase, Google, Twitter, and auth domains
- Optimized loading with WebP/AVIF formats and proper caching headers

### Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for database
- Stripe keys for payment processing
- Resend API key for email functionality

### Security Features

- CORS headers and CSP policies configured in `next.config.ts`
- RLS (Row Level Security) policies on all database tables
- Protected routes with authentication middleware
- Secure image handling with content disposition headers

### Code Style Guidelines

- DO NOT add comments unless explicitly requested
- Write clean, self-explanatory code without unnecessary documentation
