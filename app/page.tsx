import UserForm from "@/components/UserForm";
import RentDistributionChart from "@/components/RentDistributionChart";

export default function Home() {
  const userRent = 1500;

  return (
    <div>
      <UserForm/>
      <h1 className="text-xl font-bold mb-4">
        Polish ZUS Rent Distribution – March 2024
      </h1>
      <RentDistributionChart userRent={userRent} />
    </div>
  );
}
