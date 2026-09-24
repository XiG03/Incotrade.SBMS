# SBMS Frontend Implementation & Architecture Plan

This plan outlines the architecture, directory structure, and implementation strategy for the SBMS (Service Booking Management System) frontend using Next.js (App Router), based on the existing .NET Backend API and HTML layout files provided.

## User Review Required

> [!IMPORTANT]
> - **Styling Strategy**: The layout files provided are raw HTML/CSS. I recommend converting these to **Tailwind CSS** for easier maintainability in a React/Next.js environment, or we can use standard CSS Modules if you prefer keeping the original CSS structures. Please confirm if Tailwind CSS is acceptable.
> - **Directory Structure**: The current `app` directory is at the root. Standardizing to a `src/` directory (`src/app`, `src/components`) is often cleaner for enterprise projects. Let me know if you are okay with migrating to a `src/` based structure.
> - **State Management**: For a project of this size, I recommend **Zustand** for lightweight global state (e.g., Auth state, Booking steps state) and **React Query (@tanstack/react-query)** for server state (caching API responses). Please approve this stack.

## Open Questions

> [!WARNING]
> - **Backend Routing Bug**: In `ServicesController.cs`, there are multiple `[HttpGet]` endpoints (`GetAllServicesAsync`, `GetActiveServicesAsync`, `GetInActiveServicesAsync`) without distinct route templates. This will cause Swagger/API route conflicts. Please confirm if the backend routing will be fixed before frontend integration.
> - **Authentication State**: The `Login` endpoint currently returns a `refreshToken` in a HttpOnly Cookie. Will it also return a JWT `accessToken` in the response body to be used as a Bearer token, or is everything cookie-based? 
> - **Booking API**: I see layout templates for Booking, but no `BookingController` in the backend yet. Will those APIs be provided in the next phase? We can mock them in the frontend for now based on the layouts.

## 1. Proposed Next.js Project Architecture

As a senior frontend developer, I propose the following structure using the **App Router** to separate concerns, enforce modularity, and make the codebase scalable.

```text
sbms.frontend/
├── src/
│   ├── app/                      # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)/               # Route group for authentication
│   │   │   └── login/page.tsx
│   │   ├── (admin)/              # Route group for admin dashboard
│   │   │   ├── layout.tsx        # Admin Dashboard Layout (Sidebar, Header)
│   │   │   ├── services/page.tsx # Manage Services
│   │   │   ├── schedules/page.tsx# Manage Staff Schedules
│   │   │   └── page.tsx          # Admin Overview
│   │   ├── (public)/             # Route group for public facing pages
│   │   │   ├── booking/          # Booking Flow
│   │   │   │   ├── step-1/page.tsx
│   │   │   │   └── step-2/page.tsx
│   │   │   └── page.tsx          # Landing Page
│   │   ├── globals.css           # Global styles
│   │   └── layout.tsx            # Root layout
│   │
│   ├── components/               # React Components
│   │   ├── ui/                   # Reusable, generic UI components (Buttons, Inputs, Modals)
│   │   ├── layout/               # Layout components (Header, Footer, Sidebar)
│   │   └── features/             # Feature-specific components
│   │       ├── admin/
│   │       ├── booking/
│   │       └── auth/
│   │
│   ├── lib/                      # Utility functions and configurations
│   │   ├── axios.ts              # Axios instance setup with interceptors
│   │   └── utils.ts              # Helper functions (date format, class merging)
│   │
│   ├── services/                 # API Client layer (mapped to backend modules)
│   │   ├── auth.service.ts
│   │   ├── service.service.ts
│   │   └── staff.service.ts
│   │
│   ├── types/                    # TypeScript definitions (matching backend DTOs)
│   │   ├── auth.types.ts
│   │   ├── service.types.ts
│   │   └── staff.types.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useServices.ts
│   │
│   └── store/                    # Global state (Zustand)
│       └── authStore.ts
```

## 2. Technology Stack & Tooling

*   **Framework**: Next.js 15 (App Router) with React 19.
*   **Language**: TypeScript for strict typing matching backend C# DTOs.
*   **Styling**: Tailwind CSS (recommended) + Shadcn UI (for fast, accessible base components) or custom CSS based on the HTML provided.
*   **API Client**: `axios` for easy interceptor management (refresh token logic).
*   **Form Management**: `react-hook-form` with `@hookform/resolvers/zod` and `zod` for schema validation.
*   **State Management**: `zustand` (client state) + `@tanstack/react-query` (server state/caching).

## 3. Implementation Phases

### Phase 1: Foundation & Setup
*   Initialize standard folder structure (`src/` based).
*   Setup Tailwind CSS / styling architecture.
*   Configure Axios instance with base URL and generic interceptors.
*   Define TypeScript interfaces based on the .NET `DTOs`.
*   Convert the global UI assets and CSS from the layout folder into the Next.js project.

### Phase 2: Authentication & Core Layouts
*   Implement `auth.service.ts` matching `AuthController`.
*   Create the `/login` page and integrate React Hook Form.
*   Implement Auth Interceptor (attach Bearer token, handle 401 refresh via HttpOnly cookie).
*   Build the base layouts: Public Layout (Nav/Footer) and Admin Layout (Sidebar).

### Phase 3: Admin Module Integration
*   Implement `service.service.ts` matching `ServicesController`.
*   Build UI for `/admin/services` (Table, Create/Edit Modals) using the layout files.
*   Implement `staff.service.ts` matching `StaffController` & `ScheduleController`.
*   Build UI for `/admin/schedules` (Calendar view or list view) to manage staff work schedules.

### Phase 4: Public & Booking Flow (UI First)
*   Convert the Landing Page HTML to Next.js components (`/`).
*   Implement the multi-step booking flow UI (`/booking`) using the HTML layouts (Step 1: Choose Service/Expert, Step 2: Choose Date/Time).
*   Wire up the frontend state (Zustand) to hold the booking payload until the backend `BookingController` is ready.

## Verification Plan

### Automated Checks
- `npm run lint` and `npm run build` will pass without TypeScript errors.
- Ensure strict type checking across all API integrations.

### Manual Verification
- Start `npm run dev` and test routing between Landing Page, Login, and Admin sections.
- Verify Axios properly calls the local .NET backend and handles standard responses.
- Visually verify that the implemented Next.js pages match the designs provided in `stitch_sbms_booking_landing_page`.
