import { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { getUserCoins } from "@/services/user.service.ts";

export const UserCoins = () => {
  const [coins, setCoins] = useState<number>(0);
  useEffect(() => {
    fetchCoins().then();
  }, []);

  const fetchCoins = async () => {
    const res = await getUserCoins();
    setCoins(res);
  };

  return (
    <div className={"flex items-center gap-1"}>
      <Coins />
      <p className="text-sm text-gray-900 font-semibold">
        {coins} <span className={"font-medium text-xs"}>coins</span>
      </p>
    </div>
  );
};
