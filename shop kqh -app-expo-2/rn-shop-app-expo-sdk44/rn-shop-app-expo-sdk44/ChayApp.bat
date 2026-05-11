@echo off
cd /d "c:\Users\Raphael Da Silva\Downloads\Compressed\rn-shop-app-expo-sdk44\rn-shop-app-expo-sdk44"

echo Lay dia chi IP may tinh...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr "192.168"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP: =%
echo IP may tinh: %IP%

echo Khoi dong Expo voi LAN mode...
set REACT_NATIVE_PACKAGER_HOSTNAME=%IP%
npx expo start --lan

pause
