@echo off
setlocal EnableExtensions
title Ludotheque - mise a jour Graphify
cd /d "%~dp0"

echo ============================================
echo   Ludotheque - Mise a jour de Graphify
echo ============================================
echo.

set "PYTHON_CMD="

where python >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_CMD=python"
) else (
  where py >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_CMD=py"
  )
)

if not defined PYTHON_CMD (
  echo [ERREUR] Python est introuvable dans le PATH.
  echo Installez Python ^(version 3.10 ou superieure^) : https://www.python.org/
  goto :fail
)

%PYTHON_CMD% -c "import graphify" >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Le paquet graphifyy est introuvable.
  echo Installez-le avec :
  echo   %PYTHON_CMD% -m pip install graphifyy
  goto :fail
)

echo Execution : %PYTHON_CMD% -m graphify update . %*
echo.
%PYTHON_CMD% -m graphify update . %*
if errorlevel 1 goto :fail

echo.
echo ============================================
echo   Mise a jour terminee avec succes !
echo   Fichiers generes dans le dossier :
echo     - graphify-out\graph.json
echo     - graphify-out\graph.html
echo     - graphify-out\GRAPH_REPORT.md
echo ============================================
echo.
goto :end

:fail
echo.
echo [ECHEC] La mise a jour a echoue. Lisez le message ci-dessus.
echo.
pause
exit /b 1

:end
echo Appuyez sur une touche pour quitter.
pause >nul
exit /b 0
