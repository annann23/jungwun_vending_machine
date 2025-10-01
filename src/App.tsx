import { useEffect, useState } from "react";
import "./App.css";

interface itemData {
  name: string;
  amount: number;
  price: number;
  id: number;
}

interface changeData {
  totalAmount: number;
  amountList: {
    cash: number;
    amount: number;
  }[];
}

function App() {
  const [insertedAmount, setInsertedAmount] = useState(0);
  const [items, setItems] = useState<itemData[]>([]);
  const [change, setChange] = useState<changeData>();
  const insertableCash = [100, 500, 1000, 5000, 10000];

  const initItems = () => {
    setItems([
      { name: "콜라", price: 1100, amount: 3, id: 1 },
      { name: "커피", price: 700, amount: 0, id: 2 },
      { name: "물", price: 600, amount: 3, id: 3 },
    ]);
  };

  const calculateChange = () => {
    let remainingAmount = insertedAmount;
    const currentChange: changeData = {
      totalAmount: remainingAmount,
      amountList: [],
    };

    for (let i = insertableCash.length - 1; i >= 0; i--) {
      if (remainingAmount >= insertableCash[i]) {
        const amount = Math.floor(remainingAmount / insertableCash[i]);
        currentChange.amountList.push({ cash: insertableCash[i], amount });
        remainingAmount = remainingAmount % insertableCash[i];
      }
    }

    setChange(currentChange);
    setInsertedAmount(remainingAmount);
  };

  useEffect(() => {
    initItems();
  }, []);

  const buyItem = (id: number) => {
    const item = items.find((item) => item.id === id);

    if (item && item.amount > 0 && insertedAmount >= item.price) {
      setInsertedAmount(insertedAmount - item.price);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
      );
    }
    // 실제 웹페이지라면 else 상황에서는 잔액이 부족하거나 재고가 없다고 팝업이 뜨겠지만
    // 자판기와 유사하게 작동하게 하기 위해 버튼을 눌러도 아무런 동작도 하지 않습니다.
  };

  return (
    <div className="App">
      <div className="">
        <h1 className="text-2xl font-bold display-block">자판기</h1>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-row items-center justify-center"
          >
            <div>{item.name}</div>
            <div>{item.price}원</div>
            <button
              onClick={() => buyItem(item.id)}
              disabled={item.amount === 0 || insertedAmount < item.price}
              className={`text-white w-[120px] h-[40px] rounded-[12px]
                ${
                  item.amount === 0 || insertedAmount < item.price
                    ? "cursor-default bg-gray-400"
                    : "cursor-pointer bg-red-400"
                }`}
            >
              {item.amount === 0 ? "품절" : "구매하기"}
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <h3>현금투입</h3>
        <div className="flex flex-row items-center justify-center gap-4">
          {insertableCash.map((item) => (
            <button
              key={item}
              onClick={() => setInsertedAmount(insertedAmount + item)}
              className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400"
            >
              {item}원
            </button>
          ))}
        </div>
        <div>투입 금액: {insertedAmount} 원</div>
        <button
          className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400"
          onClick={() => calculateChange()}
        >
          반환하기
        </button>
        {change && change?.amountList.length > 0 && (
          <>
            <div>잔액 목록</div>
            <div>총 잔액: {change.totalAmount} 원</div>
            {change.amountList.map((item) => (
              <div key={item.cash}>
                {item.cash}원: {item.amount}개
              </div>
            ))}
          </>
        )}
      </div>
      <div>
        <h3>카드결제</h3>
        <button>카드</button>
      </div>
    </div>
  );
}

export default App;
