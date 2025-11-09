export const USER_TYPES = {
    SUPER_ADMIN: 'superadmin',
    BUILDING_ADMIN: 'buildingadmin',
    RESIDENT: 'resident',
    MEMBER: 'member',
    EMPLOYEE: 'employee'
};

export const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

// Hardcoded Super Admin credentials
export const SUPER_ADMIN = {
    phoneNumber: '9999999999',
    countryCode: '+91',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@society.com',
    userType: USER_TYPES.SUPER_ADMIN
};