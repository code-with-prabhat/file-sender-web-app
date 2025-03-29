@echo off
echo Building and starting File Sender Web App...
docker-compose up -d --build

echo.
echo Container started! Access the application at:
echo http://localhost:3000

echo.
FOR /F "tokens=4 delims= " %%i IN ('route print ^| find "0.0.0.0" ^| find /v "127.0.0.1"') DO SET IP=%%i
if not "%IP%"=="" (
    echo Or share with devices on your network: http://%IP%:3000
)

echo.
echo To stop the container, run: docker-compose down
pause 