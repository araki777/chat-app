import ChatHome from "@/components/ChatHome";
import { SessionGuard } from "@/guards/SessionGuard";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <SessionGuard>
      <ChatHome />
    </SessionGuard>
  );
};

export default Home;
