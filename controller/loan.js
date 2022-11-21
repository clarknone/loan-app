const { getLoanService, createLoanService } = require("../services/loan");
const { getUserService } = require("../services/user");

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
  res.redirect("/loan");
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

exports.createLoanAPIontroller = async function (req, res, next) {
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
