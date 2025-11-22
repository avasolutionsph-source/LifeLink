-- BloodSync Mock Data for Demo
-- Run this after schema.sql

USE bloodsync_db;

-- Insert Admin Account (Password: admin123 - hashed with bcrypt)
INSERT INTO Admins (Username, Password, Full_Name, Email) VALUES
('admin', '$2a$10$8K1p/a0dL3gzY5nJ5J5J5.K5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', 'System Administrator', 'admin@bloodsync.ph');
-- Note: In production, password hash will be: $2a$10$YourActualBcryptHashHere

-- Insert Naga City Hospitals
INSERT INTO Hospitals (Hospital_Name, Address, Contact, Email) VALUES
('Bicol Medical Center', 'Concepcion Pequeña, Naga City', '(054) 472-2400', 'info@bicolmedicalcenter.ph'),
('Mother Seton Hospital', 'Brgy. Del Rosario, Naga City', '(054) 472-6173', 'info@mothersetonhospital.ph'),
('St. John Hospital', 'P. Burgos St., Naga City', '(054) 811-3000', 'info@stjohnhospital.ph'),
('Naga City Hospital', 'Penafrancia Ave., Naga City', '(054) 473-9110', 'info@nagacityhospital.ph'),
('NICC Doctors Hospital', 'Roxas Ave., Naga City', '(054) 473-8093', 'info@niccdoctors.ph');

-- Insert Mock Donors (Various ages and blood types)
INSERT INTO Donors (First_Name, Last_Name, Blood_Type, Date_Of_Birth, Gender, Contact_Number, Email, Address, Last_Donation_Date, Eligibility_Status) VALUES
('Juan', 'Dela Cruz', 'O+', '1990-03-15', 'Male', '09171234567', 'juan.delacruz@email.com', 'Brgy. Concepcion Grande, Naga City', '2024-09-15', 'Eligible'),
('Maria', 'Santos', 'A+', '1985-07-22', 'Female', '09181234567', 'maria.santos@email.com', 'Brgy. Triangulo, Naga City', '2024-10-01', 'Eligible'),
('Pedro', 'Reyes', 'B+', '1992-11-08', 'Male', '09191234567', 'pedro.reyes@email.com', 'Brgy. Sabang, Naga City', '2024-08-20', 'Eligible'),
('Ana', 'Garcia', 'AB+', '1988-05-30', 'Female', '09201234567', 'ana.garcia@email.com', 'Brgy. Dayangdang, Naga City', '2024-09-10', 'Eligible'),
('Jose', 'Mendoza', 'O-', '1995-02-14', 'Male', '09211234567', 'jose.mendoza@email.com', 'Brgy. Liboton, Naga City', '2024-10-15', 'Eligible'),
('Luz', 'Fernandez', 'A-', '1987-09-25', 'Female', '09221234567', 'luz.fernandez@email.com', 'Brgy. San Felipe, Naga City', '2024-07-30', 'Eligible'),
('Carlos', 'Villanueva', 'B-', '1993-12-03', 'Male', '09231234567', 'carlos.v@email.com', 'Brgy. Abella, Naga City', '2024-08-05', 'Eligible'),
('Rosa', 'Torres', 'AB-', '1991-04-18', 'Female', '09241234567', 'rosa.torres@email.com', 'Brgy. Carolina, Naga City', '2024-09-25', 'Eligible'),
('Miguel', 'Ramos', 'O+', '1989-06-12', 'Male', '09251234567', 'miguel.ramos@email.com', 'Brgy. Pacol, Naga City', '2024-10-20', 'Eligible'),
('Elena', 'Cruz', 'A+', '1994-08-27', 'Female', '09261234567', 'elena.cruz@email.com', 'Brgy. Lerma, Naga City', '2024-09-30', 'Eligible'),
('Roberto', 'Diaz', 'B+', '1986-01-09', 'Male', '09271234567', 'roberto.diaz@email.com', 'Brgy. Peñafrancia, Naga City', '2024-08-15', 'Eligible'),
('Carmen', 'Lopez', 'O+', '1990-10-21', 'Female', '09281234567', 'carmen.lopez@email.com', 'Brgy. Dinaga, Naga City', '2024-10-10', 'Eligible'),
('Antonio', 'Aquino', 'A-', '1992-03-05', 'Male', '09291234567', 'antonio.a@email.com', 'Brgy. Mabolo, Naga City', '2024-09-05', 'Eligible'),
('Sofia', 'Rivera', 'AB+', '1988-11-30', 'Female', '09301234567', 'sofia.rivera@email.com', 'Brgy. Balatas, Naga City', '2024-10-25', 'Eligible'),
('Diego', 'Morales', 'O-', '1991-07-16', 'Male', '09311234567', 'diego.morales@email.com', 'Brgy. Calauag, Naga City', '2024-09-20', 'Eligible');

