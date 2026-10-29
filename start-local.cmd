@echo off
setlocal EnableExtensions
title Ludotheque - serveur local
cd /d "%~dp0"

set "MODE=%~1"
set "DEV_URL=http://localhost:5173/ludotheque/"
set "PREVIEW_URL=http://localhost:4173/ludotheque/"

echo ============================================
echo   Ludotheque - serveur local
echo ============================================
echo.

if /i "%MODE%"=="help" goto :help
if /i "%MODE%"=="--help" goto :help
if /i "%MODE%"=="/?" goto :help

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js est introuvable.
  echo Installez Node.js 22 ou superieur : https://nodejs.org/
  goto :fail
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] npm est introuvable. Reinstallez Node.js : https://nodejs.org/
  goto :fail
)

set "NODE_MAJOR="
for /f "delims=" %%v in ('node -p "process.versions.node.split('.')[0]"') do set "NODE_MAJOR=%%v"
if not defined NODE_MAJOR goto :fail
if %NODE_MAJOR% LSS 22 (
  echo [ERREUR] Node.js 22 ou superieur est requis.
  echo Version detectee :
  node -v
  goto :fail
)

if not exist "node_modules" (
  echo Installation des dependances, cela peut prendre une minute...
  if exist "package-lock.json" (
    call npm.cmd ci
  ) else (
    call npm.cmd install
  )
  if errorlevel 1 goto :fail
  echo.
)

if /i "%MODE%"=="preview" goto :preview
if /i "%MODE%"=="build" goto :preview

:dev
echo Mode : developpement ^(rechargement automatique^)
echo URL  : %DEV_URL%
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo.
call npm.cmd run dev -- --open
goto :end

:preview
echo Mode : production ^(build + service worker / test PWA^)
echo URL  : %PREVIEW_URL%
echo.
echo Construction de l'application...
call npm.cmd run build
if errorlevel 1 goto :fail
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo.
call npm.cmd run preview -- --open
goto :end

:help
echo Usage :
echo   start-local            Serveur de developpement ^(par defaut^)
echo   start-local preview    Build de production + serveur ^(test PWA / hors ligne^)
echo   start-local help       Affiche cette aide
echo.
echo Le navigateur s'ouvre automatiquement a l'adresse indiquee.
exit /b 0

:end
echo.
echo Serveur arrete.
exit /b 0

:fail
echo.
echo [ECHEC] Le serveur n'a pas pu demarrer. Lisez le message ci-dessus.
echo.
pause
exit /b 1
