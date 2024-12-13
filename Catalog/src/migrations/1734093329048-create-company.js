module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Companys', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
              CompanyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        
      },
      CompanyName: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      CompanysName: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      CompanyLogo: {
        type: Sequelize.BLOB,
        allowNull: true,
        
      },
      CompanyNo1: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      CompanyNo2: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      Address: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      AddressLine2: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      AddressLine3: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      GSTNo: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      GSTWEF: {
        type: Sequelize.DATE,
        allowNull: true,
        
      },
      IsVisible: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        
      },
      Remarks: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      MerchantKey: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },
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
      await queryInterface.dropTable('Companys');
    }
  };