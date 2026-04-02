# VacantSpot - Comprehensive Project Documentation

## 1. Project Overview
**VacantSpot** is a modern, full-stack web application designed to help residents of Abuja, Nigeria find verified, vacant house listings. The platform addresses the common problem of fake listings and "ghost houses" by implementing a strict physical verification process for landlords and properties.

The platform caters to three distinct users:
1. **Tenants/Users**: Looking for verified properties.
2. **Landlords/Agents**: Listing their available properties and building their public brand.
3. **Administrators**: Verifying landlords, reviewing queue submissions, and ensuring platform integrity.

---

## 2. Tech Stack
- **Frontend Framework**: Next.js 16.2.0 (App Router)
- **Styling**: Tailwind CSS 4 (Custom design tokens, glassmorphism, responsive)
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Paystack API (for Landlord Verification Fees)
- **Language**: TypeScript

---

## 3. Core Features & Workflows

### A. Tenant / Guest Experience
- **Property Discovery**: Browse verified house listings in Abuja on the main page.
- **Search & Filters**: Comprehensive filtering by category (Apartment, Studio, Duplex, Bungalow) and text search.
- **Public Landlord Profiles**: Tenants can view a dedicated public profile page for landlords (`/landlord/[id]`), which showcases their Verification Badge, bio, business details, contact information, and all their active property listings.

### B. Landlord / Agent Portal
- **Account Creation**: Landlords sign up and are assigned the `LANDLORD` role by a secure database trigger.
- **Verification Fee**: Landlords must pay a verification fee (₦10,000) via Paystack to ensure listing quality.
- **Profile Management**: Landlords have a secure dashboard (`/dashboard/profile`) where they can upload an avatar (stored in Supabase Storage), and update their business name, location, and bio. 
- **Property Management**: Once verified by an admin, landlords can manage their specific vacant spots.

### C. Admin Portal & Verification Queue
- **Secure Access**: The `/admin` portal is securely locked via Middleware to only allow the specific `ADMIN_EMAIL` defined in the environment variables.
- **Verification Queue**: Admins view a dynamic queue of Landlords who have paid but are pending review.
- **Approval Flow**: Using Server Actions, admins verify landlords, triggering an instant UI update and database state change (`is_verified = true`). 
- **RLS Bypass**: A specific Row-Level Security (RLS) policy allows the admin to update any user's profile securely.

---

## 4. Technical Architecture

### Authentication & Authorization
Managed via **Supabase Auth**.
- **Role-Based Access Control (RBAC)**: Managed using the custom `profiles` table linked via foreign key and triggers to `auth.users`.
- **Middleware (`src/middleware.ts`)**: 
  - Defends the `/dashboard` routes ensuring only authenticated landlords can enter.
  - Hard-redirects admins away from the landlord dashboard and into the `/admin` portal.

### Database Schema

The PostgreSQL database uses the `public` schema with the following core tables:

| Table | Description |
| :--- | :--- |
| `profiles` | Extends `auth.users`. Columns: `id`, `email`, `name`, `role`, `has_paid`, `is_verified`, `phone`, `bio`, `location`, `business_name`, `avatar_url`. |
| `properties` | Stores listings. Columns: `id`, `title`, `address`, `price`, `type`, `bedrooms`, `bathrooms`, `imageUrl`, `is_verified`, `landlord_id`. |
| `payments` | Tracks Paystack transactions. Columns: `id`, `user_id`, `amount`, `status`, `reference`. |

**Enums:** `user_role` (`USER`, `LANDLORD`, `ADMIN`)

**Row Level Security (RLS):**
- Profiles and Properties are readable by the public.
- Landlords can only `INSERT`/`UPDATE`/`DELETE` their own properties.
- Landlords can only upload avatars and edit their own profiles.
- Specifically defined Admin policies to allow overriding profiles.

### Cloud Storage
- **Bucket**: `avatars` (Public read, authenticated owner upload)
- **Bucket**: `property-images` (Public read)

### Payment Integration (Paystack)
1. **Initialization (`/api/payments/initialize`)**: Creates a pending record and returns a Paystack authorization URL.
2. **Verification (`/api/payments/verify`)**: Webhook/Callback confirms success, updating the user's `has_paid` status.

---

## 5. Folder Structure
```text
vacantspot/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── admin/            # High-security Administrator portal
│   │   ├── api/              # API and Webhook endpoints
│   │   ├── dashboard/        # Landlord protected routes (Listings, Profile editor)
│   │   ├── landlord/[id]/    # Public landlord profile dynamic route
│   │   ├── login/            # Auth: Login
│   │   ├── properties/[id]/  # Property details route
│   │   ├── signup/           # Auth: Registration 
│   │   └── page.tsx          # Homepage & Property Discovery
│   ├── components/           # Shared React Components (Navbar, UI library)
│   ├── lib/                  # Utilities (Supabase client/server logic, Server Actions)
│   └── middleware.ts         # Edge routing and RBAC protection
├── supabase/
│   └── schema.sql            # Master database setup, Triggers, RLS, Storage setup
├── public/                   # Static assets (Favicons, etc.)
└── .env.local                # Environment configuration
```

---

## 6. Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Supabase Project (Database & Storage)
- Paystack Account

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=your_admin_email@example.com
```

### Installation
```bash
npm install
npm run dev
```

### Database Initialization
Apply the `supabase/schema.sql` file via the Supabase SQL Editor. This initializes all specific tables, enum types, verification triggers, the `avatars` storage bucket, and granular Row Level Security (RLS) policies.
