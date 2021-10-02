if($('.board-page, .board-detail-page').length > 0) {
	$('body').addClass('guest-mode-active');

	$('#guestmode').html(`
		<div class="alert alert-success alert-dismissible fade show guestmode" role="alert">
		    <span class="open-signup pointer"><strong>Guest Mode:</strong>&nbsp;Login or create an account to make sure your boards are backed up.</span>
		    <button type="button" class="close" data-dismiss="alert" aria-label="Close" id="guest-mode-close">
		      <span aria-hidden="true">×</span>
		    </button>
		</div>
	`);

	$('body').append(
		`<div class="modal fade" id="login_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered" role="document">
		    <div class="modal-content bg-transparent border-0">
		      <div class="modal-body blue-bg rounded-10 py-3">
		        <form class="row px-5" id="login_form" autocomplete="login_form" name="login_form">
		          <div class="col-sm-12 text-center pb-2">
		            <img src="/asset/image/icons/128.png" height="50">
		          </div>
		          <div class="bg-white col-sm-12 p-3 my-3 rounded-10">
		            <div class="row">
		              <div class="col-sm-12 mb-3">
		                <b>Sign in</b>
										<a href="#" class="text2 link-hover float-right small" data-dismiss="modal"  data-toggle="modal" data-target="#forgot_modal">
											Forgot Password?
										</a>
		              </div>
		              <div class="col-sm-12">
		                <div class="form-group">
		                  <input type="email" class="form-control" placeholder="Email" id="email" autocomplete="email">
		                  <span class="text-danger"><small id="err_email"></small></span>
		                </div>
		              </div>
		              <div class="col-sm-12">
		                <div class="form-group">
		                  <input type="password" class="form-control" placeholder="Password" id="password" autocomplete="password">
		                  <span class="text-danger"><small id="err_password"></small></span>
		                </div>
									</div>
									<div class="col-sm-12">
		                <div class="form-group">
										<label>
											<input type="checkbox" name="remember" id="remember"> Remember me
										</label>
		                </div>
		              </div>
		              <div class="col-sm-12">
		                <div class="form-group text-center">
		                  <button class="btn btn-success px-5 noBorderRadius" id="login_btn">Sign In</button>
		                </div>
		              </div>
		            </div>
		          </div>
		          <div class="social-login text-center mx-auto col-sm-12 mb-3">
		            <p class="mt-3 mb-4 text-white">Or sign in with services</p>
		            <a class="twitter-auth pointer">
		              <img src="/asset/image/twitter.png" height="25">
		            </a>&nbsp;&nbsp;
		            <a class="google-auth pointer">
		              <img src="/asset/image/google-logo.png" height="25">
		            </a>&nbsp;&nbsp;
		            <a class="linkedin-auth pointer">
		              <img src="/asset/image/linkedin.png"  height="25">
		            </a>
		          </div>	          
		          <div class="col-sm-12 text-center">
		            <p class="my-3 text-white"><ins>Don't have an account?</ins></p>
		            <button class="btn-outline-theme px-5" data-dismiss="modal" data-toggle="modal" data-target="#signup_modal" >Sign Up</button>
		          </div>
		        </form>
		      </div>
		    </div>
		  </div>
		</div>`
	);



	$('body').append(
		`<div class="modal fade" id="signup_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered" role="document">
		    <div class="modal-content bg-transparent border-0">
		      <div class="modal-body blue-bg rounded-10 py-3">
		        <form class="row px-5" id="signup_form"  autocomplete="signup_form" name="signup_form">
		          <div class="col-sm-12 text-center pb-2">
		            <img src="/asset/image/icons/128.png" height="50">
		          </div>
		          <div class="bg-white col-sm-12 p-3 my-3 rounded-10">
		            <div class="row">
		              <div class="col-sm-12 mb-3">
		                <b>Create an account</b>
		              </div>
		              <div class="col-sm-12">
		                <div class="form-group">
		                  <input type="text" class="form-control" placeholder="Name" id="reg_name" autocomplete="reg_name">
		                  <span class="text-danger"><small id="err_reg_name"></small></span>
		                </div>
		              </div>
		              
		              <div class="col-sm-12">
		                <div class="form-group">
		                  <input type="email" class="form-control" placeholder="Email" id="reg_email" autocomplete="email">
		                  <span class="text-danger"><small id="err_reg_email"></small></span>
		                </div>
		              </div>
		              <div class="col-sm-12">
		                <div class="form-group">
		                  <input type="password" class="form-control" placeholder="Password" id="reg_password" autocomplete="password">
		                  <span class="text-danger"><small id="err_reg_password"></small></span>
		                </div>
		              </div>
		              <div class="col-sm-12">
		                <div class="form-group text-center">
		                  <button class="btn btn-success px-5 noBorderRadius" id="register_btn">Sign up</button>
		                </div>
		              </div>
		            </div>
		          </div>

		          <div class="social-login text-center mx-auto col-sm-12 mb-3">
		            <p class="mt-3 mb-4 text-white">Or sign up with services</p>
		            <a class="twitter-auth pointer">
		              <img src="/asset/image/twitter.png" height="25">
		            </a>&nbsp;&nbsp;
		            <a class="google-auth pointer">
		              <img src="/asset/image/google-logo.png"  height="25">
		            </a>&nbsp;&nbsp;
		            <a class="linkedin-auth pointer">
		              <img src="/asset/image/linkedin.png"  height="25">
		            </a>
		          </div>
		          <div class="text-center mx-auto col-sm-12 mb-4">
		            <p class="mt-1 mb-1 text-white">By creating an account, you agree to the  <br />
		            	<a href="https://qlearly.com/privacy" class="text-white" target="_blank"><ins>Terms of Service</ins></a>
		            </p>
		          </div>
		          <div class="col-sm-12 text-center">
		            <p class="mb-3 mt-2 text-white">Already a member?</p>	            
		            <button class="btn-outline-theme px-5" data-dismiss="modal" data-toggle="modal" data-target="#login_modal">Sign In</button>
		          </div>
		        </form>
		      </div>
		    </div>
		  </div>
		</div>`
	);


	$('body').append(
		`<div class="modal fade" id="forgot_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered" role="document">
		    <div class="modal-content bg-transparent border-0">
		      <div class="modal-body blue-bg rounded-10 py-3">
		        <form class="row px-5" id="forgot_form"  autocomplete="forgot_form" name="forgot_form"> 
		          <div class="col-sm-12 text-center pb-2">
		            <img src="/asset/image/icons/128.png" height="50">
		          </div>
		          <div class="bg-white col-sm-12 p-3 my-3 rounded-10">
		            <div class="row">
		              <div class="col-sm-12 mb-3">
		                <b>Forgot password</b>
		              </div>
		              <div class="col-sm-12">
		                <div class="form-group">
		                  <input type="email" class="form-control" placeholder="Email" id="forgot_email" autocomplete="forgot_email" name="forgot_email">
		                  <span class="text-danger"><small id="err_forgot_email"></small></span>
		                </div>
		              </div>

		              <div class="col-sm-12">
		                <div class="form-group text-center">
		                  <button class="btn btn-success px-5 noBorderRadius" id="forgot_btn">Send reset instruction</button>
		                </div>
		              </div>
		               
		            </div>
		          </div>

		          <div class="col-sm-12 text-center">
		            <p class="my-3 text-white">Back to sign in?</p>
		            <button class="btn-outline-theme px-5" data-dismiss="modal" data-toggle="modal" data-target="#login_modal">Sign In</button>
		          </div>

		        </form>
		      </div>
		    </div>
		  </div>
		</div>`
	);



	$('#signup_modal, #login_modal, #forgot_modal').on('hidden.bs.modal', function() {
		document.getElementById('signup_form').reset();
		document.getElementById('login_form').reset();
		document.getElementById('forgot_form').reset();
		$('[id*="err_"]').html('');
		$('#register_btn').html('Sign up');
		$('#login_btn').html('Sign in');

		if(localStorage.getItem('email')) {
			document.getElementById('email').value = localStorage.getItem('email')
			document.getElementById('password').value = localStorage.getItem('password')
			document.getElementById('remember').checked = true;
		}

	});


	// login process
	$('#login_form').submit(function(evt) {

		evt.preventDefault();

		var that = this;
		console.log(this.remember.checked);

		let flag = true;
		let email = document.getElementById('email');
		let err_email = document.getElementById('err_email');
		err_email.innerHTML = '';

		let password = document.getElementById('password');
		let err_password = document.getElementById('err_password');
		err_password.innerHTML = '';


		if (password.value == '') {
			err_password.innerHTML = 'This field is required';
			flag = false;
		}

		if (email.value == '') {
			err_email.innerHTML = 'This field is required';
			flag = false;
		}

		if (flag) {

			let param = {
				email: email.value,
				login: email.value,
				password: password.value,
				request_via: 'ext'
			}
			
			let oldValue = $('#login_btn').html();
			$('#login_btn').html('<div class="small-loader"></div>');

			service.post2("admin/post-login", param, function (response) {

				localStorage.setItem('email', '')
				localStorage.setItem('password', '')

				if(that.remember.checked) {

					localStorage.setItem('email', email.value)
					localStorage.setItem('password', password.value)

				}

				if (response.success === false) {
					$('#login_btn').html(oldValue);
					alert(response.message);
					return;
				}

				if(!response.result) {
					$('#login_btn').html(oldValue);
					alert('Oops! Something went wrong');
					return;
				}


				authController.setUser(response.result);

				sync2(function(){
					document.location.reload();
				}, true, {
					url: service.version + "auth/sync"
				});

			});

		}

	});




	// signup process
	$('#signup_form').submit( function(evt) {

		evt.preventDefault();

		let flag = true, username = $('#reg_username');
		
		let name = $('#reg_name');
		let err_name = $('#err_reg_name');
		err_name.html('');

		let password = document.getElementById('reg_password');
		let err_password = $('#err_reg_password');
		err_password.html('');

		let email = document.getElementById('reg_email');
		let err_email = $('#err_reg_email');
		err_email.html('');

		if(name.val() == '') {
			err_name.html('This field is required');
			flag = false;
		}
		 

		if (password.value == '') {
			err_password.html('This field is required');
			flag = false;
		}

		if (email.value == '') {
			err_email.html('This field is required');
			flag = false;
		} else if (!isEmailValid(email.value)) {
			err_email.html('Please enter valid email');
			flag = false;
		}

		if (flag) {

			let oldValue = $('#register_btn').html();
			$('#register_btn').html('<div class="small-loader"></div>');

			var param = {
				name: name.val(),
				email: email.value,
				password: password.value,
			};

			param.request_via = 'ext';
			service.post("admin/register", param).then(function (response) {

				if (!response.hasOwnProperty('id')) {
					return;
				}

				authController.setUser(response);

				sync2(function(){
					document.location.reload();
				}, true, {
					url: service.version + "auth/sync"
				});

			})
			.catch(function (response) {
				$('#register_btn').html(oldValue);
				var response = JSON.parse(response);
				if (response.hasOwnProperty('email')) {
					err_email.html(response.email[0]);
				}
				if (response.hasOwnProperty('password')) {
					err_password.html(response.password[0]);
				}
			});
		}

	});



	// forgot process

	$('#forgot_form').submit( function(evt) {

		evt.preventDefault();

		let flag = true;

		let email = document.getElementById('forgot_email');
		let er_email = document.getElementById('err_forgot_email');
		er_email.innerHTML = '';

		if (email.value == '') {
			er_email.innerHTML = 'This field is required';
			flag = false;
		} else if (!isEmailValid(email.value)) {
			er_email.innerHTML = 'Please enter valid email';
			flag = false;
		}

		if (flag) {

			let oldValue = $('#forgot_btn').html();
			$('#forgot_btn').html('<div class="small-loader"></div>');
			auth.forgot({
				email: email.value
			}).then(function (response) {
				email.value = '';
				$('#forgot_btn').html(oldValue);
			}).catch(function (response) {
				$('#forgot_btn').html(oldValue);
			});

		}
	});


	var oWin = null;
	var authWin = null;

	var openWinCallback = function(win) {
		oWin = win;
		authWin = win.id;
		localStorage.setItem("auth_tab", authWin);
	};


	$('.open-login').click(function() { $('#login_modal').modal('show'); });
	$('.open-signup').click(function() { $('#signup_modal').modal('show'); });

	$('.twitter-auth').click( function() {
		chrome.windows.create({
			url: 'https://qlearly.com/beta/setup/ext/social/twitter'
		}, openWinCallback);	
	});

	$('.linkedin-auth').click( function() {

		chrome.windows.create({
			url: 'https://qlearly.com/beta/setup/ext/social/linkedin'
		}, openWinCallback);
	});

	$('.google-auth').click( function() {
		chrome.windows.create({
			url: 'https://qlearly.com/beta/setup/ext/social/google'
		}, openWinCallback);
	});


	chrome.windows.onRemoved.addListener(function (win) {
		
		if(!authWin) { return false; }	
		if(authWin == win) {
			if(!localStorage.getItem("auth_token")) {
				return false;
			}
			
			$('#login_btn').html('<div class="small-loader"></div>');
			$('#register_btn').html('<div class="small-loader"></div>');


			localStorage.setItem("auth_tab", "");
			// get user information
		   	serviceController.get( "userinfo/" + localStorage.getItem("auth_token") )
		   	.then( function( data ) {
		   		localStorage.setItem("auth_token", "");
	     		authController.setUser(data.result);

				sync2(function(){
					setTimeout(function() { document.location.reload(); }, 500);
				}, true, {
					url: service.version + "auth/sync"
				});
	     		 
	     	});
		}
	});

}