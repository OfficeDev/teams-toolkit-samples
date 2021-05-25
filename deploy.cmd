@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

IF "%SAMPLE_NAME%" == "faq-plus" (
  cmd /c "%DEPLOYMENT_SOURCE%\faq-plus\deploy.cmd"
)