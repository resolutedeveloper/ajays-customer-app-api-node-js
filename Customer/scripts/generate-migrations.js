// scripts/generate-migrations.js
const fs = require('fs');
const path = require('path');
// const Sequelize = require('sequelize');
// const { sequelize } = require('../src/models'); // Import the sequelize instance from index.js
const logger = require('../src/utils/logger');
const modelsDir = path.join(__dirname, '..', 'src', 'models');
const migrationsDir = path.join(__dirname, '..', 'migrations'); // Use root-level migrations directory

// Check if migrations directory exists, if not create it
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Read all model files from the models directory
fs.readdirSync(modelsDir)
  .filter(file => file !== 'index.js' && file.endsWith('.js')) // Ignore index.js and files not ending with .js
  .forEach(file => {
    const model = require(path.join(modelsDir, file));

    if (model.init) {
      const modelName = model.name;
      const columns = model.rawAttributes;

      // Generate migration file content for each model
      const migrationContent = generateMigration(modelName, columns);

      // Generate a timestamped filename for the migration
      const migrationName = `create-${modelName.toLowerCase()}`;
      const migrationPath = path.join(migrationsDir, `${Date.now()}-${migrationName}.js`);

      // Write migration content to the file
      fs.writeFileSync(migrationPath, migrationContent);
      logger.info(`Generated migration for ${modelName}`);
    }
  });

// Function to generate migration file content
function generateMigration(modelName, columns) {
  const columnDefinitions = Object.keys(columns).map(columnName => {
    const column = columns[columnName];
    const type = column.type.key;
    const allowNull = column.allowNull ? 'allowNull: true' : 'allowNull: false';
    const defaultValue = column.defaultValue ? `defaultValue: ${column.defaultValue}` : '';

    return `      ${columnName}: {
        type: Sequelize.${type.toUpperCase()},
        ${allowNull},
        ${defaultValue}
      }`;
  }).join(',\n');

  return `module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('${modelName}s', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        ${columnDefinitions},
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },

    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('${modelName}s');
    }
  };`;
}
// Exit the script after migration generation
process.exit(0);