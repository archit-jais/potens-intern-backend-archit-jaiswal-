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
        "scoreBreakdown": {
          "skills": {
            "score": 30,
            "maxScore": 40,
            "matched": ["javascript", "node.js", "sql"],
            "missing": ["rest apis"],
            "required": ["javascript", "node.js", "sql", "rest apis"]
          },
          "domain": {
            "score": 25,
            "maxScore": 25,
            "matched": true,
            "expected": "Backend Development"
          },
          "cgpa": {
            "score": 15,
            "maxScore": 15,
            "matched": true,
            "minimumRequired": 7
          },
          "location": {
            "score": 10,
            "maxScore": 10,
            "matched": true,
            "expected": "Chennai"
          },
          "academicYear": {
            "score": 10,
            "maxScore": 10,
            "matched": true,
            "minimumRequired": 3
          },
          "total": {
            "score": 90,
            "maxScore": 100
          }
        },
        "matchedFields": {},
        "explanation": "Strong fit signals: 3 of 4 required skills match (javascript, node.js and sql), the domain matches Backend Development, the CGPA requirement of 7 is met, the location matches Chennai and the academic year requirement is met. Remaining gaps: missing required skills: rest apis. Final score: 90/100."
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
    "scoreBreakdown": {
      "skills": {
        "maxScore": 40,
        "rule": "Awarded proportionally based on how many required skills match the student profile.",
        "required": ["JavaScript", "Node.js", "SQL"]
      },
      "domain": {
        "maxScore": 25,
        "rule": "Awarded when the preferred domain matches Backend Development."
      },
      "cgpa": {
        "maxScore": 15,
        "rule": "Awarded when the student CGPA is at least 7."
      },
      "location": {
        "maxScore": 10,
        "rule": "Awarded when the preferred location matches Chennai."
      },
      "academicYear": {
        "maxScore": 10,
        "rule": "Awarded when the student is in academic year 3 or above."
      },
      "total": {
        "maxScore": 100
      }
    },
    "explanation": "Best-fit signals for this role are Backend Development interest, availability for Chennai, and skills in JavaScript, Node.js and SQL..."
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

| Tool | Approximate Usage | Purpose |
| --- | --- | --- |
| ChatGPT | ~45 messages | Project planning, architecture discussion, debugging, code review, documentation, and interview preparation |
| GitHub Copilot | Frequent inline completions | CRUD routes, controllers, React components, boilerplate, and tests |
| Codex | ~12 prompts | Frontend generation, refactoring, README improvements, and test enhancements |

