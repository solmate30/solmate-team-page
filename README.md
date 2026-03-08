<div align="center">
  <h1>🤝 Solmate</h1>
  <p><b>Filling the Empty Spaces of Society with Warm Technology</b></p>
  <p>AI-Powered Companion & Web3 Transparent Empty House Regeneration Platform</p>

  [**Read in Korean (한국어)**](./README_KO.md)
</div>

<br />

## 📖 1. Project Overview & Vision

**Solmate** is a platform built to solve two inherently connected modern societal issues: **"The Empty Spaces"** (vacant houses causing regional decline) and **"The Empty Hearts"** (social isolation and loneliness among single households and the elderly). 

By combining the scalable emotional care of **AI** with the transparent financial tracking of **Web3**, Solmate connects these empty spaces. AI serves as a 24/7 emotional companion, while Web3 transparently proves the flow of social capital and vacant space regeneration.

## 🎯 2. The Problems We Solve

* **The Empty Spaces (Physical Isolation)**: The rapid increase in vacant houses due to population decline, leading to a waste of resources and regional decay.
* **The Empty Hearts (Emotional Isolation)**: The weakening of social networks, leading to emotional isolation, depression, and lonely deaths (especially among the elderly and 1-person households).
* **The Trust Gap**: Lack of transparency in how welfare budgets, CSR funds, and donations are utilized for 1:1 care and space regeneration.

## 💡 3. Solmate's Solution (Unique Value Proposition)

Solmate is not just a chatbot or a real estate app. We provide a **Transparent Impact Operation** that fills the gaps in social interaction and physical spaces:

1. **AI Companion Chatbot (Scalable Care)**: An AI persona ("Soli") that provides 24/7 empathetic conversation. It overcomes the physical limitations of human social workers, capable of simultaneously caring for tens of thousands of users while detecting anomalies (e.g., danger keywords) to connect them with guardians or institutions.
2. **Transparent Regeneration via Web3 (Creditcoin & BondBase)**: Using blockchain smart contracts, the financing and execution of vacant house repairs, care costs, and donations are **100% recorded on-chain**. This completely resolves the distrust in "how the money is spent" for local governments, CSR companies, and individual donors.
3. **Raise-to-Earn (Impact Tokenomics)**: A reward system providing incentives for consistent, positive interactions with the AI companion or participating in vacant house regeneration projects, forming a sustainable ecosystem.

## 🛠 4. Tech Stack & Architecture

### Frontend & UI
* **Framework**: Next.js 16 (App Router), React 19
* **Styling & Animation**: Tailwind CSS v4, Framer Motion
* **3D Interactive UI**: React Three Fiber, Drei (For immersive Hero Section Particle System)
* **State Management**: Zustand 5

### AI & Data Layer
* **AI Model**: OpenAI `gpt-4o-mini` with Server-side Streaming
* **Real-time Data Integration**: Korea Public Data Portal REST API (KOSIS, Korea Rural Community Corporation) with React Server Components (RSC) & Route Caching.

### Web3 & Backend (Integration in Progress)
* **Web3/Blockchain**: Creditcoin 3.0, BondBase integration for transparent fund tracking and smart contracts.
* **Database**: Decentralized Edge DB (Turso / SQLite)

## 🚀 5. Getting Started

Follow the instructions below to run Solmate locally.

### Prerequisites
* Node.js (v18+)
* npm, yarn, pnpm, or bun

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/solmate.git
   cd solmate/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```

3. **Environment Setup (`.env.local`):**
   Ensure you have configured the required API keys (OpenAI API Key, Public Data Portal API Key, etc.).

4. **Run the Development Server:**
   ```bash
   npm run dev
   # or yarn dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.
   - The AI Companion is accessible at `/chat`.

## 📁 6. Documentation Details

Our planning and architecture docs follow a structured layering system:
- `docs/01_Concept_Design` - Concept, lean canvas, and project vision.
- `docs/02_UI_Screens` - UI screens and flow.
- `docs/03_Technical_Specs` - DB Schema, API specifications, Development principles.
- `docs/04_Logic_Progress` - Business logic and progress tracking.
- `docs/05_QA_Validation` - Test reports and QA status.

---

<div align="center">
  <i>"Connecting the Empty Spaces of the World with AI and Web3"</i>
</div>
