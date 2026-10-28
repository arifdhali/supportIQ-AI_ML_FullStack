
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    try {


      await queryInterface.bulkInsert('Departments', [
        {
          name: 'Technical Support',
          description: 'Handles technical issues, bugs, and application errors.',
          status: true,
          createdAt: now,
          updatedAt: now
        },
        {
          name: 'Billing and Payments',
          description: 'Handles payment failures, invoices, and billing disputes.',
          status: true,
          createdAt: now,
          updatedAt: now
        },
        {
          name: 'Customer Service',
          description: 'Handles general inquiries and customer complaints.',
          status: true,
          createdAt: now,
          updatedAt: now
        },
        {
          name: 'Account Management',
          description: 'Handles login issues, password resets, and account access.',
          status: true,
          createdAt: now,
          updatedAt: now
        },
        {
          name: 'Product Support',
          description: 'Handles product questions, feature requests, and usability issues.',
          status: true,
          createdAt: now,
          updatedAt: now
        }
      ], {});
    }catch(err){
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Departments', {
      name: [
        'Technical Support',
        'Billing and Payments',
        'Customer Service',
        'Account Management',
        'Product Support'
      ]
    }, {});
  }
};
