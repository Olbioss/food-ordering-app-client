import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ORDER_STATUS } from "@/config/order.status.config";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);

    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime,
    );

    const hours = created.getHours();
    const minutes = created.getMinutes();

    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${paddedMinutes}`;
  };

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">
          Sipariş Durumu:{" "}
          <span className="text-primary">{getOrderStatusInfo().label}</span>
        </h1>
        <Badge variant="secondary" className="self-start px-4 py-2 text-sm md:self-auto">
          Tahmini teslimat: {getExpectedDelivery()}
        </Badge>
      </div>
      <Progress
        className="motion-safe:animate-pulse"
        value={getOrderStatusInfo().progressValue}
      />
    </>
  );
};

export default OrderStatusHeader;
