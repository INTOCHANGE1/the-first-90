@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
call npm.cmd run dev -- -p 3010
