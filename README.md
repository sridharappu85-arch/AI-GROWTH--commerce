# NexAgentic: AI Growth & Agentic Commerce Platform

> **Theme**: AI-powered commerce platform where autonomous AI agents help businesses discover customers, recommend products, personalize offers, optimize marketing, and assist customers through the purchasing journey with human-in-the-loop authorization.

---

## 🌟 Executive Overview

**NexAgentic** is a full-stack, enterprise-grade agentic commerce web application. Rather than a basic CRUD demo, the platform models the future of **autonomous commerce**:
- **Agentic Commerce Engine**: Conversational shopping assistant that parses multi-faceted natural language constraints, searches and ranks verified specifications, generates side-by-side comparison matrices, prepares cart orders, and **mandates explicit human confirmation before checkout execution**.
- **AI Growth Engine**: Real-time business intelligence telemetry, algorithmic cohort segmentation, predictive cart-abandonment diagnostics, and automated marketing campaign synthesis with quantified ROI.
- **Demo Mode Ready**: Zero external API keys needed. Features an autonomous deterministic agent engine with natural language constraint parsing and reasoning logs.

---

## 🏗️ Architecture & Multi-Agent Ecosystem

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React + TS + Vite)                    │
│  - Public Landing Page ("Turn AI Into Your Growth Engine")             │
│  - Customer Portal: AI Shopping Assistant, Catalog, Cart, Orders      │
│  - Admin Portal: Growth Dashboard, BI Charts, Campaigns, Agent Monitor │
│  - Fast Demo Persona Switcher (Rahul, Priya, Aman, Aditi Sen)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API & JSON Payloads
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Backend API (Node.js + Express + TS)                │
│  - Role Middleware (/api/auth, /api/products, /api/cart, /api/orders)  │
│  - Agent Orchestrator (/api/agents/chat, /api/agents/logs)             │
│  - Admin Telemetry (/api/admin/metrics, /api/admin/charts)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                     Multi-Agent System & Orchestrator                  │
│  ┌───────────────────────────────┬──────────────────────────────────┐  │
│  │ 1. Shopping Agent             │ 2. Recommendation Agent          │  │
│  │ (Intent, Budget, Specs, Rationale)│ (Collaborative, Affinity Scoring)│
│  ├───────────────────────────────┼──────────────────────────────────┤  │
│  │ 3. Growth Agent               │ 4. Marketing Campaign Agent      │  │
│  │ (KPI Analysis, Segment Health)│ (Copy, Targeting, ROI Forecast)  │  │
│  └───────────────────────────────┴──────────────────────────────────┘  │
│                                   │ Controlled Tool Layer               │
│  [searchProducts, compareProducts, getCart, addToCart, prepareCheckout, │
│   createOrder, analyzeGrowth, generateCampaign, getSegments]            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Prisma ORM
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Database (SQLite via Prisma)                     │
│  Users, Preferences, Products, Reviews, Carts, Orders, Segments,       │
│  Campaigns, AgentLogs, GrowthInsights                                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 The Four Specialized Agents

1. **Shopping Agent**
   - Extracts explicit budget ceilings (e.g. `under ₹70,000`, `below 50k`), categories, and use cases (`programming`, `battery`, `photography`).
   - Ranks top product candidates with written technical rationales.
   - Generates side-by-side spec comparison matrices.
   - Executes cart additions and prepares checkout with mandatory human confirmation.
2. **Recommendation Agent**
   - Continuously evaluates customer persona profiles, past orders, wishlists, and technical proficiency.
   - Scores catalog items and surfaces high-affinity accessories (e.g. matching Logitech MX Master 3S with developer laptops).
3. **Growth Agent**
   - Analyzes store conversion funnels, category sales velocity, and RFM customer segments.
   - Synthesizes actionable growth insights with quantified revenue impact (`+18.4% AOV lift`, `+3.4x conversion multiplier`).
4. **Marketing Agent**
   - 1-Click marketing campaign studio: Generates persuasive copy, targeted audience filters, and recommended distribution channels (Email, WhatsApp, Push, Retargeting) with predicted conversion rates.

---

## 🛡️ Safety & Agentic Governance

