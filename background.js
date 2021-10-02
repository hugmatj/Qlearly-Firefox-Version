'use strict';


if(!localStorage.getItem("tab_status_on_save")) {
	localStorage.setItem("tab_status_on_save", "false");	
}
if(!localStorage.getItem("changeThemeColor")) {
	localStorage.setItem("changeThemeColor", 'false');
}
if(!localStorage.getItem("open_links_in_new_tabs")) {
	localStorage.setItem("open_links_in_new_tabs", 'true');
}
if(!localStorage.getItem("search_all_or_specific_board")) {
	localStorage.setItem("search_all_or_specific_board", 'false');
}
if(!localStorage.getItem("sync_board")) {
	localStorage.setItem("sync_board", 'true');
}
if(!localStorage.getItem("save_duplicate_url")) {
	localStorage.setItem("save_duplicate_url", 'true');
}
if(!localStorage.getItem("save_pinned_tabs")) {
	localStorage.setItem("save_pinned_tabs", 'false');
}

function savePinnedTab() {
	return (localStorage.getItem("save_pinned_tabs") == 'true');
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4();
}

function twoDigits(d) {
	if (0 <= d && d < 10) return "0" + d.toString();
	if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
	return d.toString();
}

String.prototype.ucfirst = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

Date.prototype.toMysqlFormat = function () {
	return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

Array.prototype.getIndex = function (by, value) {
	return this.map(function (item) {
		return String(item[by]);
	}).indexOf(String(value));
};

String.prototype.makeValidUrl = function() {
	if (((this).toLowerCase()).indexOf('http://') === -1 &&
		((this).toLowerCase()).indexOf('https://') === -1 &&
		((this).toLowerCase()).indexOf('file:///') === -1 &&
		((this).toLowerCase()).indexOf('chrome-extension://') === -1
	) {
		return 'http://' + this.charAt(0) + this.slice(1);
	}
	return this.charAt(0) + this.slice(1);
};

var DB = function(name) {
	var table = name;
	var collection = [];

	function get() {
		if (!localStorage.getItem(table)) {
			return collection = [];
		}
		collection = JSON.parse(localStorage.getItem(table));

		return collection.sort(function (a, b) {
			return a.sortable - b.sortable;
		});
	}
	function save(value) {
		localStorage.setItem(table, JSON.stringify(value));
	}

	return {
		get: function () {
			return get();
		},

		first: function (id, by) {
			
			by = by || 'id';

			var result = get().filter(obj => {
				return obj[by] == id;
			});
			if (result[0]) {
				return result[0];
			}
			return {};
		},

		save: function (value) {
			save(value);
		},
		update: function(id, para, option) {
			option = option || {};
			get();
			var index = collection.getIndex('id', id);
			if(index === -1) {
				return false;
			}

			Object.keys(para).forEach( (item, key) => {
				collection[index][item] = para[item];
			});

			if(!option.hasOwnProperty('sync')) {
				collection[index].sync = "true";
			}		

			save(collection);
			return true;
		},
		delete: function( id ) {
			get();
			var index = collection.getIndex('id', id);
			if(index === -1) {
				return false;
			}
			collection.splice(index, 1);
			save(collection);
			return true;
		},
		count: function() {
			return get().length;
		}
		
	}
};

const auth = {	
	data: {},
	user: function () {
		return auth.data = JSON.parse(localStorage.getItem('qleary_user'));
	},
	isLoggedIn: function () {
		if (auth.user()) {
			return true;
		}
		return false;
	},
	canCreateMoreBoard: function(){

		if(auth.isLoggedIn()) {
			if(auth.user().subscription) {
				var plantype = auth.user().subscription.plantype;
				if([2,3,4].indexOf(plantype) > -1) {
					return true;
				}
			}
		}

		if(board.count() >= 15) {
			return false;
		}
		return true;
	},
	showAds: function(){

		if(auth.isLoggedIn()) {
			if(auth.user().subscription) {
				var plantype = auth.user().subscription.plantype;
				if([2,3,4].indexOf(plantype) > -1) {
					return false;
				}
			}
		}
		return true;
	},
	maxUser: function() {

		if(auth.isLoggedIn()) {
			if(auth.user().subscription) {
				var plantype = auth.user().subscription.plan;
				if("premium" == plantype.toLowerCase()) {
					return 5;
				} else if("business" == plantype.toLowerCase()) {
					return 15;
				} else if("enterprise" == plantype.toLowerCase()) {
					return 50000;
				}
			}
		}

		return 2;
	},
	subscription: function() {
		return (auth.user())? auth.user().subscription : null;
	},
	setSubscription: function(subscription) {
		if((auth.user())) {
			var user = auth.user();
			user.subscription = subscription;
			auth.setUser(user);
			return true;
		}
		return false;
		
	},
	getToken: function () {
		return auth.user().token;
	},
	setUser: function(data) {
		return localStorage.setItem('qleary_user', JSON.stringify(data));
	},
	canAccessNonLoggedIn: function () {
		if (auth.isLoggedIn()) {
			document.location.href = chrome.extension.getURL('board.html');
		}
	},
	logout: function () {
		localStorage.removeItem('qleary_user');
		folders.save([]);
		board.save2([]);
		entry.save2([]);
	}
};



const service = {
	endpoint: 'https://qlearly.com/beta/setup/',
	version: 'ext/v7/',
	get: function (url) {

		return new Promise(function (resolve, reject) {

			var request = new XMLHttpRequest();
			request.open('GET', service.endpoint + url, true);
			request.setRequestHeader("Accept", "application/json");

			if (auth.isLoggedIn()) {
				request.setRequestHeader("Authorization", "Bearer " + auth.getToken());
			}

			request.onreadystatechange = function() { // Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					resolve(JSON.parse(this.responseText));
				} else if(this.readyState === XMLHttpRequest.DONE) {
                    reject(this.responseText);
                }
			}

			request.send();
			
		});
	},
	post: function (url, para) {

		return new Promise(function (resolve, reject) {

			para.append('via', 'extension');
			var request = new XMLHttpRequest();
			request.open('POST', service.endpoint + url, true);
			request.setRequestHeader("Accept", "application/json");

			if (auth.isLoggedIn()) {
				request.setRequestHeader("Authorization", "Bearer " + auth.getToken());
			}

			request.onreadystatechange = function() { // Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					resolve(JSON.parse(this.responseText));
				} else if(this.readyState === XMLHttpRequest.DONE) {
                    reject(this.responseText);
                }
			}

			request.send(para);
		});
	},

	delete: function (url, data) {

		return new Promise(function (resolve, reject) {

			data.append('via', 'extension');
			var request = new XMLHttpRequest();
			request.open('DELETE', service.endpoint + url, true);
			request.setRequestHeader("Accept", "application/json");

			if (auth.isLoggedIn()) {
				request.setRequestHeader("Authorization", "Bearer " + auth.getToken());
			}

			request.onreadystatechange = function() { // Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					resolve(JSON.parse(this.responseText));
				} else if(this.readyState === XMLHttpRequest.DONE) {
                    reject(this.responseText);
                }
			}

			request.send(data);
		});
	},
	reorderBoard: function() {

	},

	createOrUpdateBoard: function(id, callback) {

		if (auth.isLoggedIn()) {

			var fd = new FormData();

			var boardDetail = board.first(id);
			Object.keys(boardDetail).forEach(key => {
				fd.append(key, boardDetail[key]);
			});

			service.post(service.version + "board", fd).then(function (response) {
				callback(response);
			});
		}
	},

	createOrUpdateFolder: function(id, callback) {

		if (auth.isLoggedIn()) {

			var fd = new FormData();

			var folderDetail = folders.first(id);
			Object.keys(folderDetail).forEach(key => {
				fd.append(key, folderDetail[key]);
			});
			
			service.post(service.version + "folder", fd).then(function (response) {
				callback(response);
			})
			.catch(function( response ) {
				folders.update(id, { sync: 'true' });
			});
		}
	},

	removeFolder: function(ids, callback) {

		if (auth.isLoggedIn()) {

			var fd = new FormData();

			fd.append('ids', JSON.stringify(ids));
						
			service.delete(service.version + "folder", fd).then(function (response) {
				callback(response);
			})
			.catch(function( response ) {
				//folders.update(id, { sync: 'true' });
			});
		}
	},
}


