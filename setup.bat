@echo off
echo Creating Elda-BE project structure...


:: Initialize pnpm project
call pnpm init

:: Create necessary directories
mkdir src
mkdir src\controllers
mkdir src\models
mkdir src\routes
mkdir src\middlewares
mkdir src\services
mkdir src\utils
mkdir src\config

:: Create main application files
type nul > src\app.js
type nul > src\server.js

:: Create empty configuration files
type nul > .env
type nul > .gitignore
type nul > Dockerfile
type nul > docker-compose.yml
type nul > README.md
type nul > .eslintrc.json

:: Initialize git repository
git init

echo Project structure created successfully!
pause