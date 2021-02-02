const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'enterprise',
  password: 'qwerty21',
  port: 5432,
});
client.connect();

const AddPerson = async (personname, departmentid) => {
  try {
    const query = {
      text: 'INSERT INTO person(personname, departmentid) VALUES ($1, $2)',
      values: [personname, departmentid]
    }
    await client.query(query);
  } catch (error) {
    console.log(`AddPerson: ${error}`)
  }
}

const AddDepartments = async (departmentname) => {
  try {
    const query = {
      text: 'INSERT INTO department(departmentname) VALUES ($1)',
      values: [departmentname]
    }
    await client.query(query);
  } catch (error) {
    console.log(`AddDepartment: ${error}`)
  }
}

const AddSalary = async (personid, salary) => {
  try {
    const query = {
      text: 'INSERT INTO salary(personid, salary) VALUES ($1, $2)',
      values: [personid, salary]
    }
    await client.query(query);
  } catch (error) {
    console.log(`AddDepartment: ${error}`)
  }
}

const InitDB = async () => {
  const departmentsPromises = ['Бухгалерия', 'Поставки'].map(item => AddDepartments(item));
  await Promise.all(departmentsPromises);
  
  const personPromises = [
    {name: 'Иванов', departmentid: 1},
    {name: 'Петров', departmentid: 1},
    {name: 'Сидоров', departmentid: 2},
  ].map(item => AddPerson(item.name, item.departmentid));
  await Promise.all(personPromises);
  
  const salaryPromises = [
    {personid: 1, salary: 10000},
    {personid: 2, salary: 20000},
    {personid: 3, salary: 23000},
  ].map(item => AddSalary(item.personid, item.salary));
  await Promise.all(salaryPromises);
}

const SalaryQuery = async () => {
  try {
    query = {
      text: `
        SELECT 
          p.personname AS "Фамилия",
          d.departmentname AS "Департамент",
          s.salary AS "Зарплата"
        FROM person AS p
        INNER JOIN department as d ON p.departmentid = d.departmentid
        INNER JOIN salary as s ON p.personid = s.personid;
      `
    }
    const result = (await client.query(query)).rows;
    console.log('Запрос 1');
    console.table(result);
  } catch (error) {
    console.log(`Salary query: ${error}`)
  }
}

const AvgDepartmentSalary = async () => {
  try {
    query = {
      text: `
        SELECT 
          p.personname AS "Фамилия",
          d.departmentname AS "Департамент",
          s.salary AS "Зарплата",
          AVG(s.salary) over (PARTITION BY d.departmentid) AS "Средняя по департаменту"
        FROM person AS p
        INNER JOIN department as d ON p.departmentid = d.departmentid
        INNER JOIN salary as s ON p.personid = s.personid
      `
    }
    const result = (await client.query(query)).rows;
    console.log('Запрос 2');
    console.table(result)
  } catch (error) {
    console.log(`Salary query: ${error}`)
  }
}
//InitDB();
const Queries = async () => {
  await SalaryQuery()
  await AvgDepartmentSalary();
  client.end();
}

Queries();

