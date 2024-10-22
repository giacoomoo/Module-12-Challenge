const inquirer = require('inquirer');
const pool = require("./data");
const questions = [
  {
    type: "input",
    name: "action",
    message: "What would you like to do?"
  }
];


inquirer.createPromptModule()(questions).then(answer => {
  const { action } = answer;
  let sql = "";
  switch (action) {
    case "view all departments":
      sql = "SELECT * FROM department";
      break;
    case "view all roles":
      sql = "SELECT * FROM role";
      break;
    case "view all employees":
      sql = "SELECT * FROM employee";
      break;
    case "add a department":
      sql = "INSERT INTO department (name) VALUES ($1) RETURNING *";
      break;
    case "add a role":
      sql = "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *";
      break;
    case "add an employee":
      sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *";
      break;
    case "update an employee's role":
      sql = "UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *";
  }
  return { sql, action };
}).then(data => {
  const { sql, action } = data;
  console.log(sql, action);
  switch (action) {
    case "view all departments":
      pool.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Success!");
        console.log(result.rows);

      });
      break;
    case "view all roles":
      pool.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Success!");
        console.log(result.rows);

      });
      break;
    case "view all employees":
      pool.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Success!");
        console.log(result.rows);

      });
      break;
    case "add a department":
      inquirer.createPromptModule()({
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      }).then(ans => {
        console.log(ans);
        console.log([ans.department]);

        pool.query(sql, [...Object.values(ans)], (err, result) => {
          if (err) throw err;
          console.log("Success!");
          console.log(result.rows);

        });
      });
      break;
    case "add a role":
      inquirer.createPromptModule()([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "input",
          name: "department_id",
          message: "Which department dose the role is belong to?",
        }
      ]).then(ans => {
        console.log(ans);
        ans.department_id = ans.department_id ? parseInt(ans.department_id) : null;
        pool.query(sql, [...Object.values(ans)], (err, result) => {
          if (err) throw err;
          console.log("Success!");
          console.log(result.rows);

        });
      });
      break;
    case "add an employee":
      inquirer.createPromptModule()([
        {
          type: "input",
          name: "fist_name",  
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        {
          type: "input",
          name: "role",
          message: "What is the employee's role?",
        },
        {
          type: "input",
          name: "manager",
          message: "What is the employee's manager?",
        },
      ]).then(ans => {
        console.log(ans);
        ans.role = parseInt(ans.role);
        ans.manager = ans.manager ? parseInt(ans.manager) : null;
        pool.query(sql, [...Object.values(ans)], (err, result) => {
          if (err) throw err;
          console.log("Success!");
          console.log(result.rows);

        });
      });
      break;
    case "update an employee's role":
      break;
  }

});
