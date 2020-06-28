
const btcAppConfig = getConfig();
const webChatID = JSON.stringify({"WebChatSession" : getSessionID()})
const btcLogger = initBtcLogger( webChatID, btcLogLevel.DEBUG, btcLogType.CONSOLE_LOG);


var customChatConfig = null;

/* Create a new instance of the eGainLibrarySettings Object */
var myLibrarySettings = new eGainLibrarySettings();

myLibrarySettings.CORSHost = btcAppConfig.btc_ece_fqdn +'/system/';
myLibrarySettings.eGainContextPath = '/system/templates/chat/'+btcAppConfig.btc_ece_template+'/';
myLibrarySettings.IsDevelopmentModeOn = false;
myLibrarySettings.customMsgPath = btcAppConfig.btc_custom_msg;
btcLogger.info("InitConfig: CORSHost: "+myLibrarySettings.CORSHost);
btcLogger.info("InitConfig: eGainContextPath: "+myLibrarySettings.eGainContextPath);
btcLogger.info("InitConfig: customMsgPath: "+myLibrarySettings.customMsgPath);


/* Next create a new instance of the eGainLibrary */
/* passing in the settings you have just created. */
var myLibrary = new eGainLibrary(myLibrarySettings);
/* Now create an instance of the Chat Object */
var myChat = new myLibrary.Chat();
/* Next get the event handlers for chat. It is mandatory to provide definition for the mandatory event handlers before initializing chat */
var myEventHandlers = myChat.GetEventHandlers();

/* Example browser alert when chat is connected */
myEventHandlers.OnConnectSuccess = function (ChatConnectEventArgs) {
    btcLogger.info('OnConnectSuccess: Chat Started!'+JSON.stringify(ChatConnectEventArgs));
	this.myActivityID = ChatConnectEventArgs.ChatID
};

/* Example browser alert when there is a connection failure */
myEventHandlers.OnConnectionFailure = function (args) {
    btcLogger.info('OnConnectionFailure: Oops! Something went wrong');
};

/* Example output of agent messages to a DIV named chatwindow with jQuery */
myEventHandlers.OnAgentMessageReceived = function (agentMessageReceivedEventArgs) {
    const chat_msg = agentMessageReceivedEventArgs.Message;
	btcLogger.info("OnAgentMessageReceived: chat_msg="+chat_msg);
	
	appendAgentChat(chat_msg)
};
/* Example output of system messages to the same DIV */
myEventHandlers.OnSystemMessageReceived = function (systemMessageReceivedEventArgs) {
    const chat_msg = systemMessageReceivedEventArgs.Message;
	btcLogger.info("OnSystemMessageReceived: chat_msg="+chat_msg);

	appendAgentChat(chat_msg)
};
/* Example browser alert when an error occurs */
myEventHandlers.OnErrorOccurred = function (chatErrorOccurredEventArgs) {
    btcLogger.info('OnErrorOccurred: Oops! Something went wrong');
};
/* Example browser alert when agents are not available */
myEventHandlers.OnAgentsNotAvailable = function (agentsNotAvailableEventArgs) {
    btcLogger.info('OnAgentsNotAvailable: Sorry no agents available');
};
/* Example browser alert when the chat is completed */
myEventHandlers.OnConnectionComplete = function () {
	
	const session = this
	btcLogger.info("OnConnectionComplete: myActivityID="+session.myActivityID);
	
	try {
		
		const surveyURL = btcAppConfig.btc_survey_fqdn+"?ACTIVITY_ID="+session.myActivityID;
		btcLogger.info("OnConnectionComplete: surveyURL="+ surveyURL);
		
		window.location = surveyURL
	
	} catch (e) {
		console.log(e)
	}

};
 
myEventHandlers.OnCustTerminateSuccess = function () {
	btcLogger.info("OnCustTerminateSuccess");
};

