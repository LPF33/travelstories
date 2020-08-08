const bcrypt = require("bcryptjs");

exports.hash = password => {
    return bcrypt.genSalt().then(salt => {
        return bcrypt.hash(password, salt);
    });
};

exports.compare = (password, hash) => {
    return bcrypt.compare(password, hash);
};