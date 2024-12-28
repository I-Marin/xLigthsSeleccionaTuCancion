@echo off
chcp 65001
setlocal enabledelayedexpansion

:: Obtener la fecha y la hora en el formato aaaaMMdd_HHmmss
for /f "tokens=2 delims==" %%I in ('"wmic OS Get localdatetime /value"') do set datetime=%%I
set fecha_hora=%datetime:~0,4%%datetime:~4,2%%datetime:~6,2%_%datetime:~8,2%%datetime:~10,2%%datetime:~12,2%

:: Ejecutar el comando de Node.js y guardar la salida con la fecha y hora en el nombre del archivo
powershell -Command "$OutputEncoding = [System.Text.Encoding]::UTF8; node webserver/main.js | Tee-Object -FilePath 'C:\xLights\webserver_logs\webserver_log_%fecha_hora%.txt'"