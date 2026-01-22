# DSA Profiler - AI-Powered Student Progress Tracker

## Project Overview
DSA Profiler is a comprehensive web application designed to track, analyze, and improve the Data Skills & Algorithms (DSA) performance of students. It combines a robust MERN stack architecture with Google's Gemini AI to provide personalized insights, gamified leaderboards, and structured learning paths.

## 🚀 Key Features

### 1. Student Dashboard
- **Personalized Stats**: Real-time visualization of LeetCode performance (Easy/Medium/Hard).
- **Activity Heatmap**: A GitHub-style contribution graph showing daily submission streaks.
- **Spotlight Cards**: Beautiful, glassmorphic UI elements highlighting key metrics.
- **Topic Analysis**: Breakdown of strengths and weaknesses by DSA topic (Arrays, DP, Graphs, etc.).

### 2. 🤖 AI Smart Progress Analyzer
- **Personalized Coaching**: Integrates Google Gemini 1.5 Flash to analyze student data.
- **SWOT Analysis**: Identifies Strong Areas and Weak Areas based on submission history.
- **14-Day Roadmap**: Generates a custom study plan to target weaknesses.
- **Strategic Suggestions**: Provides actionable advice to improve problem-solving skills.

### 3. 🏆 Gamified Leaderboard
- **Real-Time Rankings**: Ranks students based on total problems solved.
- **Filtering**: Filter by Year (2nd, 3rd, 4th) and Section (A, B, C).
- **Search**: Quickly find peers by Name or Library ID.
- **Top 3 Podium**: Special visual highlighting for the top 3 performers.

### 4. 📚 DSA Practice Sheets
- **Curated Lists**: Structured problem sets (e.g., Striver's SDE Sheet, Love Babbar 450).
- **Progress Tracking**: Students can mark problems as "Done" and track completion %.
- **Admin Monitoring**: Admins can view individual student progress on specific sheets.

### 5. Admin Panel
- **Student Management**: Add, delete, and view student profiles.
- **Data Refresh**: Manual trigger to fetch latest LeetCode stats for all students.
- **Sheet Oversight**: Monitor class performance on assigned problem sheets.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Latest version for optimal performance and concurrent rendering.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS v4** & **Clsx**: Modern, utility-first styling with dynamic class composition.
- **Framer Motion**: Smooth, complex animations for a premium feel.
- **Recharts**: Data visualization for pie charts and analytics.
- **Lucide React**: Clean, consistent icon set.

### Backend
- **Node.js**: Javascript runtime for scalable network applications.
- **Express.js**: Backend framework for RESTful APIs.
- **MongoDB Atlas**: Cloud-native vector database for flexible data storage.
- **Mongoose**: ODM for strict schema modeling.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Google Generative AI SDK**: Interface for Gemini models.

### Infrastructure & Deployment
- **Vercel**: Frontend hosting (SPA).
- **Render**: Backend API hosting.
- **Cron Jobs**: Scheduled tasks to auto-update student LeetCode stats.

## ✨ Unique Selling Points (USP)

1.  **AI-Driven Insights**: Unlike standard trackers, DSA Profiler uses Generative AI to act as a personal coding coach, translating raw data into actionable study plans.
2.  **Immersive UX/UI**: Moving away from boring dashboards, it features a "Space/Cyberpunk" aesthetic with neon accents, glassmorphism, and fluid animations to keep students engaged.
3.  **Holistic Tracking**: Combines external platform data (LeetCode) with internal curriculum tracking (Sheets), giving a complete picture of a student's journey.
4.  **Institutional Focus**: Built specifically for colleges to track cohorts (Year/Section), making it perfect for placement cells and academic monitoring.
