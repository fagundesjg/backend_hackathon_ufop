const {
  getAllData,
  filterValidData,
  groupPerMonth,
  rateLoyalSales,
  membership,
  countJustOne,
  calculateAdhesion,
  revenue
} = require("../services/api");

const data = async (req, res) => {
  const data = await getAllData();
  const filteredData = filterValidData(data);
  const groupedPerMonth = groupPerMonth(filteredData);

  const memberships = membership(filteredData);
  const clients = countJustOne(data);
  const adhesionRate = calculateAdhesion(memberships, clients);
  const rev = revenue(data);
  return res.json({ rev });
};

const amountPerMonth = async (req, res) => {
  const data = await getAllData();
  const filteredData = filterValidData(data);
  const groupedPerMonth = groupPerMonth(filteredData);
  const { month } = req.query;
  const salesToEvaluate = revenue(groupedPerMonth[month - 1]);

  return res.json(salesToEvaluate);
};

const adhesionRate = async (req, res) => {
  const { month } = req.query;
};

module.exports = { data, amountPerMonth };
