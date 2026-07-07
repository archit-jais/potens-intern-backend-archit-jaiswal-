# Potens Q2 Internship Frontend

React + Vite frontend for the Internship Recommendation API.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

Backend URL is configured in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Make sure the backend is running before using the app.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Dashboard with health, totals, and stats |
| `/recommend` | Student profile form and top recommendations |
| `/catalogue` | Searchable internship catalogue |
| `/internships/:id` | Internship details and eligibility explanation |