var folders = (function(){

	var db = new DB('qleary_folder');
	var items = [];

	function verifyObject(para) {

		para.id = para.id || guid();
		para.sync = "true";
		para.sortable = para.sortable || 1;
		para.created_at || (new Date()).toMysqlFormat()
		return para;
	}

	function get() {
		return items = db.get();
	}
	return {
		get: () => {
			return get();
		},
		create: (para) => {
			get();
			var obj = verifyObject(para);
			items.push(obj);
			db.save(items);	
			return obj;
		}, 
		first: (id) => {
			return db.first(id);
		},
		delete: (id) => {
			return db.delete(id);
		},
		update: function(id, para) {
			para.sync = "true";
			return db.update(id, para);
		},
		save: function(data) {
			db.save(data);
		}
	}
}());

const main = {
	boards: [],
	get: function () {
		if (!localStorage.getItem("qleary_board")) {
			return this.boards = [];
		}
		this.boards = JSON.parse(localStorage.getItem("qleary_board"));

		return this.boards.sort(function (a, b) {
			return a.sortable - b.sortable;
		});
	},
	createNewColumn: function (boardid, param) {
		let bid = this.get().getIndex('id', boardid);
		param.restore = true;
		let obj = this.columnObject('Column Name', param);
		this.boards[bid].column.push(obj);
		this.save(this.boards);
		return {
			index: (this.boards[bid].column).length,
			obj: obj
		};
	},
	columnObject: function ( name, param ) {

		param = param || {};
		
		let cObj = {
			id: param.id || guid(),
			name: param.name || name,
			type: param.type || 'link',
			created_at: param.created_at || (new Date()).toMysqlFormat()
		};

		if(param.hasOwnProperty("restore")) {
			cObj.restore = param.restore;
		}

		return cObj;
	},
	save: function (value) {
		localStorage.setItem("qleary_board", JSON.stringify(value));
		createContextMenu();
	},

};