-- Insert Blood Inventory (Various blood types with different expiry dates)
INSERT INTO Blood_Inventory (Blood_Type, Quantity, Collection_Date, Expiry_Date, Status, Hospital_ID) VALUES
-- Bicol Medical Center
('O+', 15, '2024-10-01', '2024-12-30', 'Available', 1),
('O-', 8, '2024-10-05', '2025-01-03', 'Available', 1),
('A+', 12, '2024-10-10', '2025-01-08', 'Available', 1),
('A-', 5, '2024-10-15', '2025-01-13', 'Available', 1),
('B+', 10, '2024-10-08', '2025-01-06', 'Available', 1),
('B-', 3, '2024-10-12', '2025-01-10', 'Available', 1),
('AB+', 7, '2024-10-20', '2025-01-18', 'Available', 1),
('AB-', 2, '2024-10-18', '2025-01-16', 'Available', 1),

-- Mother Seton Hospital
('O+', 18, '2024-10-03', '2025-01-01', 'Available', 2),
('A+', 14, '2024-10-07', '2025-01-05', 'Available', 2),
('B+', 9, '2024-10-11', '2025-01-09', 'Available', 2),
('AB+', 6, '2024-10-16', '2025-01-14', 'Available', 2),
('O-', 7, '2024-10-22', '2025-01-20', 'Available', 2),

-- St. John Hospital
('O+', 20, '2024-10-02', '2024-12-31', 'Available', 3),
('A+', 11, '2024-10-09', '2025-01-07', 'Available', 3),
('B+', 8, '2024-10-14', '2025-01-12', 'Available', 3),
('O-', 5, '2024-10-19', '2025-01-17', 'Available', 3),

-- Naga City Hospital
('O+', 16, '2024-10-04', '2025-01-02', 'Available', 4),
('A+', 13, '2024-10-06', '2025-01-04', 'Available', 4),
('B+', 10, '2024-10-13', '2025-01-11', 'Available', 4),
('AB+', 4, '2024-10-17', '2025-01-15', 'Available', 4),

-- NICC Doctors Hospital
('O+', 17, '2024-10-05', '2025-01-03', 'Available', 5),
('A+', 12, '2024-10-11', '2025-01-09', 'Available', 5),
('O-', 6, '2024-10-15', '2025-01-13', 'Available', 5),

-- Some expiring soon (for alerts)
('A+', 5, '2024-09-01', '2024-11-30', 'Available', 1),
('B+', 3, '2024-09-05', '2024-12-04', 'Available', 2),

-- Some reserved/used
('O+', 2, '2024-10-01', '2024-12-30', 'Reserved', 1),
('A+', 1, '2024-09-15', '2024-12-14', 'Used', 3);

