"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var sdtin_write_1 = require("../sdtin-write");
var stream_to_string_1 = require("../stream-to-string");
// When it receives a message about what command to execute it executes it and returns the result
process.on('message', function (msg) {
    var initialCPUUsage = process.cpuUsage();
    var initialMemUsage = process.memoryUsage();
    var cp = child_process_1.spawn(msg.cmd, msg.arguments);
    //write to stdin
    sdtin_write_1.writeToStdin(cp, msg.stdin);
    var killTimerId = setTimeout(function () {
        cp.kill();
    }, msg.timeout);
    var resultPromise = [];
    resultPromise.push((stream_to_string_1.streamDataToString(cp.stderr)));
    resultPromise.push(stream_to_string_1.streamDataToString(cp.stdout));
    var pr = Promise.all(resultPromise);
    cp.on('close', function (exitCode) {
        var memUsage = process.memoryUsage();
        pr
            .then(function (result) {
            clearTimeout(killTimerId);
            return result;
        })
            .then(function (result) { return ({
            stderr: result[0],
            stdout: result[1],
            exitCode: exitCode,
            memoryUsage: memUsage.rss - initialMemUsage.rss,
            cpuUsage: process.cpuUsage(initialCPUUsage).user
        }); })
            .then(function (result) {
            process.send && process.send({
                status: 'success',
                executionResult: result
            });
        })
            .catch(function (err) {
            process.send && process.send({
                status: 'error',
                error: err
            });
            clearTimeout(killTimerId);
        });
    });
});
//# sourceMappingURL=index.js.map