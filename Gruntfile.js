var webpackDistConfig = require("./webpack/webpack.production.config.js");
var glob = require("glob");
var slice = [].slice;
var log = function() {
    return console.log.apply(console, ["GRUNT".yellow].concat(slice.call(arguments)));
};

module.exports = function(grunt) {
    var customConfig, name, pkg, replaceMap, results, taskArray, taskName, tasks, dryrun;
    pkg = grunt.file.readJSON("package.json");
    dryrun = grunt.option("dry-run") ? "--dryrun" : "";

    replaceMap = {};
    replaceMap["{{version}}"] = "" + pkg.version;

    replaceMap["<!--remove-->(.|\n)*<!--endremove-->"] = "";

    customConfig = {
        webpack: {
            options: webpackDistConfig,
            dist: {
                cache: false
            }
        },
        copy: {
            index: {
                files: [
                    {
                        src: ["client/index.html"],
                        dest: "build/<%= relativePath %>/index.dust"
                    }
                ]
            },
            pkg: {
                files: [
                    {
                        src: ["package.json"],
                        dest: "build/<%= relativePath %>/package.json"
                    }
                ]
            },
            deploy: {
                files: [
                    {
                        expand: true,
                        cwd: "build/<%= relativePath %>/",
                        src: ["**"],
                        dest: pkg.deploy + "/" + pkg.version
                    }
                ],
                options: {
                    processContentExclude: ["**/*.{png,gif,jpg,ico,psd,ttf,otf,woff,svg}"],
                    process: function(src, srcpath) {
                        var file, i, k, len, ref, ref1, replaceFiles, v;
                        replaceFiles =
                            (ref = grunt.config("deployReplaceFiles")) != null
                                ? ref
                                : grunt.config("deployReplaceFiles", glob.sync("build/**/{index.dust,app.js,appcache.mf}"));
                        for (i = 0, len = replaceFiles.length; i < len; i++) {
                            file = replaceFiles[i];
                            if (!(file.indexOf(srcpath) >= 0)) {
                                continue;
                            }
                            log("Replacing file...", file);
                            ref1 = replaceMap;
                            for (k in ref1) {
                                v = ref1[k];
                                log("Replacing key", k, "with value", v);
                                src = src.replace(new RegExp(k, "g"), v);
                            }
                        }
                        return src;
                    }
                }
            }
        }
    };

    tasks = {
        build: ["clean", "copy:index", "webpack", "copy:pkg"],
        dist: ["build", "copy:deploy"],
        test: []
    };

    grunt.config.init(defaultConfig);
    grunt.config.merge(customConfig);
    for (name in pkg.devDependencies) {
        if (name.slice(0, 6) === "grunt-" && name) {
            grunt.loadNpmTasks(name);
        }
    }
    results = [];
    for (taskName in tasks) {
        taskArray = tasks[taskName];
        results.push(grunt.registerTask(taskName, taskArray));
    }
    return results;
};
