-- Create Admin User in Database
-- Run this SQL in your PostgreSQL database or Prisma Studio

-- First, check if user exists
SELECT * FROM "User" WHERE email = 'admin@koraanlearn.com';

-- If user doesn't exist, create it
-- Note: You still need to create this user in Clerk Dashboard first!
INSERT INTO "User" (
  id,
  "clerkId",
  email,
  "firstName",
  "lastName",
  role,
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'manual_admin_' || extract(epoch from now())::text,
  'admin@koraanlearn.com',
  'Admin',
  'KoraanLearn',
  'ADMIN',
  true,
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'ADMIN',
  "isActive" = true;

-- Or if user already exists, just update the role to ADMIN
UPDATE "User" 
SET role = 'ADMIN', "isActive" = true
WHERE email = 'admin@koraanlearn.com';

-- Verify the admin user
SELECT id, email, "firstName", "lastName", role, "isActive" 
FROM "User" 
WHERE email = 'admin@koraanlearn.com';

-- You can also update any existing user to be admin by email
-- UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
