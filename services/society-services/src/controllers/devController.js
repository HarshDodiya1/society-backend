/**
 * Development Tools Controller
 * DANGEROUS: Only use in development environment
 * Provides utilities for testing and development
 */

import Users from '../models/Users.js';
import Members from '../models/Members.js';
import Buildings from '../models/Buildings.js';
import Blocks from '../models/Blocks.js';
import Floors from '../models/Floors.js';
import Units from '../models/Units.js';
import Notices from '../models/Notices.js';
import Events from '../models/Events.js';
import Complaints from '../models/Complaints.js';
import Amenities from '../models/Amenities.js';
import CommitteeMembers from '../models/CommitteeMembers.js';
import BuildingEmployees from '../models/BuildingEmployees.js';
import ParkingAreas from '../models/ParkingAreas.js';
import ParkingSpots from '../models/ParkingSpots.js';
import ParkingRequests from '../models/ParkingRequests.js';
import ParkingAssignments from '../models/ParkingAssignments.js';
import Visitors from '../models/Visitors.js';
import MaintenanceBills from '../models/MaintenanceBills.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Clean Database - Remove all data
 * ⚠️ DANGEROUS: Only works in development mode
 */
export const cleanDatabase = async (req, res) => {
    try {
        // Security check: Only allow in development
        if (process.env.NODE_ENV === 'production') {
            return errorResponse(res, 'Database cleanup is not allowed in production', 403);
        }

        console.log('⚠️  DATABASE CLEANUP STARTED - Removing all data...');

        const deletionResults = {};

        // Delete in correct order to handle foreign key constraints
        // Start with dependent tables first, then parent tables

        // 1. Maintenance & Bills
        try {
            const maintenanceResult = await MaintenanceBills.deleteMany({});
            deletionResults.maintenanceBills = maintenanceResult.deletedCount;
            console.log(`✓ Deleted ${maintenanceResult.deletedCount} maintenance bills`);
        } catch (error) {
            console.error('Error deleting maintenance bills:', error.message);
            deletionResults.maintenanceBills = 0;
        }

        // 2. Visitors
        try {
            const visitorsResult = await Visitors.deleteMany({});
            deletionResults.visitors = visitorsResult.deletedCount;
            console.log(`✓ Deleted ${visitorsResult.deletedCount} visitors`);
        } catch (error) {
            console.error('Error deleting visitors:', error.message);
            deletionResults.visitors = 0;
        }

        // 3. Parking (all parking related collections)
        try {
            await ParkingAssignments.deleteMany({});
            await ParkingRequests.deleteMany({});
            await ParkingSpots.deleteMany({});
            const parkingResult = await ParkingAreas.deleteMany({});
            deletionResults.parking = parkingResult.deletedCount;
            console.log(`✓ Deleted parking data`);
        } catch (error) {
            console.error('Error deleting parking:', error.message);
            deletionResults.parking = 0;
        }

        // 4. Employees
        try {
            const employeesResult = await BuildingEmployees.deleteMany({});
            deletionResults.employees = employeesResult.deletedCount;
            console.log(`✓ Deleted ${employeesResult.deletedCount} employees`);
        } catch (error) {
            console.error('Error deleting employees:', error.message);
            deletionResults.employees = 0;
        }

        // 5. Committee Members
        try {
            const committeeResult = await CommitteeMembers.deleteMany({});
            deletionResults.committeeMembers = committeeResult.deletedCount;
            console.log(`✓ Deleted ${committeeResult.deletedCount} committee members`);
        } catch (error) {
            console.error('Error deleting committee members:', error.message);
            deletionResults.committeeMembers = 0;
        }

        // 6. Amenities
        try {
            const amenitiesResult = await Amenities.deleteMany({});
            deletionResults.amenities = amenitiesResult.deletedCount;
            console.log(`✓ Deleted ${amenitiesResult.deletedCount} amenities`);
        } catch (error) {
            console.error('Error deleting amenities:', error.message);
            deletionResults.amenities = 0;
        }

        // 7. Complaints
        try {
            const complaintsResult = await Complaints.deleteMany({});
            deletionResults.complaints = complaintsResult.deletedCount;
            console.log(`✓ Deleted ${complaintsResult.deletedCount} complaints`);
        } catch (error) {
            console.error('Error deleting complaints:', error.message);
            deletionResults.complaints = 0;
        }

        // 8. Events
        try {
            const eventsResult = await Events.deleteMany({});
            deletionResults.events = eventsResult.deletedCount;
            console.log(`✓ Deleted ${eventsResult.deletedCount} events`);
        } catch (error) {
            console.error('Error deleting events:', error.message);
            deletionResults.events = 0;
        }

        // 9. Notices
        try {
            const noticesResult = await Notices.deleteMany({});
            deletionResults.notices = noticesResult.deletedCount;
            console.log(`✓ Deleted ${noticesResult.deletedCount} notices`);
        } catch (error) {
            console.error('Error deleting notices:', error.message);
            deletionResults.notices = 0;
        }

        // 10. Members (before users since users reference members)
        try {
            const membersResult = await Members.deleteMany({});
            deletionResults.members = membersResult.deletedCount;
            console.log(`✓ Deleted ${membersResult.deletedCount} members`);
        } catch (error) {
            console.error('Error deleting members:', error.message);
            deletionResults.members = 0;
        }

        // 11. Units (before floors)
        try {
            const unitsResult = await Units.deleteMany({});
            deletionResults.units = unitsResult.deletedCount;
            console.log(`✓ Deleted ${unitsResult.deletedCount} units`);
        } catch (error) {
            console.error('Error deleting units:', error.message);
            deletionResults.units = 0;
        }

        // 12. Floors (before blocks)
        try {
            const floorsResult = await Floors.deleteMany({});
            deletionResults.floors = floorsResult.deletedCount;
            console.log(`✓ Deleted ${floorsResult.deletedCount} floors`);
        } catch (error) {
            console.error('Error deleting floors:', error.message);
            deletionResults.floors = 0;
        }

        // 13. Blocks (before buildings)
        try {
            const blocksResult = await Blocks.deleteMany({});
            deletionResults.blocks = blocksResult.deletedCount;
            console.log(`✓ Deleted ${blocksResult.deletedCount} blocks`);
        } catch (error) {
            console.error('Error deleting blocks:', error.message);
            deletionResults.blocks = 0;
        }

        // 14. Buildings
        try {
            const buildingsResult = await Buildings.deleteMany({});
            deletionResults.buildings = buildingsResult.deletedCount;
            console.log(`✓ Deleted ${buildingsResult.deletedCount} buildings`);
        } catch (error) {
            console.error('Error deleting buildings:', error.message);
            deletionResults.buildings = 0;
        }

        // 15. Users (last, after all dependencies)
        try {
            const usersResult = await Users.deleteMany({});
            deletionResults.users = usersResult.deletedCount;
            console.log(`✓ Deleted ${usersResult.deletedCount} users`);
        } catch (error) {
            console.error('Error deleting users:', error.message);
            deletionResults.users = 0;
        }

        console.log('✅ DATABASE CLEANUP COMPLETED');

        // Calculate totals
        const totalDeleted = Object.values(deletionResults).reduce((sum, count) => sum + count, 0);

        return successResponse(res, {
            message: '⚠️ Database cleaned successfully - All data removed',
            deletedCounts: deletionResults,
            totalRecordsDeleted: totalDeleted,
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        }, 'Database cleaned successfully');

    } catch (error) {
        console.error('❌ DATABASE CLEANUP ERROR:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Get Database Statistics
 * Returns count of documents in each collection
 */
export const getDatabaseStats = async (req, res) => {
    try {
        const stats = {
            users: await Users.countDocuments(),
            members: await Members.countDocuments(),
            membersPending: await Members.countDocuments({ memberStatus: 'pending' }),
            membersApproved: await Members.countDocuments({ memberStatus: 'approved' }),
            buildings: await Buildings.countDocuments(),
            blocks: await Blocks.countDocuments(),
            floors: await Floors.countDocuments(),
            units: await Units.countDocuments(),
            notices: await Notices.countDocuments(),
            events: await Events.countDocuments(),
            complaints: await Complaints.countDocuments(),
            amenities: await Amenities.countDocuments(),
            committeeMembers: await CommitteeMembers.countDocuments(),
            employees: await BuildingEmployees.countDocuments(),
            parking: await ParkingAreas.countDocuments(),
            visitors: await Visitors.countDocuments(),
            maintenanceBills: await MaintenanceBills.countDocuments(),
        };

        const totalRecords = Object.values(stats).reduce((sum, count) => sum + count, 0);

        return successResponse(res, {
            collections: stats,
            totalRecords,
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        }, 'Database statistics fetched successfully');

    } catch (error) {
        console.error('Get Database Stats Error:', error);
        return errorResponse(res, error.message, 500);
    }
};

/**
 * Seed Sample Notices for Testing
 * Creates sample notices for all buildings in the database
 */
export const seedNotices = async (req, res) => {
    try {
        // Security check
        if (process.env.NODE_ENV === 'production') {
            return errorResponse(res, 'Seeding is not allowed in production', 403);
        }

        console.log('📢 Seeding sample notices...');

        // Get all buildings
        const buildings = await Buildings.find({ isDeleted: false });
        
        if (buildings.length === 0) {
            return errorResponse(res, 'No buildings found. Please create a building first.', 404);
        }

        const createdNotices = [];

        for (const building of buildings) {
            // Get admin user for this building (or use first user)
            const adminUser = await Users.findOne({ role: 'admin' }).limit(1);
            
            // Sample notices
            const sampleNotices = [
                {
                    title: 'Water Supply Maintenance',
                    description: 'Dear Residents,\n\nWe would like to inform you that routine water tank cleaning and maintenance will be carried out on Sunday, November 10th, 2025 from 8:00 AM to 2:00 PM.\n\nDuring this period, water supply may be temporarily interrupted. We request all residents to store sufficient water in advance.\n\nWe apologize for any inconvenience caused.\n\nThank you for your cooperation.',
                    category: 'maintenance',
                    priority: 'high',
                    buildingId: building._id,
                    publishDate: new Date(),
                    publishNow: true,
                    noticeStatus: 'published',
                    createdBy: adminUser?._id,
                    status: 'active'
                },
                {
                    title: 'Diwali Celebration 2025',
                    description: 'Dear Residents,\n\nThe Society Management Committee is organizing a grand Diwali celebration on November 15th, 2025 at 6:00 PM in the community hall.\n\nProgram Highlights:\n• Cultural performances by residents\n• Traditional games and activities\n• Diwali snacks and refreshments\n• Prize distribution\n\nAll residents and their families are cordially invited to join us for this festive celebration.\n\nLooking forward to your participation!\n\nRegards,\nSociety Management',
                    category: 'event',
                    priority: 'medium',
                    buildingId: building._id,
                    publishDate: new Date(),
                    publishNow: true,
                    noticeStatus: 'published',
                    createdBy: adminUser?._id,
                    status: 'active'
                },
                {
                    title: 'Monthly Maintenance Due - November 2025',
                    description: 'Dear Residents,\n\nThis is a gentle reminder that the monthly maintenance charges for November 2025 are now due.\n\nPayment Details:\n• Due Date: November 15, 2025\n• Late Fee: Applicable after due date\n• Payment Methods: Online transfer, cheque, or cash\n\nPlease ensure timely payment to avoid late fees.\n\nFor any queries, please contact the office during working hours (10 AM - 6 PM).\n\nThank you for your cooperation.',
                    category: 'general',
                    priority: 'high',
                    buildingId: building._id,
                    publishDate: new Date(),
                    publishNow: true,
                    noticeStatus: 'published',
                    createdBy: adminUser?._id,
                    status: 'active'
                },
                {
                    title: 'Security Advisory',
                    description: 'Dear Residents,\n\nFor the safety and security of all residents, we request everyone to:\n\n1. Always carry your access card/key\n2. Do not share entry codes with outsiders\n3. Register all visitors at the gate\n4. Report any suspicious activity immediately\n5. Ensure all doors and windows are locked when leaving\n\nLet\'s work together to maintain a safe living environment.\n\nIn case of emergency, contact security: 9876543210\n\nStay safe!',
                    category: 'general',
                    priority: 'medium',
                    buildingId: building._id,
                    publishDate: new Date(),
                    publishNow: true,
                    noticeStatus: 'published',
                    createdBy: adminUser?._id,
                    status: 'active'
                },
                {
                    title: 'Monthly Society Meeting',
                    description: 'Dear Residents,\n\nYou are invited to attend the monthly society meeting scheduled for:\n\nDate: November 20, 2025\nTime: 7:00 PM\nVenue: Community Hall\n\nAgenda:\n1. Review of maintenance activities\n2. Upcoming projects discussion\n3. Resident concerns and suggestions\n4. Budget review\n5. Any other business\n\nYour presence and participation are highly appreciated.\n\nRegards,\nManaging Committee',
                    category: 'meeting',
                    priority: 'medium',
                    buildingId: building._id,
                    publishDate: new Date(),
                    publishNow: true,
                    noticeStatus: 'published',
                    createdBy: adminUser?._id,
                    status: 'active'
                }
            ];

            // Create notices
            const notices = await Notices.insertMany(sampleNotices);
            createdNotices.push(...notices);
            
            console.log(`✓ Created ${notices.length} notices for ${building.buildingName}`);
        }

        console.log('✅ Notice seeding completed');

        return successResponse(res, {
            message: 'Sample notices created successfully',
            totalNotices: createdNotices.length,
            buildings: buildings.length,
            notices: createdNotices
        }, 'Notices seeded successfully');

    } catch (error) {
        console.error('❌ Seed Notices Error:', error);
        return errorResponse(res, error.message, 500);
    }
};
