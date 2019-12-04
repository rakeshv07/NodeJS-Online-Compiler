"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Write the stdin into the child process
 * @param proc Child process refrence
 * @param stdin stdin string
 */
function writeToStdin(proc, stdin) {
    if (stdin) {
        proc.stdin.write(stdin + '\r\n', function (err) {
            if (!err) {
                proc.stdin.end();
            }
        });
        proc.stdin.on("error", function (err) {
            // Ignore input if stream is already closed
            return;
        });
    }
}
exports.writeToStdin = writeToStdin;
//# sourceMappingURL=sdtin-write.js.map