const { LoanModel } = require("../model/loan");

const INTEREST_RATE = 0.08;
const DAILY_INTEREST_RATE = 0.01;
const PENALTY_AFTER_15_DAYS = 0.02;

exports.createLoanService = async function (data, createdDate) {
  const loan = LoanModel({ ...data });
  const error = loan.validateSync();
  if (error) {
    throw error;
  }

  const timeDifference = loan.dueDate - (createdDate || new Date()); //dynamic createdDate for simulation purpose
  const dayDifference = Math.abs(
    Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  );
  loan.interest =
    loan.principle * (INTEREST_RATE / dayDifference) * (dayDifference / 365);
  loan.amount = loan.principle + loan.interest * dayDifference;
  loan.duration = dayDifference;
  await loan.save();
  return loan;
};

const withPenalty = (loan) => {
  const timeElapse = loan.dueDate - new Date();
  const dayDifference = Math.floor(timeElapse / 1000 / 60 / 60 / 24);
  const interest = loan.amount * DAILY_INTEREST_RATE * (dayDifference / 365);
  const penaltyAfter15Days = 0.02;
  loan.totalPenalty =
    loan.amount * interest * dayDifference +
    loan.principle * (dayDifference / 15) * penaltyAfter15Days;
};

exports.getLoanService = async function (filter) {
  try {
    const loan = await LoanModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          dayDifference: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), "$dueDate"] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          interest: {
            $multiply: ["$amount", DAILY_INTEREST_RATE, "$dayDifference"],
          },
        },
      },
      {
        $addFields: {
          totalPenalty: {
            $add: [
              "$amount",
              "$interest",
              // { $multiply: ["$amount", "$interest", "$dayDifference"] },
              {
                $multiply: [
                  "$principle",
                  { $floor: { $divide: ["$dayDifference", 15] } },
                  PENALTY_AFTER_15_DAYS,
                ],
              },
            ],
          },
        },
      },
    ]).catch((e) => {
      return { error: e.message };
    });
    return loan;
  } catch (error) {
    return { error: error.message };
  }
};
