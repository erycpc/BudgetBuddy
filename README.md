# BudgetBuddy 💚

> A full-stack personal finance web application built on the MERN stack with AI-powered financial advisory.

![BudgetBuddy](https://img.shields.io/badge/version-1.0.0-green) ![Node](https://img.shields.io/badge/node-v22+-green) ![React](https://img.shields.io/badge/react-v18+-green)

---

## Overview

BudgetBuddy helps users take control of their finances by tracking expenses, managing budgets, setting savings goals, and monitoring investments — all in one place. The built-in AI advisor reads your real financial data and gives personalized, actionable advice.

---

## Features

- **Authentication** — Secure register and login with JWT and bcrypt password hashing
- **Expense Tracking** — Add, view, and delete expenses with category tagging
- **Budget Management** — Set monthly spending limits with real-time progress bars
- **Savings Goals** — Track savings targets with deadline countdowns and progress tracking
- **Investment Portfolio** — Monitor investments and calculate returns
- **AI Financial Advisor** — Powered by Groq (LLaMA 3.3 70B) with access to your real financial data
- **Smart Notifications** — Budget warnings, goal milestones and deadline alerts
- **Dashboard** — Interactive revenue chart with weekly, monthly and yearly filters
- **Settings** — Update profile information and change password
- **Mobile Responsive** — Works across all screen sizes
- **Skeleton Loading** — Smooth loading states across all pages

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Recharts | Data visualization and charts |
| Context API | Global auth state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Groq SDK | AI inference (LLaMA 3.3 70B) |

---

## Project Structure

```
BudgetBuddy/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile, password
│   │   ├── expenseController.js  # Expense CRUD
│   │   ├── budgetController.js   # Budget CRUD
│   │   ├── goalController.js     # Goal CRUD
│   │   ├── investmentController.js # Investment CRUD
│   │   └── aiController.js       # AI chat with financial context
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema with pre-save hook
│   │   ├── Expense.js            # Expense schema
│   │   ├── Budget.js             # Budget schema
│   │   ├── Goal.js               # Goal schema
│   │   └── Investment.js         # Investment schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── investmentRoutes.js
│   │   └── aiRoutes.js
│   ├── .env                      # Environment variables (not committed)
│   └── server.js                 # Entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── dashboard/
        │   │   ├── Sidebar.jsx
        │   │   ├── DashboardHeader.jsx
        │   │   ├── Overview.jsx
        │   │   ├── AIChat.jsx
        │   │   └── Notifications.jsx
        │   ├── ErrorBoundary.jsx
        │   ├── ProtectedRoute.jsx
        │   └── Skeleton.jsx
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Expenses.jsx
        │   ├── Budgets.jsx
        │   ├── Goals.jsx
        │   ├── Investments.jsx
        │   └── Settings.jsx
        ├── services/
        │   └── api.js            # Axios instance with interceptors
        └── App.jsx               # Routes
```

---

## Getting Started

### Prerequisites

- Node.js v22+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/budgetbuddy.git
cd budgetbuddy
```

**2. Set up the backend**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/budgetbuddy
JWT_SECRET=your_long_random_secret_key
GROQ_API_KEY=gsk_your_groq_api_key
```

**3. Set up the frontend**
```bash
cd ../frontend
npm install
```

**4. Run both servers**

Backend (from `backend/` folder):
```bash
npm run dev
```

Frontend (from `frontend/` folder):
```bash
npm run dev
```

The app will be running at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/password` | Change password | Yes |

### Expenses
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/expenses` | Get all expenses | Yes |
| POST | `/api/expenses` | Add expense | Yes |
| PUT | `/api/expenses/:id` | Update expense | Yes |
| DELETE | `/api/expenses/:id` | Delete expense | Yes |

### Budgets
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/budgets` | Get all budgets | Yes |
| POST | `/api/budgets` | Add budget | Yes |
| PUT | `/api/budgets/:id` | Update budget | Yes |
| DELETE | `/api/budgets/:id` | Delete budget | Yes |

### Goals
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/goals` | Get all goals | Yes |
| POST | `/api/goals` | Add goal | Yes |
| PUT | `/api/goals/:id` | Update goal | Yes |
| DELETE | `/api/goals/:id` | Delete goal | Yes |

### Investments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/investments` | Get all investments | Yes |
| POST | `/api/investments` | Add investment | Yes |
| PUT | `/api/investments/:id` | Update investment | Yes |
| DELETE | `/api/investments/:id` | Delete investment | Yes |

### AI
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/ai/chat` | Chat with AI advisor | Yes |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: 5000) | No |
| `MONGO_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `GROQ_API_KEY` | Groq API key for AI features | Yes |

---

## Key Design Decisions

**Why JWT over sessions?**
JWTs are stateless — the server doesn't need to store session data. This makes the API scalable and works perfectly for a future mobile app using the same endpoints.

**Why Groq over OpenAI?**
Groq offers a generous free tier with extremely fast inference on LLaMA 3.3 70B — ideal for a finance app where response speed matters and costs need to stay low during early growth.

**Why Context API over Redux?**
BudgetBuddy's global state is minimal — just the authenticated user and token. Context API handles this cleanly without the overhead of Redux.

**Why MongoDB over PostgreSQL?**
Financial data in BudgetBuddy is document-oriented — each expense, budget, and goal belongs to a user and doesn't need complex relational joins. MongoDB's flexible schema also made iteration faster during development.

---

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 30 days
- All protected routes verified with auth middleware
- Ownership checks on every update and delete operation
- Environment variables kept out of version control
- CORS configured to allow only the frontend origin

---

## Roadmap

- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Stripe integration for Pro plan
- [ ] Freemium gating — AI advisor behind Pro
- [ ] React Native mobile app (iOS + Android)
- [ ] Email notifications for budget alerts
- [ ] CSV export for expenses
- [ ] Multi-currency support
- [ ] Recurring expenses
- [ ] Financial reports (monthly/yearly PDF)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## Author

**Eric Mbithi**
- GitHub: [@erycpc](https://github.com/erycpc)
- Email: ericmbithiofficial@gmail.com

---

*Built with 💚 using the MERN stack*
