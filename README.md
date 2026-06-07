# 🎓 Suggestify – Modern Web Application

Suggestify is a sleek, **Vite‑powered React** frontend paired with a lightweight **Express** backend. Designed for rapid development and easy deployment, the project provides a clean, maintainable codebase free of unused Internet Computer (ICP) integrations.

---

## 🚀 Key Features

- **⚡ Fast Development** – Hot‑module reloading with Vite for instant feedback.
- **🛠️ Typed UI** – TypeScript + React for robust, maintainable front‑end code.
- **📦 Modular Architecture** – Separate `client` (frontend) and `server` (backend) workspaces.
- **🔧 Simple Backend** – Express API ready for extension.
- **📦 Production‑Ready** – Optimized build output with `npm run build`.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (optional, easy to replace)
- **State Management:** React Hooks & Context API
- **Deployment:** Vercel / Netlify

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database (optional):** MongoDB (Mongoose) – not required for the starter template
- **Deployment:** Vercel Serverless Functions / Render

---

## 📂 Project Structure

```
/client  – React (Vite) application – the PWA frontend.
/server  – Express API – optional backend services.
```

---

## ⚙️ Quick Start

1. **Prerequisites**
   - Node.js (v18 or newer)
   - Git
   - (Optional) MongoDB instance if you plan to use a database

2. **Clone the repository**
   ```bash
   git clone https://github.com/saksheegupta11/Suggestify.git
   cd Suggestify
   ```

3. **Install dependencies**
   ```bash
   npm install   # Installs both client and server workspaces
   ```

4. **Run the apps locally**
   - Frontend:
     ```bash
     npm run dev --workspace=client
     ```
   - Backend (if needed):
     ```bash
     npm run dev --workspace=server
     ```

5. **Build for production**
   ```bash
   npm run build --workspace=client
   ```
   The static files are emitted to `client/dist/`.

---

