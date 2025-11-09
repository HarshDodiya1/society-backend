import MaintenanceBillsModel from '../models/MaintenanceBills.js';
import { DBConnect } from '../models/index.js';

async function migrateMaintenance() {
    try {
        console.log('Using existing MongoDB connection...');

        // Get all bills
        const bills = await MaintenanceBillsModel.find({}).lean();
        console.log(`Found ${bills.length} bills to migrate`);

        let updated = 0;
        let skipped = 0;

        for (const bill of bills) {
            // Check if bill needs migration (has old schema fields)
            if (bill.totalOwnerAmount || bill.totalTenantAmount) {
                // Calculate amount from old fields
                const amount = parseInt(bill.totalOwnerAmount || 0) || parseInt(bill.totalTenantAmount || 0) || 0;

                // Update the bill
                await MaintenanceBillsModel.updateOne(
                    { _id: bill._id },
                    {
                        $set: { amount },
                        $unset: {
                            totalOwnerAmount: "",
                            totalTenantAmount: "",
                            lateFeeEnabled: "",
                            lateFeeType: "",
                            lateFeeAmount: "",
                            description: "",
                            published: "",
                            billStatus: "",
                            createdBy: "",
                            updatedBy: "",
                            deletedAt: "",
                            isDeleted: ""
                        }
                    }
                );
                updated++;
                console.log(`✓ Updated bill ${bill._id} - Amount: ₹${amount}`);
            } else if (!bill.amount) {
                // Bill doesn't have amount or old fields - set default
                await MaintenanceBillsModel.updateOne(
                    { _id: bill._id },
                    { $set: { amount: 0 } }
                );
                updated++;
                console.log(`✓ Set default amount for bill ${bill._id}`);
            } else {
                skipped++;
            }
        }

        console.log('\n=== Migration Complete ===');
        console.log(`Updated: ${updated} bills`);
        console.log(`Skipped: ${skipped} bills (already migrated)`);

        await DBConnect.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        await DBConnect.disconnect();
        process.exit(1);
    }
}

migrateMaintenance();
