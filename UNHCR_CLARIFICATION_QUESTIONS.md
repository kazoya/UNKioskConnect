# UNHCR Kiosk Requirements - Clarification Questions

**Status:** Submitted - Awaiting Response  
**Date Submitted:** [Date]  
**Purpose:** This document contains all clarification questions submitted to UNHCR regarding kiosk requirements to ensure accurate implementation.

---

## 1. Biometrics Verification Questions

### 1.1 Biometric Type
- What is the exact type of biometric verification required?
- IRIS (required per TOR) — but should Face Recognition also be supported?
- What are the required iris camera specifications? (Resolution, distance, capture speed, lighting level)
- Is there a preferred technical provider or SDK for integration (e.g., IrisID, Iritech)?
- Should the kiosk support adding additional modalities later such as Fingerprint or Face Recognition?

---

## 2. Camera and Document Image Questions

### 2.1 Personal Photo Camera
- Requirements for personal photo capture camera (resolution, specifications, ICAO standards?)
- Specifications for document camera/scanner (ID, Passport) — should MRZ be supported?
- Should the image be sent as RAW or after specific processing?

---

## 3. Workflow Questions

### 3.1 User Workflow
- What is the expected practical scenario for the user when using the kiosk?
- Biometric verification → Photo capture → Document upload → Data review → Printing
- Is there a predefined workflow from your side?
- What is performed on the kiosk and what is performed on the server?

---

## 4. Integration Questions

### 4.1 System Integration
- What are the target UNHCR systems for integration?
- Will API Documentation be provided?
- Should SSO be supported? What protocol (OAuth2 / SAML)?
- What encryption levels are required (TLS version, hashing standards...)?
- Should Audit Logs be recorded on the kiosk itself or on the server only?

---

## 5. Printer Questions

### 5.1 Document Printing
- What are the specifications for documents required to be printed? (UNHCR documents)
- Is the print format fixed (Template) or variable?
- Should the printer be:
  - Laser or Thermal?
  - Full A4 only or other sizes?

---

## 6. UI/UX Questions

### 6.1 Interface Design
- Is there a ready-made design from UNHCR that must be adhered to?
- Does the interface need:
  - Night mode?
  - Support for elderly users?
  - Support for people with disabilities (Voice Guidance)?

---

## 7. Maintenance and Support (O&M) Questions

### 7.1 Service Level Agreement
- What is the required maintenance agreement duration?
- What is the SLA level? (Response time, Resolution time)
- What quantity of spare parts is required to be provided?
- Number of preventive maintenance visits per year?

---

## 8. Scalability Questions

### 8.1 Future Expansion
- Is there a plan to add:
  - New modules?
  - Additional kiosks?
  - New devices (Passport reader, Fingerprint)?

---

## 9. Security Questions

### 9.1 Security Requirements
- Required isolation level on the kiosk (Secure Boot, Encryption at rest)
- Will an external Security Audit be conducted after delivery?
- Data retention policies

---

## Next Steps

Once responses are received from UNHCR:
1. Review and analyze all responses
2. Update system architecture and specifications
3. Implement final adjustments with minimal overhead
4. Conduct final testing and validation
5. Prepare for deployment

---

**Note:** This document is maintained internally and will be updated as responses are received.

