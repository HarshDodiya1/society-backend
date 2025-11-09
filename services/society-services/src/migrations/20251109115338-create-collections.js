module.exports = {
  async up(db, client) {
    // create collection: amenities
    await db.createCollection("amenities", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "name": {
                "bsonType": "string"
            },
            "description": {
                "bsonType": "string"
            },
            "capacity": {
                "bsonType": "number"
            },
            "amenityType": {
                "bsonType": "string"
            },
            "bookingCharge": {
                "bsonType": "number"
            },
            "bookingType": {
                "bsonType": "string"
            },
            "paymentGateway": {
                "bsonType": "string"
            },
            "advanceBookingDays": {
                "bsonType": "number"
            },
            "requiresApproval": {
                "bsonType": "bool"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "amenityStatus": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "name",
            "description",
            "capacity",
            "amenityType",
            "bookingType",
            "advanceBookingDays",
            "buildingId"
        ]
    }
});

    // create collection: amenitybookings
    await db.createCollection("amenitybookings", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "amenityId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "bookingDate": {
                "bsonType": "date"
            },
            "amenityBookingSlotId": {
                "bsonType": "objectId"
            },
            "bookingAmount": {
                "bsonType": "string"
            },
            "paymentStatus": {
                "bsonType": "string"
            },
            "bookingStatus": {
                "bsonType": "string"
            },
            "approvedBy": {
                "bsonType": "objectId"
            },
            "approvedAt": {
                "bsonType": "date"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "amenityId",
            "memberId",
            "buildingId",
            "bookingDate",
            "amenityBookingSlotId",
            "bookingAmount"
        ]
    }
});

    // create collection: amenityslots
    await db.createCollection("amenityslots", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "amenityId": {
                "bsonType": "objectId"
            },
            "startTime": {
                "bsonType": "string"
            },
            "endTime": {
                "bsonType": "string"
            },
            "slotStatus": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "amenityId",
            "startTime",
            "endTime"
        ]
    }
});

    // create collection: blocks
    await db.createCollection("blocks", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "blockName": {
                "bsonType": "string"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "blockName",
            "buildingId"
        ]
    }
});

    // create collection: buildingadmins
    await db.createCollection("buildingadmins", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "firstName": {
                "bsonType": "string"
            },
            "lastName": {
                "bsonType": "string"
            },
            "email": {
                "bsonType": "string"
            },
            "countryCode": {
                "bsonType": "string"
            },
            "phoneNumber": {
                "bsonType": "string"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "status": {
                "bsonType": "string"
            },
            "lastLoginAt": {
                "bsonType": "date"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "firstName",
            "lastName",
            "email",
            "countryCode",
            "phoneNumber",
            "buildingId"
        ]
    }
});

    // create collection: buildingemployees
    await db.createCollection("buildingemployees", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "firstName": {
                "bsonType": "string"
            },
            "lastName": {
                "bsonType": "string"
            },
            "countryCodeName": {
                "bsonType": "string"
            },
            "countryCode": {
                "bsonType": "string"
            },
            "phoneNumber": {
                "bsonType": "string"
            },
            "email": {
                "bsonType": "string"
            },
            "gender": {
                "bsonType": "string"
            },
            "address": {
                "bsonType": "string"
            },
            "dateOfBirth": {
                "bsonType": "date"
            },
            "employeeType": {
                "bsonType": "string"
            },
            "employmentType": {
                "bsonType": "string"
            },
            "agencyDetails": {
                "bsonType": "string"
            },
            "idProofType": {
                "bsonType": "string"
            },
            "idProofNumber": {
                "bsonType": "string"
            },
            "idProofDocument": {
                "bsonType": "string"
            },
            "policeVerificationDocument": {
                "bsonType": "string"
            },
            "shiftTimings": {
                "bsonType": "string"
            },
            "joiningDate": {
                "bsonType": "date"
            },
            "userId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "firstName",
            "lastName",
            "countryCodeName",
            "countryCode",
            "phoneNumber",
            "email",
            "employeeType",
            "employmentType",
            "buildingId"
        ]
    }
});

    // create collection: buildinggallerys
    await db.createCollection("buildinggallerys", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "blockId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "buildingId"
        ]
    }
});

    // create collection: buildings
    await db.createCollection("buildings", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "buildingName": {
                "bsonType": "string"
            },
            "societyName": {
                "bsonType": "string"
            },
            "address": {
                "bsonType": "string"
            },
            "territory": {
                "bsonType": "string"
            },
            "city": {
                "bsonType": "string"
            },
            "state": {
                "bsonType": "string"
            },
            "pincode": {
                "bsonType": "string"
            },
            "totalBlocks": {
                "bsonType": "number"
            },
            "totalUnits": {
                "bsonType": "number"
            },
            "buildingType": {
                "bsonType": "string"
            },
            "buildingLogo": {
                "bsonType": "string"
            },
            "projectId": {
                "bsonType": "objectId"
            },
            "approveBy": {
                "bsonType": "objectId"
            },
            "approveAt": {
                "bsonType": "date"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "buildingName",
            "societyName",
            "address",
            "city",
            "state",
            "pincode"
        ]
    }
});

    // create collection: committeemembers
    await db.createCollection("committeemembers", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "firstName": {
                "bsonType": "string"
            },
            "lastName": {
                "bsonType": "string"
            },
            "countryCodeName": {
                "bsonType": "string"
            },
            "countryCode": {
                "bsonType": "string"
            },
            "phoneNumber": {
                "bsonType": "string"
            },
            "email": {
                "bsonType": "string"
            },
            "committeeType": {
                "bsonType": "string"
            },
            "userId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "startDate": {
                "bsonType": "date"
            },
            "endDate": {
                "bsonType": "date"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "firstName",
            "lastName",
            "countryCodeName",
            "countryCode",
            "phoneNumber",
            "email",
            "committeeType",
            "userId",
            "buildingId",
            "startDate"
        ]
    }
});

    // create collection: complaints
    await db.createCollection("complaints", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "title": {
                "bsonType": "string"
            },
            "category": {
                "bsonType": "string"
            },
            "priority": {
                "bsonType": "string"
            },
            "description": {
                "bsonType": "string"
            },
            "complaintType": {
                "bsonType": "string"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "unitId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "assignedToEmployeeId": {
                "bsonType": "objectId"
            },
            "complaintStatus": {
                "bsonType": "string"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "title",
            "category",
            "priority",
            "description",
            "complaintType",
            "buildingId"
        ]
    }
});

    // create collection: eventregistrations
    await db.createCollection("eventregistrations", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "eventId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "unitId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "registrationData": {
                "bsonType": "string"
            },
            "registrationDate": {
                "bsonType": "date"
            },
            "attendance": {
                "bsonType": "string"
            },
            "qrCode": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "eventId",
            "memberId",
            "unitId",
            "buildingId"
        ]
    }
});

    // create collection: events
    await db.createCollection("events", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "title": {
                "bsonType": "string"
            },
            "description": {
                "bsonType": "string"
            },
            "banner": {
                "bsonType": "string"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "territory": {
                "bsonType": "string"
            },
            "venue": {
                "bsonType": "string"
            },
            "venueLocation": {
                "bsonType": "string"
            },
            "eventDate": {
                "bsonType": "date"
            },
            "startTime": {
                "bsonType": "string"
            },
            "endTime": {
                "bsonType": "string"
            },
            "registrationLimit": {
                "bsonType": "number"
            },
            "eventStatus": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "title",
            "description",
            "buildingId",
            "venue",
            "eventDate",
            "startTime",
            "endTime"
        ]
    }
});

    // create collection: floors
    await db.createCollection("floors", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "floorName": {
                "bsonType": "string"
            },
            "blockId": {
                "bsonType": "objectId"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "floorName",
            "blockId"
        ]
    }
});

    // create collection: index
    await db.createCollection("index", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {}
    }
});

    // create collection: maintenancebills
    await db.createCollection("maintenancebills", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "maintenanceTypeId": {
                "bsonType": "objectId"
            },
            "unitId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "dueDate": {
                "bsonType": "date"
            },
            "month": {
                "bsonType": "number"
            },
            "year": {
                "bsonType": "number"
            },
            "totalOwnerAmount": {
                "bsonType": "string"
            },
            "totalTenantAmount": {
                "bsonType": "string"
            },
            "lateFeeEnabled": {
                "bsonType": "bool"
            },
            "lateFeeType": {
                "bsonType": "string"
            },
            "lateFeeAmount": {
                "bsonType": "string"
            },
            "description": {
                "bsonType": "string"
            },
            "published": {
                "bsonType": "bool"
            },
            "billStatus": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "maintenanceTypeId",
            "unitId",
            "buildingId",
            "dueDate",
            "month",
            "year",
            "totalOwnerAmount",
            "totalTenantAmount"
        ]
    }
});

    // create collection: maintenancepayments
    await db.createCollection("maintenancepayments", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "billId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "paidBy": {
                "bsonType": "objectId"
            },
            "paidAmount": {
                "bsonType": "string"
            },
            "paidDate": {
                "bsonType": "date"
            },
            "paymentStatus": {
                "bsonType": "string"
            },
            "receiptUrl": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "billId",
            "memberId",
            "paidAmount",
            "paidDate"
        ]
    }
});

    // create collection: maintenancetypes
    await db.createCollection("maintenancetypes", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "name": {
                "bsonType": "string"
            },
            "description": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "name",
            "description"
        ]
    }
});

    // create collection: members
    await db.createCollection("members", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "firstName": {
                "bsonType": "string"
            },
            "lastName": {
                "bsonType": "string"
            },
            "countryCodeName": {
                "bsonType": "string"
            },
            "countryCode": {
                "bsonType": "string"
            },
            "phoneNumber": {
                "bsonType": "string"
            },
            "email": {
                "bsonType": "string"
            },
            "gender": {
                "bsonType": "string"
            },
            "ownershipProof": {
                "bsonType": "string"
            },
            "committeeType": {
                "bsonType": "string"
            },
            "memberType": {
                "bsonType": "string"
            },
            "memberRelation": {
                "bsonType": "string"
            },
            "parentMemberId": {
                "bsonType": "objectId"
            },
            "userId": {
                "bsonType": "objectId"
            },
            "blockId": {
                "bsonType": "objectId"
            },
            "floorId": {
                "bsonType": "objectId"
            },
            "unitId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "memberStatus": {
                "bsonType": "string"
            },
            "approvedBy": {
                "bsonType": "objectId"
            },
            "approvedAt": {
                "bsonType": "date"
            },
            "rejectedBy": {
                "bsonType": "objectId"
            },
            "rejectedAt": {
                "bsonType": "date"
            },
            "rejectionReason": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "firstName",
            "lastName",
            "countryCodeName",
            "countryCode",
            "phoneNumber",
            "email",
            "gender",
            "ownershipProof",
            "memberType",
            "userId",
            "blockId",
            "floorId",
            "unitId",
            "buildingId"
        ]
    }
});

    // create collection: notices
    await db.createCollection("notices", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "title": {
                "bsonType": "string"
            },
            "description": {
                "bsonType": "string"
            },
            "category": {
                "bsonType": "string"
            },
            "priority": {
                "bsonType": "string"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "targetUserType": {
                "bsonType": "string"
            },
            "publishDate": {
                "bsonType": "date"
            },
            "publishNow": {
                "bsonType": "bool"
            },
            "expiryDate": {
                "bsonType": "date"
            },
            "noticeStatus": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "title",
            "description",
            "category",
            "priority",
            "buildingId",
            "publishDate"
        ]
    }
});

    // create collection: parkingareas
    await db.createCollection("parkingareas", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "parkingName": {
                "bsonType": "string"
            },
            "numberOfMemberCar": {
                "bsonType": "number"
            },
            "numberOfMemberBike": {
                "bsonType": "number"
            },
            "numberOfVisitorCar": {
                "bsonType": "number"
            },
            "numberOfVisitorBike": {
                "bsonType": "number"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "parkingName",
            "numberOfMemberCar",
            "numberOfMemberBike",
            "numberOfVisitorCar",
            "numberOfVisitorBike",
            "buildingId"
        ]
    }
});

    // create collection: parkingassignments
    await db.createCollection("parkingassignments", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "parkingSpotId": {
                "bsonType": "objectId"
            },
            "vehicleId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "assignmentStatus": {
                "bsonType": "string"
            },
            "approvedBy": {
                "bsonType": "objectId"
            },
            "approvedAt": {
                "bsonType": "date"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "parkingSpotId",
            "vehicleId",
            "memberId",
            "buildingId"
        ]
    }
});

    // create collection: parkingrequests
    await db.createCollection("parkingrequests", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "unitId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "vehicleType": {
                "bsonType": "string"
            },
            "vehicleNumber": {
                "bsonType": "string"
            },
            "requestedSpotId": {
                "bsonType": "objectId"
            },
            "assignedSpotId": {
                "bsonType": "objectId"
            },
            "requestStatus": {
                "bsonType": "string"
            },
            "remarks": {
                "bsonType": "string"
            },
            "adminRemarks": {
                "bsonType": "string"
            },
            "approvedBy": {
                "bsonType": "objectId"
            },
            "approvedAt": {
                "bsonType": "date"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "unitId",
            "memberId",
            "buildingId",
            "vehicleType",
            "vehicleNumber",
            "requestStatus"
        ]
    }
});

    // create collection: parkingspots
    await db.createCollection("parkingspots", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "parkingAreaId": {
                "bsonType": "objectId"
            },
            "parkingNumber": {
                "bsonType": "string"
            },
            "parkingType": {
                "bsonType": "string"
            },
            "blockId": {
                "bsonType": "objectId"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "parkingAreaId",
            "parkingNumber",
            "parkingType"
        ]
    }
});

    // create collection: penalties
    await db.createCollection("penalties", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "penaltyNumber": {
                "bsonType": "number"
            },
            "title": {
                "bsonType": "string"
            },
            "descriptions": {
                "bsonType": "string"
            },
            "email": {
                "bsonType": "string"
            },
            "photos": {
                "bsonType": "string"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "unitId": {
                "bsonType": "objectId"
            },
            "penaltyDate": {
                "bsonType": "date"
            },
            "amount": {
                "bsonType": "string"
            },
            "penaltyStatus": {
                "bsonType": "string"
            },
            "receiverDate": {
                "bsonType": "date"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "penaltyNumber",
            "title",
            "descriptions",
            "buildingId",
            "unitId",
            "penaltyDate",
            "amount"
        ]
    }
});

    // create collection: units
    await db.createCollection("units", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "unitNumber": {
                "bsonType": "string"
            },
            "unitType": {
                "bsonType": "string"
            },
            "area": {
                "bsonType": "string"
            },
            "floorId": {
                "bsonType": "objectId"
            },
            "blockId": {
                "bsonType": "objectId"
            },
            "allocatedTo": {
                "bsonType": "objectId"
            },
            "unitStatus": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "unitNumber",
            "unitType",
            "area",
            "floorId",
            "blockId"
        ]
    }
});

    // create collection: users
    await db.createCollection("users", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "firstName": {
                "bsonType": "string"
            },
            "lastName": {
                "bsonType": "string"
            },
            "userName": {
                "bsonType": "string"
            },
            "countryCodeName": {
                "bsonType": "string"
            },
            "countryCode": {
                "bsonType": "string"
            },
            "phoneNumber": {
                "bsonType": "string"
            },
            "email": {
                "bsonType": "string"
            },
            "isbuildingMember": {
                "bsonType": "bool"
            },
            "isbuildingEmployee": {
                "bsonType": "bool"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "firstName",
            "lastName",
            "userName",
            "countryCodeName",
            "countryCode",
            "phoneNumber",
            "email"
        ]
    }
});

    // create collection: vehicles
    await db.createCollection("vehicles", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "memberId": {
                "bsonType": "objectId"
            },
            "vehicleImage": {
                "bsonType": "string"
            },
            "vehicleNumber": {
                "bsonType": "string"
            },
            "vehicleType": {
                "bsonType": "string"
            },
            "rcBookImage": {
                "bsonType": "string"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "memberId",
            "vehicleNumber",
            "vehicleType"
        ]
    }
});

    // create collection: visitors
    await db.createCollection("visitors", {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "visitorName": {
                "bsonType": "string"
            },
            "phoneNumber": {
                "bsonType": "string"
            },
            "visitorImage": {
                "bsonType": "string"
            },
            "vehicleNumber": {
                "bsonType": "string"
            },
            "visitorType": {
                "bsonType": "string"
            },
            "purpose": {
                "bsonType": "string"
            },
            "buildingId": {
                "bsonType": "objectId"
            },
            "blockId": {
                "bsonType": "objectId"
            },
            "floorId": {
                "bsonType": "objectId"
            },
            "unitId": {
                "bsonType": "objectId"
            },
            "memberId": {
                "bsonType": "objectId"
            },
            "checkInTime": {
                "bsonType": "date"
            },
            "checkOutTime": {
                "bsonType": "date"
            },
            "approvalStatus": {
                "bsonType": "string"
            },
            "approvedBy": {
                "bsonType": "objectId"
            },
            "approvedAt": {
                "bsonType": "date"
            },
            "status": {
                "bsonType": "string"
            },
            "createdBy": {
                "bsonType": "objectId"
            },
            "updatedBy": {
                "bsonType": "objectId"
            },
            "createdAt": {
                "bsonType": "date"
            },
            "updatedAt": {
                "bsonType": "date"
            },
            "deletedAt": {
                "bsonType": "date"
            },
            "isDeleted": {
                "bsonType": "bool"
            }
        },
        "required": [
            "visitorName",
            "phoneNumber",
            "purpose",
            "buildingId",
            "checkInTime"
        ]
    }
});

  },

  async down(db, client) {
    await db.collection('amenities').drop();
    await db.collection('amenitybookings').drop();
    await db.collection('amenityslots').drop();
    await db.collection('blocks').drop();
    await db.collection('buildingadmins').drop();
    await db.collection('buildingemployees').drop();
    await db.collection('buildinggallerys').drop();
    await db.collection('buildings').drop();
    await db.collection('committeemembers').drop();
    await db.collection('complaints').drop();
    await db.collection('eventregistrations').drop();
    await db.collection('events').drop();
    await db.collection('floors').drop();
    await db.collection('index').drop();
    await db.collection('maintenancebills').drop();
    await db.collection('maintenancepayments').drop();
    await db.collection('maintenancetypes').drop();
    await db.collection('members').drop();
    await db.collection('notices').drop();
    await db.collection('parkingareas').drop();
    await db.collection('parkingassignments').drop();
    await db.collection('parkingrequests').drop();
    await db.collection('parkingspots').drop();
    await db.collection('penalties').drop();
    await db.collection('units').drop();
    await db.collection('users').drop();
    await db.collection('vehicles').drop();
    await db.collection('visitors').drop();
  }
};