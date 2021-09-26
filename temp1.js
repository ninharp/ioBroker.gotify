let lastMessageTime = 0;
let lastMessageText = '';

let adapter;

function startAdapter(options) {
	
    options = options || {};
    Object.assign(options, {name: adapterName});
    adapter = new utils.Adapter(options);

    adapter.on('message', obj => obj && obj.command === 'send' && obj.message && processMessage(obj.message, obj));

    adapter.on('ready', () => main());
	//adapter.log.info("Gotify Notification Adapter started!");
	//utils.console.log("dfssdf");
    return adapter;
}

function processMessage(message, obj) {
    // filter out double messages
    const json = JSON.stringify(message);
    if (lastMessageTime && lastMessageText === JSON.stringify(message) && new Date().getTime() - lastMessageTime < 1000) {
        return adapter.log.debug('Filter out double message [first was for ' + (new Date().getTime() - lastMessageTime) + 'ms]: ' + json);
    }
    lastMessageTime = new Date().getTime();
    lastMessageText = json;

    sendNotification(message, error =>
        obj && obj.callback && adapter.sendTo(obj.from, obj.command, {error}, obj.callback));
}

function main() {
    // Adapter is listening on messages
}

function sendNotification(message, callback) {
    if (!message) message = {};
    let push;
    let isDelete = false;

	/*
    if (message.token) {
        isDelete = true;
        push = new Pushsafer({
            k:     message.token,
            debug: process.argv[3] === 'debug'
        });
    } else if (!pushsafer) {
        if (adapter.config.token) {
            pushsafer = new Pushsafer({
                k:     adapter.config.token,
                debug: process.argv[3] === 'debug'
            });
            push = pushsafer;
        } else {
            adapter.log.error('Cannot send notification while not configured');
            return callback && callback('Cannot send notification while not configured');
        }
    } else {
        push = pushsafer;
    }
	*/

    if (!push) {
        return;
    }

    if (typeof message !== 'object') {
        message = {message: message};
    }

    message.m         = message.message   || message.m  || '';
    message.t         = message.title     || message.t  || adapter.config.title;
    message.pr        = message.priority  || message.pr || adapter.config.priority;

    if (message.url) {
        message.u = message.url;
    }
    if (message.urlTitle) {
        message.ut = message.urlTitle;
    }

    let data;
    let parts;

    if (message.message   !== undefined) delete message.message;
    if (message.title     !== undefined) delete message.title;
    if (message.priorty   !== undefined) delete message.priorty;
    if (message.token     !== undefined) delete message.token;

    adapter.log.debug('Send gotify notification: ' + message.m);

//    if (message.c  !== null && message.c  !== undefined) message.c  = message.c.toString();
/*
    push.send(message, (err, result) => {
        if (isDelete) {
            setTimeout(() => push = null, 500);
        }
        try {
            result = JSON.parse(result);
        } catch (e) {
            adapter.log.error('Cannot parse answer: ' + result);
        }

        if (err || result.error) {
            adapter.log.error('Cannot send notification: ' + JSON.stringify(err || result.error));
            callback && callback(err || result.error);
            return false;
        } else {
            callback && callback();
            return true;
        }
    });
*/
}

// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
}