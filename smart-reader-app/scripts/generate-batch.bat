@echo off
set OPENAI_API_KEY=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
set ELEVENLABS_API_KEY=sk_01f48d92fe0922c46c4380f1595093de3d50cb7871eff61a
set META_PAGE_TOKEN=EAAOYpZA4xaSMBRqIOrzvXfHgEdLpgKeNg296xYkvSZA51WYgGID7gtQDWZAzCOYVVId3M3ZBoBr83inZC9SZCV26hkzSCyqY8umGQA2MRGuJsaS8ojDGbvdwtKZBkOYZCwmtUOfWyXEqj5x9F9KvoxM1l1K3ZC0YgDphde6xgWHnyRrwWHIPXFmdW5TidlpsF6deZAIuE6
set META_IG_USER_ID=17841427937808106

set BATCH_FILE=%~dp0batch.txt

if not exist "%BATCH_FILE%" (
    echo.
    echo Falta: scripts\batch.txt
    echo Formato: un microlearning_id por linea, lineas en blanco y # comentarios son ignorados
    echo.
    exit /b 1
)

set TOTAL=0
set OK=0
set FAIL=0

for /f "usebackq eol=# tokens=*" %%i in ("%BATCH_FILE%") do (
    if not "%%i"=="" set /a TOTAL+=1
)

echo.
echo =============================================================
echo  Batch: %TOTAL% microlearnings
echo =============================================================
echo.

for /f "usebackq eol=# tokens=*" %%i in ("%BATCH_FILE%") do (
    if not "%%i"=="" (
        echo [%%i] Procesando...
        node "%~dp0generate-reel.mjs" %%i %*
        if errorlevel 1 (
            echo [%%i] ERROR
            set /a FAIL+=1
        ) else (
            echo [%%i] OK
            set /a OK+=1
        )
        echo.
    )
)

echo =============================================================
echo  Listo: %OK% OK  /  %FAIL% con error
echo =============================================================
echo.
