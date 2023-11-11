import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {web3, borrowYourCarContract, carTokenContract} from "../../utils/contracts"

const HomePage = () => {

    const [account, setAccount] = useState('')
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0]);
                }
            }
        }
        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (carTokenContract) {
                const ba = await carTokenContract.methods.balanceOf(account).call();
                setBalance(ba);
            } else {
                alert('Contract not exists.')
            }
        }
        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const tokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (carTokenContract) {
            try {
                await carTokenContract.methods.airdrop().send({
                    gas: 200000,
                    from: account
                })
                alert('You have got Car Token.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }


    return (
        <div>
            <p>当前余额：{balance}</p>
            <p><button onClick={tokenAirdrop}>点击领取初始资金</button></p>
            <p><Link to="../OwnedPage">查看自己拥有的车</Link></p>
            <p><Link to="../UnborrowPage">查看所有空闲的车</Link></p>
            <p><Link to="../SearchPage">查找车辆</Link></p>
        </div>
    )
}

export default HomePage