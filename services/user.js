const { UserModel } = require("../model/user");

exports.createUserService = async function (data) {
    const user = UserModel({ ...data });
    const error = user.validateSync();
    if (error) {
      throw error;
    }
    await user.save();
    return user;
  };
  
  exports.getUserService = async function (filter) {
    try {
      const user = await UserModel.find({ ...filter })
        .lean()
        .catch((e) => {
          return { error: e.message };
        });
      return user;
    } catch (error) {
      return { error: error.message };
    }
  };