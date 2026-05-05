const mongoose = require('mongoose');

async function dropIndex() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://user:password@cluster.mongodb.net/clear_estate";
    console.log("Connecting to", uri);
    await mongoose.connect(uri);
    
    // We get the raw collection to drop index by name
    const collection = mongoose.connection.collection('users');
    
    try {
      await collection.dropIndex('email_1');
      console.log('Successfully dropped index: email_1');
    } catch (err) {
      console.log('Index email_1 not found or already dropped.', err.message);
    }
    
    // Explicitly create the new one just in case mongoose hasn't yet
    try {
      await collection.createIndex({ email: 1, role: 1 }, { unique: true });
      console.log('Successfully created compound index {email: 1, role: 1}');
    } catch (err) {
      console.log('Error creating compound index:', err.message);
    }
    
  } catch (error) {
    console.error("Connection error", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

dropIndex();
