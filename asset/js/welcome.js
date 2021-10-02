
const defaultLinksForColumn = {
	social: [
		{
			title: 'Twitter',
			url: "https://twitter.com/",
			favIconUrl: 'https://www.google.com/s2/favicons?domain=https://twitter.com/'
		},
		{
			title: 'LinkedIn',
			url: "https://www.linkedin.com",
			favIconUrl: 'https://www.google.com/s2/favicons?domain=https://www.linkedin.com'
		},
		{
			title: 'Reddit',
			url: "https://www.reddit.com",
			favIconUrl: 'https://www.google.com/s2/favicons?domain=https://www.reddit.com'
		},
		{
			title: 'Help Center',
			url: "https://help.qlearly.com/qlearly-browser-extension-v2",
			favIconUrl: 'https://qlearly.com/extension_web/img/Qlearlylogo.png'
		},
		{
			title: 'Getting Started',
			url: "https://help.qlearly.com/qlearly-browser-extension-v2/getting-started-with-our-browser-extension",
			favIconUrl: 'https://qlearly.com/extension_web/img/Qlearlylogo.png'
		},
		{
			title: 'Contact Us',
			url: "https://qlearly.com/contact",
			favIconUrl: 'https://qlearly.com/extension_web/img/Qlearlylogo.png'
		}
	],
	work: [
		{
			title: 'Zapier',
			url: "https://zapier.com",
			favIconUrl: 'https://www.google.com/s2/favicons?domain=https://zapier.com'
		},{
			title: 'Airtable',
			url: "https://airtable.com",
			favIconUrl: 'https://www.google.com/s2/favicons?domain=https://airtable.com'
		},{
			title: 'Slack',
			url: "https://slack.com",
			favIconUrl: 'https://www.google.com/s2/favicons?domain=https://slack.com'
		},{
			title: 'MailChimp',
			url: "https://mailchimp.com",
			favIconUrl: 'https://www.google.com/s2/favicons?domain=https://mailchimp.com'
		}
	],
	checklist: [
		{ title: 'Hi' },
		{ title: 'Welcome' },
		{ title: 'To' },
		{ title: 'Qlearly' },
		{ title: 'Create your own tasks! 😎' }
	]
};


function defaultSocialColumn(columnId, boardId) {

	defaultLinksForColumn.social.forEach((item, index) => {
		entry.create({
	  		board_id: boardId,
			column_id: columnId,
			title: item.title,
			url: item.url,
			sortable: index,
			favIconUrl: item.favIconUrl
		});
	});
}

function defaultWorkColumn(columnId, boardId) {
	
	defaultLinksForColumn.work.forEach((item, index) => {
		entry.create({
	  		board_id: boardId,
			column_id: columnId,
			title: item.title,
			url: item.url,
			sortable: index,
			favIconUrl: item.favIconUrl
		});
	});
}

function defaultChecklistColumn(columnId, boardId) {

	defaultLinksForColumn.checklist.forEach((item, index) => {
		entry.create({
	  		board_id: boardId,
			column_id: columnId,
			title: item.title,
			type: "checklist",
			sortable: index
		});
	});
}

function addBookmarkManually() {
	boardController.createDetault(function(response){
		saveBookMarks(response.bookmark.id, response.board.id);
		defaultSocialColumn(response.socialColumn.id, response.board.id);
		defaultWorkColumn(response.workColumn.id, response.board.id);
		defaultChecklistColumn(response.checklistColumn.id, response.board.id);
	});
	
	localStorage.setItem("qleary_is_default_created", "true");
	document.location.reload();
}