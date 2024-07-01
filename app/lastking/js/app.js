$(document).ready(()=>{
			
	$("#startBtn").click(()=>{
		$("body").loading({message:"CONNECT...",zIndex:999})
		game.connect(async (userAddress)=> {
			if(userAddress == false) {
				$.toast({
					text: '[ERROR] Connect Failed',
					position: 'top-center',
					stack: false
				});
			} else {
				
				var allowance = await game.allowance();
				
				if(allowance.unitAmount.gt(allowance.allowanceAmount)) {
					$(".send-btn").addClass("disable-btn");
				} else {
					$(".approve-btn").addClass("disable-btn");
				}
				
				var syncGame = async () => {
					var gameData = await game.gameData();
					$(".unitAmount").html(utils.number_format(utils.precision(utils.z(gameData.unitAmount, game.tokenDecimals), 0), 0) + " S315");
					$(".amount .value").html(utils.number_format(utils.precision(utils.z(gameData.balanceAmount, game.tokenDecimals), 0), 0) + " S315");
					$(".userAddress .value").html(game.userAddress);
					$(".gameAddress .value").html(game.gameAddress);
					$(".winningUser .value").html(gameData.winningUser);
					$(".winningBlock .value").html(gameData.winningBlockNumber);
					var time = gameData.winningBlockNumber < gameData.currentNumber ? 0 : (gameData.winningBlockNumber - gameData.currentNumber + 1) * 3;
					$(".time .value").html(time+" s");
					
					clearInterval(window.countdown);
					window.countdown = setInterval(() => {
						if(time > 0) {
							time = time-1;
						}
						$(".time .value").html(time+" s");
					}, 1000);
					
					$(".order-box .list").html("");
					gameData.orderHistory.map(function(item) {
						if(item.blockNumber == 0) {return;}
						$(".order-box .list").append('<div class="row"><div class="item user">{0}</div><div class="item block">{1}</div><div class="item amount">{2} S315</div></div>'.format(utils.encode_address(item.user, 6, 4), item.blockNumber, utils.precision(utils.z(item.amount, game.tokenDecimals), 0)));
					});
					
					$(".winner-box .list").html("");
					gameData.winnerHistory.map(function(item) {
						if(item.blockNumber == 0) {return;}
						$(".winner-box .list").append('<div class="row"><div class="item user">{0}</div><div class="item block">{1}</div><div class="item amount">{2} S315</div></div>'.format(utils.encode_address(item.user, 6, 4), item.blockNumber, utils.number_format(utils.precision(utils.z(item.amount, game.tokenDecimals), 0), 0)));
					});
				}
				
				await syncGame();
				setInterval(syncGame, 3000);
				
				$(".gamebox").fadeIn(500);
			}
			$("body").loading("stop");
		});
	});
	
	$(".send-btn").click(()=>{
		
		if($(".send-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"SENDING...",zIndex:999})
		
		window.game.send().on('transactionHash', function(hash) {
			
		}).on('receipt', function(receipt) {
			$.toast({
				text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
				position: 'top-center',
				stack: false
			});
			$("body").loading("stop");
		}).catch(function(err) {
			$.toast({
				text: "[ERROR] " + err.message,
				position: 'top-center',
				stack: false
			});
			$("body").loading("stop");
		});
		
	});
	
	$(".approve-btn").click(()=>{
		
		if($(".approve-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"SENDING...",zIndex:999})
		
		window.game.approve().on('transactionHash', function(hash) {
			
		}).on('receipt', function(receipt) {
			$.toast({
				text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
				position: 'top-center',
				stack: false
			});
			$("body").loading("stop");
			
			$(".send-btn").removeClass("disable-btn");
			$(".approve-btn").addClass("disable-btn");
			
		}).catch(function(err) {
			$.toast({
				text: "[ERROR] " + err.message,
				position: 'top-center',
				stack: false
			});
			$("body").loading("stop");
		});
		
	});

});