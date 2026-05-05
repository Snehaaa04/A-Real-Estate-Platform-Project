const mongoose = require('mongoose');

async function fixIndices() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://clearestate_db_user:sepm%40estate%23756122*all@cluster0.k4p6ilq.mongodb.net/clear-estate?retryWrites=true&w=majority";
    await mongoose.connect(uri);
    const collection = mongoose.connection.collection('users');
    try {
      await collection.dropIndex('id_1');
      console.log('Dropped id_1');
    } catch(e) { console.log('No id_1'); }
  } catch(e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixIndices();
