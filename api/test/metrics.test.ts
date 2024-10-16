// test/metrics.test.ts

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index'; // Adjust the path if necessary
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { expect } = chai;

// Integrate chai-http with chai
chai.use(chaiHttp);

describe('GET /metrics', () => {
  it('should return Prometheus metrics when provided correct Authorisation header', (done) => {
    const authToken = process.env.AUTH_TOKEN;
    if (!authToken) {
      throw new Error('AUTH_TOKEN is not defined');
    }

    chai
      .request(app)
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
    chai
      .request(app)
      .get('/metrics')
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should return 403 Forbidden when incorrect Authorisation header is provided', (done) => {
    chai
      .request(app)
      .get('/metrics')
      .set('Authorisation', 'wrongtoken')
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
});