var board = {
	boards: [],
	db: new DB('qleary_board'),
	getAll: function () {
		// var folderLists = folder.get().map(item => { return item.id; });
		// this.boards = boardController.get().filter(item => {
		// 	return (folderLists.indexOf(item.folder_id) > -1);
		// });
		this.boards = board.get();
		return this.boards;
	},

	createDetault: function(callback) {

		var folderDetail = folders.create({ title: ''});
		var bookmark = board.columnObject('Bookmark');
		var socialColumn = board.columnObject('🌎 SOCIAL & OTHERS');
		var workColumn = board.columnObject('💼 WORK');
		var checklistColumn = board.columnObject("✅ TODAY'S TASK");
		
		var obj = board.create({
			folder_id: folderDetail.id,
			name: "Primary Board",
			is_favorite: 1,
			column: [
				bookmark, socialColumn,	workColumn, checklistColumn
			]
		});
		localStorage.setItem("qleary_is_default_created", "true");
		callback({
			bookmark: bookmark,
			socialColumn: socialColumn,
			workColumn: workColumn,
			checklistColumn: checklistColumn,
			board: obj
		});

	}, 
	get: function () {
		if (!localStorage.getItem("qleary_board")) {
			return this.boards = [];
		}
		this.boards = JSON.parse(localStorage.getItem("qleary_board"));

		return this.boards.sort(function (a, b) {
			return a.sortable - b.sortable;
		});
	},
	count: function() {
		return board.db.count();
	},
	getByFolder: function(id) {
		return this.get().filter(item => {
			return item.folder_id == id;
		});
	},
	default: function () {
		return this.getAll()[0];
	},
	favorite: function () {

		let result = this.getAll().filter(obj => {
			return obj.is_favorite === 1;
		});
		if (result[0]) {
			return result[0];
		}
		return null;

	},
	first: function (id) {
		this.getAll();

		var result = this.boards.filter(obj => {
			return obj.id == id;
		});
		if (result[0]) {
			return result[0];
		}
		return {};
	},
	column: function (id) {
		this.getAll();

		var result = this.boards.filter(obj => {
			return obj.id == id;
		});
		if (result[0]) {
			return result[0].column;
		}
		return [];
	},
	getCoumn: function (id) {

		this.getAll();

		var result = this.boards.filter(obj => {
			return obj.column.filter(item => {
				return item.id == id;
			}).length > 0;
		});
		if (result[0]) {
			result = result[0].column.filter(item => {
				return item.id == id;
			});
			if (result[0]) {
				return result[0];
			}
		}
		return [];

	},
	create: function (data) {

		this.get();
		if (!data.hasOwnProperty('is_favorite')) {
			data.is_favorite = 0;
		}
		let currentIndex = this.boards.length;

		if(!data.hasOwnProperty('id')) {
			data.id = guid();
		}

		if(!data.hasOwnProperty('column')) {
			data.column = [
				board.columnObject('Rename me')
			];
		}
		if(!Array.isArray(data.column)) {
			data.column = [
				board.columnObject('Rename me')
			];
		}


		let bObj = {
			id: data.id,
			folder_id: data.folder_id || '',
			name: data.name || 'Unnamed board',
			is_favorite: data.is_favorite,
			sharable_code: '',
			sortable: data.sortable || currentIndex, 
			column: data.column,
			sync: "true",			
			created_at: data.created_at || (new Date()).toMysqlFormat()
		};
		if(data.hasOwnProperty("restore")) {
			bObj.restore = data.restore
		}
		this.boards.push(bObj);

		this.save(this.boards);
		return bObj;
	},
	update: function(id, para, option) {
		return board.db.update(id, para, option);
	},
	udpate: function (index, data, when) {
		when = when || 'sync';
		if (data.name) {
			this.boards[index].name = data.name || 'Unnamed board';
		}

		if (data.hasOwnProperty('meta_title')) {
			this.boards[index].meta_title = data.meta_title;
		}

		if (data.hasOwnProperty('author_url')) {
			this.boards[index].author_url = data.author_url;
		}

		if (data.hasOwnProperty('meta_title')) {
			this.boards[index].seo_author = data.seo_author;
		}
 
		if (data.hasOwnProperty('meta_description')) {
			this.boards[index].meta_description = data.meta_description;
		}

		if (data.hasOwnProperty('image')) {
			this.boards[index].image = data.image;
		}

		if (data.hasOwnProperty('is_favorite')) {
			this.boards[index].is_favorite = data.is_favorite;
		}

		if (data.hasOwnProperty('sharable_code')) {
			this.boards[index].sharable_code = data.sharable_code;
		}

		if (data.hasOwnProperty('sortable')) {
			this.boards[index].sortable = data.sortable;
		}

		this.boards[index].sync = "true";

		if (when == 'sync') {
			this.save(this.boards);
		} else if (when == 'not_sync') {
			this.save2(this.boards);
		}
		return true;
	},
	updateById: function (id, data, when) {
		return this.udpate(this.boards.getIndex('id', id), data, when);
	},
	removeFavorite: function () {
		for (var i in this.boards) {
			this.boards[i].is_favorite = 0;
		}

		this.save(this.boards);
	},
	delete: (id) => {
		var detail = board.db.first(id);
		board.createRemoved(detail);
		entry.deleteByBoard(detail);
		var response = board.db.delete(id);
		createContextMenu();
		return response;
	},
	remove: function ($key) {
		this.createRemoved(this.boards[$key]);
		entry.deleteByBoard(this.boards[$key]);
		this.boards.splice($key, 1);
		this.save(this.boards);
	},
	save: function (value) {
		localStorage.setItem("qleary_board", JSON.stringify(value));
		// sync2();
		createContextMenu();
	},
	save2: function (value) {
		localStorage.setItem("qleary_board", JSON.stringify(value));
		createContextMenu();
	},
	restore: function (id) {

		if(restorableRecord['board_' + id]) {
			restorableRecord['board_' + id].restore = true;
			restorableRecord['board_' + id].column.map(function(item){
				item.restore = true;
				return item;
			});
			board.create(restorableRecord['board_' + id]);
			board.render();
			entry.restore(id);
			// currentBoard.columns.instance[]
		}
	},
	restoreColumn: function (id, boardId) {

		if(restorableRecord['column_' + id]) {
			
			board.deleteRemovedColumn(id);
			let newColumn = board.createNewColumn(boardId, restorableRecord['column_' + id]);
			if(restorableRecord['columns_entry_' + id]) {
				entry.restoreByColumn(id);
			}
			if(currentBoard.id == boardId) {
				currentBoard.columns.createNewElement(newColumn.obj, newColumn.index);
			}
		}
	},

	getRemovedItem: function () {
		if (!localStorage.getItem("qleary_board_removed")) {
			return [];
		}
		return JSON.parse(localStorage.getItem("qleary_board_removed"));
	},
	deleteRemovedColumn: function(id) {
		let data = this.getRemovedColumn();
		let index = data.map(function (item) {
			return String(item.id);
		}).indexOf(String(id));
		if (index > -1) {
			data.splice(index, 1);
			this.saveRemovedColumn(data);
		}
	},
	saveRemoved: function (value) {
		localStorage.setItem("qleary_board_removed", JSON.stringify(value));
	},
	createRemoved: function (value) {
		let items = this.getRemovedItem();
		items.push(value);
		board.saveRemoved(items);
	},

	getRemovedColumn: function () {
		if (!localStorage.getItem("qleary_column_removed")) {
			return [];
		}
		return JSON.parse(localStorage.getItem("qleary_column_removed"));
	},
	saveRemovedColumn: function (value) {
		localStorage.setItem("qleary_column_removed", JSON.stringify(value));
	},
	createRemovedColumn: function (value) {
		let items = this.getRemovedColumn();
		items.push(value);
		this.saveRemovedColumn(items);
	},
	createNewColumn: function (boardid, param) {

		let bid = this.getIndexById(this.boards, boardid);
		param.restore = true;
		let obj = this.columnObject('Column Name', param);
		this.boards[bid].column.push(obj);
		this.save(this.boards);
		return {
			index: (this.boards[bid].column).length,
			obj: obj
		};
	},
	copyColumn: function (boardid, columnid, callback) {

		let obj = board.getCoumn(columnid);
		
		let index = this.boards.getIndex('id', boardid);
				
		if(index !== -1) {
			var entries = entry.getByColumn(obj.id);
			 
			obj = board.createNewColumn(boardid, {
				name: obj.name
			});

			entries.map(item => {
				item.id = guid();
				item.board_id = boardid;
				item.column_id = obj.obj.id;

				entry.create(item);
				return item;
			});
			
			callback({
				index: (this.boards[index].column).length,
				obj: obj.obj,
				entries: entries
			});
		}
	},
	moveColumn: function (boardid, columnid) {

		let obj = board.getCoumn(columnid);
		let index = this.boards.getIndex('id', boardid);
				
		if(index !== -1) {
			let index2 = this.boards.getIndex('id', obj.board_id);
			obj.board_id = boardid;
			this.boards[index].column.push(obj);

			let columnIndex = this.getIndexById(this.boards[index2].column, columnid);
			
			this.boards[index2].column.splice(columnIndex, 1);
			this.save2(this.boards);		

			return {
				index: (this.boards[index].column).length,
				obj: obj
			};
		}
	},
	columnObject: function ( name, param ) {

		param = param || {};
		
		let cObj = {
			id: param.id || guid(),
			name: param.name || name,
			type: param.type || 'link',
			created_at: param.created_at || (new Date()).toMysqlFormat()
		};

		if(param.hasOwnProperty("restore")) {
			cObj.restore = param.restore;
		}
		cObj.sync = "true";
		return cObj;
	},
	getIndexById: function (array_value, id) {
		return array_value.map(function (img) {
			return String(img.id);
		}).indexOf(String(id));
	},
	updateAllColumn: function (boardId, data) {
		let index = this.getIndexById(this.getAll(), boardId);

		this.boards[index].column = data;

		this.save(this.boards);
		return true;

	},
	updateColumn: function (id, data, when) {

		when = when || 'sync';
		let index = this.getIndexById(this.boards, currentBoard.id);

		let index2 = this.getIndexById(this.boards[index].column, id);

		if (data.hasOwnProperty('name')) {
			this.boards[index].column[index2].name = data.name
		}
		if (data.hasOwnProperty('author')) {
			this.boards[index].column[index2].author = data.author
		}

		if (data.hasOwnProperty('author_url')) {
			this.boards[index].column[index2].author_url = data.author_url
		}

		if (data.hasOwnProperty('meta_title')) {
			this.boards[index].column[index2].meta_title = data.meta_title
		}

		if (data.hasOwnProperty('meta_description')) {
			this.boards[index].column[index2].meta_description = data.meta_description
		}
		if (data.hasOwnProperty('sharable_code')) {
			this.boards[index].column[index2].sharable_code = data.sharable_code
		}

		if (when == 'sync') {
			this.save(this.boards);
		} else if (when == 'not_sync') {
			this.save2(this.boards);
		}
		return true;
	},
	deleteColumn: function (columnId, boardId) {
		board.getAll();
		let index = this.getIndexById(this.boards, boardId);
		if (index !== -1) {
			let index2 = this.getIndexById(this.boards[index].column, columnId);
			this.createRemovedColumn(this.boards[index].column[index2]);
			this.boards[index].column.splice(index2, 1);
			entry.removeByColumn(columnId);
			this.save(this.boards);

			return true;
		}

		return false;

	}
};

