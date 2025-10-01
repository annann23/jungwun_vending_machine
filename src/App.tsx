import { useEffect, useState, useRef } from "react";
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
  const [isCardPayment, setIsCardPayment] = useState(false);

  //===============================================AI=================================================
  //프롬프트: 사용자가 1분 이상 아무런 동작을 하지 않으면 isCardPayment=true면 false로 바꿔주고, insertedAmount가 남아있다면 다 반환해주는 함수를 만들어줘.
  // 자동 반환 타이머 관련 상태
  const autoReturnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  //==================================================================================================

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

  const handleInsertedAmount = (amount: number) => {
    updateLastActivity();
    if (isCardPayment) returnChange(amount);
    else setInsertedAmount(insertedAmount + amount);
  };

  const handleCardPayment = (value: boolean) => {
    updateLastActivity();
    if (insertedAmount > 0) return;
    setIsCardPayment(value);
  };

  //===============================================AI=================================================
  //프롬프트: 사용자가 1분 이상 아무런 동작을 하지 않으면 isCardPayment=true면 false로 바꿔주고, insertedAmount가 남아있다면 다 반환해주는 함수를 만들어줘.

  // 사용자 활동 감지 함수
  const updateLastActivity = () => {
    lastActivityRef.current = Date.now();
  };

  // 자동 반환 함수
  const performAutoReturn = () => {
    console.log("자동 반환 실행: 1분 이상 동작이 감지되지 않았습니다.");

    // 카드 결제 중이면 취소
    if (isCardPayment) {
      setIsCardPayment(false);
      console.log("카드 결제 자동 취소");
    }

    // 현금이 남아있으면 반환
    if (insertedAmount > 0) {
      returnChange();
      console.log(`${insertedAmount}원 자동 반환`);
    }
  };

  // 타이머 설정 함수
  const resetAutoReturnTimer = () => {
    // 기존 타이머가 있으면 제거
    if (autoReturnTimerRef.current) {
      clearTimeout(autoReturnTimerRef.current);
    }

    // 1분(60000ms) 후 자동 반환 실행
    autoReturnTimerRef.current = setTimeout(() => {
      performAutoReturn();
    }, 60000);
  };
  //==================================================================================================

  useEffect(() => {
    initItems();
  }, []);

  //===============================================AI=================================================
  //프롬프트: 사용자가 1분 이상 아무런 동작을 하지 않으면 isCardPayment=true면 false로 바꿔주고, insertedAmount가 남아있다면 다 반환해주는 함수를 만들어줘.

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    resetAutoReturnTimer();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (autoReturnTimerRef.current) {
        clearTimeout(autoReturnTimerRef.current);
      }
    };
  }, []);

  // 사용자 활동이 있을 때마다 타이머 리셋
  useEffect(() => {
    updateLastActivity();
    resetAutoReturnTimer();
  }, [insertedAmount, isCardPayment, boughtItems]);
  //==================================================================================================

  const buyItem = (id: number) => {
    updateLastActivity();
    const item = items.find((item) => item.id === id);

    if (item && item.amount > 0) {
      if (isCardPayment) {
        //카드로 결제한다면 물품 구매 후 바로 완료로 넘어감
        setBoughtItems([...boughtItems, item]);
        setIsCardPayment((prev) => !prev);
        return;
      }

      if (insertedAmount >= item.price) {
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
                  className={`text-white w-[120px] h-[40px] rounded-[12px]
                ${
                  item.amount !== 0 &&
                  (insertedAmount >= item.price || isCardPayment)
                    ? "cursor-pointer bg-red-400"
                    : "cursor-default bg-gray-400"
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
              {boughtItems.map((item, index) => (
                <div key={item.name + index}>{item.name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h3 className="mb-4 font-bold text-xl">현금투입</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {insertableCash.map((item) => (
            <button
              key={item}
              onClick={() => handleInsertedAmount(item)}
              className={`text-red-400 w-[80px] h-[40px] rounded-[12px] border-2 border-red-400`}
            >
              {item}원
            </button>
          ))}
        </div>
        <div>투입 금액: {insertedAmount} 원</div>
        <button
          className="text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400"
          onClick={() => {
            updateLastActivity();
            returnChange();
          }}
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
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className={`w-[120px] h-[40px] rounded-[12px] border-2 ${
              insertedAmount > 0 || isCardPayment
                ? "cursor-default border-gray-400 text-gray-400"
                : "cursor-pointer border-red-400 text-red-400"
            }`}
            onClick={() => {
              handleCardPayment(true);
            }}
          >
            카드
          </button>
          <button
            className={`text-red-400 w-[120px] h-[40px] rounded-[12px] border-2 border-red-400 ${
              isCardPayment
                ? "cursor-pointer border-red-400 text-red-400"
                : "cursor-default border-gray-400 text-gray-400"
            }`}
            onClick={() => {
              handleCardPayment(false);
            }}
          >
            결제 취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
