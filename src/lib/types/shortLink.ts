export interface ShortLink {
  id: string;
  originalURL: string;
  redirectURL: string;
  customId: string | null;
  shortId: string | null;
  activeClicks: number;
  createdAt: string;
  active: boolean;
  customDomain: boolean;
}
