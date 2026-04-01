# VacantSpot - Project Documentation

## Project Overview
**VacantSpot** is a modern, full-stack web application designed to help residents of Abuja, Nigeria find verified, vacant house listings. The platform addresses the common problem of fake listings and "ghost houses" by implementing a strict physical verification process for landlords and properties.

## Tech Stack
- **Frontend**: Next.js 16.2.0 (App Router)
- **Styling**: Tailwind CSS 4
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Paystack API
- **Language**: TypeScript

---

## Core Features

### 1. Property Discovery (Guest/User)
- Browse verified house listings in Abuja.
- Filter and search for properties based on type, price, and location.
- View detailed property information including images, amenities, and verification status.

### 2. Landlord/Agent Portal
- **Verification Fee**: Landlords must pay a one-time verification fee of ₦10,000 via Paystack to ensure listing quality.
- **Admin Approval**: After payment, accounts undergo manual admin verification.
- **Property Management**: Once verified, landlords can list and manage their vacant spots.

### 3. Admin Portal
- **Verification Queue**: Admins can review landlord payments and verify accounts.
- **Listing Control**: Admins have the power to verify or delist properties based on physical inspections.

---

## Technical Architecture

### Authentication & Authorization
Managed via **Supabase Auth**.
- Role-based access control (RBAC) is implemented using a custom `profiles` table.
- **Middleware**: `src/middleware.ts` handles route protection, ensuring landlords and admins can only access their respective dashboards.

### Database Schema (Inferred)
The project uses a PostgreSQL database hosted on Supabase with the following primary tables:

| Table | Description |
| :--- | :--- |
| `profiles` | Stores user profiles including `role` (USER, LANDLORD, ADMIN), `has_paid`, and `is_verified`. |
| `properties` | Stores property listings with details like `price`, `address`, `landlord_id`, and `is_verified`. |
| `payments` | Tracks Paystack transactions and their statuses. |

### Payment Integration
The Paystack integration follows a two-step flow:
1. **Initialization**: `/api/payments/initialize` creates a pending record and returns a Paystack authorization URL.
2. **Verification**: `/api/payments/verify` (Webhook/Callback) confirms the transaction success and updates the user's `has_paid` status.

---

## Folder Structure
```text
vacantspot/
├── src/
│   ├── app/                  # Next.js App Router routes
│   │   ├── admin/            # Admin portal
│   │   ├── api/              # API routes (Payments, etc.)
│   │   ├── dashboard/        # Landlord/Agent dashboard
│   │   ├── login/            # Authentication pages
│   │   ├── properties/       # Property detail pages
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions and Supabase clients
│   └── middleware.ts         # Route protection logic
├── public/                   # Static assets
└── .env.local               # Environment variables (Configuration)
```

---

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- Supabase Account
- Paystack Account

### Environment Variables
Create a `.env.local` file in the root directory with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@vacantspot.com
```

### Installation
```bash
npm install
npm run dev
```

---

## Verification Policy
To maintain platform integrity, all properties go through a physical verification check by the VacantSpot team before being marked as "Verified" on the platform. Landlords who attempt to list fraudulent properties will be permanently banned.
