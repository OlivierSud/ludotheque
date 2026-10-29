# Génère les icônes PNG de la PWA à partir du motif défini ci-dessous.
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root 'public\icons'
New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null

$bg = [System.Drawing.ColorTranslator]::FromHtml('#1b1b2f')
$colors = @(
  [System.Drawing.ColorTranslator]::FromHtml('#ffc857'),
  [System.Drawing.ColorTranslator]::FromHtml('#7c5cff'),
  [System.Drawing.ColorTranslator]::FromHtml('#2ec4b6'),
  [System.Drawing.ColorTranslator]::FromHtml('#ff6b6b')
)

function New-RoundedRect([System.Drawing.RectangleF]$rect, [single]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
  $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
  $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
  $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-Icon([int]$size, [string]$directory, [string]$file, [bool]$maskable) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $scale = 1.0
  $inset = 0.0
  if ($maskable) {
    # Zone de sécurité : le contenu reste dans les 80 % centraux.
    $scale = 0.66
    $inset = ($size * (1 - $scale)) / 2
  }

  $backgroundRect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
  $radius = if ($maskable) { 0 } else { $size * 0.22 }
  $brush = New-Object System.Drawing.SolidBrush($bg)
  if ($radius -le 0) {
    $graphics.FillRectangle($brush, $backgroundRect)
  } else {
    $path = New-RoundedRect $backgroundRect $radius
    $graphics.FillPath($brush, $path)
    $path.Dispose()
  }

  $gridSize = $size * 0.56 * $scale
  $gridOrigin = ($size - $gridSize) / 2
  $cell = $gridSize / 2
  $radiusDot = $cell * 0.52

  for ($row = 0; $row -lt 2; $row++) {
    for ($col = 0; $col -lt 2; $col++) {
      $index = $row * 2 + $col
      $centerX = $gridOrigin + $cell * $col + $cell / 2
      $centerY = $gridOrigin + $cell * $row + $cell / 2
      $dotBrush = New-Object System.Drawing.SolidBrush($colors[$index])
      $graphics.FillEllipse($dotBrush, $centerX - $radiusDot, $centerY - $radiusDot, $radiusDot * 2, $radiusDot * 2)
      $dotBrush.Dispose()
    }
  }

  $brush.Dispose()

  $target = Join-Path $directory $file
  $bitmap.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  Write-Host "Icône générée : $target"
}

New-Icon 192 $iconsDir 'icon-192.png' $false
New-Icon 512 $iconsDir 'icon-512.png' $false
New-Icon 512 $iconsDir 'maskable-512.png' $true
New-Icon 180 (Join-Path $root 'public') 'apple-touch-icon.png' $false
