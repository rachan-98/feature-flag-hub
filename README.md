# Feature Flag Hub

A full-stack MERN based Multi-Tenant Feature Flag Management System built for the Byepo Technologies SDE task-based assessment.

## Overview

Feature Flag Hub allows different organizations to manage their own feature flags. A Super Admin can create organizations, Organization Admins can manage feature flags for their organization, and End Users can check whether a feature is enabled or disabled.

## Features

### Super Admin
- Static credential based login
- Create organizations
- View organization list

### Organization Admin
- Login with JWT authentication
- Create feature flags
- Enable or disable feature flags
- Delete feature flags
- View all flags scoped to their organization

### End User
- Enter organization slug and feature key
- Check whether a feature is enabled or disabled

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

## Project Structure

```txt
feature-flag-hub
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
└── frontend
    ├── src
    │   ├── api
    │   ├── components
    │   ├── context
    │   ├── pages
    │   └── App.jsx
