
function getConfig() {
    
	var appConfig = {};
				
	//appConfig.btc_ece_fqdn   		= "https://pcceeceweb.pcce.com";
	appConfig.btc_ece_fqdn   		= "https://fcccwewvp01.gosi.ins";
	appConfig.btc_ece_template      = "chat-demo-gosionline"
	appConfig.btc_ece_endpoint    	=  appConfig.btc_ece_fqdn+"/system/templates/chat/"+appConfig.btc_ece_template+"/chat_client.html"
	appConfig.btc_ece_chatpoint     = '1002'
	appConfig.btc_custom_msg        =  appConfig.btc_ece_fqdn+"/system/templates/chat/"+appConfig.btc_ece_template+"/l10n/en-US.json";
	appConfig.btc_survey_fqdn       =  "https://fcccwewvp01.gosi.ins/system/templates/chat/"+appConfig.btc_ece_template+"/survey/sample_survey.html";

	appConfig.btc_logserver_transport 	= "http://";
	appConfig.btc_logserver_ipaddr 		= "localhost";
	appConfig.btc_logserver_port   		= "7860";
	appConfig.btc_logserver_endpoint 	= appConfig.btc_logserver_transport+appConfig.btc_logserver_ipaddr+":"+appConfig.btc_logserver_port;
		
	appConfig.btc_imgdir                = "img/"
	appConfig.btc_imgdir                = "css/"
	
	return appConfig;
					 
}
