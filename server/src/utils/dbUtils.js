const mongoose = require("mongoose");

const supportsTransactions = async () => {
  const db = mongoose.connection.db;
  if (!db) return false;

  const admin = db.admin();
  try {
    const info = await admin.command({ hello: 1 });
    return Boolean(info.setName || info.msg === "isdbgrid");
  } catch (error) {
    try {
      const info = await admin.command({ ismaster: 1 });
      return Boolean(info.setName || info.msg === "isdbgrid");
    } catch (innerError) {
      return false;
    }
  }
};

const runWithSession = async (operation) => {
  const session = await mongoose.startSession();
  const useTransaction = await supportsTransactions();

  if (useTransaction) {
    session.startTransaction();
  }

  try {
    const result = await operation(session);

    if (useTransaction) {
      await session.commitTransaction();
    }

    return result;
  } catch (error) {
    if (useTransaction) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  runWithSession,
  supportsTransactions,
};
