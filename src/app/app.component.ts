import { Component } from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
const metaincoinArtifacts = require('../../build/contracts/TokenTest.json');
import { canBeNumber } from '../util/validation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  MetaCoin = contract(metaincoinArtifacts);

  // TODO add proper types these variables
  account: any;
  accounts: any;
  web3: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;
  stoped: boolean = false;
  symbol: string = "";

  constructor() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof this.web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
  }

  onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.
    this.MetaCoin.setProvider(this.web3.currentProvider);

    console.log('metacoin:', this.MetaCoin);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];

      this.getSymbol();
      this.refreshBalance();
    });
  }

  refreshBalance = () => {
    let meta;
    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.balanceOf.call(this.account, {
          from: this.account
        });
      })
      .then((value) => {
        this.balance = value;
      })
      .catch((e) => {
        console.log(e);
        this.setStatus("Error getting balance; see log.");
      });
  }

  setStatus = (message) => {
    this.status = message;
  }

  sendCoin = () => {
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;
    let meta;

    this.setStatus("Initiating transaction... (please wait)");

    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.transfer(receiver, amount, {
          from: this.account
        });
      })
      .then(() => {
        this.setStatus("Transaction complete!");
        this.refreshBalance();
      })
      .catch((e) => {
        console.log(e);
        this.setStatus("Error sending coin; see log.");
      });
  }

  getSymbol() {
    let meta;
    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.symbol();
      })
      .then((symbol) => {
        this.symbol = symbol;
      })
  }
  circuitBreaker = () => {
    let meta;
    this.stoped = !this.stoped;
    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.setCircuitBreaker(this.stoped, {
          from: this.account
        });
      })
      // .then(() => {
      //   this.setStatus("");
      //   this.refreshBalance();
      // })
      .catch((e) => {
        console.log(e);
        this.setStatus("Error sending coin; see log.");
      });
  }
}
