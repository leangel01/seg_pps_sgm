@echo off
REM setup.bat - Setup script for local development with Firebase (Windows)

echo 🚀 SEG_PPS_SGM - Local Setup
echo ================================

REM Check if .env exists
if exist .env (
    echo ✅ .env already exists
) else (
    echo 📋 Creating .env from .env.example...
    copy .env.example .env
    echo ✅ .env created
    echo.
    echo ⚠️  NEXT STEP: Edit .env and add your Firebase credentials:
    echo    - Open .env in your editor
    echo    - Replace the placeholder values with your actual Firebase config
    echo    - Save the file
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

echo.
echo ================================
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. If you just created .env, edit it with your Firebase credentials
echo 2. Run: npm run dev
echo.
echo For production deployment:
echo See DEPLOY.md for GitHub Pages setup
