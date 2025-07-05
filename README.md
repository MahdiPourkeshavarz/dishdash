# DishDash 🍔🗺️

**DishDash** is a modern, map-based web application for discovering and sharing food experiences at any location. Built with Next.js and TypeScript, it features a highly interactive and beautifully designed user interface, inspired by modern design principles.

Users can pinpoint their location, create new posts about their food experiences with a satisfaction rating, and see other posts visually represented on the map.

_(A placeholder image showing the main map view with custom-colored post markers, a stack of posts, and the sleek, Gemini-inspired post modal open at the bottom.)_

---

## ✨ Features

- **Interactive Map View**: A fast and fluid map experience powered by Leaflet and React-Leaflet.
- **Global Light & Dark Theme**: A persistent, themeable interface managed with Zustand, ensuring a comfortable viewing experience day or night.
- **Real-time Geolocation**: Automatically detects the user's location to center the map and tag new posts accurately.
- **Gemini-Inspired Posting UI**: A sleek, bottom-anchored modal for creating new posts, featuring:
  - A two-step "initial" and "expanded" view for an efficient workflow.
  - A glowing, animated "halo" effect.
  - Full mobile and on-screen keyboard support.
- **Dynamic & Themed Map Markers**:
  - **Single Posts**: Display a unique emoji icon directly on the map based on the post's satisfaction (`awesome`, `good`, or `bad`).
  - **Stacked Posts**: Multiple posts at one location are automatically grouped into a single, color-coded pin that displays a post count.
- **Post Carousel**: Click on a stacked marker to open an interactive carousel, allowing you to browse through all posts at that location with swipe gestures on mobile and buttons on desktop.
- **Engaging UI/UX**:
  - Custom-designed, theme-aware "Polaroid-style" post cards.
  - Smooth, fluid animations throughout the app, powered by Framer Motion.
  - Responsive design that works seamlessly on both desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14+ (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Local Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/dishdash.git
    cd dishdash
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Local HTTPS (Required for Geolocation):**
    The browser's Geolocation API requires a secure context (HTTPS) to function. We use `mkcert` to create a trusted local development environment.

    - First, install `mkcert` (follow instructions for your OS: [mkcert on GitHub](https://github.com/FiloSottile/mkcert)). A common way on macOS is `brew install mkcert`.
    - Install the local Certificate Authority:
      ```bash
      mkcert -install
      ```
    - In your project root, generate a certificate for localhost:
      ```bash
      mkcert localhost 127.0.0.1 ::1
      ```

4.  **Run the development server:**
    The `dev` script is pre-configured to use the HTTPS certificate.

    ```bash
    npm run dev
    ```

    The application should now be running on **`https://localhost:3000`**.

---

## 📁 Project Structure

The project follows a feature-colocated structure for scalability and maintainability.

```
/
├── components/
│   ├── features/
│   │   ├── map/         # Map-related components (MapView, PostMarker, etc.)
│   │   └── post/        # Post-related components (PostModal, PostCard, etc.)
│   └── layout/          # General layout components (Navbar, etc.)
├── hooks/
│   └── useVirtualKeyboard.ts # Custom hook for mobile keyboard detection
├── lib/
│   └── posts.ts         # Mock data for posts
├── pages/
│   └── api/             # API routes (not currently used for posting)
├── public/
│   ├── /uploads/        # (If using local file upload for dev)
│   └── /awesome.png     # Static assets and icons
├── store/
│   └── useStoreStore.ts # Global Zustand store for state management
└── styles/
    └── globals.css      # Global styles, including Leaflet overrides
```

---

## 🌱 Future Improvements

This project serves as a strong foundation. Future enhancements could include:

- **Real Backend & Database**: Replace the local `posts` array with a proper database (e.g., PostgreSQL, MongoDB) and a full backend API.
- **User Authentication**: Implement user sign-up and login (e.g., with NextAuth.js).
- **Cloud Image Storage**: Replace the local file system with a cloud storage solution like AWS S3 or Cloudinary for handling image uploads in production.
- **User Profiles & Interaction**: Add user profiles, comments, and the ability to "like" or save posts.
- **Filtering and Searching**: Allow users to filter posts on the map by satisfaction, date, or food type.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
