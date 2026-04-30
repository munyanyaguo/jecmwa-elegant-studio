import { NAV, CONTACT } from "@/data/site";

const Footer = () => {
  return (
    <footer className="border-t border-hairline py-16 md:py-20 bg-background">
      <div className="container-edge">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="font-serif text-2xl tracking-[0.18em] text-foreground">JECMWA</div>
            <div className="mt-1 text-[10px] tracking-[0.4em] text-muted-foreground">LIMITED</div>
            <p className="mt-6 max-w-sm text-sm leading-[1.8] text-muted-foreground">
              An interior styling studio shaping warm, considered homes through
              mirrors, portraits, and curated decor.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow mb-5">Navigate</div>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-foreground/75 hover:text-accent transition-colors">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="eyebrow mb-5">Studio</div>
            <ul className="space-y-3 text-sm text-foreground/75">
              <li><a href={CONTACT.email} className="hover:text-accent transition-colors">{CONTACT.emailDisplay}</a></li>
              <li><a href={CONTACT.phone} className="hover:text-accent transition-colors">{CONTACT.phoneDisplay}</a></li>
              <li><a href={CONTACT.whatsapp} className="hover:text-accent transition-colors">WhatsApp the studio</a></li>
              <li className="text-muted-foreground">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            © {new Date().getFullYear()} JECMWA Limited · All rights reserved
          </div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Interior Styling · Mirrors · Portraits · Decor
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
