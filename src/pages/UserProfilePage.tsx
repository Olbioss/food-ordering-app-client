import { useGetUser, useUpdateMyUser } from "@/api/UserApi";
import Spinner from "@/components/ui/Spinner";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

  if (isGetLoading) return <Spinner />;

  if (!currentUser) return <span>Kullanıcı profili yüklenemedi</span>;

  return (
    <UserProfileForm
      currentUser={currentUser}
      onSave={updateUser}
      isLoading={isUpdateLoading}
    />
  );
};
export default UserProfilePage;
