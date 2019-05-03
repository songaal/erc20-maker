<template>
    <b-container class="text-center cover-container">
        
        <div class="eth-logo"></div>
        <div>
            <span class="service-name">ERC-20 Token Maker</span>
        </div>

        <h1 class="mt-4 mb-2 main-coin-text">{{token.symbol}}</h1>
        <h4 class="mb-5 lead text-muted">{{token.name}}</h4>
        
        <h4 class="mt-4">개요</h4>
        <table class="table">
            <tr>
                <th>토큰타입</th>
                <td>이더리움 ERC-20</td>
            </tr>
            <tr>
                <th>토큰이름</th>
                <td>{{token.name}}</td>
            </tr>
            <tr>
                <th>토큰심볼</th>
                <td>{{token.symbol}}</td>
            </tr>
            <tr>
                <th>총 발행량</th>
                <td>{{token.totalSupply}}</td>
            </tr>
            <tr>
                <th>소수점갯수</th>
                <td>{{token.decimals}}</td>
            </tr>
            <tr>
                <th>생성일시</th>
                <td>{{token.date}}</td>
            </tr>
        </table>
        
        <h4 class="mt-5">속성</h4>
        <table class="table">
            <tr>
                <th>컨트랙트</th>
                <td>
                    <a ref="address" target="_black">
                        {{token.addressText}}
                    </a>
                </td>
            </tr>
            <tr>
                <th>소유자</th>
                <td>
                    <a ref="owner" target="_black">
                        {{token.ownerText}}
                    </a>
                    
                </td>
            </tr>
            
        </table>

        <div class="mastfoot mt-5">
            <div class="inner">
                <p>Provided by <a href="https://www.gncloud.kr/" style="color: black;">GNCloud</a> 
                    <span style="color: red; font-size: 18px; margin: 3px;">&hearts;</span>
                </p>
            </div>
        </div>
    </b-container>
</template>

<script>
import Web3 from 'web3'
import sampleABI from '../contracts/sample-abi'
import Utils from '../Utils'

export default {
    name: 'TokenDetail',
    components: {},
    data() {
        return {
            web3: null,
            instance: null,
            token: {
                id: null,
                address: null,
                addressText: null,
                name: null,
                symbol: null,
                totalSupply: null,
                decimals: null,
                owner: null,
                ownerText: null,
                txCount: null,
                timeStamp: null,
                date: null
            }
        }
    },
    created() {
        this.token.id = this.$route.params.token
        this.web3 = new Web3(new Web3.providers.HttpProvider(Utils.getWeb3Url()))
        if (!this.web3.isConnected()) {
            alert('네트워크 연결 실패.')
            return
        }
        this.instance = this.web3.eth.contract(sampleABI).at(this.token.id)
        this.getTokenSummary()
        this.getTokenTxCount()
        this.getToken()
    },
    methods: {
        async getTokenSummary() {
            this.token.name = await this.instance['name']() || ''
            this.token.symbol = await this.instance['symbol']() || ''
            this.token.totalSupply = Utils.comma(await this.instance['totalSupply']() || 0)
            this.token.decimals = Utils.comma(await this.instance['decimals']() || 0)
            this.token.address = await this.instance['address']
            this.$refs.address.setAttribute('href', Utils.link('address', this.token.address))
            this.token.addressText = Utils.shortHash(this.token.address)

            this.token.owner = await this.instance['owner']()
            this.$refs.owner.setAttribute('href', Utils.link('address', this.token.owner))
            this.token.ownerText = Utils.shortHash(this.token.owner)
            console.log('contract >> ', await this.instance)
            console.log('web3 >>', await this.web3)
        },
        async getTokenTxCount() {
            let url = `https://blockscout.com/eth/ropsten/api?module=account&action=txlist&address=${this.token.id}&offset=10`
            let res = await fetch(url)
            let body = await res.json()
            
            this.token.timeStamp = body.result[0].timeStamp
            let tmpDate = new Date()
            tmpDate.setTime(Number(body.result[0].timeStamp) * 1000)
            this.token.date = tmpDate.getFullYear() + '.'
            this.token.date += ((tmpDate.getMonth() + 1) <= 10 ? '0' + (tmpDate.getMonth() + 1) : tmpDate.getMonth() + 1) + '.'
            this.token.date += (tmpDate.getDate() <= 10 ? '0' + tmpDate.getDate() : tmpDate.getDate())
        },
        async getToken() {
            // TEST
            let url = `https://blockscout.com/eth/ropsten/api?module=token&action=getToken&contractaddress=${this.token.id}`
            let res = await fetch(url)
            let body = await res.json()
            console.log(body)
        }
    }
}
</script>

<style>
.cover-container {
    max-width: 42em !important;
}
.eth-logo {
    background-image: url("/img/ethereum-ci.png");
    background-size: 100px;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    height: 120px;
}
.service-name {
    font-size: 1.2em;
    font-weight: bold;
}
.main-coin-text {
    font-size: 60px;
}
.mastfoot {
    bottom: 1em;
}

</style>