- **Zero Direct SQL Mutations**: AI agents interact exclusively through strongly typed, audited application tools in `AgentTools.ts`.
- **Mandatory Human-In-The-Loop Confirmation**: For critical commerce actions (e.g. placing an order or committing simulated payments), the agent triggers an **Order Confirmation Modal** requiring explicit user sign-off.
- **Simulated Commerce**: All transactions are simulated with ₹ INR currency for presentation safety without external financial liabilities.
- **Full Observability**: Every invocation logs inputs, tool invoked, output summary, execution latency (ms), and step-by-step reasoning chains into `AgentLog`.

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js v18+ (Tested on Node v24)
- npm v9+

### 1. Clone & Run Development Server
```bash
# In project root:
npm run dev
```
This simultaneously boots:
- 🚀 **Backend API**: `http://localhost:5000`
- 💻 **Frontend Web App**: `http://localhost:5173`

### 2. (Optional) Re-seed Database
```bash
# Re-populates 30+ products, 10 customers, 24 orders, insights, and campaigns:
npm run seed
```

### 3. Build for Production
```bash
npm run build
```

---

## 👥 Demo Personas & Fast Role Switcher

In the top navigation bar, use the **Persona Switcher** to instantly test the platform:
- **Rahul Sharma** (*Senior Fullstack Developer*): High budget (₹80k), developer laptops, mechanical keyboards.
- **Priya Patel** (*Marketing Strategist & Creator*): Flagship smartphones, wearables, wireless earbuds.
- **Aman Verma** (*CS Student*): Budget (₹65k), value-conscious coding laptops with long battery endurance.
- **Aditi Sen** (*Store Administrator & Growth Lead*): Full access to Executive BI Dashboard, Recharts graphs, Growth insights, and Campaign Studio.

---

## 📊 Realistic Seed Data Highlights

- **30+ Products**: Realistic devices in Indian Rupees (₹) spanning Laptops, Audio & ANC, Smartphones, Smartwatches, and Desk Productivity with technical specs (Processors, RAM, Battery Whr, Displays, Weights).
- **10 Customer Personas**: Demographically diverse profiles with preferences, order histories, and wishlists.
- **24 Historical Orders**: Spanning the past 60 days, populating revenue trends, AOV, and AI-assisted purchase KPIs.
- **5 Algorithmic Customer Segments**: "Tech Enthusiasts & High CLV", "Value-Conscious Students", "Creative Professionals", "Dormant Cart Abandoners", "WFH Productivity".
- **AI Growth Insights & Marketing Campaigns**: Pre-seeded telemetry demonstrating diagnostic playbooks and ad copy generation.

---

## 🧪 Recommended Presentation Walkthrough

1. **Public Landing Page**:
   - Navigate to `http://localhost:5173`.
   - Review the Hero section: *"Turn AI Into Your Growth Engine."*
   - Explore the interactive agent showcase tabs (Shopping Flow, Growth Diagnostic, Campaign Generator).
2. **AI Shopping Assistant Journey**:
   - Click **Try AI Shopping Assistant** (or `/assistant`).
   - Click the prompt: *"Find me a laptop under ₹70,000 with good battery life."*
   - Inspect the **Agent Reasoning Trace** accordion (constraints extracted: Budget ≤ ₹70k, Category = Laptops, attributes = programming/battery).
   - Click **Compare Side-by-Side** to inspect the technical specification matrix.
   - Click **Add to Cart** or type *"add to cart"*.
   - Type *"proceed to checkout"* or click the cart icon.
   - Review the **Human-In-The-Loop Confirmation Modal**, check the authorization box, and confirm order.
   - Notice the celebratory confetti and receipt in **My Orders**.
3. **Executive BI Dashboard & Growth Engine**:
   - Use the top bar switcher to switch to **Admin Mode** (or click `/admin`).
   - Examine the 8 KPI Cards (Revenue, Orders, 4.8% CR, CLV, 7.2% Agent CR, AOV).
   - Review the interactive Recharts (Revenue over time, Conversion Funnel, Category sales).
   - Open **AI Growth Insights** (`/admin/insights`) to inspect signals and click *"Deploy Action"*.
   - Open **Campaign Studio** (`/admin/campaigns`) and click *"Generate Campaign with AI"* to view real-time copy synthesis.
   - Open **Agent Activity** (`/admin/agents`) to inspect the real-time observability telemetry log.
#   A I - G R O W T H - - c o m m e r c e  
 