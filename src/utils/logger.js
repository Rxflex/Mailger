const chalk = require('chalk');

function system ( message ) {
    console.log( chalk.blue( message ) );
}

function error ( message ) {
    console.log( chalk.red( message ) );
}

function success ( message ) {
    console.log( chalk.green( message ) );
}

function warning ( message ) {
    console.log( chalk.yellow( message ) );
}

function info ( message ) {
    console.log( chalk.cyan( message ) );
}

function debug ( message ) {
    console.log( chalk.magenta( message ) );
}

function log ( message ) {
    console.log( message );
}

function warn ( message ) {
    console.warn( message );
}

function fatal ( message ) {
    console.error( message );
}

function redirect ( target ) {
    console.log( `${chalk.yellow('[REDIRECT]')} Redirecting to ${target}.` );
}

module.exports = {
    system,
    error,
    success,
    warning,
    info,
    debug,
    log,
    warn,
    fatal,
    redirect
}