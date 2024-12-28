@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

FOR /L %%i IN (1,1,100) DO (
    copy /Y simon_dice_ok.fseq .\cientos\simon_dice_ok_%%i.fseq
    copy /Y simon_dice_ok.xsq .\cientos\simon_dice_ok_%%i.xsq 
)

echo Se han creado 100 archivos.
echo "Asegurese que el xLights esta abierto"
pause

node C:\Program Files\xLights\xScheduleWeb\webserver\simon_dice_ok_100.js
echo Se han renderizado 100 archivos.
pause

