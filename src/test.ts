// test-connection.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('insuretech', 'staging', 'staging', {
  host: 'localhost',
  dialect: 'postgres',
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection successful');
  } catch (error) {
    console.error('Unable to connect:', error);
  }
}

testConnection();
