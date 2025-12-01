import sequelize from '../src/database';
import '../src/models/Inventory';
import '../src/models/Location';

const clearAll = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔌 Successfully connected to the database.');
        console.log('🗑️  Deleting all tables...');

        await sequelize.sync({ force: true });

        console.log('✅ Database fully cleared!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during clearing:', error);
        process.exit(1);
    }
};

void clearAll();