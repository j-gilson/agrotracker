interface AcceptInviteAndRefreshFarmsInput {
  token: string;
  acceptInvite: (token: string) => Promise<{ fazendaId: string }>;
  refreshFarms: () => Promise<void>;
}

export const acceptInviteAndRefreshFarms = async ({
  token,
  acceptInvite,
  refreshFarms,
}: AcceptInviteAndRefreshFarmsInput): Promise<string> => {
  const { fazendaId } = await acceptInvite(token);
  await refreshFarms();
  return fazendaId;
};
