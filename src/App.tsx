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
  const [boughtItems, setBoughtItems] = useState<itemData[]>([]);

  const initItems = () => {
    setItems([
      { name: "콜라", price: 1100, amount: 3, id: 1 },
      { name: "커피", price: 700, amount: 0, id: 2 },
      { name: "물", price: 600, amount: 3, id: 3 },
    ]);
  };

  const returnChange = (amount?: number) => {
    let remainingAmount = amount !== undefined ? amount : insertedAmount;
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
      let remainingAmount = insertedAmount - item.price;
      setBoughtItems([...boughtItems, item]);
      setInsertedAmount(remainingAmount);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
      );
      if (
        remainingAmount <
        Math.min(
          ...items.filter((item) => item.amount > 0).map((item) => item.price)
        )
      ) {
        returnChange(remainingAmount); // insertedAmount가 비동기적으로 업데이트 되기 때문에 계산된 값을 직접 전달
      }
    }
    // 실제 웹페이지라면 else 상황에서는 잔액이 부족하거나 재고가 없다고 팝업이 뜨겠지만
    // 자판기와 유사하게 작동하게 하기 위해 else 상황에서 아무런 동작도 하지 않게 했습니다.
  };

  return (
    <div className="App flex flex-row items-start justify-center gap-12 p-12">
      <div className="">
        <h1 className="text-2xl font-bold display-block">자판기</h1>
        <div className="flex flex-col items-center justify-between border-2 border-blue-400 p-24 w-[450px] h-[700px] box-border">
          <div className="flex flex-row items-center justify-center gap-4 mb-12">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center"
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
          <div>
            <div>상품 출구</div>
            <div className="border-2 border-black-700 w-[120px] h-[60px]">
              {boughtItems.map((item) => (
                <div key={item.id}>{item.name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h3 className="mb-4 font-bold text-xl">현금투입</h3>
        <div className="grid grid-cols-2 gap-4 mb-12">
          {insertableCash.map((item) => (
            <button
              key={item}
              onClick={() => setInsertedAmount(insertedAmount + item)}
              className="text-red-400 w-[80px] h-[40px] rounded-[12px] border-2 border-red-400"
            >
              {item}원
            </button>
          ))}
        </div>
        <div>투입 금액: {insertedAmount} 원</div>
        <button
          className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400"
          onClick={() => returnChange()}
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
        <h3 className="mb-4 font-bold text-xl">카드결제</h3>
        <button
          className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400"
          onClick={() => {}}
        >
          카드
        </button>
      </div>
    </div>
  );
}

export default App;
