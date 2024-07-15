window.game = {
	checkAccount:0,
	browser:"https://bscscan.com",
	// provider:"https://bsc-dataseed1.binance.org",
	chainId:0,
	userAddress:false,
	gameAddress:"0x5508140BfB8feD9Fc63C5aE6F756FfDEaE18ad82",
	tokenAddress:"0x565D40e2ef60f0B4e5bD0136Bb2C58ACe83fDaA5",
	tokenDecimals:18,
	currentBlock:0,
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
	send(success, error) {
		var lastking = new this.metaMask.eth.Contract(lastking_abi, this.gameAddress);
		lastking.methods.launch().send({from:this.userAddress})
		.on('receipt', function(receipt) {
			success(receipt);
		})
		.catch(function(err) {
			error(err);
		});
	},
	sign(success, error) {
		var lastking = new this.metaMask.eth.Contract(lastking_abi, this.gameAddress);
		lastking.methods.sign().send({from:this.userAddress})
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
		
		var gameParameter = await this.gameData();
		var unitAmount = new this.BN(gameParameter.unitAmount);
		
		return {
			allowanceAmount:allowance, 
			unitAmount:unitAmount
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
		var lastking = new this.metaMask.eth.Contract(lastking_abi, this.gameAddress);
		var gameParameter = await lastking.methods.game().call();
		
		gameParameter.currentNumber = await this.getCurrentNumber();
		gameParameter.balanceAmount = await lastking.methods.getPoolBalance().call();
		gameParameter.orderHistory  = await lastking.methods.getOrderHistory().call();
		gameParameter.winnerHistory = await lastking.methods.getWinnerHistory().call();
		
		return gameParameter;
	},
	async gameAccount() {
		var lastking = new this.metaMask.eth.Contract(lastking_abi, this.gameAddress);
		var gameAccount = await lastking.methods.gameAccounts(this.userAddress).call();
		return gameAccount;
	},
	// async isSign() {
	// 	var gameAccount = await gameAccount();
	// 	return gameAccount != "0x0000000000000000000000000000000000000000";
	// }
}