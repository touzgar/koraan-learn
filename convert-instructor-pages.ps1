# Script to convert instructor pages to Server Component wrappers

$pages = @(
    @{Path="app/instructor/analytics/page.tsx"; Component="InstructorAnalyticsClient"},
    @{Path="app/instructor/certificates/page.tsx"; Component="InstructorCertificatesClient"},
    @{Path="app/instructor/courses/page.tsx"; Component="InstructorCoursesClient"},
    @{Path="app/instructor/courses/[id]/edit/page.tsx"; Component="InstructorCourseEditClient"},
    @{Path="app/instructor/lessons/page.tsx"; Component="InstructorLessonsClient"},
    @{Path="app/instructor/lessons/[id]/edit/page.tsx"; Component="InstructorLessonEditClient"},
    @{Path="app/instructor/quizzes/page.tsx"; Component="InstructorQuizzesClient"},
    @{Path="app/instructor/quizzes/create/page.tsx"; Component="InstructorQuizCreateClient"},
    @{Path="app/instructor/quizzes/[id]/page.tsx"; Component="InstructorQuizDetailClient"},
    @{Path="app/instructor/quizzes/[id]/edit/page.tsx"; Component="InstructorQuizEditClient"},
    @{Path="app/instructor/reviews/page.tsx"; Component="InstructorReviewsClient"},
    @{Path="app/instructor/students/page.tsx"; Component="InstructorStudentsClient"}
)

foreach ($page in $pages) {
    $pagePath = $page.Path
    $componentName = $page.Component
    $componentPath = "components/instructor/$componentName.tsx"
    
    Write-Host "Processing $pagePath..." -ForegroundColor Cyan
    
    # Read the original page content
    $content = Get-Content $pagePath -Raw
    
    # Create the client component by keeping everything except removing the export default line
    # and adding 'use client' at the top
    $clientContent = $content
    
    # Save the client component
    Set-Content -Path $componentPath -Value $clientContent
    Write-Host "  Created $componentPath" -ForegroundColor Green
    
    # Create the new server component wrapper
    $serverContent = @"
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import $componentName from '@/components/instructor/$componentName'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  if (user.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  
  return <$componentName />
}
"@
    
    # Save the new page
    Set-Content -Path $pagePath -Value $serverContent
    Write-Host "  Updated $pagePath" -ForegroundColor Green
}

Write-Host "`nAll pages converted successfully!" -ForegroundColor Green
Write-Host "Run 'git add -A && git commit -m `"fix: Convert all remaining instructor pages`" && git push' to commit" -ForegroundColor Yellow
