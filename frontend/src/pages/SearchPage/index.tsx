import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {web3, borrowYourCarContract, carTokenContract} from "../../utils/contracts"

const SearchPage = () => {

    const [account, setAccount] = useState('')
    const [owned, setOwned] = useState<number[]>([]);
    const [balance, setBalance] = useState(0);
    const [carInfo, setCarInfo] = useState<{ carId: number; owner: any; borrower: any; borrowUntil: any; imageURL: string}[]>([]);
    const [owner, setOwner] = useState([]);
    const [inputCarId, setInputCarId] = useState(0);
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
            const result = await borrowYourCarContract.methods.getCarInfo(inputCarId).call();
            const carId = inputCarId;
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
            setCarInfo(carInfoArray);
        }
        if(inputCarId != 0) {
            getCarInfo()
        }
    }, [inputCarId])

    const handleInputCarId = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputCar = parseInt(event.target.value);
        setInputCarId(inputCar);
    }

    const handleConfirmClick = async (carId:number) => {
        if(carId < 0) {
            alert("请输入大于0的数字");
        } else {
            try {
                const result = borrowYourCarContract.methods.getOwner(carId).call();
                setOwner(result[0]);
            } catch (error:any) {
                console.error("Error during transaction:", error);
            }
        }
    }

    return (
        <div>
            <p>当前余额：{balance}</p>
            <div>
                查询车辆：<input type="text" value={inputCarId} onChange={handleInputCarId} />
                <div></div>
                <button onClick={async () => handleConfirmClick(inputCarId)}>确认</button>
            </div>
            {carInfo.length > 0 ? (
                <ul>
                    {carInfo.map((car, index) => (
                        <li key={index}>
                            <strong>Car: {car.carId}</strong> - Owner: {car.owner}
                            {(
                                <>
                                    - Borrower: {car.borrower} - Borrow Until: {car.borrowUntil}
                                </>
                            )}
                            <p><img src={car.imageURL} alt={`Car ${car.carId}`} style={{maxWidth: "200px"}} /></p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>请输入查询编号！</p>
            )}
            <p><Link to="../HomePage">返回主页</Link></p>
        </div>
    )
}

export default SearchPage