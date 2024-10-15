# kavach-plugin

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

https://icons.getbootstrap.com/



## TODO

- [ ] Cache all contexts (many API calls are being made when click on Get Proof Now button)
- [x] Remove hardcoding of ProofType at line no. `1766` in `zkProofs.vue` file.
- [ ] Remove hardcoing of credential 
- [ ] Remove hardcoding of Issuer DID resolution
- [x] Fix the Wallet modal popup
- [ ] Add checkmark on the AppInstruction page if all proofs and SBT are done. 
- [ ] Create Key for BJJ (also for ed25519)
- [ ] Issue credential in BJJ
- [ ] Implement verification of zk Proofs in smart contracts
- [ ] Redeploy smart contracts