const entry = {
	entries: [],
	db: new DB('qleary_entry'),
	createBatch: (data, sync) => {
		sync = (sync !== false);
		entry.get();
		data.map( obj => {
			
			obj.id = obj.id || guid();		
			obj.title = obj.title || '';
			obj.type = obj.type || 'link';
			obj.created_at = (new Date()).toMysqlFormat();
			if(obj.type == 'link') {
				obj.url = obj.url.makeValidUrl();
			}
			obj = entry.createObject(obj, sync);

			if(localStorage.getItem("save_duplicate_url") == 'false') {
				if(entry.entries.filter(item => { return item.url == obj.url }).length > 0) {
					return false;
				}
			}
			entry.entries.push(obj);
			return obj;			
		});

		entry.db.save(entry.entries);
		return data;
	},
	create: function (obj) {
		this.get();

		obj.id = obj.id || guid();		
		obj.title = obj.title || '';
		obj.type = obj.type || 'link';
		//obj.most_visited = 0;
		obj.created_at = (new Date()).toMysqlFormat();
		if(obj.type == 'link') {
			obj.url = obj.url.makeValidUrl();
		}
		obj = this.createObject(obj);

		if(localStorage.getItem("save_duplicate_url") == 'false') {
			if(this.entries.filter(item => { return item.url == obj.url }).length > 0) {
				return false;
			}
		}
		entry.entries.push(obj);
		this.save2(entry.entries);
		return obj;
	},
	sync: function(obj) {
		service.post2(service.version + "entry/create", obj, function (response) {

		});
	},	
	save: function (value) {
		localStorage.setItem("qleary_entry", JSON.stringify(value));
		//sync2('');
	},
	save2: function (value) {
		localStorage.setItem("qleary_entry", JSON.stringify(value));
	},
	synced: function(ids) {
		ids.forEach(item => {
			entry.updateLocal(item, {}, false);
		});
	},
	restoreSelf: function (id) {
		
		if(restorableRecord['entry_' + id]) {
			let obj2 = restorableRecord['entry_' + id];
			obj2.restore = true;
			entry.deleteRemovedEntry(id);
			let obj = entry.create(obj2);

			if(currentBoard.columns.instance.hasOwnProperty(restorableRecord['entry_' + id].column_id)){
				currentBoard.columns.instance[restorableRecord['entry_' + id].column_id].newEntry(obj);
			}
		}
	},
	restore: function (id) {

		if(restorableRecord['board_entry_' + id]) {

			if(restorableRecord['board_entry_' + id] instanceof Array) {
				restorableRecord['board_entry_' + id].map(function(item){
					entry.deleteRemovedEntry(item.id);
					item.restore = true;
					entry.create(item);
				});
			};
		}
	},
	restoreByColumn: function (id, timestamp='') {
		
		if(restorableRecord['columns_entry_' + id+timestamp]) {

			if(restorableRecord['columns_entry_' + id + timestamp] instanceof Array) {
				console.log(restorableRecord['columns_entry_' + id + timestamp]);
				restorableRecord['columns_entry_' + id + timestamp].map(function(item){
					entry.deleteRemovedEntry(item.id);
					item.restore = true;
					entry.create(item);
				});
			};
		}
	},
	getRemovedItem: function () {
		if (!localStorage.getItem("qleary_entry_removed")) {
			return [];
		}
		return JSON.parse(localStorage.getItem("qleary_entry_removed"));
	},
	saveRemoved: function (value) {
		localStorage.setItem("qleary_entry_removed", JSON.stringify(value));
	},
	createRemoved: function (value) {
		let items = this.getRemovedItem();
		items.push(value);
		this.saveRemoved(items);
	},
	deleteRemovedEntry: function (id) {

		let data = this.getRemovedItem();
		let index = data.map(function (item) {
			return String(item.id);
		}).indexOf(String(id));
		if (index > -1) {
			data.splice(index, 1);
			
			this.saveRemoved(data);
		}
	},
	saveCurrestSession: function () {
		this.save(this.entries);
	},
	get: function () {
		if (!localStorage.getItem("qleary_entry")) {
			return this.entries = [];
		}
		return this.entries = JSON.parse(localStorage.getItem("qleary_entry"));
	},
	first: function (id) {
		this.get();

		var result = this.entries.filter(obj => {
			return obj.id == id;
		});
		if (result[0]) {
			return result[0];
		}
		return {};
	},
	count: function (columnId) {
		if (columnId) {
			return this.get().filter((obj, index) => {
				return (obj.column_id === columnId);
			}).length;
		}
		return this.get().length;
	},
	getSyncable: function (id) {
		return this.get().filter(obj => {
			return (obj.sync === true);
		});
	},

	getByColumn: function (id) {
		return (this.get().filter(obj => {
			return (obj.column_id === id);
		})).sort(function (a, b) {
			return (a.sortable || 0) - (b.sortable || 0);
		});
	},
	getByBoard: function (id) {
		return (this.get().filter(obj => {
			return (obj.board_id === id);
		})).sort(function (a, b) {
			return a.sortable - b.sortable;
		});
	},
	deleteEntry: function (id, sync) {

		sync = sync || 'sync';
		let index = this.get().map(function (item) {
			return String(item.id);
		}).indexOf(String(id));
		if (index > -1) {
			this.createRemoved(this.entries[index]);
			this.entries.splice(index, 1);
			if (sync == 'sync') {
				this.save(this.entries);
			} else {
				this.save2(this.entries);
			}
		}
	},
	remove: function(obj) {

		var index = this.entries.getIndex('id', obj.id);
		if (index > -1) {
			if(obj.createRemoved) {
				this.createRemoved(this.entries[index]);
			}
			this.entries.splice(index, 1);
			if (obj.sync) {
				this.save(this.entries);
			} else {
				this.save2(this.entries);
			}
		}
	},

	deleteByBoard: function (obj) {

		if(!obj.hasOwnProperty('createRemoved')) {
			obj.createRemoved = true;
		}

		if(!obj.hasOwnProperty('sync')) {
			obj.sync = true;
		}

		entry.getByBoard(obj.id).forEach(function (item, index) {

			// entry.deleteEntry(item.id, 'not_sync');
			entry.remove({
				id: item.id, 
				sync: obj.sync,
				createRemoved: obj.createRemoved
			});

		});
	},
	removeByColumn: function (columnId) {

		entry.getByColumn(columnId).forEach(function (item, index) {

			entry.deleteEntry(item.id, 'not_sync');

		});
	},
	update: function (id, obj) {
		this.get();
		let index = getIndexById(entry.entries, id.trim());
		if (index === -1) {
			return false;
		}

		if (obj.hasOwnProperty("sortable")) {
			entry.entries[index].sortable = obj.sortable;
		}

		if (obj.hasOwnProperty("title")) {
			entry.entries[index].title = obj.title;
		}

		if (obj.hasOwnProperty("column_id")) {
			entry.entries[index].column_id = obj.column_id;
		}

		if (obj.hasOwnProperty("most_visited")) {
			entry.entries[index].most_visited += 1;
		}

		if (obj.hasOwnProperty("description")) {
			entry.entries[index].description = obj.description;
		}

		if (obj.hasOwnProperty("status")) {
			entry.entries[index].status = obj.status;
		}
		entry.entries[index].sync = true;

		this.save(entry.entries);
		return true;

	},
	updateLocal: function (id, obj, sync) {

		this.get();
		let index = entry.entries.getIndex('id', id.trim());
		if (index === -1) {
			return false;
		}

		if (obj.hasOwnProperty("sortable")) {
			entry.entries[index].sortable = obj.sortable;
		}

		if (obj.hasOwnProperty("title")) {
			entry.entries[index].title = obj.title;
		}

		if (obj.hasOwnProperty("column_id")) {
			entry.entries[index].column_id = obj.column_id;
		}

		if (obj.hasOwnProperty("most_visited")) {
			entry.entries[index].most_visited += 1;
		}
		
		if(sync === true) {
			entry.entries[index].sync = true;
		}
		this.save2(entry.entries);
		return true;
	},
	createObject: function (obj, sync) {
		sync = (sync !== false);
		if (!obj.hasOwnProperty('column_id')) {
			obj.column_id = '';
		}
		obj.type = obj.type || 'link';
		if(sync === true) {
			obj.sync = "true";
		}		
		obj.sortable = obj.sortable || 0;
		return obj;
	},
	lastSortable: function(columnId) {
		var allEntries = entry.getByColumn(columnId).map(a => a.sortable);
		if(allEntries.length > 0) {
			if(Math.max(...allEntries) > allEntries.length){
				return Math.max(...allEntries);
			}
		}

		return allEntries.length + 1;
	}
};


