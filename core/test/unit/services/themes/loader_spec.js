var should = require('should'),
    sinon = require('sinon'),
    fs = require('fs-extra'),
    tmp = require('tmp'),
    join = require('path').join,
    config = require('../../../../server/config'),
    themes = require('../../../../server/services/themes'),
    themeList = themes.list;

describe('Themes', function () {
    afterEach(function () {
        sinon.restore();
    });

    describe('Loader', function () {
        var themePath;

        beforeEach(function () {
            themePath = tmp.dirSync({unsafeCleanup: true});
            sinon.stub(config, 'getContentPath').withArgs('themes').returns(themePath.name);
        });

        afterEach(function () {
            themePath.removeCallback();
        });

        describe('Load All', function () {
            it('should load directory and include only folders', function (done) {
                // create trash
                fs.writeFileSync(join(themePath.name, 'aquarius.zip'));
                fs.writeFileSync(join(themePath.name, '.DS_Store'));

                // create actual theme
                fs.mkdirSync(join(themePath.name, 'aquarius'));
                fs.mkdirSync(join(themePath.name, 'aquarius', 'partials'));
                fs.writeFileSync(join(themePath.name, 'aquarius', 'index.hbs'));
                fs.writeFileSync(join(themePath.name, 'aquarius', 'partials', 'navigation.hbs'));

                themes.loadAll()
                    .then(function (result) {
                        var themeResult = themeList.getAll();

                        // Loader doesn't return anything
                        should.not.exist(result);

                        themeResult.should.eql({
                            aquarius: {
                                name: 'aquarius',
                                path: join(themePath.name, 'aquarius'),
                                'package.json': null
                            }
                        });

                        done();
                    })
                    .catch(done);
            });

            it('should read directory and read package.json if present', function (done) {
                // create trash
                fs.writeFileSync(join(themePath.name, 'README.md'));
                fs.writeFileSync(join(themePath.name, 'Thumbs.db'));

                // create actual theme
                fs.mkdirSync(join(themePath.name, 'aquarius'));
                fs.mkdirSync(join(themePath.name, 'not-aquarius'));
                fs.writeFileSync(
                    join(themePath.name, 'aquarius', 'package.json'),
                    JSON.stringify({name: 'aquarius', version: '0.1.2'})
                );

                themes.loadAll()
                    .then(function (result) {
                        var themeResult = themeList.getAll();

                        // Loader doesn't return anything
                        should.not.exist(result);

                        themeResult.should.eql({
                            aquarius: {
                                name: 'aquarius',
                                path: join(themePath.name, 'aquarius'),
                                'package.json': {name: 'aquarius', version: '0.1.2'}
                            },
                            'not-aquarius': {
                                name: 'not-aquarius',
                                path: join(themePath.name, 'not-aquarius'),
                                'package.json': null
                            }
                        });

                        done();
                    })
                    .catch(done);
            });
        });

        describe('Load One', function () {
            it('should read directory and include only single requested theme', function (done) {
                // create trash
                fs.writeFileSync(join(themePath.name, 'aquarius.zip'));
                fs.writeFileSync(join(themePath.name, '.DS_Store'));

                // create actual theme
                fs.mkdirSync(join(themePath.name, 'aquarius'));
                fs.writeFileSync(join(themePath.name, 'aquarius', 'index.hbs'));
                fs.writeFileSync(
                    join(themePath.name, 'aquarius', 'package.json'),
                    JSON.stringify({name: 'aquarius', version: '0.1.2'})
                );
                fs.mkdirSync(join(themePath.name, 'not-aquarius'));
                fs.writeFileSync(join(themePath.name, 'not-aquarius', 'index.hbs'));

                themes.loadOne('aquarius')
                    .then(function (themeResult) {
                        themeResult.should.eql({
                            name: 'aquarius',
                            path: join(themePath.name, 'aquarius'),
                            'package.json': {name: 'aquarius', version: '0.1.2'}
                        });

                        done();
                    })
                    .catch(done);
            });

            it('should throw an error if theme cannot be found', function (done) {
                // create trash
                fs.writeFileSync(join(themePath.name, 'aquarius.zip'));
                fs.writeFileSync(join(themePath.name, '.DS_Store'));

                themes.loadOne('aquarius')
                    .then(function () {
                        done('Should have thrown an error');
                    })
                    .catch(function (err) {
                        err.message.should.eql('Package not found');
                        done();
                    });
            });
        });
    });
});
