PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS patients (
 id TEXT PRIMARY KEY, medical_record_number TEXT NOT NULL UNIQUE, full_name TEXT NOT NULL,
 gender TEXT CHECK (gender IN ('L','P','X')), birth_date TEXT, phone TEXT,
 status TEXT NOT NULL DEFAULT 'ACTIVE', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(full_name);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE TABLE IF NOT EXISTS appointments (
 id TEXT PRIMARY KEY, patient_id TEXT NOT NULL, doctor_name TEXT NOT NULL, service TEXT NOT NULL,
 appointment_date TEXT NOT NULL, appointment_time TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'SCHEDULED', notes TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (patient_id) REFERENCES patients(id)
);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, action TEXT NOT NULL, entity_type TEXT NOT NULL,
 entity_id TEXT, payload_json TEXT NOT NULL, previous_hash TEXT NOT NULL, event_hash TEXT NOT NULL UNIQUE,
 created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_events(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events(entity_type, entity_id);