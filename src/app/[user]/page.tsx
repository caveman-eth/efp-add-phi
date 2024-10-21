import type { Metadata } from "next";
import { isAddress, isHex } from "viem";

import UserInfo from "./components/user-info";
import { truncateAddress } from "#/lib/utilities";

interface Props {
  params: { user: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const user = isAddress(params.user) ? params.user : params.user;
  const truncatedUser = isAddress(params.user)
    ? (truncateAddress(params.user) as string)
    : params.user;
  const isList = Number.isInteger(Number(user)) && !(isAddress(user) || isHex(user));

  return {
    title: `${isList ? `List #${user}` : truncatedUser} | EFP`,
    openGraph: {
      title: `${isList ? `List #${user}` : truncatedUser} | EFP`,
      siteName: `${isList ? `List #${user}` : truncatedUser} - EFP profile`,
      description: `${isList ? `List #${user}` : truncatedUser} - EFP profile`,
      url: `https://ethfollow.xyz/${user}`,
      images: [
        {
          url: `https://ethfollow.xyz/og?user=${user}`,
        },
      ],
    },
    twitter: {
      images: `https://ethfollow.xyz/og?user=${user}`,
    },
  };
}

const UserPage = ({ params }: Props) => {
  return (
    <main className="xl:overflow-hidden h-screen w-full">
      <UserInfo user={params.user} />
    </main>
  );
};

export default UserPage;
