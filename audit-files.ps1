$dirs = @('D:\Final Project\frontend\src', 'D:\Final Project\backend\src')
$results = @()
foreach ($dir in $dirs) {
  if (Test-Path $dir) {
    Get-ChildItem -Recurse -Path $dir -Include '*.jsx','*.tsx','*.ts','*.js' | ForEach-Object {
      $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
      if ($lines -gt 300) {
        $results += [PSCustomObject]@{ Lines = $lines; File = $_.FullName }
      }
    }
  }
}
$results | Sort-Object Lines -Descending | Format-Table Lines, File -AutoSize
