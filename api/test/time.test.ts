import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index'; // Adjust the path if necessary
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const { expect } = chai;

// Integrate chai-http with chai
chai.use(chaiHttp);

describe('GET /time', () => {
  it('should return a response that matches the JSON schema', (done) => {
    const authToken = process.env.AUTH_TOKEN;
    if (!authToken) {
      throw new Error('AUTH_TOKEN is not defined');
    }

    chai
      .request(app)
      .get('/time')
      .set('Authorisation', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('epoch').that.is.a('number');
        done();
      });
  });

  it('should return 403 Forbidden when no Authorisation header is provided', (done) => {
    chai
      .request(app)
      .get('/time')
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should return 403 Forbidden when incorrect Authorisation header is provided', (done) => {
    chai
      .request(app)
      .get('/time')
      .set('Authorisation', 'wrongtoken')
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
});
