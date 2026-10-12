@echo off
chcp 65001 >nul
set "PATH=d:\GRAVITY\MinGit\cmd;d:\GRAVITY\gh\bin;%PATH%"
echo ================================================================
echo   🚀 ระบบอัปโหลดโครงการ Rabies Dashboard ขึ้น GitHub อัตโนมัติ
echo   บัญชีผู้ใช้: cdkls46000-sketch (cdkls46000@gmail.com)
echo ================================================================
echo.

:: ตรวจสอบสถานะการล็อกอิน GitHub
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/3] กรุณายืนยันการเข้าสู่ระบบ GitHub บนเว็บเบราว์เซอร์...
    echo (ระบบจะเปิดหน้าต่างเบราว์เซอร์ให้กด Authorize อัตโนมัติ)
    echo.
    gh auth login -h github.com -p https -w
) else (
    echo [1/3] ยืนยันตัวตน GitHub เรียบร้อยแล้ว!
)

echo.
echo [2/3] กำลังสร้าง Repository และเชื่อมต่อ Remote...
gh repo create rabies-kalasin-dashboard --public --source=. --remote=origin --description "Rabies Surveillance Dashboard for Kalasin Province" >nul 2>&1

echo.
echo [3/3] กำลัง Push โค้ดทั้งหมดขึ้น GitHub (branch: main)...
git push -u origin main

echo.
echo ================================================================
echo   ✅ อัปโหลดขึ้น GitHub สำเร็จแล้ว!
echo   ลิงก์ Repository: https://github.com/cdkls46000-sketch/rabies-kalasin-dashboard
echo ================================================================
pause
