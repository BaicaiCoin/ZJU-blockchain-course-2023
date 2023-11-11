import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {web3, borrowYourCarContract, carTokenContract} from "../../utils/contracts"

const OwnedPage = () => {

    const [account, setAccount] = useState('')
    const [owned, setOwned] = useState<number[]>([]);
    const [balance, setBalance] = useState(0);
    const [carInfo, setCarInfo] = useState<{ carId: number; owner: any; borrower: any; borrowUntil: any; imageURL: string}[]>([]);

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
                    setAccount(accounts[0])
                }
            }
        }
        initCheckAccounts()
    }, [])

    useEffect(() => {
        const borrowYourCarContractInfo = async () => {
            if (borrowYourCarContract) {
                const ownedcar = await borrowYourCarContract.methods.getOwnedCar(account).call();
                setOwned(ownedcar[0].slice(0, ownedcar[1]));
            } else {
                alert('Contract not exists.')
            }
        }
        if(account !== '') {
            borrowYourCarContractInfo()
        }
    }, [account])

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

    useEffect(() => {
        const getCarInfo = async () => {
            const carInfoArray = [];
            for(let i=0;i<owned.length;i++) {
                const result = await borrowYourCarContract.methods.getCarInfo(owned[i]).call();
                const carId = owned[i];
                const owner = result[0];
                const borrower = result[1];
                const borrowUntil = result[2];
                const imageURL = require(`../../pictures/car${carId}.jpg`);
                carInfoArray.push({
                    carId,
                    owner,
                    borrower,
                    borrowUntil,
                    imageURL,
                });
            }
            setCarInfo(carInfoArray);
        }
        if(owned.length != 0) {
            getCarInfo()
        }
    }, [owned])

    return (
        <div>
            <p>当前余额：{balance}</p>
            {carInfo.length > 0 ? (
                <ul>
                    {carInfo.map((car, index) => (
                        <li key={index}>
                            <strong>Car: {car.carId}</strong> - Owner: {car.owner}
                            {car.borrower !== '0x0000000000000000000000000000000000000000' && new Date(car.borrowUntil*1000).getTime() >= Date.now() &&(
                                <>
                                     - Borrower: {car.borrower} - Borrow Until: {car.borrowUntil}
                                </>
                            )}
                            <p><img src={car.imageURL} alt={`Car ${car.carId}`} style={{maxWidth: "200px"}} /></p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>你目前没有车！</p>
            )}
            <p><Link to="../HomePage">返回主页</Link></p>
        </div>
    )
}

export default OwnedPage