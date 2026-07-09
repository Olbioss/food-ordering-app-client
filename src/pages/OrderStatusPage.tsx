import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Spinner from "@/components/ui/Spinner";

const OrderStatusPage = () => {
  const { isLoading, orders } = useGetMyOrders();

  if (isLoading) {
    return <Spinner />;
  }

  if (!orders || orders.length === 0) {
    return "Sipariş bulunamadı";
  }

  return (
    <div className="space-y-10">
      {orders.map((order) => (
        <div className="space-y-8 rounded-3xl bg-card p-6 shadow-warm md:p-10">
          <OrderStatusHeader order={order} />
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
            <AspectRatio ratio={16 / 5}>
              <img
                src={order.restaurant.imageUrl}
                className="rounded-2xl object-cover h-full w-full"
              />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
