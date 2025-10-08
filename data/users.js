import { users } from '../config/mongoCollections.js';

export const createUser = async (username, passwordHash, playerTag) => {
  if (!username || typeof username !== 'string' || !username.trim()) {
    throw 'You must provide a valid username';
  }
  if (!passwordHash || typeof passwordHash !== 'string' || !passwordHash.trim()) {
    throw 'You must provide a valid password';
  }

  const usersCollection = await users();

  const newUser = {
    username: username.trim().toLowerCase(),
    password: passwordHash.trim(), // store hash
    playerTag: playerTag,
    lastBattleTime: null,
    battles: [],
    decks: []
  };

  const insertInfo = await usersCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';

  const user = await usersCollection.findOne({ _id: insertInfo.insertedId });
  user._id = user._id.toString();
  return user;
};

export const getUserByUsername = async (username) => {
  const usersCollection = await users();
  return usersCollection.findOne({ username: username.trim().toLowerCase() });
};


export const getUserByPlayerTag = async (playerTag) => {
  const usersCollection = await users();
  return usersCollection.findOne({ playerTag: playerTag.trim().toUpperCase() });
};