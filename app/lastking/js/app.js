$(document).ready(()=>{
	
	$("#rule-btn").click(()=>{
		$(".rule-box").fadeIn(500);
	});
	$(".rule-box .back-btn").click(()=>{
		$(".rule-box").fadeOut(500);
	});
			
	$("#startBtn").click(()=>{
		$("body").loading({message:"CONNECT...",zIndex:999})
		game.connect(async (userAddress)=> {
			if(userAddress == false) {
				$.toast({
					text: '[ERROR] Connect Failed',
					position: 'top-center',
					stack: false
				});
			} else if(game.chainId != 56 && game.chainId != 97) {
				$.toast({
					text: '[ERROR] Please select BSC network',
					position: 'top-center',
					stack: false
				});
			} else {
				
				var gameAccount = await game.gameAccount();
				if(gameAccount == "0x0000000000000000000000000000000000000000") {
					$(".sign-box").show();
					$(".send-box").hide();
				} else {
					$(".sign-box").hide();
					$(".send-box").show();
					
					$(".gameAccount .value").html(gameAccount);
					
					var allowance = await game.allowance();
					if(allowance.unitAmount.gt(allowance.allowanceAmount)) {
						$(".send-btn").addClass("disable-btn");
					} else {
						$(".approve-btn").addClass("disable-btn");
					}
				}
				
				var currentNumber = 0;
				var syncGame = async () => {
					
					var gameData = await game.gameData();
					
					$(".unitAmount").html(utils.number_format(utils.precision(utils.z(gameData.unitAmount, game.tokenDecimals), 0), 0) + " S315");
					$(".amount .value").html(utils.number_format(utils.precision(utils.z(gameData.balanceAmount, game.tokenDecimals), 0), 0) + " S315");
					$(".userAddress .value").html(game.userAddress);
					$(".gameAddress .value").html(game.gameAddress);
					$(".winningUser .value").html(gameData.winningUser);
					$(".winningBlock .value").html(gameData.winningBlockNumber);
					var time = gameData.winningBlockNumber < gameData.currentNumber ? 0 : (gameData.winningBlockNumber - gameData.currentNumber) * 3;
					
					if(gameData.status == false) {
						$(".send-btn").addClass("disable-btn");
						$(".approve-btn").addClass("disable-btn");
					}
					
					if(gameData.currentNumber > currentNumber) {
						currentNumber = gameData.currentNumber;
						
						$(".time .value").html((time)+" s");
						
						clearInterval(window.countdown);
						window.countdown = setInterval(() => {
							if(time > 0) {
								time = time-1;
							}
							$(".time .value").html(time+" s");
						}, 1000);
					}
					
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
				setInterval(syncGame, 1000);
				$(".gamebox").fadeIn(500);
			}
			$("body").loading("stop");
		});
	});
	
	$(".sign-btn").click(()=>{
		
		if($(".sign-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"SENDING...",zIndex:999})
		
		window.game.sign(async function(receipt) {
				var gameAccount = await game.gameAccount();
				$(".gameAccount .value").html(gameAccount);
				$(".sign-box").hide();
				$(".send-box").show();
				
				$(".send-btn").addClass("disable-btn");
				$(".approve-btn").removeClass("disable-btn");
				
				$.toast({
					text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
				
			},
			function(err) {
				$.toast({
					text: "[ERROR] " + err.message,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
			}
		);
	});
	
	$(".approve-btn").click(()=>{
		
		if($(".approve-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"SENDING...",zIndex:999})
		
		window.game.approve(function(receipt) {
				$.toast({
					text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
				
				$(".send-btn").removeClass("disable-btn");
				$(".approve-btn").addClass("disable-btn");
			},
			function(err) {
				$.toast({
					text: "[ERROR] " + err.message,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
			}
		);
		
	});
	
	$(".send-btn").click(async ()=>{
		
		if($(".send-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"SENDING...",zIndex:999})
		
		await window.game.send(function(receipt) {
				$.toast({
					text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
				
				$(".send-btn").addClass("disable-btn");
				var text = $(".send-btn").html();
				var time = 30;
				$(".send-btn").html(time+" s");
				var sendTimer = setInterval(() => {
					time = time-1;
					if(time > 0) {
						$(".send-btn").html(time+" s");
					} else {
						$(".send-btn").removeClass("disable-btn");
						$(".send-btn").html(text);
						clearInterval(sendTimer);
					}
				}, 1000);
				
			},
			function(err) {
				$.toast({
					text: "[ERROR] " + err.message,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
			}
		);
		
	});

});