import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { DBConnect } from './index.js';

const MaintenanceBillsSchema = new Schema({
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: 'buildings',
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidDate: {
        type: Date
    },
    paymentMethod: {
        type: String
    },
    transactionId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

MaintenanceBillsSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

// Indexes
MaintenanceBillsSchema.index({ buildingId: 1 });
MaintenanceBillsSchema.index({ isDeleted: 1, billStatus: 1 });
MaintenanceBillsSchema.index({ createdAt: -1 });

const MaintenanceBillsModel = DBConnect.model('maintenancebills', MaintenanceBillsSchema);

MaintenanceBillsModel.syncIndexes().then(() => {
    console.log('MaintenanceBills Model Indexes Synced')
}).catch((err) => {
    console.log('MaintenanceBills Model Indexes Sync Error', err)
});

// Sample Seed Data Function
// Usage: Call MaintenanceBillsModel.seedSampleData(unitId, buildingId) to create sample bills
MaintenanceBillsModel.seedSampleData = async function(unitId, buildingId) {
    try {
        // Check if bills already exist for this unit
        const existingBills = await this.find({ unitId });
        if (existingBills.length > 0) {
            console.log('✅ Sample maintenance bills already exist for this unit');
            return existingBills;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // 1-12
        const currentYear = currentDate.getFullYear();

        const sampleBills = [];

        // Create bills for last 6 months
        for (let i = 0; i < 6; i++) {
            let month = currentMonth - i;
            let year = currentYear;

            // Handle year rollover
            if (month <= 0) {
                month = month + 12;
                year = year - 1;
            }

            // Create due date (15th of each month)
            const dueDate = new Date(year, month - 1, 15);

            // Determine if bill is paid (last 3 months paid, current month unpaid)
            const isPaid = i >= 1;

            const bill = {
                unitId,
                buildingId,
                month,
                year,
                amount: 5000, // ₹5000 per month
                dueDate,
                isPaid,
                paidDate: isPaid ? new Date(year, month - 1, Math.floor(Math.random() * 10) + 5) : null,
                paymentMethod: isPaid ? ['UPI', 'Credit Card', 'Net Banking'][Math.floor(Math.random() * 3)] : null,
                transactionId: isPaid ? `TXN${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
            };

            sampleBills.push(bill);
        }

        const createdBills = await this.insertMany(sampleBills);
        console.log(`✅ Created ${createdBills.length} sample maintenance bills`);
        return createdBills;
    } catch (error) {
        console.error('❌ Error seeding sample maintenance bills:', error);
        throw error;
    }
};

export default MaintenanceBillsModel;