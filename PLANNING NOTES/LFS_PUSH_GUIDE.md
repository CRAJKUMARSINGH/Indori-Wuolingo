# PowerShell Upload — CODE-JUNCTION to GitHub

Copy and paste this entire block into **PowerShell** (run as Administrator).

---

## Full Upload Script

```powershell
# ── CONFIG — change these two lines only ─────────────────────────────────────
$LOCAL_CODE_JUNCTION = "E:\Rajkumar\Indori-Wuolingo\CODE-JUNCTION"
$REPO_URL            = "https://github.com/CRAJKUMARSINGH/Indori-Wuolingo.git"
# ─────────────────────────────────────────────────────────────────────────────

# 1. Install Git LFS if not already installed
git lfs install

# 2. Clone repo to a temp folder on Desktop
$CLONE_DIR = "$env:USERPROFILE\Desktop\Indori-Wuolingo-upload"
if (Test-Path $CLONE_DIR) { Remove-Item $CLONE_DIR -Recurse -Force }
git clone $REPO_URL $CLONE_DIR
Set-Location $CLONE_DIR

# 3. Activate LFS in the cloned copy
git lfs install
git lfs pull

# 4. Copy your local CODE-JUNCTION into artifacts\code-junction
$TARGET = "$CLONE_DIR\artifacts\code-junction"
if (-not (Test-Path $TARGET)) { New-Item -ItemType Directory -Path $TARGET | Out-Null }
Copy-Item -Path "$LOCAL_CODE_JUNCTION\*" -Destination $TARGET -Recurse -Force
Write-Host "✓ Copied CODE-JUNCTION to $TARGET"

# 5. Stage all changes (LFS auto-handles audio/images/video)
git add .

# 6. Commit
git commit -m "feat: add code-junction apps from local Windows folder"

# 7. Push  (you will be prompted for GitHub username + password/token)
git push origin main

Write-Host ""
Write-Host "✓ Done! Your CODE-JUNCTION apps are now on GitHub."
Write-Host "  Open Replit → Version Control → Pull to sync here."
```

---

## If you already have the repo cloned locally

Use this shorter version instead:

```powershell
# Set paths
$LOCAL_CODE_JUNCTION = "E:\Rajkumar\Indori-Wuolingo\CODE-JUNCTION"
$REPO_DIR            = "E:\Rajkumar\Indori-Wuolingo"   # <-- your existing clone

Set-Location $REPO_DIR
git lfs install
git pull origin main

# Copy CODE-JUNCTION into artifacts/code-junction
$TARGET = "$REPO_DIR\artifacts\code-junction"
if (-not (Test-Path $TARGET)) { New-Item -ItemType Directory -Path $TARGET | Out-Null }
Copy-Item -Path "$LOCAL_CODE_JUNCTION\*" -Destination $TARGET -Recurse -Force

git add .
git commit -m "feat: add code-junction apps from local Windows folder"
git push origin main

Write-Host "✓ Pushed successfully."
```

---

## GitHub Personal Access Token (needed for push)

If `git push` asks for a password and your GitHub password doesn't work:

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Tick `repo` scope → **Generate token**
4. Copy the token and use it as your **password** when git prompts

To save it so you're not asked again:
```powershell
git config --global credential.helper store
```

---

## After pushing — sync to Replit

In Replit → **Version Control panel** (left sidebar) → click **Pull**.
Your `artifacts/code-junction/` files will appear here immediately.