-- Insert Donation Records
INSERT INTO Donation_Records (Donor_ID, Hospital_ID, Donation_Date, Blood_Type, Units_Donated, Health_Status, Notes) VALUES
(1, 1, '2024-09-15', 'O+', 1, 'Good', 'Regular donor'),
(2, 2, '2024-10-01', 'A+', 1, 'Good', 'First-time donor'),
(3, 3, '2024-08-20', 'B+', 1, 'Good', 'Regular donor'),
(4, 1, '2024-09-10', 'AB+', 1, 'Good', 'Excellent health'),
(5, 4, '2024-10-15', 'O-', 1, 'Good', 'Universal donor'),
(6, 2, '2024-07-30', 'A-', 1, 'Good', 'Regular donor'),
(7, 5, '2024-08-05', 'B-', 1, 'Good', 'Healthy donor'),
(8, 3, '2024-09-25', 'AB-', 1, 'Good', 'Rare blood type'),
(9, 1, '2024-10-20', 'O+', 1, 'Good', 'Regular contributor'),
(10, 2, '2024-09-30', 'A+', 1, 'Good', 'Great donor'),
(11, 4, '2024-08-15', 'B+', 1, 'Good', 'Regular donor'),
(12, 5, '2024-10-10', 'O+', 1, 'Good', 'Consistent donor'),
(13, 3, '2024-09-05', 'A-', 1, 'Good', 'Regular donor'),
(14, 1, '2024-10-25', 'AB+', 1, 'Good', 'Excellent condition'),
(15, 2, '2024-09-20', 'O-', 1, 'Good', 'Universal donor'),
(1, 2, '2024-06-10', 'O+', 1, 'Good', 'Previous donation'),
(2, 1, '2024-07-05', 'A+', 1, 'Good', 'Second donation'),
(5, 3, '2024-08-01', 'O-', 1, 'Good', 'Regular schedule'),
(9, 4, '2024-07-15', 'O+', 1, 'Good', 'Frequent donor'),
(12, 5, '2024-08-25', 'O+', 1, 'Good', 'Regular donor');

-- Insert Blood Requests (Mix of Pending, Approved, and Completed)
INSERT INTO Blood_Requests (Hospital_ID, Blood_Type, Units_Requested, Urgency_Level, Required_By_Date, Status, Notes) VALUES
-- Pending Requests
(1, 'O+', 5, 'High', '2024-12-01', 'Pending', 'Emergency surgery scheduled'),
(2, 'A+', 3, 'Medium', '2024-12-05', 'Pending', 'Regular inventory replenishment'),
(3, 'B+', 2, 'Low', '2024-12-10', 'Pending', 'Planned procedure'),
(4, 'O-', 4, 'Critical', '2024-11-25', 'Pending', 'Trauma patient - urgent'),
(5, 'AB+', 1, 'Medium', '2024-12-03', 'Pending', 'Surgical preparation'),

-- Approved Requests
(1, 'A-', 2, 'High', '2024-11-28', 'Approved', 'Approved for transfer'),
(2, 'B+', 3, 'Medium', '2024-11-30', 'Approved', 'Ready for pickup'),
(3, 'O+', 6, 'High', '2024-11-27', 'Approved', 'Emergency approved'),

-- Completed Requests
(4, 'A+', 4, 'Medium', '2024-10-15', 'Completed', 'Successfully delivered'),
(5, 'O+', 5, 'High', '2024-10-10', 'Completed', 'Emergency fulfilled'),
(1, 'B-', 1, 'Low', '2024-10-20', 'Completed', 'Routine request completed'),
(2, 'AB+', 2, 'Medium', '2024-10-25', 'Completed', 'Delivered on time'),
(3, 'O-', 3, 'Critical', '2024-10-05', 'Completed', 'Critical case - resolved');

-- Update approval and completion dates for approved/completed requests
UPDATE Blood_Requests SET Approved_By = 1, Approval_Date = '2024-11-20 10:30:00' WHERE Status IN ('Approved', 'Completed');
UPDATE Blood_Requests SET Completion_Date = '2024-10-15 14:00:00' WHERE Request_ID = 9;
UPDATE Blood_Requests SET Completion_Date = '2024-10-10 09:15:00' WHERE Request_ID = 10;
UPDATE Blood_Requests SET Completion_Date = '2024-10-20 16:45:00' WHERE Request_ID = 11;
UPDATE Blood_Requests SET Completion_Date = '2024-10-25 11:30:00' WHERE Request_ID = 12;
UPDATE Blood_Requests SET Completion_Date = '2024-10-05 08:00:00' WHERE Request_ID = 13;
