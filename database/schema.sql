-- BloodSync Blood Donation Management System
-- Database Schema with Mock Data

CREATE DATABASE IF NOT EXISTS bloodsync_db;
USE bloodsync_db;

-- Drop tables if exist (for fresh install)
DROP TABLE IF EXISTS Blood_Requests;
DROP TABLE IF EXISTS Donation_Records;
DROP TABLE IF EXISTS Blood_Inventory;
DROP TABLE IF EXISTS Donors;
DROP TABLE IF EXISTS Hospitals;
DROP TABLE IF EXISTS Admins;

-- Admins Table
CREATE TABLE Admins (
    Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Full_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals Table
CREATE TABLE Hospitals (
    Hospital_ID INT AUTO_INCREMENT PRIMARY KEY,
    Hospital_Name VARCHAR(200) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Contact VARCHAR(50),
    Email VARCHAR(100),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors Table
CREATE TABLE Donors (
    Donor_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Date_Of_Birth DATE NOT NULL,
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Contact_Number VARCHAR(20),
    Email VARCHAR(100),
    Address VARCHAR(255),
    Medical_History TEXT,
    Last_Donation_Date DATE,
    Eligibility_Status ENUM('Eligible', 'Temporarily Ineligible', 'Permanently Ineligible') DEFAULT 'Eligible',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Inventory Table
CREATE TABLE Blood_Inventory (
    Unit_ID INT AUTO_INCREMENT PRIMARY KEY,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    Collection_Date DATE NOT NULL,
    Expiry_Date DATE NOT NULL,
    Status ENUM('Available', 'Reserved', 'Expired', 'Used') DEFAULT 'Available',
    Hospital_ID INT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL
);

-- Donation Records Table
CREATE TABLE Donation_Records (
    Donation_ID INT AUTO_INCREMENT PRIMARY KEY,
    Donor_ID INT NOT NULL,
    Hospital_ID INT,
    Donation_Date DATE NOT NULL,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Units_Donated INT DEFAULT 1,
    Health_Status VARCHAR(100),
    Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Donor_ID) REFERENCES Donors(Donor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL
);

-- Blood Requests Table
CREATE TABLE Blood_Requests (
    Request_ID INT AUTO_INCREMENT PRIMARY KEY,
    Hospital_ID INT NOT NULL,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Units_Requested INT NOT NULL,
    Urgency_Level ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    Request_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Required_By_Date DATE,
    Status ENUM('Pending', 'Approved', 'Completed', 'Rejected') DEFAULT 'Pending',
    Approved_By INT,
    Approval_Date TIMESTAMP NULL,
    Completion_Date TIMESTAMP NULL,
    Notes TEXT,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE CASCADE,
    FOREIGN KEY (Approved_By) REFERENCES Admins(Admin_ID) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_donor_blood_type ON Donors(Blood_Type);
CREATE INDEX idx_inventory_blood_type ON Blood_Inventory(Blood_Type);
CREATE INDEX idx_inventory_status ON Blood_Inventory(Status);
CREATE INDEX idx_request_status ON Blood_Requests(Status);
CREATE INDEX idx_donation_date ON Donation_Records(Donation_Date);
