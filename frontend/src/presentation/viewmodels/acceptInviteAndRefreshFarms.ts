interface AcceptInviteAndRefreshFarmsInput {
  token: string;
  acceptInvite: (token: string) => Promise<void>;
  refreshFarms: () => Promise<void>;
}

export const acceptInviteAndRefreshFarms = async ({
  token,
  acceptInvite,
  refreshFarms,
}: AcceptInviteAndRefreshFarmsInput): Promise<void> => {
  await acceptInvite(token);
  await refreshFarms();
};
