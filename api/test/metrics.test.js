"use strict";
// test/metrics.test.ts
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
describe('GET /metrics', () => {
    it('should return Prometheus metrics when provided correct Authorisation header', (done) => {
        const authToken = process.env.AUTH_TOKEN;
        if (!authToken) {
            throw new Error('AUTH_TOKEN is not defined');
        }
        chai_1.default
            .request(index_1.default)
            .get('/metrics')
            .set('Authorisation', authToken) // Ensure consistent header name
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', /^text\/plain/);
            expect(res.text).to.include('# HELP'); // Basic check for Prometheus metrics format
            done();
        });
    });
    it('should return 403 Forbidden when no Authorisation header is provided', (done) => {
        chai_1.default
            .request(index_1.default)
            .get('/metrics')
            .end((err, res) => {
            expect(res).to.have.status(403);
            done();
        });
    });
    it('should return 403 Forbidden when incorrect Authorisation header is provided', (done) => {
        chai_1.default
            .request(index_1.default)
            .get('/metrics')
            .set('Authorisation', 'wrongtoken')
            .end((err, res) => {
            expect(res).to.have.status(403);
            done();
        });
    });
});
//# sourceMappingURL=metrics.test.js.map