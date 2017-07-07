(function () {
			const socket = io();
        	var user;
        	        	
        	user = {
        		id: $('.id').text(),
        		name: $('.name').text(),
        		photo: $('.photo_profile').text()
			}
        	
			console.log(user);
			
        	window.onbeforeunload = (e) => {
				socket.emit('userExit', user);
			};
			/*
			getNameText = () => {
				var $message_input;
		        $message_input = $('.name_input');
		        return $message_input.val();
		    };
		    sendName = (text) => {
		    	if (text.trim() === '') {
		            return;
		        }
		        $('.name_input').val('');		        
		    	socket.emit('setUsername', text);
		    };

		    $('.send_name').click( (e) => {
		    	sendName(getNameText());
		    });
		    
		    sendToken = (token) => {
		    	socket.emit('setUsername', token);
		    };
		    
		    $('.facebook').click( (e) => {
		    	sendToken('fb');
		    	window.location = '/login';
		    });

			$('.close').click( (e) => {
				$('.login').show();
		    	$('.title').text('Login | Mionix');
		    	$('.chat').hide();
		    	socket.emit('userExit', user);
		    });

		    socket.on('userExists', (data) => {
        		$('.error').text(data);
        		$('.error').show();
          	});
			socket.on('userSet', (data) => {
				user = data.username;
				$('.login').hide();
		    	$('.title').text('Chat | Mionix | ' + user);
		    	$('.chat').show();
			});*/

		    var Message;
		    Message = function(arg) {
		        this.user = arg.user, this.photo = arg.photo, this.text = arg.text, this.message_side = arg.message_side;
		        this.draw = function(_this) {
		            return () => {
		                var $message;
		                $message = $($('.message_template').clone().html());
		                $message.addClass(_this.message_side).find('.text').html(_this.text);
		                $message.addClass(_this.user).find('.avatar').attr({ title: _this.user, style: 'background-image: url('+ _this.photo +'); background-size: 60px;' });
		                	                

		                $('.messages').append($message);
		                return setTimeout( function() {
		                    return $message.addClass('appeared');
		                }, 0);
		            };
		        }(this);
		        return this;
		    };
		    $(function () {   
		    	
		    	socket.emit('setUsername', user);
		    	var getMessageText, message_side, sendMessage;
		        message_side = 'right';
		        getMessageText = () => {
		            var $message_input;
		            $message_input = $('.message_input');
		            return $message_input.val();
		        };
		        sendMessage = (text) => {
		            if (text.trim() === '') {
		                return;
		            }
		            $('.message_input').val('');
		            socket.emit('msg', {message: text, user: user.name, photo: user.photo, id: user.id } );		            
		        };
		        
		        $('.send_message').click((e) =>{
		            return sendMessage(getMessageText());
		        });

		        socket.on('newmsg', (data) => {
		          console.log(data);
		          if(user){
		            var $messages, message;
		            $messages = $('.messages');
		            if(user.id === data.id) message_side = 'right';
		            else message_side = 'left';
		            message = new Message({
		            	user: data.user,
		            	photo: data.photo,
		                text: data.message,
		                message_side: message_side
		            });
		            message.draw();
		            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);

		          }
		        })


		        $('.message_input').keyup((e) => {
		            if (e.which === 13) {
		                return sendMessage(getMessageText());
		            }
		        });
		       
		    });
		}.call(this));