param(
  [string]$ip = ""
)

if (-not $ip) {
  $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "*Wi-Fi*" | Where-Object { $_.PrefixOrigin -ne "WellKnown" }).IPAddress
}

if (-not $ip -or $ip.Count -gt 1) {
  if ($ip.Count -gt 1) {
    Write-Host "Multiplos IPs encontrados:" -ForegroundColor Yellow
    for ($i = 0; $i -lt $ip.Count; $i++) {
      Write-Host "  [$i] $($ip[$i])"
    }
    $choice = Read-Host "Escolha o numero (0-$($ip.Count-1))"
    $ip = $ip[[int]$choice]
  } else {
    $ip = Read-Host "Digite o IP manualmente"
  }
}

Write-Host "Usando IP: $ip" -ForegroundColor Green

$serverFile = Join-Path $PSScriptRoot "..\backend\src\server.ts"
$envFile = Join-Path $PSScriptRoot "..\frontend\.env.development"

(Get-Content $serverFile) -replace 'http://[^:]+:\$\{PORT\}', "http://$ip`:3333" | Set-Content $serverFile
(Get-Content $envFile) -replace 'http://[^:]+:\d+', "http://$ip`:3333" | Set-Content $envFile

Write-Host "Atualizado:" -ForegroundColor Green
Write-Host "  backend/src/server.ts" -ForegroundColor Cyan
Write-Host "  frontend/.env.development" -ForegroundColor Cyan
