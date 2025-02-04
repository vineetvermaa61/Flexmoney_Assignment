# Yoga Admission Project
This project is a web application for managing Yoga class admissions. It allows users to register, select a batch, and process payments for a monthly fee of Rs 500. Built with React for the frontend and a REST API backend, it validates user data, stores details in a database, and integrates a mock payment function.

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


Screenshots

![alt text](/Screenshots/1.png)
![alt text](/Screenshots/2.png)
![alt text](/Screenshots/3.png)
![alt text](/Screenshots/4.png)
![alt text](/Screenshots/5.png)