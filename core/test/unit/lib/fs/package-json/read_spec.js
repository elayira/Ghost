var should = require('should'),
    tmp = require('tmp'),
    join = require('path').join,
    fs = require('fs-extra'),
    packageJSON = require('../../../../../server/lib/fs/package-json');

describe('lib/fs/package-json: read', function () {
    describe('all', function () {
        it('should read directory and ignore unneeded items', function (done) {
            var packagePath = tmp.dirSync({unsafeCleanup: true});

            // create example theme
            fs.mkdirSync(join(packagePath.name, 'aquarius'));
            fs.writeFileSync(join(packagePath.name, 'aquarius', 'index.hbs'));

            // create some trash
            fs.mkdirSync(join(packagePath.name, 'node_modules'));
            fs.mkdirSync(join(packagePath.name, 'bower_components'));
            fs.mkdirSync(join(packagePath.name, '.git'));
            fs.writeFileSync(join(packagePath.name, '.DS_Store'));

            packageJSON.read.all(packagePath.name)
                .then(function (pkgs) {
                    pkgs.should.eql({
                        aquarius: {
                            name: 'aquarius',
                            path: join(packagePath.name, 'aquarius'),
                            'package.json': null
                        }
                    });

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });

        it('should read directory and parse package.json files', function (done) {
            var packagePath, pkgJson;

            packagePath = tmp.dirSync({unsafeCleanup: true});
            pkgJson = JSON.stringify({
                name: 'test',
                version: '0.0.0'
            });

            // create example theme
            fs.mkdirSync(join(packagePath.name, 'testtheme'));
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'package.json'), pkgJson);
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'index.hbs'));

            packageJSON.read.all(packagePath.name)
                .then(function (pkgs) {
                    pkgs.should.eql({
                        testtheme: {
                            name: 'testtheme',
                            path: join(packagePath.name, 'testtheme'),
                            'package.json': {
                                name: 'test',
                                version: '0.0.0'
                            }
                        }
                    });

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });

        it('should read directory and ignore invalid package.json files', function (done) {
            var packagePath, pkgJson;

            packagePath = tmp.dirSync({unsafeCleanup: true});
            pkgJson = JSON.stringify({
                name: 'test'
            });

            // create example theme
            fs.mkdirSync(join(packagePath.name, 'testtheme'));
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'package.json'), pkgJson);
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'index.hbs'));

            packageJSON.read.all(packagePath.name)
                .then(function (pkgs) {
                    pkgs.should.eql({
                        testtheme: {
                            name: 'testtheme',
                            path: join(packagePath.name, 'testtheme'),
                            'package.json': null
                        }
                    });

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });
    });

    describe('one', function () {
        it('should read directory and ignore unneeded items', function (done) {
            var packagePath = tmp.dirSync({unsafeCleanup: true});

            // create example theme
            fs.mkdirSync(join(packagePath.name, 'aquarius'));
            fs.writeFileSync(join(packagePath.name, 'aquarius', 'index.hbs'));

            // create some trash
            fs.mkdirSync(join(packagePath.name, 'node_modules'));
            fs.mkdirSync(join(packagePath.name, 'bower_components'));
            fs.mkdirSync(join(packagePath.name, '.git'));
            fs.writeFileSync(join(packagePath.name, '.DS_Store'));

            packageJSON.read.one(packagePath.name, 'aquarius')
                .then(function (pkgs) {
                    pkgs.should.eql({
                        aquarius: {
                            name: 'aquarius',
                            path: join(packagePath.name, 'aquarius'),
                            'package.json': null
                        }
                    });

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });

        it('should read directory and parse package.json files', function (done) {
            var packagePath, pkgJson;

            packagePath = tmp.dirSync({unsafeCleanup: true});
            pkgJson = JSON.stringify({
                name: 'test',
                version: '0.0.0'
            });

            // create example theme
            fs.mkdirSync(join(packagePath.name, 'testtheme'));
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'package.json'), pkgJson);
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'index.hbs'));

            packageJSON.read.one(packagePath.name, 'testtheme')
                .then(function (pkgs) {
                    pkgs.should.eql({
                        testtheme: {
                            name: 'testtheme',
                            path: join(packagePath.name, 'testtheme'),
                            'package.json': {
                                name: 'test',
                                version: '0.0.0'
                            }
                        }
                    });

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });

        it('should read directory and ignore invalid package.json files', function (done) {
            var packagePath, pkgJson;

            packagePath = tmp.dirSync({unsafeCleanup: true});
            pkgJson = JSON.stringify({
                name: 'test'
            });

            // create example theme
            fs.mkdirSync(join(packagePath.name, 'testtheme'));
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'package.json'), pkgJson);
            fs.writeFileSync(join(packagePath.name, 'testtheme', 'index.hbs'));

            packageJSON.read.one(packagePath.name, 'testtheme')
                .then(function (pkgs) {
                    pkgs.should.eql({
                        testtheme: {
                            name: 'testtheme',
                            path: join(packagePath.name, 'testtheme'),
                            'package.json': null
                        }
                    });

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });

        it('should read directory and include only single requested package', function (done) {
            var packagePath = tmp.dirSync({unsafeCleanup: true});

            // create trash
            fs.writeFileSync(join(packagePath.name, 'aquarius.zip'));
            fs.writeFileSync(join(packagePath.name, '.DS_Store'));

            // create actual theme
            fs.mkdirSync(join(packagePath.name, 'aquarius'));
            fs.mkdirSync(join(packagePath.name, 'aquarius', 'partials'));
            fs.writeFileSync(join(packagePath.name, 'aquarius', 'index.hbs'));
            fs.writeFileSync(join(packagePath.name, 'aquarius', 'partials', 'navigation.hbs'));
            fs.mkdirSync(join(packagePath.name, 'not-aquarius'));
            fs.writeFileSync(join(packagePath.name, 'not-aquarius', 'index.hbs'));

            packageJSON.read.one(packagePath.name, 'aquarius')
                .then(function (pkgs) {
                    pkgs.should.eql({
                        aquarius: {
                            name: 'aquarius',
                            path: join(packagePath.name, 'aquarius'),
                            'package.json': null
                        }
                    });

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });

        it('should return an error if package cannot be found', function (done) {
            var packagePath = tmp.dirSync({unsafeCleanup: true});

            // create trash
            fs.writeFileSync(join(packagePath.name, 'aquarius.zip'));
            fs.writeFileSync(join(packagePath.name, '.DS_Store'));

            packageJSON.read.one(packagePath.name, 'aquarius')
                .then(function () {
                    done('Should have thrown an error');
                })
                .catch(function (err) {
                    err.message.should.eql('Package not found');
                    done();
                })
                .finally(packagePath.removeCallback);
        });

        it('should return empty object if package is not a directory', function (done) {
            var packagePath = tmp.dirSync({unsafeCleanup: true});

            // create trash
            fs.writeFileSync(join(packagePath.name, 'aquarius.zip'));
            fs.writeFileSync(join(packagePath.name, '.DS_Store'));

            packageJSON.read.one(packagePath.name, 'aquarius.zip')
                .then(function (pkg) {
                    pkg.should.eql({});

                    done();
                })
                .catch(done)
                .finally(packagePath.removeCallback);
        });
    });
});
