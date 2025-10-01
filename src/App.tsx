import { useEffect, useState } from "react";
import "./App.css";

interface itemData {
  name: string;
  amount: number;
  price: number;
  id: number;
}

function App() {
  const [insertedAmount, setInsertedAmount] = useState(0);
  const [items, setItems] = useState<itemData[]>([]);

  const initItems = () => {
    setItems([
      { name: "콜라", price: 1100, amount: 3, id: 1 },
      { name: "커피", price: 700, amount: 0, id: 2 },
      { name: "물", price: 600, amount: 3, id: 3 },
    ]);
  };

  const insertableCash = [100, 500, 1000, 5000, 10000];

  useEffect(() => {
    initItems();
  }, []);

  const buyItem = (id: number) => {};

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
              구매하기
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <h3>현금투입</h3>
        <div className="flex flex-row items-center justify-center gap-4">
          <button className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400">
            100원
          </button>
          <button className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400">
            500원
          </button>
          <button className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400">
            1000원
          </button>
          <button className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400">
            5000원
          </button>
          <button className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400">
            10000원
          </button>
        </div>
        <div>투입 금액: {insertedAmount} 원</div>
      </div>
      <div>
        <h3>카드결제</h3>
        <button>카드</button>
      </div>
    </div>
  );
}

export default App;
