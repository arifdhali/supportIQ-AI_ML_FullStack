
const { Tickets } = require("../models");
const { success } = require("../utils/response");

const createTicket = async (req, res, next) => {
  try {
    const { subject, descriptions, customerId, department_id } = req.body;

    const ticket = await Tickets.create({
      subject,
      descriptions,
      customerId,
      department_id
    });
    success(res,null,"Ticket created successfully",201)
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket };
