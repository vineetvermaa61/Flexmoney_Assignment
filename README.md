# Yoga Admission Project

[User]
  - user_id (PK)
  - name
  - age
  - email
  - phone
  - password
  - createdAt

[Enrollment]
  - enrollment_id (PK)
  - user_id (FK to User)
  - batch (6-7AM, 7-8AM, 8-9AM, 5-6PM)
  - enrollmentDate

[Payment]
  - payment_id (PK)
  - user_id (FK to User)
  - enrollment_id (FK to Enrollment)
  - amount (default 500)
  - transactionId
  - status (success/failed)
  - paymentDate
