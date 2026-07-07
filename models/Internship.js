const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Internship = sequelize.define(
  'Internship',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    requiredSkills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    minimumCGPA: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 10,
      },
    },
    academicYear: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    stipend: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    internshipType: {
      type: DataTypes.ENUM('Remote', 'Onsite', 'Hybrid'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'internships',
    indexes: [
      { fields: ['domain'] },
      { fields: ['location'] },
      { fields: ['internship_type'] },
    ],
  }
);

module.exports = Internship;
