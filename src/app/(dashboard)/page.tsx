import { getUser } from "@/server/services/auth/get-user";

export default async function Home() {
  const user = await getUser();

  return (
    <div>
      <h1>Welcome {user.email}</h1>
    </div>
  );
}
