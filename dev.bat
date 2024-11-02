@echo off
PowerShell -Command "Start-Process PowerShell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File ""%~dp0dev.ps1""' -Verb RunAs"