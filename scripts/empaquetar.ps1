$ErrorActionPreference = 'Stop'
$proyecto = Split-Path -Parent $PSScriptRoot
$nombre = 'JuanCarlos_Osega_PFY2201_EFT_FRONT_END_I'
$salida = Join-Path (Split-Path -Parent $proyecto) "$nombre.zip"
$temporal = Join-Path ([System.IO.Path]::GetTempPath()) ([guid]::NewGuid().ToString())
$carpeta = Join-Path $temporal $nombre
New-Item -ItemType Directory -Path $carpeta | Out-Null
$archivos = @('index.html', 'package.json', 'package-lock.json', 'vite.config.js', 'playwright.config.js', '.gitignore', '.gitattributes', 'README.md', 'PRESENTACION.md', 'assets', 'src', 'tests')
foreach ($archivo in $archivos) {
    Copy-Item -LiteralPath (Join-Path $proyecto $archivo) -Destination $carpeta -Recurse
}
New-Item -ItemType Directory -Path (Join-Path $carpeta 'scripts') | Out-Null
Copy-Item -LiteralPath $PSCommandPath -Destination (Join-Path $carpeta 'scripts/empaquetar.ps1')
Compress-Archive -LiteralPath $carpeta -DestinationPath $salida -Force
Write-Output "Paquete generado: $salida"
