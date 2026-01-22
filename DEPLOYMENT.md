# Deployment Guide

This project is ready for deployment. The recommended stack is **Vercel** for the Frontend and **Render** (or Railway) for the Backend.

## 1. Backend Deployment (Render.com)

1.  Push your code to GitHub.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Configuration**:
    - **Root Directory**: `server`
    - **Build Command**: `npm install`
    - **Start Command**: `node index.js`
6.  **Environment Variables**:
    Add the following variables in the "Environment" tab:
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A secure random string.
    - `GEMINI_API_KEY`: Your Google Gemini API key.
    - `CLIENT_URL`: The URL of your deployed frontend (e.g., `https://dsa-profiler.vercel.app`). *Note: You can add this after deploying the frontend.*

## 2. Frontend Deployment (Vercel)

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configuration**:
    - **Root Directory**: `client`
    - **Framework Preset**: Vite (should be detected automatically).
    - **Build Command**: `vite build` (default).
    - **Output Directory**: `dist` (default).
5.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://dsa-profiler-backend.onrender.com`). *Note: Do not add a trailing slash.*

## 3. Final Steps

1.  Once both are deployed, make sure to update the `CLIENT_URL` in the Backend (Render) to match your actual Vercel URL.
2.  Redeploy the backend if you changed the environment variable.

Your application should now be live!
