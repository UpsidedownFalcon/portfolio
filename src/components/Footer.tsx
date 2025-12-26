export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">&lt;</span>
            Built with passion
            <span className="text-primary">/&gt;</span>
          </div>
          <div className="font-mono text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bhavy Metakar. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
