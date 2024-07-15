var fruitwars_abi = [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "accounts",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "bonusRate",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "bounsAddress",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "burnRate",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "unitAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint8[]",
						"name": "tickets",
						"type": "uint8[]"
					}
				],
				"name": "buyTickets",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "claim",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "gameAccounts",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "gamePool",
				"outputs": [
					{
						"internalType": "contract GamePool",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getAccounts",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getGameUserCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "hash",
						"type": "bytes32"
					}
				],
				"name": "getHashTicket",
				"outputs": [
					{
						"internalType": "uint8",
						"name": "",
						"type": "uint8"
					}
				],
				"stateMutability": "pure",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getMaxTicketNumber",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getPoolBalance",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					}
				],
				"name": "getUserOrders",
				"outputs": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "user",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "unitAmount",
								"type": "uint256"
							},
							{
								"internalType": "uint8[]",
								"name": "buyTickets",
								"type": "uint8[]"
							},
							{
								"internalType": "uint8",
								"name": "status",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "blockNumber",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "winningBlockNumber",
								"type": "uint256"
							},
							{
								"internalType": "uint8",
								"name": "blockTicket",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "winningAmount",
								"type": "uint256"
							}
						],
						"internalType": "struct IFruitWars.Order[10]",
						"name": "",
						"type": "tuple[10]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getWinnerHistory",
				"outputs": [
					{
						"components": [
							{
								"internalType": "address",
								"name": "user",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "amount",
								"type": "uint256"
							},
							{
								"internalType": "uint8[]",
								"name": "buyTickets",
								"type": "uint8[]"
							},
							{
								"internalType": "uint256",
								"name": "blockNumber",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "winningBlockNumber",
								"type": "uint256"
							},
							{
								"internalType": "uint8",
								"name": "blockTicket",
								"type": "uint8"
							}
						],
						"internalType": "struct IFruitWars.Winner[10]",
						"name": "",
						"type": "tuple[10]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "maxTicketNumber",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "maxUnitAmount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "minUnitAmount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "orderRate",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "poolAccounts",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "renounceOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_maxTicketNumber",
						"type": "uint256"
					}
				],
				"name": "setMaxTicketNumber",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_winningRate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_burnRate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_bonusRate",
						"type": "uint256"
					}
				],
				"name": "setRate",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_minAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_maxAmount",
						"type": "uint256"
					}
				],
				"name": "setUnitAmount",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "sign",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "startGame",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "started",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "stopGame",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "userOrders",
				"outputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "unitAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "blockNumber",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "winningBlockNumber",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "blockTicket",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "winningAmount",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "winners",
				"outputs": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "blockNumber",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "winningBlockNumber",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "blockTicket",
						"type": "uint8"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "winningRate",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "withdrawETH",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_tokenAddress",
						"type": "address"
					}
				],
				"name": "withdrawToken",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		];
