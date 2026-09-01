import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import { getSettings } from '@/lib/queries';
import { DEFAULT_DISCORD_INVITE } from '@/lib/site';

export const revalidate = 60;

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const discordUrl = settings?.discord_invite_url || DEFAULT_DISCORD_INVITE;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar discordUrl={discordUrl} />
      <main className="flex-1">{children}</main>
      <Footer discordUrl={discordUrl} />
    </div>
  );
}
