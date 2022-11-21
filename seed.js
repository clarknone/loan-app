const { createLoanService } = require("./services/loan");
const { createUserService } = require("./services/user");

const updateDB = (async function () {
  await require("./config/db");

  const users = [
    {
      firstname: "Mercy",
      lastname: "Fisher",
      principle: 2000,
      dueDate: "2022-12-20",
    },
    {
      firstname: "Bob",
      lastname: "Fisher",
      principle: 200,
      dueDate: "2023-01-20",
    },
    {
      firstname: "Micheal",
      lastname: "Fisher",
      principle: 590,
      dueDate: "2222-11-20",
    },
    {
      firstname: "Dan",
      lastname: "Johnson",
      principle: 600,
      dueDate: "2022-11-20",
      createdDate: new Date("2022-10-20"),
    },
  ];

  users.forEach(async (item) => {
    const { firstname, lastname } = item;
    const { principle, dueDate } = item;
    const user = await createUserService({ firstname, lastname });
    const loan = await createLoanService(
      { user: user._id, principle, dueDate },
      item.createdDate
    );
  });
  return
})();
