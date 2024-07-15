window.game = {
	checkAccount:0,
	browser:"https://bscscan.com",
	// provider:"https://bsc-dataseed1.binance.org",
	chainId:0,
	userAddress:false,
	gameAddress:"0xd91df19c5cbc2b79832Fa41c00e7E742bf1E76Cb",
	tokenAddress:"0x565D40e2ef60f0B4e5bD0136Bb2C58ACe83fDaA5",
	tokenDecimals:18,
	currentBlock:0,
	fruits:['🍎', '🍐','🍊', '🍑','🍒','🍓','🍇','🍌','🍋','🍉'],
	connect(callback) {
		
		this.checkAccount++;
		if(this.checkAccount >= 10) {
			callback && callback(false);
			return;
		}
		
		// alert(typeof(web3));
		if(typeof(ethereum) == "undefined" && typeof(web3) == "undefined") {
			setTimeout(()=>{
				this.connect(callback);
			}, 100);
			return;
		}
		
		var provider = null;
		if(typeof(web3) != "undefined") {
			provider = web3.currentProvider;
		} else if(typeof(ethereum) != "undefined") {
			provider = ethereum;
		}
		
		if(typeof(this.metaMask) == "undefined") {
			this.metaMask = new Web3(provider);
			this.metaMask.utils.hexToNumber = function(number) {
				if(number == undefined) {
					return 0x00;
				}
				return this.toBN(number).toString(10);
			}
			this.BN = this.metaMask.utils.BN;
			this.zeroAmount = new this.BN(0);
		}
		
		provider.request({method: 'eth_requestAccounts'}).then(function(address) {
			window.game.metaMask.eth.getChainId().then((chainId)=>{
				window.game.chainId = chainId;
				window.game.userAddress = window.game.metaMask.utils.toChecksumAddress(address[0]);
				callback && callback(window.game.userAddress);
			});
		}).catch(function(err) {
			window.game.userAddress = false;
			callback && callback(window.game.userAddress);
		});
		
	},
	buyTickets(unitAmount, tickets, success, error) {
		var fruitwars = new this.metaMask.eth.Contract(fruitwars_abi, this.gameAddress);
		fruitwars.methods.buyTickets(unitAmount, tickets).send({from:this.userAddress})
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});
	},
	claim(success, error) {
		var fruitwars = new this.metaMask.eth.Contract(fruitwars_abi, this.gameAddress);
		fruitwars.methods.claim().send({from:this.userAddress})
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});
	},
	sign(success, error) {
		var fruitwars = new this.metaMask.eth.Contract(fruitwars_abi, this.gameAddress);
		fruitwars.methods.sign().send({from:this.userAddress})
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});
	},
	async approve(success, error) {
		var gameAccount = await this.gameAccount();
		var token = new this.metaMask.eth.Contract(erc20_abi, this.tokenAddress);
		token.methods.approve(gameAccount, "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF").send({from:this.userAddress})
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});;
	},
	async allowance() {
	
		var gameAccount = await this.gameAccount();
		
		// console.log(gameAccount);
		
		var token = new this.metaMask.eth.Contract(erc20_abi, this.tokenAddress);
		var allowance = new this.BN(await token.methods.allowance(this.userAddress, gameAccount).call());
		
		var fruitwars = new this.metaMask.eth.Contract(fruitwars_abi, this.gameAddress);
		var maxUnitAmount = new this.BN(await fruitwars.methods.maxUnitAmount().call());
		
		return {
			allowanceAmount:allowance, 
			maxUnitAmount:maxUnitAmount
		};
		
	},
	async balance(walletAddress) {
		var token = new this.metaMask.eth.Contract(erc20_abi, this.tokenAddress);
		var balance = new this.BN(await token.methods.balanceOf(walletAddress).call());
		return balance;
	},
	getCurrentNumber:async function() {
		
		if(this.currentBlock == 0) {
			var currentBlock = await this.metaMask.eth.getBlockNumber();
			while(true) {
				if(currentBlock.account_names == undefined) {
					break;
				}
				currentBlock = currentBlock.account_names;
			}
			
			this.currentBlock = parseInt(currentBlock);
		} else {
			
			var currentBlock = this.currentBlock+1;
			var block = await this.metaMask.eth.getBlock(currentBlock);
			if(block != undefined && block != null) {
				this.currentBlock = parseInt(currentBlock);
			}

		}
		
		return this.currentBlock;
	},
	async gameData() {
		var fruitwars = new this.metaMask.eth.Contract(fruitwars_abi, this.gameAddress);
		// var gameParameter = await fruitwars.methods.game().call();
		var gameParameter = {};
		gameParameter.currentNumber = await this.getCurrentNumber();
		gameParameter.status = await fruitwars.methods.started().call();
		gameParameter.maxUnitAmount = await fruitwars.methods.maxUnitAmount().call();
		gameParameter.balanceAmount = await fruitwars.methods.getPoolBalance().call();
		gameParameter.orderHistory  = await fruitwars.methods.getUserOrders(this.userAddress).call();
		gameParameter.winnerHistory = await fruitwars.methods.getWinnerHistory().call();
		
		return gameParameter;
	},
	async gameUserOrders() {
		var fruitwars = new this.metaMask.eth.Contract(fruitwars_abi, this.gameAddress);
		var orderHistory  = await fruitwars.methods.getUserOrders(this.userAddress).call();
		return orderHistory;
	},
	async gameAccount() {
		var fruitwars = new this.metaMask.eth.Contract(fruitwars_abi, this.gameAddress);
		var gameAccount = await fruitwars.methods.gameAccounts(this.userAddress).call();
		return gameAccount;
	},
	// async isSign() {
	// 	var gameAccount = await gameAccount();
	// 	return gameAccount != "0x0000000000000000000000000000000000000000";
	// }
}