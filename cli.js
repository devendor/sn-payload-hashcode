#!/usr/bin/env nodejs

/* eslint-disable node/shebang */

let nopt = require("nopt"),
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    phc = require("."),
    knownOpts = {
        "files": [path, Array],
        "help": Boolean,
        "version": Boolean
    },
    shortHands = {
        "f": ["--files"],
        "file": ["--files"],
        "h": ["--help"],
        "?": ["--help"],
        "v": ["--version"]
    },
    debug = process.env.DEBUG_SN_PAYLOAD_HASH || process.env.DEBUG_SN_PAYLOAD_HASH ? function() {
        console.log.apply(console, arguments); // eslint-disable-line no-console
    } : function() {};


nopt.invalidHandler = function(key, val) {
    throw new Error(key + " was invalid with value \"" + val + "\"");
};

function testFilePath(filepath) {
    try {
        if (filepath !== "-") {
            fs.statSync(filepath);
        }
    } catch (err) {
        throw 'Unable to open path "' + filepath + '"';
    }
}

function checkFiles(parsed) {
    let argv = parsed.argv;
    let isTTY = true;
    let file_params = parsed.files || [];
    let hadGlob = false;

    try {
        isTTY = (process.stdout.isTTY);
    } catch (ex) {
        debug("error querying for isTTY:", ex);
    }

    debug('isTTY: ' + isTTY);

    // assume any remaining args are files
    file_params = file_params.concat(argv.remain);

    parsed.files = [];
    // assume any remaining args are files
    file_params.forEach(function(f) {
        // strip stdin path eagerly added by nopt in '-f -' case
        debug("checkFile-param " + f);
        if (f.length > 1 && f.slice(-2) === '/-') {
            parsed.files.push('-');
            return;
        }

        let foundFiles = [];
        let isGlob = glob.hasMagic(f);

        // Input was a glob. This only hits when shell isn't globbing for us.
        if (isGlob) {
            debug("using glob");
            hadGlob = true;
            foundFiles = glob(f, {
                sync: true,
                absolute: true,
                ignore: ['**/node_modules/**', '**/.git/**']
            });
        } else {
            // Input was not a glob, add it to an array so we are able to handle it in the same loop below
            try {
                testFilePath(f);
            } catch (err) {
                // if file is not found, and the resolved path indicates stdin marker
                if (path.parse(f).base === '-') {
                    f = '-';
                } else {
                    throw err;
                }
            }
            foundFiles = [f];
        }

        if (foundFiles && foundFiles.length) {
            // Add files to the parsed.files if it didn't exist in the array yet
            foundFiles.forEach(function(file) {
                let filePath = path.resolve(file);
                if (file === '-') { // case of stdin
                    parsed.files.push(file);
                } else if (parsed.files.indexOf(filePath) === -1) {
                    parsed.files.push(filePath);
                }
            });
        }
    });

    if ('string' === typeof parsed.outfile && isTTY && !parsed.files.length) {
        testFilePath(parsed.outfile);
        // use outfile as input when no other files passed in args
        parsed.files.push(parsed.outfile);
        // operation is now an implicit overwrite
        parsed.replace = true;
    }

    if (hadGlob || parsed.files.length > 1) {
        parsed.replace = true;
    }

    if (!parsed.files.length && !hadGlob) {
        // read stdin by default
        if (isTTY) {
            console.log("Reading from STDIN"); // eslint-disable-line no-console
            parsed.files.push('-');
        } else {
            throw 'Must pipe input or define at least one file.';
        }
    }

    return parsed;
}


function usage(err) {
    let scriptName = path.basename(process.argv[1]),
        version = require('./package.json').version;
    let msg = [
        scriptName + '@' + version,
        '',
        'CLI OPTIONS:',
        '  -f, --file       Input file(s) (Pass \'-\' for stdin)',
        '  -h, --help       Show this help',
        '  -v, --version   Show package version'


    ];
    /* eslint-disable no-console */
    if (err) {
        msg.push(err);
        msg.push('');
        console.error(msg.join('\n'));
    } else {
        console.log(msg.join('\n'));
    }
    /* eslint-enable */
}

function getDataFromFileOrInput(filepath) {
    return new Promise((resolve) => {
        let _data;
        if (filepath === '-') {
            _data = '';
            process.stdin.on('error', function() {
                throw 'Must pipe input or define at least one file.';
            });
            process.stdin.on('readable', () => {
                let chunk;
                process.stdin.setEncoding('utf8');
                while (null !== (chunk = process.stdin.read())) {
                    _data = _data + chunk;
                }
                resolve(_data);
            });

            process.stdin.on('end', function() {
                if (_data === null) {
                    throw 'Must pipe input or define at least one file.';
                }
            });
            process.stdin.resume();
            //debug(process.stdin)
        } else {
            _data = fs.readFileSync(filepath, 'utf8');
            resolve(_data);
        }
    });
}

async function interpret(argv, slice) {
    let parsed;
    /* eslint-disable no-console,no-process-exit */
    try {
        parsed = nopt(knownOpts, shortHands, argv, slice);
    } catch (ex) {
        usage(ex);
        process.exit(1); // eslint-disable-line no-process-exit
    }

    try {
        checkFiles(parsed);
    } catch (ex) {
        console.error('Run `' + path.basename(process.argv[1]) + ' -h` for help.');
        console.error(ex);
        process.exit(2); // eslint-disable-line no-process-exit
    }
    if (parsed.version) {
        console.log(require('./package.json').version);
        process.exit(0);
    } else if (parsed.help) {
        usage();
        process.exit(0);
    }
    /* eslint-enable */
    let result = {};
    let i;
    for (i = 0; i < parsed.files.length; i++) {
        const data = await getDataFromFileOrInput(parsed.files[i]);
        //debug("Data:" + data);
        //debug(phc.extractPayload(data));
        result[String(parsed.files[i])] = phc.calculatePayloadHashCode(
            data
        );
    }
    if (require.main === module) console.log(JSON.stringify(result,null,2)); // eslint-disable-line no-console
    return result;
}

// interpret args immediately when called as executable
if (require.main === module) {
    interpret();
}
exports.interpret = interpret;
