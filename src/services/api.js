const axios = require("axios");

const api = axios.create({
  baseURL: "https://hackaengine-dot-red-equinox-253000.appspot.com/sales"
});

const getData = async offset => {
  const baseURL =
    "https://hackaengine-dot-red-equinox-253000.appspot.com/sales";
  const { data } = await api.get(`${baseURL}?offset=${offset}&per_page=200`);
  return data;
};

async function getAllData() {
  let data = [];
  for (let i = 0; i < 7; i++) {
    const set = await getData(i * 200);
    data = data.concat(set);
  }
  return data;
}

function filterValidData(data) {
  return data.filter(item => {
    const { date } = item;
    return date.dia > 20;
  });
}

function groupPerMonth(data) {
  const months = [[], [], []];
  for (item of data) {
    const { date } = item;
    if (date.dia === 21 || date.dia === 22) months[0].push(item);
    if (date.dia === 23 || date.dia === 24) months[1].push(item);
    else months[2].push(item);
  }
  return months;
}

function rateLoyalSales(monthSales) {
  const amountLoyalSales = monthSales
    .filter(sale => {
      const { points } = sale;
      return points !== 0;
    })
    .map(sale => sale.price)
    .reduce((acc, current) => acc + current, 0);

  const totalAmount = monthSales
    .map(sale => sale.price)
    .reduce((acc, current) => acc + current, 0);

  return amountLoyalSales / totalAmount;
}

function modifyData(data) {
  const modifiedData = data.map(sale => {
    const { date } = sale;
    let month;
    if (date.dia === 21 || date.dia === 22) month = 1;
    else if (date.dia === 23 || date.dia === 24) month = 2;
    else month = 3;
    sale["date"]["mes"] = month;
    return sale;
  });

  return modifiedData;
}

//Retorna numero de clientes fidelizados por mês
function membership(data) {
  //Remove this function when using real data
  const modifiedData = modifyData(data);
  const membersPerMonth = [[], [], []];
  const members = new Map();

  for (sale of modifiedData) {
    const { cliente, date, points } = sale;
    if (!members.has(cliente.id) && points !== 0)
      members.set(cliente.id, date.mes);
  }

  members.forEach((v, k) => {
    membersPerMonth[v - 1].push(k);
  });

  return membersPerMonth.map(item => item.length);
}

//retorna numero de clientes que compraram no mes(incluindo não fidelizados)
function countJustOne(data) {
  //remove this when using real data
  const modifiedData = modifyData(data);
  const clientsPerMonth = [];
  const salesPerMonth = [[], [], []];
  for (sale of modifiedData) {
    const { cliente, date } = sale;
    const clientMonth = { id: cliente.id, month: date.mes };
    if (
      !clientsPerMonth.find(
        f => f.id === clientMonth.id && f.month === clientMonth.month
      )
    )
      clientsPerMonth.push(clientMonth);
  }
  for (sale of clientsPerMonth) {
    const index = sale.month - 1;
    salesPerMonth[index].push(sale);
  }

  return salesPerMonth.map(item => item.length);
}

function calculateAdhesion(memberships, clients) {
  const adhesionRatePerMonth = {};
  for (let i = 0; i < 3; i++) {
    adhesionRatePerMonth[i + 1] = memberships[i] / clients[i];
  }
  return adhesionRatePerMonth;
}

function revenue(data) {
  return data
    .map(sale => sale.price)
    .reduce((acc, current) => acc + current, 0);
}

module.exports = {
  getData,
  getAllData,
  filterValidData,
  groupPerMonth,
  rateLoyalSales,
  membership,
  countJustOne,
  calculateAdhesion,
  revenue
};
