# Indo American School Firestore Security Specification

## 1. Data Invariants
1. A user document in `/users/{userId}` can only be created with `role == 'student'` unless the user presents a valid unused `/teacherInvitations/{code}` or is the bootstrapped admin email (`komaljamui26@gmail.com` with `email_verified == true`). Students can never self-assign `'teacher'` or `'admin'`.
2. PII (`email`) resides strictly in `/users/{userId}` and `/contactMessages/{messageId}`, readable only by the document owner or admin.
3. Teacher privileges (`isApprovedTeacher()`) require `/users/{request.auth.uid}` to have `role == 'teacher'` and `teacherStatus == 'approved'`.
4. Every `quizAttempts` and `lessonProgress` write enforces `incoming().userId == request.auth.uid` and server timestamp `request.time`.
5. Every `discussions/{discussionId}/replies/{replyId}` write verifies the parent `/discussions/{discussionId}` exists (Master Gate).
6. Student assignment submissions cannot set `status: 'graded'`, `marks`, or `feedback`; only approved teachers or admins can grade submissions.
7. Terminal lock: once a teacher invitation is `used == true`, it cannot be reused or modified by non-admins.

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Self-Assigned Admin**: `POST /users/{uid}` with `{ role: 'admin', teacherStatus: 'approved', ... }` -> DENIED.
2. **Self-Assigned Teacher Without Invite**: `POST /users/{uid}` with `{ role: 'teacher', teacherStatus: 'approved', ... }` -> DENIED.
3. **Shadow Update on User Role**: `PATCH /users/{uid}` changing `role` from `'student'` to `'teacher'` -> DENIED.
4. **Cross-User PII Read**: Non-admin user calls `GET /users/{otherUid}` -> DENIED.
5. **Unscoped List Scraping on Users**: Non-admin user calls `LIST /users` -> DENIED.
6. **Ghost Field Injection**: `POST /personalNotes/{id}` with extra `{ isVerified: true }` -> DENIED (`hasOnly` check).
7. **ID Poisoning**: `POST /personalNotes/{1500_char_junk_id}` -> DENIED (`isValidId` check).
8. **Spoofed Quiz Attempt Owner**: Student A creates `/quizAttempts/{id}` with `userId: studentB` -> DENIED.
9. **Client Timestamp Forgery**: Creating `/quizAttempts/{id}` with backdated `createdAt` not equal to `request.time` -> DENIED.
10. **Student Self-Grading Submission**: Student updates `/submissions/{id}` setting `status: 'graded', marks: 100` -> DENIED.
11. **Orphaned Discussion Reply**: Creating `/discussions/nonexistent/replies/r1` -> DENIED (`exists` parent check).
12. **Unverified Email Spoof**: Request with `email: 'komaljamui26@gmail.com'` and `email_verified: false` -> DENIED.
