window.game = {
	checkAccount:0,
	browser:"https://bscscan.com",
	// provider:"https://bsc-dataseed1.binance.org",
	userAddress:false,
	tokenAddress:"0x565D40e2ef60f0B4e5bD0136Bb2C58ACe83fDaA5",
	tokenDecimals:18,
	gameAddress:"0xBeEd90071cECA26d70C5C9698d76a718e48b5D3B",
	currentBlock:0,
	connect(callback) {
		
		this.checkAccount++;
		if(this.checkAccount >= 10) {
			callback && callback(false);
			return;
		}
		
		// alert(typeof(web3));
		if(typeof(ethereum) == "undefined") {
			setTimeout(()=>{
				this.connect(callback);
			}, 100);
			return;
		}
		
		if(typeof(this.metaMask) == "undefined") {
			this.metaMask = new Web3(ethereum);
			this.metaMask.utils.hexToNumber = function(number) {
				if(number == undefined) {
					return 0x00;
				}
				return this.toBN(number).toString(10);
			}
			this.BN = this.metaMask.utils.BN;
		}
		
		ethereum.enable().then(function(address) {
			window.game.userAddress = address[0];
			callback && callback(window.game.userAddress);
		}).catch(function() {
			window.game.userAddress = false;
			callback && callback(window.game.userAddress);
		});
		
	},
	send() {
		var lastking = new this.metaMask.eth.Contract(lastking_abi, this.gameAddress);
		return lastking.methods.launch().send({from:this.userAddress});
	},
	approve() {
		var token = new this.metaMask.eth.Contract(erc20_abi, this.tokenAddress);
		return token.methods.approve(this.gameAddress, "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF").send({from:this.userAddress});
	},
	async allowance() {
		var token = new this.metaMask.eth.Contract(erc20_abi, this.tokenAddress);
		var allowance = new this.BN(await token.methods.allowance(this.userAddress, this.gameAddress).call());
		
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
	}
}