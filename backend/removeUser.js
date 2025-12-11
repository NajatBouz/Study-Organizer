require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./models/User'); // Dein User-Modell importieren

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node removeUser.js <email>');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const result = await User.deleteOne({ email });
  if (result.deletedCount === 0) {
    console.log('Kein User mit dieser Email gefunden.');
  } else {
    console.log('User erfolgreich gelöscht:', email);
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