myEventHandlers.OnConnectionInitialized = function (evt) {
	
	btcLogger.info("OnConnectionInitialized");
	
	const available = evt.checkEligibility.responseType;
	btcLogger.info("OnConnectionInitialized: available="+available);
	
	if (available === 0) {
		console.log("chat.pre-chat")
		startChat();
	} else if (available === 1) {
		
		 btcLogger.info("OnConnectionInitialized: Agents are unavailable");
		appendAgentChat(customChatConfig.EG_CHAT_UNAVAILABLE);
		 
	} else if (available === 2) {
		
		btcLogger.info("OnConnectionInitialized: chat.chat-unavailable");
		appendAgentChat(customChatConfig.EG_CHAT_UNAVAILABLE);
		
	} else {
		btcLogger.info("OnConnectionInitialized: undefined status: "+available)
	}

};

function openForm() {
  $('#myForm').show();
  $('#chat-conv').animate({scrollTop: $('#chat-conv')[0].scrollHeight}, 1000);
}

function closeForm() {
  $('#myForm').hide();
}

function appendAgentChat(chat_msg) {

	const today = new Date();
	const day = today.getDate();
	const month = today.toLocaleString('default', { month: 'long' });
	const timeStr = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
	
	const fromAgent =   '<div class="received-chats">'+
							'<div class="received-msg">'+
							'	<div class="received-msg-inbox">'+
							'		<p>'+chat_msg+'</p>'+
							'		<span class="received-msg-time">'+timeStr+' | '+month+' '+day+'</span>'+
							'	</div>'+
							'</div>'+
						'</div>';

	$('#chat-conv').append(fromAgent);
					
	$('#chat-conv').animate({scrollTop: $('#chat-conv')[0].scrollHeight}, 1000);
	
	$('#sendchat_txt').val("");
	
}

function appendCustomerChat(chat_msg) {

	const today = new Date();
	const day = today.getDate();
	const month = today.toLocaleString('default', { month: 'long' });
	const timeStr = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })


	const fromCust = '<div class="outgoing-chats">'+
					 '	<div class="outgoing-msg">'+
					 '		<div class="outgoing-msg-inbox">'+
					 '			<p>'+chat_msg+'</p>'+
					 '			<span class="outgoing-msg-time">'+timeStr+' | '+month+' '+day+'</span>'+
					 '		</div>'+
					 '	</div>'+
					 '</div>';
	
	$('#chat-conv').append(fromCust);
					
	$('#chat-conv').animate({scrollTop: $('#chat-conv')[0].scrollHeight}, 1000);
	
	$('#sendchat_txt').val("");
	
}

