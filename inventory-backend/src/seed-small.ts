import sequelize from '../src/database';
import Location from '../src/models/Location';
import Inventory from '../src/models/Inventory';

const seed50 = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');

        const locations = await Location.findAll();

        if (locations.length === 0) {
            console.error('Error: No locations found in the database! Please add locations first.');
            process.exit(1);
        }


        const items = [];
        for (let i = 1; i <= 50; i++) {

            const randomLocation = locations[Math.floor(Math.random() * locations.length)];

            items.push({
                name: `Test Item #${i}`,
                price: Math.floor(Math.random() * 1000) + 10,
                locationId: randomLocation.id
            });
        }


        await Inventory.bulkCreate(items);

        console.log('✅ Successfully added 50 random records!');
        process.exit(0);

    } catch (error) {
        console.error('Error during insertion:', error);
        process.exit(1);
    }
};

void seed50();