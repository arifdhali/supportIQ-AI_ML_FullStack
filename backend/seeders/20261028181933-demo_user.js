
'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const users = [
      {
        firstName: 'Arif',
        lastName: 'Khan',
        email: 'arif@example.com',
        photo: null,
        roles: 'user',
        createdAt: now,
        updatedAt: now,
        status: true,
        password: await bcrypt.hash('User@123', 10),
      },
      {
        firstName: 'Rahul',
        lastName: 'Das',
        email: 'rahul@example.com',
        photo: null,
        roles: 'user',
        createdAt: now,
        updatedAt: now,
        status: true,
        password: await bcrypt.hash('User@123', 10),
      },
      {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya@example.com',
        photo: null,
        roles: 'user',
        createdAt: now,
        updatedAt: now,
        status: true,
        password: await bcrypt.hash('User@123', 10),
      },
      {
        firstName: 'Amit',
        lastName: 'Roy',
        email: 'amit.agent@example.com',
        photo: null,
        roles: 'agent',
        createdAt: now,
        updatedAt: now,
        status: true,
        password: await bcrypt.hash('Agent@123', 10),
      },
      {
        firstName: 'Neha',
        lastName: 'Sen',
        email: 'neha.admin@example.com',
        photo: null,
        roles: 'admin',
        createdAt: now,
        updatedAt: now,
        status: true,
        password: await bcrypt.hash('Admin@123', 10),
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});


    const [userRows] = await queryInterface.sequelize.query(`
      SELECT id
      FROM Users
      WHERE roles = 'agent'
    `);


    const [departmentRows] = await queryInterface.sequelize.query(`
      SELECT id
      FROM Departments
      WHERE status = true
      ORDER BY id ASC
    `);

    if (!userRows.length) {
      throw new Error('No users with the agent role were found.');
    }

    if (!departmentRows.length) {
      throw new Error('No active departments were found.');
    }


    const agents = userRows.map((user, index) => ({
      userId: user.id,
      department_id:
        departmentRows[index % departmentRows.length].id,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('Agents', agents, {});
  },

  async down(queryInterface, Sequelize) {



    await queryInterface.bulkDelete('Users', {
      email: [
        'arif@example.com',
        'rahul@example.com',
        'priya@example.com',
        'amit.agent@example.com',
        'neha.admin@example.com'
      ]
    }, {});
  }
};
