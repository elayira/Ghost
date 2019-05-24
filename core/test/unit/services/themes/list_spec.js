var should = require('should'),
    sinon = require('sinon'),
    _ = require('lodash'),
    themes = require('../../../../server/services/themes'),
    themeList = themes.list;

describe('Themes', function () {
    afterEach(function () {
        sinon.restore();
    });

    describe('List', function () {
        beforeEach(function () {
            themeList.init({
                aquarius: {foo: 'bar'},
                'not-aquarius': {bar: 'baz'}
            });
        });

        it('get() allows getting a single theme', function () {
            themeList.get('aquarius').should.eql({foo: 'bar'});
        });

        it('get() with no args should do nothing', function () {
            should.not.exist(themeList.get());
        });

        it('getAll() returns all themes', function () {
            themeList.getAll().should.be.an.Object().with.properties('aquarius', 'not-aquarius');
            Object.keys(themeList.getAll()).should.have.length(2);
        });

        it('set() updates an existing theme', function () {
            var origaquarius = _.cloneDeep(themeList.get('aquarius'));
            themeList.set('aquarius', {magic: 'update'});

            themeList.get('aquarius').should.not.eql(origaquarius);
            themeList.get('aquarius').should.eql({magic: 'update'});
        });

        it('set() can add a new theme', function () {
            themeList.set('rasper', {color: 'red'});
            themeList.get('rasper').should.eql({color: 'red'});
        });

        it('del() removes a key from the list', function () {
            should.exist(themeList.get('aquarius'));
            should.exist(themeList.get('not-aquarius'));
            themeList.del('aquarius');
            should.not.exist(themeList.get('aquarius'));
            should.exist(themeList.get('not-aquarius'));
        });

        it('del() with no argument does nothing', function () {
            should.exist(themeList.get('aquarius'));
            should.exist(themeList.get('not-aquarius'));
            themeList.del();
            should.exist(themeList.get('aquarius'));
            should.exist(themeList.get('not-aquarius'));
        });

        it('init() calls set for each theme', function () {
            var setSpy = sinon.spy(themeList, 'set');

            themeList.init({test: {a: 'b'}, aquarius: {c: 'd'}});
            setSpy.calledTwice.should.be.true();
            setSpy.firstCall.calledWith('test', {a: 'b'}).should.be.true();
            setSpy.secondCall.calledWith('aquarius', {c: 'd'}).should.be.true();
        });

        it('init() with empty object resets the list', function () {
            themeList.init();
            var result = themeList.getAll();
            should.exist(result);
            result.should.be.an.Object();
            result.should.eql({});
            Object.keys(result).should.have.length(0);
        });
    });
});
