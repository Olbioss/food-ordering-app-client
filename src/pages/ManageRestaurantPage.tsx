import {
  useCreateRestaurant,
  useGetMyRestaurantOrders,
  useGetRestaurant,
  useUpdateRestaurant,
} from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateRestaurant();
  const { restaurant } = useGetRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateRestaurant();

  const { orders } = useGetMyRestaurantOrders();

  const isEditing = !!restaurant;

  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Siparişler</TabsTrigger>
        <TabsTrigger value="manage-retaurant">Restoranı Yönet</TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-5 rounded-3xl bg-card p-5 shadow-warm md:p-10 mt-4"
      >
        <h2 className="text-2xl font-bold font-heading">
          {orders?.length} aktif sipariş
        </h2>
        {orders?.map((order) => <OrderItemCard order={order} />)}
      </TabsContent>
      <TabsContent value="manage-retaurant" className="mt-4">
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={isEditing ? updateRestaurant : createRestaurant}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
export default ManageRestaurantPage;
