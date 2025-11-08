# Society Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All routes (except auth routes) should include authentication middleware in production.

---

## 1. Authentication Routes (`/api/auth`)

### Super Admin Login
- **POST** `/auth/superadmin/send-otp`
  - Body: `{ phoneNumber: "+919999999999" }`
  - Response: OTP sent (currently accepts any OTP)

- **POST** `/auth/superadmin/verify-otp`
  - Body: `{ phoneNumber, otp }`
  - Response: `{ token, userInfo }`

### Building Admin Login
- **POST** `/auth/buildingadmin/send-otp`
  - Body: `{ phoneNumber, buildingId }`

- **POST** `/auth/buildingadmin/verify-otp`
  - Body: `{ phoneNumber, otp, buildingId }`
  - Response: `{ token, userInfo }`

---

## 2. Dashboard Routes (`/api/dashboard`)

- **GET** `/dashboard/stats?buildingId={id}`
  - Returns: Total blocks, units, members, employees, complaints, parking, bills, amenities, events, visitors stats

- **GET** `/dashboard/recent-activities?buildingId={id}&limit=10`
  - Returns: Recent complaints and visitors

---

## 3. Building Settings Routes (`/api/building-settings`)

### Blocks
- **POST** `/building-settings/blocks`
  - Body: `{ blockName, buildingId }`

- **GET** `/building-settings/blocks?buildingId={id}`

- **GET** `/building-settings/blocks/:id`

- **PUT** `/building-settings/blocks/:id`

- **DELETE** `/building-settings/blocks/:id` (soft delete)

### Floors
- **POST** `/building-settings/floors`
  - Body: `{ floorName, blockId }`

- **POST** `/building-settings/floors/bulk`
  - Body: `{ blockId, floorPrefix, numberOfFloors }`

- **GET** `/building-settings/floors?blockId={id}`

- **GET** `/building-settings/floors/:id`

- **PUT** `/building-settings/floors/:id`

- **DELETE** `/building-settings/floors/:id`

### Units
- **POST** `/building-settings/units`
  - Body: `{ unitNumber, unitType, area, floorId, blockId }`

- **GET** `/building-settings/units?blockId={id}&floorId={id}&unitStatus={status}`

- **GET** `/building-settings/units/:id`

- **PUT** `/building-settings/units/:id`

- **DELETE** `/building-settings/units/:id`

### Parking Areas
- **POST** `/building-settings/parking-areas`
  - Body: `{ parkingName, numberOfMemberCar, numberOfMemberBike, numberOfVisitorCar, numberOfVisitorBike, buildingId }`

- **GET** `/building-settings/parking-areas?buildingId={id}`

- **PUT** `/building-settings/parking-areas/:id`

- **DELETE** `/building-settings/parking-areas/:id`

### Parking Spots
- **POST** `/building-settings/parking-spots`
  - Body: `{ parkingAreaId, parkingNumber, parkingType, blockId }`

- **GET** `/building-settings/parking-spots?parkingAreaId={id}&parkingType={type}&status={status}`

---

## 4. Notice Board Routes (`/api/notices`)

- **POST** `/notices`
  - Body: `{ title, description, attachments[], category, priority, buildingId, blockIds[], targetUserType, unitIds[], publishNow, publishDate, expiryDate }`

- **GET** `/notices?buildingId={id}&noticeStatus={status}&category={cat}&priority={pri}`

- **GET** `/notices/:id`

- **PUT** `/notices/:id`

- **PUT** `/notices/:id/publish`

- **DELETE** `/notices/:id`

---

## 5. Amenities Routes (`/api/amenities`)

- **POST** `/amenities`
  - Body: `{ name, description, images[], capacity, amenityType, bookingCharge, bookingType, paymentGateway, advanceBookingDays, requiresApproval, buildingId }`

- **GET** `/amenities?buildingId={id}&amenityType={type}&amenityStatus={status}`

- **GET** `/amenities/:id`

- **PUT** `/amenities/:id`

- **DELETE** `/amenities/:id`

### Amenity Slots
- **POST** `/amenities/slots`
  - Body: `{ amenityId, startTime, endTime, slotStatus }`

- **GET** `/amenities/slots?amenityId={id}`

- **PUT** `/amenities/slots/:id`

- **DELETE** `/amenities/slots/:id`

---

## 6. Committee Members Routes (`/api/committee-members`)

- **POST** `/committee-members`
  - Body: `{ firstName, lastName, countryCodeName, countryCode, phoneNumber, email, committeeType, memberId, buildingId, startDate, endDate }`

- **GET** `/committee-members?buildingId={id}&committeeType={type}&status={status}`

- **GET** `/committee-members/:id`

- **PUT** `/committee-members/:id`

- **PUT** `/committee-members/:id/status`
  - Body: `{ status: "active" | "inactive" }`

- **DELETE** `/committee-members/:id`

---

## 7. Employees Routes (`/api/employees`)

- **POST** `/employees`
  - Body: `{ firstName, lastName, countryCodeName, countryCode, phoneNumber, email, gender, address, dateOfBirth, employeeType, employmentType, agencyDetails, idProofType, idProofNumber, idProofDocument, policeVerificationDocument, shiftTimings, workingDays[], joiningDate, buildingId }`

- **GET** `/employees?buildingId={id}&employeeType={type}&employmentType={type}&status={status}`

- **GET** `/employees/:id`

- **PUT** `/employees/:id`

- **PUT** `/employees/:id/status`
  - Body: `{ status: "active" | "inactive" }`

- **DELETE** `/employees/:id`

---

## 8. Complaints Routes (`/api/complaints`)

