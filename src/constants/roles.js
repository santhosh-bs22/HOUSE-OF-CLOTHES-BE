const Roles = Object.freeze({
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER"
});

module.exports = {
    Roles,
    ROLES_LIST: Object.values(Roles)
};

