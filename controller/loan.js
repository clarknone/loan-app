const { getLoanService, createLoanService } = require("../services/loan");
const { getUserService, createUserService } = require("../services/user");

const validateLoan = (data) => {
  try {
    const isValidAmount = data.principle >= 1;
    // const date = new Date(data.dueDate);
    // const timeDiff = date - new Date();
    // const isValidDueDate = timeDiff > 24 * 60 * 60 * 1000;
    if (isValidAmount && data.dueDate && data.user) {
      return [true];
    } else {
      return [
        false,
        "amount must be greater than 0 and due date must be at least 1 day into the feature",
      ];
    }
  } catch (error) {
    return [false, error.message];
  }
};

exports.getLoanController = async function (req, res, next) {
  let filter = {};

  const loanData = await getLoanService(filter).catch((e) => {
    return { error: e.message };
  });
  const user = await getUserService({});
  console.log(Array.isArray(loanData));
  res.render("Loan", { data: loanData, user });
};

exports.createLoanController = async function (req, res, next) {
  const data = req.body;
  const response = { message: "failed to create loan", status: 400 };
  const [isValid, validateMessage] = validateLoan(data);
  if (!isValid) {
    response.message = validateMessage;
    response.data = { error: validateMessage };
  } else {
    await createLoanService(data)
      .then((loan) => {
        if (loan.error) {
          response.data = loan;
          response.message = loan.error;
        } else {
          response.status = 201;
          response.message = "loan created";
          response.data = loan;
        }
      })
      .catch((e) => {
        response.data = e.message;
      });
  }
  console.log(response);
  res.redirect("/");
};

exports.getAPILoanController = async function (req, res, next) {
  let filter = {};
  const response = { message: "failed to create loan", status: 400 };

  await getLoanService(filter)
    .then((loan) => {
      if (loan.error) {
        response.data = loan;
        response.message = loan.error;
      } else {
        response.status = 200;
        response.message = "request sucessful";
        response.data = loan;
      }
    })
    .catch((e) => {
      response.data = e.message;
    });
  res.status(response.status).send({ ...response });
};

exports.createLoanAPIController = async function (req, res, next) {
  const data = req.body;
  const response = { message: "failed to create loan", status: 400 };

  const [isValid, validateMessage] = validateLoan(data);

  if (!isValid) {
    response.message = validateMessage;
    response.data = { error: validateMessage };
  } else {
    await createLoanService(data)
      .then((loan) => {
        if (loan.error) {
          response.data = loan;
          response.message = loan.error;
        } else {
          response.status = 201;
          response.message = "loan created";
          response.data = loan;
        }
      })
      .catch((e) => {
        response.data = e.message;
      });
  }
  res.status(response.status).send({ ...response });
};

exports.seedAPIController = async function (req, res, next) {
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
    const { firstname, lastName } = item;
    const { principle, dueDate } = item;
    const user = await createUserService({ firstname, lastName });
    const loan = await createLoanService(
      { user: user._id, principle, dueDate },
      item.createdDate
    );
  });
  res.json({ success: true });
};
