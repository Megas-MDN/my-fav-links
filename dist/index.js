"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 3001;
app_1.app.listen(port, () => {
    console.log("Server started on port %s 🚀", port);
});
exports.default = app_1.app;
