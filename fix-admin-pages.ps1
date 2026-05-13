$adminPages = @(
  'app/admin/page.tsx',
  'app/admin/analytics/page.tsx',
  'app/admin/calendar/page.tsx',
  'app/admin/categories/page.tsx',
  'app/admin/certificates/page.tsx',
  'app/admin/courses/page.tsx',
  'app/admin/notifications/page.tsx',
  'app/admin/payments/page.tsx',
  'app/admin/reservations/page.tsx',
  'app/admin/spaces/page.tsx',
  'app/admin/statistics/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/validation/page.tsx'
)

$count = 0
foreach ($page in $adminPages) {
  if (Test-Path $page) {
    $content = Get-Content $page -Raw
    if ($content -notmatch "export const dynamic") {
      # Add dynamic config after imports, before export default
      $content = $content -replace "(import.*\r?\n)+(\r?\n)", "`$0export const dynamic = 'force-dynamic'`nexport const revalidate = 0`n`n"
      Set-Content $page $content -NoNewline
      $count++
      Write-Output "Fixed: $page"
    }
  }
}
Write-Output "`nAdded dynamic config to $count admin pages"