function startChat() {
	
	/* Create the customer object */
	var customerObject =  new myLibrary.Datatype.CustomerObject();
	customerObject.SetPrimaryKey(customerObject.PrimaryKeyParams.PRIMARY_KEY_EMAIL,$('#emailid').val());
	
	var customerFirstName = new myLibrary.Datatype.CustomerParameter();
	customerFirstName.eGainParentObject = "casemgmt";
	customerFirstName.eGainChildObject = "individual_customer_data";
	customerFirstName.eGainAttribute = "first_name";
	customerFirstName.eGainValue = $('#fname').val();
	customerFirstName.eGainParamName = "first_name";
	customerFirstName.eGainMinLength = "1";
	customerFirstName.eGainMaxLength = "50";
	customerFirstName.eGainRequired = "1";
	customerFirstName.eGainFieldType = "1";
	customerFirstName.eGainPrimaryKey = "0";
	customerFirstName.eGainValidationString = "";
	customerObject.AddCustomerParameter(customerFirstName);
	
	var customerLastName = new myLibrary.Datatype.CustomerParameter();
	customerLastName.eGainParentObject = "casemgmt";
	customerLastName.eGainChildObject = "individual_customer_data";
	customerLastName.eGainAttribute = "last_name";
	customerLastName.eGainValue = $('#lname').val();      
	customerLastName.eGainParamName = "last_name";
	customerLastName.eGainMinLength = "1";
	customerLastName.eGainMaxLength = "50";
	customerLastName.eGainRequired = "1";
	customerLastName.eGainFieldType = "1";
	customerLastName.eGainPrimaryKey = "0";
	customerLastName.eGainValidationString = "";
	customerObject.AddCustomerParameter(customerLastName);
	
	var customerEmail = new myLibrary.Datatype.CustomerParameter();
	customerEmail.eGainParentObject = "casemgmt";
	customerEmail.eGainChildObject = "email_address_contact_point_data";
	customerEmail.eGainAttribute = "email_address";
	customerEmail.eGainValue = $('#emailid').val();      
	customerEmail.eGainParamName = "email_address";
	customerEmail.eGainMinLength = "1";
	customerEmail.eGainMaxLength = "50";
	customerEmail.eGainRequired = "1";
	customerEmail.eGainFieldType = "1";
	customerEmail.eGainPrimaryKey = "1";
	customerEmail.eGainValidationString = "";
	customerObject.AddCustomerParameter(customerEmail);
	
	var customerPhone = new myLibrary.Datatype.CustomerParameter();
	customerPhone.eGainParentObject = "casemgmt";
	customerPhone.eGainChildObject = "phone_number_data";
	customerPhone.eGainAttribute = "phone_number";
	customerPhone.eGainValue = $('#phonenum').val();      
	customerPhone.eGainParamName = "phone_number";
	customerPhone.eGainMinLength = "1";
	customerPhone.eGainMaxLength = "18";
	customerPhone.eGainRequired = "1";
	customerPhone.eGainFieldType = "1";
	customerPhone.eGainPrimaryKey = "0";
	customerPhone.eGainValidationString = "";
	customerObject.AddCustomerParameter(customerPhone);
	
	var nationalID = new myLibrary.Datatype.CustomerParameter();
	nationalID.eGainParentObject = "casemgmt";
	nationalID.eGainChildObject = "activity_data";
	nationalID.eGainAttribute = "national_id";
	nationalID.eGainValue = $('#nationalid').val();      
	nationalID.eGainParamName = "national_id";
	nationalID.eGainMinLength = "1";
	nationalID.eGainMaxLength = "20";
	nationalID.eGainRequired = "1";
	nationalID.eGainFieldType = "1";
	nationalID.eGainPrimaryKey = "0";
	nationalID.eGainValidationString = "";
	customerObject.AddCustomerParameter(nationalID);
	
	
	/*Now set the customer */
	myLibrary.SetCustomer(customerObject);
	myChat.Start();
}


$(document).ready(function () {

	$.getJSON( btcAppConfig.btc_custom_msg, function( data ) {
	  customChatConfig = data.APP;
	});
	
	openForm();

   $('#chat-conv').animate({scrollTop: $('#chat-conv')[0].scrollHeight}, 1000);

   $('.CurrentCorsHost').each(function (index, value) {
        $(value).html($.cookie('corsHost'));
    });

    $("#sendchat_txt").on('keyup', function(evt) {
        if (evt.which == 13)
        {
			
			const chat_msg = $('#sendchat_txt').val();
			if (!chat_msg) {
				return;
			}
			myChat.SendMessageToAgent(chat_msg);
			appendCustomerChat(chat_msg);
        }
    });
	
    $("#sendtext_btn").on('click', function() {

		$('#sendchat_txt').focus();

		const chat_msg = $('#sendchat_txt').val();
		if (!chat_msg) {
			return;
		}
		myChat.SendMessageToAgent(chat_msg);
		appendCustomerChat(chat_msg);
	});
    
    $("#EndChatBtn").on('click', function () {
        myChat.End();
    });

    $('#StartChatBtn').on('click', function () {
		/* Now call the Chat initiliaztion method with your entry point and callbacks */
		myChat.Initialize(btcAppConfig.btc_ece_chatpoint,'en', 'US', myEventHandlers, btcAppConfig.btc_ece_template, 'v11');
    });
});
