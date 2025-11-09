module.exports = {
  async up(db, client) {
    // Add userId field to committeemembers collection
    // This will be a required field for new documents
    // Existing documents will need to be updated manually or through a script
    await db.collection('committeemembers').updateMany(
      {},
      {
        $set: {
          // We don't set userId here - it will be required only for new documents
          // Existing documents can be updated later if needed
        }
      }
    );

    // Add allocatedTo field to units collection
    // This is optional, so we don't need to add it to existing documents
    await db.collection('units').updateMany(
      {},
      {
        $set: {
          // allocatedTo will be null for existing units
        }
      }
    );

    console.log('Migration completed: Added userId to committeemembers and allocatedTo to units');
  },

  async down(db, client) {
    // Remove userId field from committeemembers collection
    await db.collection('committeemembers').updateMany(
      {},
      {
        $unset: {
          userId: ''
        }
      }
    );

    // Remove allocatedTo field from units collection
    await db.collection('units').updateMany(
      {},
      {
        $unset: {
          allocatedTo: ''
        }
      }
    );

    console.log('Migration rolled back: Removed userId from committeemembers and allocatedTo from units');
  }
};
