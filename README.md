# Links Simplified

Links Simplified is a production-style URL shortener built with Next.js, Prisma, NextAuth, and PostgreSQL. It is designed to feel like a real SaaS product with authentication, link management, premium upgrades, and payment integration.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=auth0&logoColor=white" alt="NextAuth" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy on Vercel" />
</p>


## Overview

This project allows users to:

- Shorten long URLs into clean and shareable links
- Create custom aliases for branded or memorable short links
- Manage their links from a personal dashboard
- Sign in securely with Google authentication
- Upgrade to a premium plan for advanced features
- Activate links when required and manage the inactive links. 
- Delete inactive or links which are not required. 
- Checkout using Razorpay's safe test environment. 

The app combines a polished frontend experience with a backend API and database layer that is suitable for real-world use.

## Features

- Google sign-in with NextAuth
- URL shortening with optional custom slugs
- Authenticated dashboard for link management
- Premium subscription flow with Razorpay integration
- Payment and subscription-related user experience
- Manage links effective - Activate, Deactivate and delete links. 
- Responsive, modern UI built with Tailwind CSS

## Tech Stack

- Next.js
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- NeonDB
- Tailwind CSS
- Razorpay
- Vercel
- Biome for linting and formatting

## Project Structure

- src/app - application routes and pages
- src/app/api - Backend Logic and DB operations
- src/components - reusable UI and authentication components
- src/lib - shared utilities, types, Prisma setup, and validation
- prisma - Prisma schema and migrations
- public - static assets

## Prerequisites

Make sure you have the following installed:

- Node.js 20 or newer
- npm or pnpm
- PostgreSQL running locally or on a cloud provider
- A Google OAuth app for authentication
- Razorpay API credentials for payments

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Pranava-Pai-N/Links-Simplified
cd Links-Simplified
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env file in the project root and add the following variables from the sample env-file:

```bash
cp .env.example .env
```

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.


## Available Scripts

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run start    # start the production build
npm run lint     # run Biome checks
npm run format   # format the codebase
```

## Deployment

The project is designed to be deployed on Vercel with a PostgreSQL database.

<p align="center">
  <a href="https://links-simplified.vercel.app" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Click%20For%20Demo-Links%20Simplified-00C7B7?style=for-the-badge&logo=vercel&logoColor=white" alt="Click for Demo" />
  </a>
</p>

- Deployment Platform: Vercel
- Database: Neon/PostgreSQL

For production deployment, make sure to configure all environment variables securely in your hosting platform.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them
   ```bash
   git add .
   git commit -m "Add your feature"
   ```
4. Push the branch and open a pull request

Please keep changes focused, write clear commit messages, and verify the app still works locally before submitting a PR.

## License

This project is licensed under the [MIT](./LICENSE) License.

## Developer Info

Built and maintained by Pranava Pai N.

- GitHub: https://github.com/Pranava-Pai-N
- Portfolio : https://pranava-pai.live

If you want to contribute, improve the UI, add features, or fix issues, feel free to open a pull request or start a discussion.
