# Potens Backend Q2 - Internship Recommendation API

An Express.js backend for the Potens Backend Q2 assignment. The API accepts a structured student profile and returns the top internship recommendations from a seeded MySQL catalogue, including scores, matched fields, and plain English reasoning.

The project is intentionally simple, deterministic, and interview-friendly: no AI is used in the recommendation flow, and the business logic is separated from routes and controllers.

## Overview

| Area | Details |
| --- | --- |
| Domain | Internship recommendations for students |
| Backend | Express.js with JavaScript |
| Database | MySQL |
| ORM | Sequelize |
| Testing | Jest and Supertest |
| Auth | `x-admin-token` for protected write endpoints |
| Recommendation style | Deterministic weighted scoring |

## Architecture

The application follows a layered backend structure.

| Layer | Responsibility |
| --- | --- |
| Routes | Define API paths and middleware |
| Controllers | Handle request/response flow |
| Services | Contain database access and business operations |
| Models | Define Sequelize schemas |
| Utils | Shared helpers for scoring, validation, responses, and explanations |
| Middleware | Auth, async error forwarding, 404, and centralized error handling |
| Tests | Route and utility tests using Jest and Supertest |

Request flow:

```txt
Client -> Route -> Middleware -> Controller -> Service -> Sequelize Model -> MySQL
```

## Folder Structure

```txt
.
├── app.js
├── server.js
├── config/
│   ├── database.js
│   └── env.js
├── controllers/
│   ├── explainController.js
│   ├── healthController.js
│   ├── itemController.js
│   └── recommendationController.js
├── middleware/
│   ├── adminAuth.js
│   ├── asyncHandler.js
│   ├── errorHandler.js
│   └── notFound.js
├── models/
│   ├── index.js
│   └── Internship.js
├── routes/
│   ├── explainRoutes.js
│   ├── healthRoutes.js
│   ├── index.js
│   ├── itemRoutes.js
│   └── recommendationRoutes.js
├── scripts/
│   └── seedInternships.js
├── services/
│   ├── explainService.js
│   ├── itemService.js
│   └── recommendationService.js
├── tests/
└── utils/
```

## Installation

### Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | 18+ recommended |
| MySQL | 8+ recommended |
| npm | Comes with Node.js |

### Setup

```bash
npm install
cp .env.example .env
```

Update `.env` with your local MySQL credentials.

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=potens_q2
DB_USER=root
DB_PASSWORD=

CORS_ORIGIN=*
ADMIN_TOKEN=replace-with-a-secure-token
```

Create the database in MySQL before running the seed script.

```sql
CREATE DATABASE potens_q2;
```

Seed the internship catalogue:

```bash
npm run seed
```

Run the server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the server with Node |
| `npm run dev` | Start the server with Nodemon |
| `npm run seed` | Sync and seed 15 internships |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |

## API Documentation

Primary routes are available at the root path. The same router is also mounted under `/api`, so `/items` and `/api/items` both work.

### Health

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Check API health |

### Recommendations

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/recommend` | No | Return top 3 internship recommendations |

Request body:

```json
{
  "skills": ["JavaScript", "Node.js", "SQL"],
  "cgpa": 8,
  "preferredDomain": "Backend Development",
  "preferredLocation": "Chennai",
  "academicYear": 3
}
```

Successful response shape:

```json
{
  "success": true,
  "data": {
    "profile": {
      "skills": ["JavaScript", "Node.js", "SQL"],
      "cgpa": 8,
      "preferredDomain": "Backend Development",
      "preferredLocation": "Chennai",
      "academicYear": 3
    },
    "recommendations": [
      {
        "internship": {},
        "score": 90,
        "matchedFields": {},
        "explanation": "Plain English reason for the match."
      }
    ]
  }
}
```

### Items

| Method | Endpoint | Auth | Success Code | Description |
| --- | --- | --- | --- | --- |
| GET | `/items` | No | 200 | List internships |
| GET | `/items/:id` | No | 200 | Get one internship |
| POST | `/items` | `x-admin-token` | 201 | Create an internship |
| PUT | `/items/:id` | `x-admin-token` | 200 | Update an internship |
| DELETE | `/items/:id` | `x-admin-token` | 204 | Delete an internship |

Admin header:

```txt
x-admin-token: your-admin-token
```

Item body:

```json
{
  "title": "Backend Engineering Intern",
  "company": "Zoho",
  "location": "Chennai",
  "domain": "Backend Development",
  "requiredSkills": ["JavaScript", "Node.js", "SQL", "REST APIs"],
  "minimumCGPA": 7,
  "academicYear": 3,
  "stipend": 25000,
  "internshipType": "Onsite",
  "description": "Build and maintain REST APIs for internal productivity products."
}
```

