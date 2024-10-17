"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const index_1 = __importDefault(require("../src/index")); // Adjust the path if necessary
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const { expect } = chai_1.default;
// Integrate chai-http with chai
chai_1.default.use(chai_http_1.default);
describe('GET /time', () => {
    it('should return a response that matches the JSON schema', (done) => {
        const authToken = process.env.AUTH_TOKEN;
        if (!authToken) {
            throw new Error('AUTH_TOKEN is not defined');
        }
        chai_1.default
            .request(index_1.default)
            .get('/time')
            .set('Authorisation', authToken)
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('epoch').that.is.a('number');
            done();
        });
    });
    it('should return 403 Forbidden when no Authorisation header is provided', (done) => {
        chai_1.default
            .request(index_1.default)
            .get('/time')
            .end((err, res) => {
            expect(res).to.have.status(403);
            done();
        });
    });
    it('should return 403 Forbidden when incorrect Authorisation header is provided', (done) => {
        chai_1.default
            .request(index_1.default)
            .get('/time')
            .set('Authorisation', 'wrongtoken')
            .end((err, res) => {
            expect(res).to.have.status(403);
            done();
        });
    });
});
//# sourceMappingURL=time.test.js.map