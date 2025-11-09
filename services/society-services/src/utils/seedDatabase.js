/**
 * Database Seed Script
 * 
 * Seeds the database with sample buildings, blocks, floors, and units
 * for testing the resident registration flow
 * 
 * Run with: node src/utils/seedDatabase.js
 */

import dotenv from 'dotenv';
dotenv.config();

import BuildingsModel from '../models/Buildings.js';
import BlocksModel from '../models/Blocks.js';
import FloorsModel from '../models/Floors.js';
import UnitsModel from '../models/Units.js';

// Wait for database connection
await new Promise(resolve => setTimeout(resolve, 2000));

// Sample buildings data
const sampleBuildings = [
    {
        buildingName: 'Shivalik Heights',
        societyName: 'Shivalik Heights Residency',
        address: '123 Main Road, Satellite',
        territory: 'West Ahmedabad',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        buildingType: 'Residential',
        status: 'active',
        blocks: [
            {
                blockName: 'A',
                floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'],
                unitsPerFloor: 4
            },
            {
                blockName: 'B',
                floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'],
                unitsPerFloor: 4
            }
        ]
    },
    {
        buildingName: 'Green Valley Apartments',
        societyName: 'Green Valley Society',
        address: '456 Park Avenue, Prahlad Nagar',
        territory: 'South Ahmedabad',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380051',
        buildingType: 'Residential',
        status: 'active',
        blocks: [
            {
                blockName: 'A',
                floors: ['Ground Floor', '1st Floor', '2nd Floor'],
                unitsPerFloor: 3
            },
            {
                blockName: 'B',
                floors: ['Ground Floor', '1st Floor', '2nd Floor'],
                unitsPerFloor: 3
            }
        ]
    },
    {
        buildingName: 'Sunrise Towers',
        societyName: 'Sunrise Residential Complex',
        address: '789 Lake View Road, Bodakdev',
        territory: 'Central Ahmedabad',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380054',
        buildingType: 'Residential',
        status: 'active',
        blocks: [
            {
                blockName: 'Tower 1',
                floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'],
                unitsPerFloor: 2
            },
            {
                blockName: 'Tower 2',
                floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'],
                unitsPerFloor: 2
            }
        ]
    }
];

// Unit types for variation
const unitTypes = ['1BHK', '2BHK', '3BHK', 'Studio', 'Penthouse'];
const unitAreas = ['650', '850', '1200', '500', '1500'];

// Generate unit number
const generateUnitNumber = (blockName, floorIndex, unitIndex) => {
    const floorNumber = floorIndex.toString().padStart(1, '0');
    const unitNumber = (unitIndex + 1).toString().padStart(2, '0');
    return `${blockName}${floorNumber}${unitNumber}`;
};

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing data...');
        await UnitsModel.deleteMany({});
        await FloorsModel.deleteMany({});
        await BlocksModel.deleteMany({});
        await BuildingsModel.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Seed buildings
        for (const buildingData of sampleBuildings) {
            console.log(`📍 Creating building: ${buildingData.buildingName}`);

            // Create building
            const building = await BuildingsModel.create({
                buildingName: buildingData.buildingName,
                societyName: buildingData.societyName,
                address: buildingData.address,
                territory: buildingData.territory,
                city: buildingData.city,
                state: buildingData.state,
                pincode: buildingData.pincode,
                buildingType: buildingData.buildingType,
                totalBlocks: buildingData.blocks.length,
                totalUnits: 0, // Will update after creating units
                status: buildingData.status
            });

            let totalUnitsInBuilding = 0;

            // Create blocks
            for (const blockData of buildingData.blocks) {
                console.log(`  🏢 Creating block: ${blockData.blockName}`);

                const block = await BlocksModel.create({
                    blockName: blockData.blockName,
                    buildingId: building._id,
                    totalFloors: blockData.floors.length,
                    totalUnits: 0 // Will update after creating units
                });

                let totalUnitsInBlock = 0;

                // Create floors
                for (let floorIndex = 0; floorIndex < blockData.floors.length; floorIndex++) {
                    const floorName = blockData.floors[floorIndex];
                    console.log(`    📐 Creating floor: ${floorName}`);

                    const floor = await FloorsModel.create({
                        floorName,
                        blockId: block._id,
                        totalUnits: blockData.unitsPerFloor
                    });

                    // Create units
                    for (let unitIndex = 0; unitIndex < blockData.unitsPerFloor; unitIndex++) {
                        const unitNumber = generateUnitNumber(blockData.blockName, floorIndex, unitIndex);
                        const unitTypeIndex = (floorIndex + unitIndex) % unitTypes.length;
                        const unitStatus = Math.random() > 0.3 ? 'Vacant' : 'Occupied'; // 70% vacant, 30% occupied

                        await UnitsModel.create({
                            unitNumber,
                            unitType: unitTypes[unitTypeIndex],
                            area: unitAreas[unitTypeIndex],
                            floorId: floor._id,
                            blockId: block._id,
                            unitStatus
                        });

                        totalUnitsInBlock++;
                        totalUnitsInBuilding++;
                    }
                }

                // Update block total units
                block.totalUnits = totalUnitsInBlock;
                await block.save();
            }

            // Update building total units
            building.totalUnits = totalUnitsInBuilding;
            await building.save();

            console.log(`✅ ${buildingData.buildingName} created with ${totalUnitsInBuilding} units\n`);
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Buildings: ${await BuildingsModel.countDocuments()}`);
        console.log(`   Blocks: ${await BlocksModel.countDocuments()}`);
        console.log(`   Floors: ${await FloorsModel.countDocuments()}`);
        console.log(`   Units: ${await UnitsModel.countDocuments()}`);

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
        process.exit(0);
    }
};

// Run seeding
connectDB().then(() => {
    seedDatabase();
});
