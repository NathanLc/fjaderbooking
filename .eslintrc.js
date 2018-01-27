module.exports = {
  "extends": "standard",
  "plugins": [
    "standard",
    "promise"
  ],
  "rules": {
    "indent": [1, 2],
    "semi": [1, "always"],
    "no-unused-vars": [1, { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
  }
};
