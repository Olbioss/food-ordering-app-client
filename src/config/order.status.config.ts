import { OrderStatus } from "@/types";

type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progressValue: number;
};

export const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Alındı", value: "placed", progressValue: 0 },
  {
    label: "Restoran Onayı Bekleniyor",
    value: "paid",
    progressValue: 25,
  },
  { label: "Hazırlanıyor", value: "inProgress", progressValue: 50 },
  { label: "Yola Çıktı", value: "outForDelivery", progressValue: 75 },
  { label: "Teslim Edildi", value: "delivered", progressValue: 100 },
];
