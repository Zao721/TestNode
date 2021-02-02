INSERT INTO person(personid, personname, departmentid) VALUES
  (1, "Иванов", 1),
  (2, "Петров", 1),
  (3, "Сидоров", 2);

INSERT INTO department(departmentid,departmentname) VALUES
  (1, "Бухгалтерия"),
  (2, "Поставки");

INNER INTO salary(personid, salary) VALUES
  (1, 10000),
  (2, 20000),
  (3, 23000);
  
-- Запрос 1
SELECT 
  p.personname AS "Фамилия",
  d.departmentname AS "Департамент",
  s.salary AS "Зарплата"
FROM person AS p
INNER JOIN department as d ON p.departmentid = d.departmentid
INNER JOIN salary as s ON p.personid = s.personid;
-- Запрос 2
SELECT 
  p.personname AS "Фамилия",
  d.departmentname AS "Департамент",
  s.salary AS "Зарплата",
  AVG(s.salary) over (PARTITION BY d.departmentid) AS "Средняя по департаменту"
FROM person AS p
INNER JOIN department as d ON p.departmentid = d.departmentid
INNER JOIN salary as s ON p.personid = s.personid