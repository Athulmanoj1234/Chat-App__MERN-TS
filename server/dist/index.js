"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./models/users"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
const port = 4001;
const salt = bcrypt_1.default.genSaltSync(10);
app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:5175' }));
app.use(express_1.default.json());
mongoose_1.default.connect('mongodb://localhost:27017/CHATAPP').then(() => {
    console.log('database is connected');
});
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (req.body) {
        const userDoc = await users_1.default.create({
            username,
            email,
            password: bcrypt_1.default.hashSync(password, salt),
        });
        res.json(userDoc);
    }
    else {
        res.json({ messege: "did not receiced userdata" });
    }
});
app.listen(port, () => {
    console.log(`you are listening to the port ${port}`);
});
//# sourceMappingURL=index.js.map