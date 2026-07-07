# Potens Backend Q2 - Profile-to-Recommendation API

Initial Express.js backend setup for the Potens Q2 assignment.

## Tech Stack

- Express
- MySQL
- Sequelize
- dotenv
- cors
- helmet
- nodemon
- Jest
- Supertest

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm start
npm run dev
npm run seed
npm test
```

## Database

The project uses MySQL through Sequelize. Configure database credentials in `.env`.

Current model:

- `Internship` - internship catalogue item used for recommendations

## Current Routes

- `GET /api/health` - basic API health check
- `POST /recommend` - returns top 3 internship recommendations for a student profile
- `GET /explain/:id` - explains internship eligibility criteria in plain English
- `GET /items` - list internship items
- `GET /items/:id` - get one internship item
- `POST /items` - create an internship item, requires `x-admin-token`
- `PUT /items/:id` - update an internship item, requires `x-admin-token`
- `DELETE /items/:id` - delete an internship item, requires `x-admin-token`

## Recommendation Profile

```json
{
  "skills": ["JavaScript", "Node.js", "SQL"],
  "cgpa": 8,
  "preferredDomain": "Backend Development",
  "preferredLocation": "Chennai",
  "academicYear": 3
}
```

Scoring weights: skills `40`, domain `25`, CGPA `15`, location `10`, academic year `10`.
