# url-shortener

This is a [homework](https://drive.google.com/file/d/1AreBiHDUYXH6MI5OqWpKP-f6-W0zA8np/view) of Dcard backend intern.

## Installation

### Environment Variables

Create a new env file and edit environment variables.

`.env`

```env
APP_URL = "http://localhost:3000"

DB_TYPE = mariadb
DB_HOST = 127.0.0.1
DB_PORT = 3306
DB_USER = url-shortener
DB_PASSWORD = secret
DB_NAME = url-shortener
```

### Install Dependencies

```bash
npm i
```

### Run Server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Introduction

### Tech Stack

- Framework
  - Nest.js (Express Backend)
    - Progressive backend framework written in TypeScript
- Database
  - MySQL / MariaDB
    - Relational database
- Third Party Library
  - typeorm
    - TypeScript library for ORM
  - mysql2
    - TypeORM mysql / mariadb driver
  - husky / lint-staged
    - Pre-commit hook
  - prettier
    - Code formatter
  - eslint
    - TypeScript linter

### Routes

#### POST `/api/v1/urls`

##### Request Body

```typescript
{
  url: string,
  expireAt: string
}
```

expireAt must be a string in ISO 8601 format.

##### Response

- 201 Created

  ```typescript
  {
    id: string,
    shortUrl: string
  }
  ```

- 400 Bad request

  ```json
  {
    "statusCode": 400,
    "message": ["expireAt must be a valid ISO 8601 date string"],
    "error": "Bad Request"
  }
  ```

#### GET `/:id`

##### Parameters

- `id`: string
  - short URL id

##### Response

- 302 Redirect to original URL
- 404 original URL not found or expired

  ```json
  {
    "statusCode": 404,
    "message": "Url not found",
    "error": "Not Found"
  }
  ```
