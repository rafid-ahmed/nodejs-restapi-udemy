const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const AuthMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function() {
    it('should throw error if no auth header is present', function() {
        const req = {
            get: function(headerName) {
                return null;
            }
        };
        expect(AuthMiddleware.bind(this, req, {}, () => {})).to.throw('No authentication header found.');
    })
    
    it('should throw error if auth header is only one string', function() {
        const req = {
            get: function(headerName) {
                return 'xyz';
            }
    
        };
        expect(AuthMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should throw error if token cannot be verified', function() {
        const req = {
            get: function(headerName) {
                return 'Bearer xyz';
            }
    
        };
        expect(AuthMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should yield a userId if token is valid', function() {
        const req = {
            get: function(headerName) {
                return 'Bearer xyz';
            }
    
        };

        // using stub
        sinon.stub(jwt, 'verify')
        jwt.verify.returns({ userId: 'abc' });

        AuthMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })
})