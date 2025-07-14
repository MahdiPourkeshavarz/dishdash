DishDash 🍔🗺️
DishDash is a modern, map-based web application for discovering and sharing food experiences at any location. Built with a full suite of modern technologies including Next.js, TypeScript, and Zustand, it features a highly interactive and beautifully designed user interface.

Users can sign in via Google or credentials, see their real-time location, explore nearby restaurants and cafes, get directions, and post their own food experiences with a satisfaction rating.

(A placeholder image showing the main map view with themed tiles, custom-colored user post markers, a live places layer, and the interactive UI elements.)

✨ Features
Full Authentication System: Powered by NextAuth.js, supporting both traditional credentials (email/password) and Google OAuth.

Advanced Auth UI: A sleek, theme-aware, bottom-sheet modal for Sign In & Sign Up, with integrated validation.

Interactive Map View: A fast and fluid map experience using Leaflet with custom map tiles from a centralized Map Style Provider.

Live Places (POI) Layer: Automatically fetches and displays nearby points of interest (like restaurants and cafes) from OpenStreetMap as the user pans and zooms the map.

Multi-App Directions: Users can get directions to any post from their current location, with a choice of opening in Google Maps, Waze, Neshan, or Balad.

Global Light & Dark Theme: A persistent, theme-aware interface managed with Zustand, which automatically detects the user's system preference on their first visit.

Dynamic & Themed Map Markers:

Single Posts: Display a unique, high-quality emoji icon directly on the map based on the post's satisfaction.

Stacked Posts: Multiple posts at one location are automatically grouped into a single, color-coded pin that displays a post count.

Engaging UI/UX:

Post Carousel: An interactive, animated carousel to browse stacked posts, with swipe gestures on mobile.

Profile Management: A pop-up modal for logged-in users to update their profile picture and password.

Creative Animations: Smooth, fluid animations throughout the app, powered by Framer Motion, including "halo" effects and morphing UI elements.

Robust Form Validation: Client-side validation using Zod and react-hook-form, featuring an interactive password strength checker during sign-up.

🛠️ Tech Stack
Framework: Next.js 14+ (App Router)

Language: TypeScript

Authentication: NextAuth.js

State Management: Zustand

Styling: Tailwind CSS

Mapping: Leaflet & React-Leaflet

Animation: Framer Motion & Lottie

Validation: Zod & React Hook Form

Icons: Lucide React

🚀 Getting Started
Follow these instructions to get a local copy up and running.

1. Prerequisites
   Node.js (v18 or later)

An NPM package manager (npm, yarn, or pnpm)

2. Initial Setup
   Clone the repository:

Bash

git clone https://github.com/your-username/dishdash.git
cd dishdash
Install dependencies:

Bash

npm install 3. Environment Variables
Authentication requires API keys. Create a file named .env.local in the root of your project and add the following variables.

Code snippet

# .env.local

# This MUST match the URL you are using for development.

# Use https for geolocation and OAuth to work correctly.

NEXTAUTH_URL=https://localhost:3000

# A secret key for encrypting session tokens.

# Generate a strong secret by running `openssl rand -base64 32` in your terminal.

NEXTAUTH_SECRET=your-super-secret-key-goes-here

# Get these from the Google Cloud Console for Google Sign-In

GOOGLE_CLIENT_ID=your-google-client-id-goes-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-goes-here 4. Local HTTPS & Running the App
The Geolocation API and Google OAuth require a secure (HTTPS) environment.

Set up mkcert (if you haven't already) to create a trusted local certificate.

Run the development server with the pre-configured HTTPS script:

Bash

npm run dev
The application will be available at https://localhost:3000.

5. (Optional) Testing on Mobile
   To test on your phone, Google OAuth requires a public URL. The best way to do this is with ngrok.

Install and configure ngrok.

Start a tunnel to your secure local server: ngrok http https://localhost:3000

Update your NEXTAUTH_URL in .env.local and your Redirect URI in the Google Cloud Console with the public ngrok URL provided.

Restart your server and access the app via the ngrok URL on your phone.

📁 Project Structure
/src
├── app/
│ ├── (main)/ # Main page layout and content
│ ├── api/auth/[...nextauth]/ # The NextAuth.js API route handler
│ ├── layout.tsx # Root layout
│ └── providers.tsx # Client-side context providers
├── components/
│ ├── features/
│ │ ├── auth/ # AuthModal, Input, PasswordStrength
│ │ ├── map/ # MapView, POI components, etc.
│ │ ├── post/ # PostCard, PostCarousel, DirectionsPill
│ │ └── user/ # ProfileModal
│ └── layout/
│ └── Navbar.tsx
├── hooks/
│ ├── useClickOutside.ts
│ └── useVirtualKeyboard.ts
├── lib/
│ ├── authOptions.ts # NextAuth.js configuration
│ ├── fonts.ts # Custom font definitions
│ └── validations/
│ └── auth.ts # Zod validation schemas
├── services/
│ └── osmService.ts # Logic for fetching data from Overpass API
└── store/
└── useStore.ts # Global Zustand store
└── useMapStyle.ts

🌱 Future Improvements
Implement Backend: Connect the Sign Up and Post Creation forms to a real backend API and database (e.g., PostgreSQL with Prisma).

Cloud Image Storage: Integrate a service like AWS S3 or Cloudinary for user profile and post image uploads.

Notifications: Add real-time notifications for likes or other interactions.
