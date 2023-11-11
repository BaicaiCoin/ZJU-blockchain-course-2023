import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {web3, borrowYourCarContract, carTokenContract} from "../../utils/contracts"
const OwnedPage = () => {

    const [account, setAccount] = useState('');
    const [unborrowed, setUnborrowed] = useState<number[]>([]);
    const [balance, setBalance] = useState(0);
    const [carInfo, setCarInfo] = useState<{ carId: number; owner: any; borrower: any; borrowUntil: any; imageURL: string}[]>([]);
    const [inputCarId, setInputCarId] = useState(0);
    const [inputPrice, setInputPrice] = useState(0);
    const [inputDuration, setInputDuration] = useState(0);



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
                const unborrowedcar = await borrowYourCarContract.methods.getAvailableCar().call();
                setUnborrowed(unborrowedcar[0].slice(0, unborrowedcar[1]));
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
            for(let i=0;i<unborrowed.length;i++) {
                const result = await borrowYourCarContract.methods.getCarInfo(unborrowed[i]).call();
                const carId = unborrowed[i];
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
        if(unborrowed.length != 0) {
            getCarInfo()
        }
    }, [unborrowed])

    const borrowCar = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

    }

    const handleInputDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputDuration = parseInt(event.target.value);
        setInputDuration(inputDuration);
    }

    const handleConfirmClick = async (value: number|null, carId:number) => {
        if(inputDuration == 0 || value == null) {
            alert("请输入大于0的数字");
        } else {
            const amount = web3.utils.toWei((value*100).toString(), 'ether');
            try {
                await Promise.all([
                    carTokenContract.methods.approve(borrowYourCarContract.options.address, amount).send({from: account}),
                    borrowYourCarContract.methods.borrowCar(carId, account, value, 0).send({from: account})
                ]);
                setInputDuration(0);
            } catch (error:any) {
                console.error("Error during transaction:", error);
                alert(`交易失败，请查看控制台日志获取详细信息。错误信息：${error.message}, ${value}`);
            }
        }
        setInputDuration(0);
    }

    return (
        <div>
            <p>当前余额：{balance}</p>
            <p>想租车吗？请输入车的编号和租用时长：</p>

            {carInfo.length > 0 ? (
                <ul>
                    {carInfo.map((car, index) => (
                        <li key={index}>
                            <strong>Car: {car.carId}</strong> - Owner: {car.owner}
                            <div>
                                借用时长：<input type="text" value={inputDuration} onChange={handleInputDuration} />
                                <div></div>
                                <button onClick={async () => handleConfirmClick(inputDuration, car.carId)}>确认</button>
                            </div>
                            <p><img src={car.imageURL} alt={`Car ${car.carId}`} style={{maxWidth: "200px"}} /></p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>目前没有任何可借用车辆！</p>
            )}
            <p><Link to="../HomePage">返回主页</Link></p>
        </div>
    )
}

export default OwnedPage