- **POST** `/complaints`
  - Body: `{ title, category, priority, description, images[], complaintType, buildingId, unitId, memberId }`

- **GET** `/complaints?buildingId={id}&complaintStatus={status}&category={cat}&priority={pri}&memberId={id}`

- **GET** `/complaints/stats?buildingId={id}`

- **GET** `/complaints/:id`

- **PUT** `/complaints/:id`

- **PUT** `/complaints/:id/status`
  - Body: `{ complaintStatus, assignedToEmployeeId }`

- **POST** `/complaints/:id/follow-up`
  - Body: `{ remarks, nextFollowUpDate, sendEmailNotification }`

- **DELETE** `/complaints/:id`

---

## 9. Parking Routes (`/api/parking`)

- **GET** `/parking/dashboard?buildingId={id}`

- **GET** `/parking/requests?buildingId={id}&assignmentStatus={status}`

- **POST** `/parking/requests`
  - Body: `{ parkingSpotId, vehicleId, memberId, buildingId }`

- **PUT** `/parking/requests/:id/approve`

- **PUT** `/parking/requests/:id/reject`

- **PUT** `/parking/requests/:id/release`

- **GET** `/parking/vehicles?buildingId={id}&memberId={id}`

---

## 10. Events Routes (`/api/events`)

- **POST** `/events`
  - Body: `{ title, description, banner, buildingId, blockIds[], floorIds[], unitIds[], targetUserTypes[], territory, venue, venueLocation, eventDate, startTime, endTime, registrationLimit, registrationFields[] }`

- **GET** `/events?buildingId={id}&eventStatus={status}`

- **GET** `/events/:id`

- **PUT** `/events/:id`

- **PUT** `/events/:id/publish`

- **DELETE** `/events/:id`

- **GET** `/events/registrations?eventId={id}`

- **PUT** `/events/registrations/:id/attendance`
  - Body: `{ status: "attended" | "absent" }`

- **GET** `/events/analytics?eventId={id}`

---

## 11. Visitors Routes (`/api/visitors`)

- **POST** `/visitors`
  - Body: `{ visitorName, phoneNumber, visitorImage, vehicleNumber, visitorType, purpose, buildingId, blockId, floorId, unitId, memberId }`

- **GET** `/visitors?buildingId={id}&visitorType={type}&approvalStatus={status}&startDate={date}&endDate={date}`

- **GET** `/visitors/today?buildingId={id}`

- **GET** `/visitors/stats?buildingId={id}&startDate={date}&endDate={date}`

- **GET** `/visitors/:id`

- **PUT** `/visitors/:id`

- **PUT** `/visitors/:id/approve`

- **PUT** `/visitors/:id/reject`

- **PUT** `/visitors/:id/checkout`

- **DELETE** `/visitors/:id`

---

## 12. Maintenance & Bills Routes (`/api/maintenance`)

### Bills
- **POST** `/maintenance/bills`
  - Body: `{ name, description, billDate, dueDate, period, buildingId, blockIds[], floorIds[], unitIds[], billFor, lateFee, totalAmount }`

- **GET** `/maintenance/bills?buildingId={id}&billStatus={status}&month={num}&year={num}`

- **GET** `/maintenance/bills/stats?buildingId={id}&month={num}&year={num}`

- **GET** `/maintenance/bills/:id`

- **PUT** `/maintenance/bills/:id`

- **PUT** `/maintenance/bills/:id/publish`

- **DELETE** `/maintenance/bills/:id`

### Maintenance Types
- **POST** `/maintenance/types`
  - Body: `{ name, description, buildingId }`

- **GET** `/maintenance/types?buildingId={id}`

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

---

## Enums and Constants

### Complaint Status
- `open`
- `in-process`
- `on-hold`
- `close`
- `re-open`
- `dismiss`

### Notice Category
- `general`
- `maintenance`
- `event`
- `emergency`
- `meeting`
- `sos`

### Priority Levels
- `high`
- `medium`
- `low`

### Unit Status
- `Vacant`
- `Occupied`
- `Under Maintenance`

### Visitor Types
- `employee`
- `member`
- `tenant`
- `vendor`
- `delivery`

### Committee Types
- `Chairman`
- `Secretary`
- `Treasurer`
- `Member`

### Employment Types
- `society`
- `agency`

### Amenity Types
- `free`
- `paid`

### Booking Types
- `one-time`
- `recurring`

### Event Status
- `draft`
- `published`
- `ongoing`
- `completed`
- `cancelled`

---

## Notes

1. **File Uploads**: Currently mocked. Images/attachments should be stored as URLs/paths.
2. **OTP Verification**: Currently accepts any OTP value and returns success.
3. **Payment Gateway**: Structure is in place (PhonePe, Razorpay) but implementation is mocked.
4. **Member Registration**: Done from mobile app (not admin panel).
5. **Authentication**: All routes except `/auth/*` should have authentication middleware in production.
6. **Soft Delete**: All delete operations are soft deletes (sets `isDeleted: true`).
7. **ObjectId Conversion**: buildingId and other IDs in query params are automatically converted to MongoDB ObjectId where needed.

---

## Testing the API

1. Start the server:
   ```bash
   cd society-backend/services/society-services
   npm start
   ```

2. Server will run on: `http://localhost:5000`

3. Use Postman/Thunder Client/Insomnia to test endpoints

4. Example Login (Superadmin):
   ```bash
   POST http://localhost:5000/api/auth/superadmin/send-otp
   Body: { "phoneNumber": "+919999999999" }

   POST http://localhost:5000/api/auth/superadmin/verify-otp
   Body: { "phoneNumber": "+919999999999", "otp": "123456" }
   ```

5. Use the returned token in Authorization header for subsequent requests.