### Explain

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/explain/:id` | No | Return internship details, eligibility criteria, and a plain English explanation |

Response shape:

```json
{
  "success": true,
  "data": {
    "internship": {},
    "eligibilityCriteria": {
      "requiredSkills": ["JavaScript", "Node.js", "SQL"],
      "minimumCGPA": 7,
      "academicYear": 3,
      "preferredDomain": "Backend Development",
      "preferredLocation": "Chennai",
      "internshipType": "Onsite"
    },
    "explanation": "This internship is best suited for students interested in Backend Development roles in Chennai..."
  }
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "message": "Item not found"
  }
}
```

| Status | Meaning |
| --- | --- |
| 400 | Invalid or missing request fields |
| 401 | Missing or invalid admin token |
| 404 | Route or item not found |
| 500 | Unexpected server error |

## Recommendation Algorithm

The recommendation engine compares every internship against the submitted profile and computes a score out of 100.

| Criteria | Weight | Scoring Rule |
| --- | ---: | --- |
| Skills | 40 | Proportional score based on matched required skills |
| Domain | 25 | Full points if preferred domain matches internship domain |
| CGPA | 15 | Full points if profile CGPA meets minimum CGPA |
| Location | 10 | Full points if preferred location matches internship location |
| Academic year | 10 | Full points if profile academic year meets minimum year |

Ranking rules are deterministic:

| Priority | Rule |
| --- | --- |
| 1 | Higher score |
| 2 | Higher number of matched skills |
| 3 | Higher stipend |
| 4 | Lower internship id |

Recommendations with a `0` score are excluded, so no-match cases return an empty list.

## Data Model

### Internship

| Field | Type | Notes |
| --- | --- | --- |
| `id` | Integer | Auto-increment primary key |
| `title` | String | Internship title |
| `company` | String | Company name |
| `location` | String | City or `Remote` |
| `domain` | String | Role domain |
| `requiredSkills` | JSON | Array of required skills |
| `minimumCGPA` | Decimal | Minimum eligible CGPA |
| `academicYear` | Integer | Minimum eligible academic year |
| `stipend` | Integer | Monthly stipend in INR |
| `internshipType` | Enum | `Remote`, `Onsite`, or `Hybrid` |
| `description` | Text | Role description |

## Design Decisions

| Decision | Reason |
| --- | --- |
| Sequelize ORM | Keeps database access structured and model-driven |
| Service layer | Prevents database queries from being placed directly in routes |
| Deterministic scoring | Makes results explainable, testable, and suitable for interviews |
| JSON for `requiredSkills` | Keeps the schema simple while supporting multiple skills |
| Admin token middleware | Lightweight protection for catalogue write operations |
| Central error handler | Ensures consistent error responses |
| Mocked services in route tests | Keeps tests fast and independent from MySQL |

## Tradeoffs

| Tradeoff | Impact |
| --- | --- |
| Simple admin token instead of JWT | Easier for assignment review, but not suitable for multi-user production auth |
| JSON skills field instead of normalized skill tables | Faster to build and explain, but harder to query deeply at scale |
| `sequelize.sync` in seed script | Convenient for local setup, but migrations would be better for production |
| Exact text matching for domain/location | Deterministic and simple, but does not handle synonyms or nearby locations |
| No caching yet | Keeps behavior straightforward, but repeated recommendation calls always scan all items |

## Future Improvements

| Improvement | Benefit |
| --- | --- |
| Add Sequelize migrations | Safer schema evolution |
| Add pagination and filtering to `/items` | Better catalogue browsing at scale |
| Add request validation library such as Joi or Zod | More robust validation rules |
| Add OpenAPI/Swagger documentation | Easier API exploration |
| Add recommendation caching with TTL | Faster repeated recommendation requests |
| Add webhook subscription flow | Notify users when new internships match their profile |
| Add normalized skill/domain tables | Better analytics and filtering |
| Add JWT-based admin auth | Production-grade authentication |

## Testing

The test suite uses Jest and Supertest.

| Area | Coverage |
| --- | --- |
| Health | Basic health route |
| CRUD | List, get, create, update, delete, auth failures, not found cases |
| Recommendation | Successful recommendation, missing fields, invalid fields, no-match cases |
| Explain | Eligibility explanation route and utility |
| Scoring | Deterministic ranking and no-match behavior |

Run:

```bash
npm test
```

## AI Usage Log

| Phase | AI Assistance Used | Human Direction |
| --- | --- | --- |
| Initial setup | Generated Express structure, config, middleware, and test setup | User specified stack and requested no CRUD initially |
| Database design | Generated Sequelize Internship model and seed script | User specified internship fields and MySQL/Sequelize |
| CRUD APIs | Generated item routes, controllers, services, and admin protection | User specified endpoint list and auth behavior |
| Recommendation engine | Generated deterministic scoring utility, validator, service, controller, and tests | User specified profile fields and scoring weights |
| Explain endpoint | Generated eligibility explanation route, service, utility, and tests | User specified response contents |
| Tests | Expanded Jest/Supertest tests for required cases | User specified scenarios to cover |
| README | Generated professional project documentation | User specified README sections |

No AI is used at runtime by the API. All recommendation results are produced by deterministic JavaScript logic.
