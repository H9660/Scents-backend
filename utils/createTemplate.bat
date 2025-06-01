@echo off
aws ses create-template --cli-input-json file://emailTemplate.json
pause
