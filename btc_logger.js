

const btcLogType = {
	"DISABLE_LOG" : 0,
	"CONSOLE_LOG" : 1,
	"REMOTE_LOG" : 2,
	"FILE_LOG" : 3
}

const btcLogLevel = {
	ERROR: log4javascript.Level.ERROR,
	WARN:  log4javascript.Level.WARN,
	INFO:  log4javascript.Level.INFO,
	DEBUG: log4javascript.Level.DEBUG
}

function initBtcLogger(context, defLogLevel, logType, batchSz) {

	var btcAppConfig = getConfig();

    var btcLogger = log4javascript.getLogger(context);
	
	if ( logType == btcLogType.DISABLE_LOG ) {
		return btcLogger;
	}
	
	if ( logType == btcLogType.CONSOLE_LOG ) {
		var consoleAppender = new log4javascript.BrowserConsoleAppender();
		consoleAppender.setLayout(new log4javascript.PatternLayout("%d{HH:mm:ss} %c %p %m"));

		if (defLogLevel) {
			btcLogger.setLevel(defLogLevel);
		} else {
			btcLogger.setLevel(log4javascript.Level.ALL);
		}

		btcLogger.addAppender(consoleAppender);
	
	} else if ( logType == btcLogType.REMOTE_LOG ) {
	
		var logSvrURL = btcAppConfig.btc_logserver_endpoint+"/AppDebugLogger"
		console.log("initBtcLogger: logSvrURL="+logSvrURL);
	
		var ajaxAppender = new log4javascript.AjaxAppender(logSvrURL);
		
		ajaxAppender.setBatchSize(1);
		ajaxAppender.setThreshold(log4javascript.Level.ALL);

		if (defLogLevel) {
			ajaxAppender.setThreshold(defLogLevel);
		}
		
		if (batchSz) {
			ajaxAppender.setBatchSize(batchSz);
		} 
		
		//ajaxAppender.sendAll();
		ajaxAppender.setSendAllOnUnload(); // send all remaining messages on window.beforeunload()
		//ajaxAppender.setLayout(new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n"));
		ajaxAppender.setLayout(new log4javascript.JsonLayout(true, false));
		ajaxAppender.addHeader("Content-Type", "application/json");
		btcLogger.addAppender(ajaxAppender);
		
	}
		
	
    return btcLogger;
}