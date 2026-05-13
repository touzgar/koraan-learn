$files = @(
  'app/api/user/role/route.ts',
  'app/api/admin/users/route.ts',
  'app/api/admin/users/[userId]/route.ts',
  'app/api/admin/users/[userId]/role/route.ts',
  'app/api/admin/users/[userId]/status/route.ts',
  'app/api/admin/spaces/route.ts',
  'app/api/admin/spaces/[id]/route.ts',
  'app/api/admin/spaces/[id]/status/route.ts',
  'app/api/admin/reservations/[id]/status/route.ts',
  'app/api/admin/profile/route.ts',
  'app/api/admin/profile/image/route.ts',
  'app/api/auth/me/route.ts',
  'app/api/instructor/analytics/route.ts',
  'app/api/instructor/certificates/route.ts',
  'app/api/instructor/courses/route.ts',
  'app/api/instructor/courses/[id]/route.ts',
  'app/api/instructor/courses/[id]/status/route.ts',
  'app/api/instructor/dashboard/route.ts',
  'app/api/instructor/lessons/route.ts',
  'app/api/instructor/lessons/[id]/route.ts',
  'app/api/instructor/lessons/[id]/publish/route.ts',
  'app/api/instructor/profile/route.ts',
  'app/api/instructor/profile/image/route.ts',
  'app/api/instructor/quizzes/route.ts',
  'app/api/instructor/quizzes/[id]/route.ts',
  'app/api/instructor/quizzes/[id]/details/route.ts',
  'app/api/instructor/reviews/route.ts',
  'app/api/instructor/students/route.ts',
  'app/api/instructor/students/[id]/route.ts',
  'app/api/student/calendar/route.ts',
  'app/api/student/certificates/route.ts',
  'app/api/student/courses/route.ts',
  'app/api/student/courses/[id]/route.ts',
  'app/api/student/courses/available/route.ts',
  'app/api/student/dashboard/route.ts',
  'app/api/student/enroll/route.ts',
  'app/api/student/lessons/route.ts',
  'app/api/student/notifications/route.ts',
  'app/api/student/profile/route.ts',
  'app/api/student/profile/image/route.ts',
  'app/api/student/progress/route.ts',
  'app/api/student/quizzes/route.ts',
  'app/api/student/quizzes/[id]/route.ts',
  'app/api/student/quizzes/[id]/submit/route.ts'
)

$count = 0
foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    if ($content -notmatch "export const dynamic") {
      $lines = Get-Content $file
      $newLines = @()
      $importsDone = $false
      foreach ($line in $lines) {
        $newLines += $line
        if (-not $importsDone -and $line -match "^import" -and $lines[$lines.IndexOf($line) + 1] -notmatch "^import") {
          $newLines += ""
          $newLines += "export const dynamic = 'force-dynamic'"
          $importsDone = $true
        }
      }
      $newLines | Set-Content $file
      $count++
    }
  }
}
Write-Output "Added dynamic config to $count files"