function getFolder() { return folders; }
function getAuth() { return auth; }
function getService() { return service; }
function getBoard() { return board; }
function getEntry() { return entry; }

function createContextMenu() {

	if(localStorage.getItem('qleary_main_menuid')) {
		chrome.contextMenus.removeAll();
	}

	var contexts = [ "page","selection","link","editable","image","video","audio" ];

	let menuId = chrome.contextMenus.create({
		title: "Save to Qlearly", 
		contexts:['all'],
		onclick: function(info, tab) { }
	});
	localStorage.setItem('qleary_main_menuid', menuId);

	(main.get()).forEach(function(item){

		var boardId = chrome.contextMenus.create({
			title: item.name.ucfirst(), 
			parentId: menuId, 
			onclick: function(info, tab) { }
		});

		item.column.forEach(function(column){
			chrome.contextMenus.create({
				title: column.name.ucfirst(), 
				parentId: boardId,
				onclick: function ( info, tab ) {

					if (!tab.url || tab.url == 'chrome://newtab/') {
						return false;
					}

				  	entry.create({
				  		board_id: item.id,
						column_id: column.id,
						title: tab.title,
						url: tab.url,
						favIconUrl: tab.favIconUrl,
						sortable: entry.lastSortable(column.id) + 1,
					});
				}
			});
		});

		chrome.contextMenus.create({parentId: boardId, type: "separator"});

		chrome.contextMenus.create({
			title: "+ Create new column",
			parentId: boardId,
			onclick: function ( info, tab ) {

				if (!tab.url || tab.url == 'chrome://newtab/') {
					return false;
				}

				var column = main.createNewColumn(item.id, {});

			  	entry.create({
			  		board_id: item.id,
					column_id: column.obj.id,
					title: tab.title,
					url: tab.url,
					favIconUrl: tab.favIconUrl,
					sortable: entry.lastSortable(column.obj.id) + 1
				});
			}
		});

		chrome.contextMenus.create({parentId: boardId, type: "separator"});

		chrome.contextMenus.create({
			title: "Open board",
			parentId: boardId,
			onclick: function ( info, tab ) {

				localStorage.setItem('qleary_current_board', item.id);
				chrome.tabs.create({ url: 'board-detail.html' });
			}
		});
	});
	 
}

createContextMenu();


chrome.runtime.onInstalled.addListener(function() {

	chrome.tabs.create({ url: 'board-detail.html' });
	
});

chrome.runtime.setUninstallURL('https://qlearly.com/uninstall');



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "auth") {
    	localStorage.setItem("auth_token", request.token );
    	chrome.windows.remove(parseInt(localStorage.getItem("auth_tab")));
      	sendResponse({});
    	
    } else {
      sendResponse({});
    }
});