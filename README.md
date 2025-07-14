# DishDash 🍔🗺️

**DishDash** is a modern, map-based web application for discovering and sharing food experiences at any location. Built with Next.js and TypeScript, it features a highly interactive and beautifully designed user interface, inspired by modern design principles.

Users can sign in, see their real-time location, explore nearby restaurants and cafes fetched live from OpenStreetMap, get directions using their preferred map application, and create visually rich posts about their own experiences.

---

## ✨ Features

- **Full Authentication System**: Powered by **NextAuth.js**, supporting both traditional credentials (email/password) and **Google OAuth** for secure sign-in.
- **Advanced Auth UI**: A sleek, theme-aware, "bottom-sheet" style modal for Sign In & Sign Up, with integrated validation and success/error states.
- **Interactive Map View**: A fast and fluid map experience powered by **Leaflet** and React-Leaflet, with map styles managed by a clean Provider pattern.
- **Live Places (POI) Layer**: Automatically fetches and displays nearby points of interest (restaurants, cafes) from **OpenStreetMap** via the Overpass API as the user pans and zooms.
- **Custom Map Markers**:
  - **User Posts**: Display a unique emoji icon directly on the map based on the post's satisfaction rating. Stacks of posts are represented by a colored pin with a count.
  - **Places**: Show custom icons for different POI types (e.g., restaurant vs. cafe).
- **Multi-App Directions**: Users can get directions to any post via an expanding "pill" UI, with the choice of opening in Google Maps or Neshan.
- **Global Light & Dark Theme**: A persistent, themeable interface managed with **Zustand**. It automatically detects the user's system preference on their first visit.
- **Engaging UI/UX**:
  - **Post Carousel**: An interactive, animated carousel to browse stacked posts, with swipe gestures on mobile.
  - **Profile Management**: A pop-up modal for logged-in users to update their profile picture and password through a tabbed interface.
  - **Advanced Animations**: Smooth, fluid animations throughout the app powered by **Framer Motion**, including "halo" effects, layout animations, and a Lottie-powered map loader.
- **Robust Form Validation**: Client-side validation using **Zod** and **`react-hook-form`**, featuring an interactive password strength checker during sign-up.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14+ (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & [Lottie](https://lottiefiles.com/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### 1\. Prerequisites

- Node.js (v18 or later)
- An NPM package manager (npm, yarn, or pnpm)

### 2\. Initial Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MahdiPourkeshavarz/dishdash.git
    cd dishdash
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 3\. Environment Variables

Authentication requires API keys. Create a file named `.env.local` in the root of your project and add the following variables.

```env
# .env.local

# This MUST match the URL you are using for development.
# Use https for geolocation and OAuth to work correctly.
NEXTAUTH_URL=https://localhost:3000

# A secret key for encrypting session tokens.
# Generate a strong secret by running `openssl rand -base64 32` in your terminal.
NEXTAUTH_SECRET=your-super-secret-key-goes-here

# Get these from the Google Cloud Console for Google Sign-In
GOOGLE_CLIENT_ID=your-google-client-id-goes-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-goes-here
```

### 4\. Local HTTPS & Running the App

The Geolocation API and Google OAuth require a secure (HTTPS) environment.

1.  **Set up `mkcert`** (if you haven't already) to create a trusted local certificate.
2.  **Run the development server** with the pre-configured HTTPS script:
    ```bash
    npm run dev
    ```
3.  The application will be available at **`https://localhost:3000`**.

---

## 📁 Project Structure

This project uses a feature-colocated structure inside the `src` directory.

```
src/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts
│   ├── fonts/
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── map/
│   │   ├── post/
│   │   └── user/
│   └── layout/
│       └── Navbar.tsx
├── hooks/
│   ├── useClickOutside.ts
│   └── useVirtualKeyboard.ts
├── lib/
│   ├── authOptions.ts
│   ├── fonts.ts
│   └── validations/
│       └── auth.ts
├── services/
│   └── osmService.ts
└── store/
    └── useStore.ts
    └── useMapStyle.ts
```

---

## 🌱 Future Improvements

- **Implement Backend**: Connect the Sign Up and Post Creation forms to a real backend API and database (e.g., PostgreSQL with Prisma).
- **Cloud Image Storage**: Integrate a service like AWS S3 or Cloudinary for user profile and post image uploads.
- **Notifications**: Add real-time notifications for likes or other interactions.
- **Advanced Search**: Implement a search bar to find places or posts by name or category on the map.
- **Offline Capabilities**: Use a service worker to provide a basic offline experience.
