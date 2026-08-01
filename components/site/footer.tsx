import Link from 'next/link';
import { Skull } from 'lucide-react';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/league', label: 'FIFA League' },
  { href: '/members', label: 'Members' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/hall-of-fame', label: 'Hall of Fame' },
  { href: '/about', label: 'About' },
];

export default function Footer({ discordUrl }: { discordUrl: string }) {
  const discordLabel = discordUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <footer className="border-t border-border/50 bg-card/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Skull className="h-6 w-6 text-primary" />
              <span className="font-orbitron font-bold">
                <span className="text-primary">Purple</span> Buccaneers
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              A premium gaming community. Join us for events, FIFA leagues, and good times.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Navigate</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Join Us</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Become part of the crew on our Discord server.
            </p>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {discordLabel} →
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Purple Buccaneers. All hands on deck.
          </p>
        </div>
      </div>
    </footer>
  );
}
