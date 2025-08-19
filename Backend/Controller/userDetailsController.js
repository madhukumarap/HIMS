const db = require("../model/index.model");
const User = db.user;
const { getConnectionList } = require("../model/index.model3");

const updateUser = async (req, res) => {
  const database = req.headers.userDatabase;
  const connectionList = await getConnectionList(database);
  const db = connectionList[database];
  const User = db.user;

  const id = req.params.id;
  const { status } = req.body;
  const user = await User.findByPk(id);
  if (!user) {
    res.status(400).send({ message: "User not found" });
  } else {
    user.status = status;
    const update = await user.save();
    res.send({ message: "User details updated succesfully" });
  }
};

module.exports = updateUser;

// id, name, username, email, phoneNumber, password, createdAt, updatedAt, hospitalId, status
