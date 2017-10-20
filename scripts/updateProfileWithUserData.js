// This script merges user data from `users.md` into `_data/profiles.yml`.
// This is needed to automatically convert existing user data into a new format and location.
// Created: Oct 19, 2017
// Author: Larry Battle - github.com/LarryBattle
const fs = require("fs");
const path = require("path");
const YAML = require("yamljs");
const _ = require("lodash");

const basePath = '../';

const FILE_PATH = {
  USER_PROFILES_YML: path.join(basePath, '_data/profiles.yml'),
  USERS_MD: path.join(basePath, 'users.md'),
  SAVED_FILE: path.join(basePath, '_data/profiles.yml')
};

const validatePath = () => {
  var foundUsers = fs.existsSync(FILE_PATH.USERS_MD);
  var foundProfiles = fs.existsSync(FILE_PATH.USER_PROFILES_YML);
  if (!foundProfiles && !foundUsers) {
    throw new Error("Unable to find any user files. Make sure you're running from the script directory.");
  }
};

var convertUserMdToYml = (usersMd) => {
  return usersMd.split('\n').map(line => {
      if (!/:/.test(line)) return line.trim();

      const [whole, key, value] = line.match(/^([^:]+):(.*)$/);
      let v = value.trim();
      if (!v || v === '-') return '';
      // Looks for markdown link as value
      if (/^\[.*\)$/.test(v)) {
        v = v.match(/\(([^]+)\)$/)[1];
      }
      v = v.replace(/"/g, '\\"');
      const newLine = `${key}: "${v}"`;
      if (/^\s*-/) {
        return newLine;
      }
      return ' '.repeat(2) + newLine;
    })
    .join('\n');
};

const getUsersFromOldFile = () => {
  let users = [];
  try {
    var usersMd = fs.readFileSync(FILE_PATH.USERS_MD, 'utf-8');
    var ymlSource = convertUserMdToYml(usersMd);
    users = YAML.parse(ymlSource);
  } catch (e) {
    console.error(e);
  }
  return users;
};

const getUsersFromCurrentFile = () => {
  let users = [];
  try {
    const profilesConfig = YAML.load(FILE_PATH.USER_PROFILES_YML);
    users = profilesConfig.profiles;
  } catch (e) {
    console.error(e);
  }
  return users;
};

const combineUsers = (users, otherUsers) => {
  var key = "Name";
  return _.filter(
    _.sortBy(
      _.uniqBy(
        _.concat(users, otherUsers),
        key),
      key),
    key);
};

const saveYmlToFile = (ymlConfig) => {
  const str = YAML.stringify(ymlConfig, 3, 2);
  fs.writeFileSync(FILE_PATH.SAVED_FILE, str, 'utf-8');
};

const init = () => {
  validatePath();
  var users = combineUsers(
    getUsersFromOldFile(),
    getUsersFromCurrentFile()
  );
  var ymlToSave = {
    profiles: users
  }
  saveYmlToFile(ymlToSave);
  console.log("Saved users to " + FILE_PATH.SAVED_FILE);
};

init();