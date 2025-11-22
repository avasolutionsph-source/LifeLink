-- LifeLink Life-Saving Donation Network
-- Database Schema - Blood, Organs, and Tissues Management System
-- Naga City, Camarines Sur, Philippines

CREATE DATABASE IF NOT EXISTS lifelink_db;
USE lifelink_db;

-- Drop tables if exist (for fresh install)
DROP TABLE IF EXISTS ConsentRecords;
DROP TABLE IF EXISTS RecipientPriority;
DROP TABLE IF EXISTS TissueBank;
DROP TABLE IF EXISTS OrganRegistry;
DROP TABLE IF EXISTS Blood_Requests;
DROP TABLE IF EXISTS Donation_Records;
DROP TABLE IF EXISTS Blood_Inventory;
DROP TABLE IF EXISTS Donors;
DROP TABLE IF EXISTS Hospitals;
DROP TABLE IF EXISTS Admins;

-- ======================
-- CORE SYSTEM TABLES
-- ======================

-- Admins Table
CREATE TABLE Admins (
    Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Full_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    Role ENUM('Super Admin', 'Hospital Admin', 'Coordinator') DEFAULT 'Coordinator',
    Hospital_ID INT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Last_Login TIMESTAMP NULL
);

-- Hospitals Table - Real Naga City Hospitals
CREATE TABLE Hospitals (
    Hospital_ID INT AUTO_INCREMENT PRIMARY KEY,
    Hospital_Name VARCHAR(200) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Contact VARCHAR(50),
    Email VARCHAR(100),
    Type ENUM('Government', 'Private', 'Specialized') DEFAULT 'Government',
    Blood_Bank_Certified BOOLEAN DEFAULT FALSE,
    Organ_Transplant_Certified BOOLEAN DEFAULT FALSE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- DONOR MANAGEMENT
-- ======================

-- Enhanced Donors Table with Extended Medical History
CREATE TABLE Donors (
    Donor_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Middle_Name VARCHAR(50),
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Date_Of_Birth DATE NOT NULL,
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Contact_Number VARCHAR(20),
    Email VARCHAR(100),
    Address VARCHAR(255),
    City VARCHAR(100) DEFAULT 'Naga City',
    Province VARCHAR(100) DEFAULT 'Camarines Sur',

    -- Extended Medical History
    Weight_KG DECIMAL(5,2),
    Height_CM DECIMAL(5,2),
    Medical_Conditions TEXT,
    Current_Medications TEXT,
    Allergies TEXT,
    Previous_Surgeries TEXT,
    Smoking_Status ENUM('Never', 'Former', 'Current') DEFAULT 'Never',
    Alcohol_Consumption ENUM('None', 'Occasional', 'Regular') DEFAULT 'None',

    -- Donation Preferences
    Willing_Blood_Donor BOOLEAN DEFAULT TRUE,
    Willing_Organ_Donor BOOLEAN DEFAULT FALSE,
    Willing_Tissue_Donor BOOLEAN DEFAULT FALSE,
    Organs_Willing_To_Donate TEXT,
    Tissues_Willing_To_Donate TEXT,

    -- Status Fields
    Last_Blood_Donation_Date DATE,
    Blood_Eligibility_Status ENUM('Eligible', 'Temporarily Ineligible', 'Permanently Ineligible') DEFAULT 'Eligible',
    Organ_Donor_Status ENUM('Registered', 'Active', 'Matched', 'Donated', 'Deceased', 'Inactive') DEFAULT 'Inactive',

    -- Compliance
    Consent_Signed BOOLEAN DEFAULT FALSE,
    Consent_Date DATE,
    Next_Of_Kin_Name VARCHAR(100),
    Next_Of_Kin_Contact VARCHAR(20),

    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- BLOOD MANAGEMENT
-- ======================

-- Blood Inventory Table
CREATE TABLE Blood_Inventory (
    Unit_ID INT AUTO_INCREMENT PRIMARY KEY,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    Collection_Date DATE NOT NULL,
    Expiry_Date DATE NOT NULL,
    Status ENUM('Available', 'Reserved', 'Expired', 'Used', 'Quarantine') DEFAULT 'Available',
    Hospital_ID INT,
    Donor_ID INT NULL,
    Storage_Location VARCHAR(100),
    Temperature_Log TEXT,
    Quality_Check_Passed BOOLEAN DEFAULT TRUE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL,
    FOREIGN KEY (Donor_ID) REFERENCES Donors(Donor_ID) ON DELETE SET NULL
);

-- Donation Records Table
CREATE TABLE Donation_Records (
    Donation_ID INT AUTO_INCREMENT PRIMARY KEY,
    Donor_ID INT NOT NULL,
    Hospital_ID INT,
    Donation_Type ENUM('Blood', 'Organ', 'Tissue') DEFAULT 'Blood',
    Donation_Date DATE NOT NULL,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    Units_Donated INT DEFAULT 1,
    Health_Status VARCHAR(100),
    Pre_Donation_Screening_Passed BOOLEAN DEFAULT TRUE,
    Post_Donation_Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Donor_ID) REFERENCES Donors(Donor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL
);

-- Blood/Organ Requests Table (Enhanced)
CREATE TABLE Blood_Requests (
    Request_ID INT AUTO_INCREMENT PRIMARY KEY,
    Hospital_ID INT NOT NULL,
    Request_Type ENUM('Blood', 'Organ', 'Tissue') DEFAULT 'Blood',
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    Units_Requested INT NOT NULL,
    Urgency_Level ENUM('Low', 'Medium', 'High', 'Critical', 'Life-Threatening') DEFAULT 'Medium',
    Request_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Required_By_Date DATE,
    Patient_Condition TEXT,
    Status ENUM('Pending', 'Approved', 'Completed', 'Rejected', 'Transferred') DEFAULT 'Pending',
    Approved_By INT,
    Approval_Date TIMESTAMP NULL,
    Completion_Date TIMESTAMP NULL,
    Transfer_To_Hospital_ID INT NULL,
    Notes TEXT,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE CASCADE,
    FOREIGN KEY (Approved_By) REFERENCES Admins(Admin_ID) ON DELETE SET NULL,
    FOREIGN KEY (Transfer_To_Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL
);

-- ======================
-- ORGAN MANAGEMENT (NEW)
-- ======================

-- Organ Registry Table
CREATE TABLE OrganRegistry (
    Organ_ID INT AUTO_INCREMENT PRIMARY KEY,
    Donor_ID INT NOT NULL,
    Organ_Type ENUM('Heart', 'Liver', 'Kidney', 'Lung', 'Pancreas', 'Small Intestine', 'Cornea') NOT NULL,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    HLA_Typing VARCHAR(255),
    Organ_Status ENUM('Available', 'Matched', 'Transplanted', 'Expired', 'Unsuitable') DEFAULT 'Available',

    -- Donor Information
    Donor_Age INT,
    Donor_Weight_KG DECIMAL(5,2),
    Donor_Height_CM DECIMAL(5,2),
    Cause_Of_Death VARCHAR(255),
    Death_Date DATETIME,

    -- Organ Viability
    Retrieval_Date DATETIME,
    Ischemia_Time_Minutes INT,
    Quality_Assessment TEXT,
    Viable_Until DATETIME,

    -- Matching and Allocation
    Recipient_ID INT NULL,
    Match_Score DECIMAL(5,2),
    Allocated_Hospital_ID INT,
    Transplant_Date DATETIME NULL,
    Transplant_Outcome ENUM('Successful', 'Rejected', 'Complications', 'Failed') NULL,

    Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (Donor_ID) REFERENCES Donors(Donor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Allocated_Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL
);

-- ======================
-- TISSUE MANAGEMENT (NEW)
-- ======================

-- Tissue Bank Table
CREATE TABLE TissueBank (
    Tissue_ID INT AUTO_INCREMENT PRIMARY KEY,
    Tissue_Type ENUM('Cornea', 'Skin Graft', 'Bone Graft', 'Heart Valve', 'Blood Vessel', 'Tendon', 'Cartilage') NOT NULL,
    Donor_ID INT NULL,
    Collection_Date DATE NOT NULL,
    Processing_Date DATE,
    Expiry_Date DATE NOT NULL,

    -- Storage Information
    Storage_Location VARCHAR(100),
    Storage_Temperature_C DECIMAL(5,2),
    Batch_Number VARCHAR(50),

    -- Quality Control
    Sterility_Test_Passed BOOLEAN DEFAULT TRUE,
    Quality_Grade ENUM('Excellent', 'Good', 'Fair', 'Poor') DEFAULT 'Good',

    -- Status
    Status ENUM('Available', 'Reserved', 'Used', 'Expired', 'Quarantine', 'Rejected') DEFAULT 'Available',
    Hospital_ID INT,
    Recipient_ID INT NULL,

    -- Usage
    Usage_Date DATETIME NULL,
    Usage_Outcome TEXT,

    Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (Donor_ID) REFERENCES Donors(Donor_ID) ON DELETE SET NULL,
    FOREIGN KEY (Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL
);

-- ======================
-- RECIPIENT/WAITLIST MANAGEMENT (NEW)
-- ======================

-- Recipient Priority Table
CREATE TABLE RecipientPriority (
    Recipient_ID INT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    Middle_Name VARCHAR(50),
    Date_Of_Birth DATE NOT NULL,
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    Blood_Type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    HLA_Typing VARCHAR(255),

    -- Contact
    Contact_Number VARCHAR(20),
    Email VARCHAR(100),
    Address VARCHAR(255),

    -- Medical Information
    Needed_Organ_Type ENUM('Heart', 'Liver', 'Kidney', 'Lung', 'Pancreas', 'Small Intestine', 'Cornea'),
    Needed_Tissue_Type ENUM('Cornea', 'Skin Graft', 'Bone Graft', 'Heart Valve', 'Blood Vessel', 'Tendon', 'Cartilage'),
    Medical_Condition TEXT,
    Diagnosis_Date DATE,
    Current_Hospital_ID INT,
    Treating_Physician VARCHAR(100),

    -- Priority Scoring
    Urgency_Score INT DEFAULT 0 CHECK (Urgency_Score BETWEEN 0 AND 100),
    Wait_Time_Days INT DEFAULT 0,
    Medical_Urgency ENUM('Elective', 'Routine', 'Urgent', 'Critical', 'Life-Threatening') DEFAULT 'Routine',
    Priority_Points INT DEFAULT 0,

    -- Waitlist Status
    Waitlist_Status ENUM('Active', 'Matched', 'Transplanted', 'Removed', 'Deceased', 'Inactive') DEFAULT 'Active',
    Waitlist_Entry_Date DATE NOT NULL,
    Matched_Date DATE NULL,
    Transplant_Date DATE NULL,
    Outcome TEXT,

    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (Current_Hospital_ID) REFERENCES Hospitals(Hospital_ID) ON DELETE SET NULL
);

-- ======================
-- CONSENT & COMPLIANCE (NEW)
-- ======================

-- Consent Records Table
CREATE TABLE ConsentRecords (
    Consent_ID INT AUTO_INCREMENT PRIMARY KEY,
    Donor_ID INT NULL,
    Recipient_ID INT NULL,
    Consent_Type ENUM('Blood Donation', 'Organ Donation', 'Tissue Donation', 'Organ Receipt', 'Tissue Receipt', 'General') NOT NULL,

    -- Legal Information
    Consent_Given BOOLEAN DEFAULT FALSE,
    Consent_Date DATE NOT NULL,
    Consent_Form_Number VARCHAR(50),
    Witnessed_By VARCHAR(100),
    Witness_Contact VARCHAR(20),

    -- Specific Authorizations
    Authorized_Blood_Types TEXT,
    Authorized_Organs TEXT,
    Authorized_Tissues TEXT,

    -- Next of Kin (for deceased donors)
    Next_Of_Kin_Name VARCHAR(100),
    Next_Of_Kin_Relationship VARCHAR(50),
    Next_Of_Kin_Contact VARCHAR(20),
    Next_Of_Kin_Consent_Given BOOLEAN DEFAULT FALSE,

    -- Revocation
    Revoked BOOLEAN DEFAULT FALSE,
    Revocation_Date DATE NULL,
    Revocation_Reason TEXT,

    -- Compliance Flags
    RA_7719_Compliant BOOLEAN DEFAULT TRUE COMMENT 'Blood Services Act',
    Data_Privacy_Act_Compliant BOOLEAN DEFAULT TRUE COMMENT 'Data Privacy Act of 2012',
    HIPAA_Style_Compliant BOOLEAN DEFAULT TRUE,

    -- Document Storage
    Document_Path VARCHAR(255),
    Digital_Signature TEXT,

    Notes TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (Donor_ID) REFERENCES Donors(Donor_ID) ON DELETE CASCADE,
    FOREIGN KEY (Recipient_ID) REFERENCES RecipientPriority(Recipient_ID) ON DELETE CASCADE
);

-- ======================
-- INDEXES FOR PERFORMANCE
-- ======================

-- Donors
CREATE INDEX idx_donor_blood_type ON Donors(Blood_Type);
CREATE INDEX idx_donor_organ_status ON Donors(Organ_Donor_Status);
CREATE INDEX idx_donor_city ON Donors(City);

-- Blood Inventory
CREATE INDEX idx_inventory_blood_type ON Blood_Inventory(Blood_Type);
CREATE INDEX idx_inventory_status ON Blood_Inventory(Status);
CREATE INDEX idx_inventory_expiry ON Blood_Inventory(Expiry_Date);
CREATE INDEX idx_inventory_hospital ON Blood_Inventory(Hospital_ID);

-- Requests
CREATE INDEX idx_request_status ON Blood_Requests(Status);
CREATE INDEX idx_request_urgency ON Blood_Requests(Urgency_Level);
CREATE INDEX idx_request_type ON Blood_Requests(Request_Type);
CREATE INDEX idx_request_date ON Blood_Requests(Request_Date);

-- Donations
CREATE INDEX idx_donation_date ON Donation_Records(Donation_Date);
CREATE INDEX idx_donation_type ON Donation_Records(Donation_Type);

-- Organs
CREATE INDEX idx_organ_type ON OrganRegistry(Organ_Type);
CREATE INDEX idx_organ_status ON OrganRegistry(Organ_Status);
CREATE INDEX idx_organ_blood_type ON OrganRegistry(Blood_Type);
CREATE INDEX idx_organ_retrieval_date ON OrganRegistry(Retrieval_Date);

-- Tissues
CREATE INDEX idx_tissue_type ON TissueBank(Tissue_Type);
CREATE INDEX idx_tissue_status ON TissueBank(Status);
CREATE INDEX idx_tissue_expiry ON TissueBank(Expiry_Date);

-- Recipients
CREATE INDEX idx_recipient_blood_type ON RecipientPriority(Blood_Type);
CREATE INDEX idx_recipient_status ON RecipientPriority(Waitlist_Status);
CREATE INDEX idx_recipient_urgency ON RecipientPriority(Medical_Urgency);
CREATE INDEX idx_recipient_organ_type ON RecipientPriority(Needed_Organ_Type);

-- Consent
CREATE INDEX idx_consent_donor ON ConsentRecords(Donor_ID);
CREATE INDEX idx_consent_recipient ON ConsentRecords(Recipient_ID);
CREATE INDEX idx_consent_type ON ConsentRecords(Consent_Type);
