var url = new URL(window.location.href);


chrome.runtime.sendMessage({method: "auth", 'token': url.searchParams.get("token")}, function(response) {

	// window.open(chrome.extension.getURL('authentication.html'), '_self', '');
	//window.open('chrome-extension://mbcomljjamnionbeciloamcapndomheo/authentication.html', '_self', '');
});

 