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
					
					if(allowance.maxUnitAmount.gt(allowance.allowanceAmount)) {
						$(".send-btn").addClass("disable-btn");
						$(".approve-btn").removeClass("disable-btn");
						$(".approve-btn").show();
						$(".check-btn").hide();
					} else {
						$(".send-btn").removeClass("disable-btn");
						$(".approve-btn").addClass("disable-btn");
						$(".approve-btn").hide();
						$(".check-btn").show();
						
						var orderHistory = await game.gameUserOrders();
						var lastOrder = orderHistory[0];
						var lastUnitAmount = new game.BN(lastOrder.unitAmount);
						if(lastUnitAmount.gt(game.zeroAmount) && lastOrder.status == 0) {
							$(".send-btn").addClass("disable-btn");
							$(".check-btn").removeClass("disable-btn");
						} else {
							$(".send-btn").removeClass("disable-btn");
							$(".check-btn").addClass("disable-btn");
						}
						
					}
					
				}
				
				var currentNumber = 0;
				var syncGame = async () => {
					
					var gameData = await game.gameData();
					
					$(".unitAmount").html(utils.number_format(utils.precision(utils.z(gameData.unitAmount, game.tokenDecimals), 0), 0) + " S315");
					$(".amount .value").html(utils.number_format(utils.precision(utils.z(gameData.balanceAmount, game.tokenDecimals), 0), 0) + " S315");
					$(".userAddress .value").html(game.userAddress);
					$(".gameAddress .value").html(game.gameAddress);
					
					// var time = gameData.winningBlockNumber < gameData.currentNumber ? 0 : (gameData.winningBlockNumber - gameData.currentNumber) * 3;
					
					if(gameData.status == false) {
						$(".send-btn").addClass("disable-btn");
						$(".approve-btn").addClass("disable-btn");
					}
					
					// if(gameData.currentNumber > currentNumber) {
					// 	currentNumber = gameData.currentNumber;
						
					// 	$(".time .value").html((time)+" s");
						
					// 	clearInterval(window.countdown);
					// 	window.countdown = setInterval(() => {
					// 		if(time > 0) {
					// 			time = time-1;
					// 		}
					// 		$(".time .value").html(time+" s");
					// 	}, 1000);
					// }
					
					$(".order-box .list").html("");
					gameData.orderHistory.map(function(item) {
						if(item.blockNumber == 0) {return;}
						// console.log(item.buyTickets);
						var buyTickets = "";
						item.buyTickets.map((ticket)=>{
							buyTickets += game.fruits[ticket] +" ";
						});
						// var winningAmount = game.metaMask.utils.toBN(item.winningAmount);
						var orderAmount = new game.BN(item.unitAmount).mul(new game.BN(item.buyTickets.length));
						// var profitAmount =winningAmount.sub(orderAmount);
						
						if(item.status == 0) {
							$(".order-box .list").append('<div class="row"><div class="item order"><div>{0}</div><div>{1}</div></div><div class="item result"><div>{2}</div><div>-</div></div><div class="item amount"><div>WAITING</div><div>-</div></div></div>'.format(item.blockNumber, buyTickets, item.winningBlockNumber));
						} else if(item.status == 3) {
							$(".order-box .list").append('<div class="row"><div class="item order"><div>{0}</div><div>{1}</div></div><div class="item result"><div>{2}</div><div>-</div></div><div class="item amount color-blue"><div>TIMEOUT</div><div>{3} S315</div></div></div>'.format(item.blockNumber, buyTickets, item.winningBlockNumber, "-"+utils.precision(utils.z(orderAmount, game.tokenDecimals), 0)));
						} else if(item.status == 1) {
							$(".order-box .list").append('<div class="row"><div class="item order"><div>{0}</div><div>{1}</div></div><div class="item result"><div>{2}</div><div>{3}</div></div><div class="item amount color-green"><div>{4}</div><div>{5} S315</div></div></div>'.format(item.blockNumber, buyTickets, item.winningBlockNumber, game.fruits[item.blockTicket], "WIN",("+"+utils.precision(utils.z(item.winningAmount, game.tokenDecimals), 0))));
						} else if(item.status == 2) {
							$(".order-box .list").append('<div class="row"><div class="item order"><div>{0}</div><div>{1}</div></div><div class="item result"><div>{2}</div><div>{3}</div></div><div class="item amount color-red"><div>{4}</div><div>{5} S315</div></div></div>'.format(item.blockNumber, buyTickets, item.winningBlockNumber, game.fruits[item.blockTicket], "LOSE",("-"+utils.precision(utils.z(orderAmount, game.tokenDecimals), 0))));
						}
					});
					
					$(".winner-box .list").html("");
					gameData.winnerHistory.map(function(item) {
						if(item.blockNumber == 0) {return;}
						$(".winner-box .list").append('<div class="row"><div class="item user">{0}</div><div class="item block">{1} - {2}</div><div class="item amount">{3} S315</div></div>'.format(utils.encode_address(item.user, 6, 4), item.blockNumber, item.winningBlockNumber, utils.number_format(utils.precision(utils.z(item.amount, game.tokenDecimals), 0), 0)));
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
				
				$(".approve-btn").hide();
				$(".check-btn").show();
				$(".check-btn").addClass("disable-btn");
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
		
		var unitAmount = $(".amount-item.active").data("value");
		var tickets = [];
		$(".fruit-item.active").map((key, item)=>{
			tickets.push($(item).data("value"));
		});

		if(tickets.length == 0) {
			$.toast({
				text: '[ERROR] Please select the fruit code',
				position: 'top-center',
				stack: false
			});
			return;
		}
		
		if(unitAmount == undefined) {
			$.toast({
				text: '[ERROR] Please select the bet amount',
				position: 'top-center',
				stack: false
			});
			return;
		} 
		
		$("body").loading({message:"SENDING...",zIndex:999});
		
		unitAmount = utils.w(unitAmount, game.tokenDecimals);
		
		await window.game.buyTickets(unitAmount, tickets,function(receipt) {
				$.toast({
					text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
				
				$(".send-btn").addClass("disable-btn");
				
				$(".check-btn").addClass("disable-btn");
				var text = $(".check-btn").html();
				var time = 30;
				$(".check-btn").html(time+" s");
				var checkTimer = setInterval(() => {
					time = time-1;
					if(time > 0) {
						$(".check-btn").html(time+" s");
					} else {
						$(".check-btn").removeClass("disable-btn");
						$(".check-btn").html(text);
						clearInterval(checkTimer);
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
	
	
	$(".check-btn").click(async ()=>{
		if($(".check-btn").hasClass("disable-btn")) {
			return;
		}
		
		$("body").loading({message:"SENDING...",zIndex:999})
		
		await window.game.claim(function(receipt) {
				$.toast({
					text: '[SUCCESS] TransactionHash ' + receipt.transactionHash,
					position: 'top-center',
					stack: false
				});
				$("body").loading("stop");
				$(".check-btn").addClass("disable-btn");
				
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
	
	
	$(".fruit-item").click(function() {
		
		if($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
		
	});
	
	$(".amount-item").click(function() {
		
		$(".amount-item.active").removeClass("active");
		$(this).addClass("active");
		
	});

});