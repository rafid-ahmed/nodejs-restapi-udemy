const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('auth middleware', function() {
    it('should throw error if no auth header is present', function() {
        const req = {
            get: function(headerName) {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('No authentication header found.');
    })
    
    it('should throw error if auth header is only one string', function() {
        const req = {
            get: function(headerName) {
                return 'xyz';
            }
    
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should throw error if token cannot be verified', function() {
        const req = {
            get: function(headerName) {
                return 'Bearer xyz';
            }
    
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
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

        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })
})