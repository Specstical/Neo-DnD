import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border/70 bg-card/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground md:px-8">
          <div className="flex items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Neo-DnD</p>
            
          </div>
          
           <div className="text-center text-xs text-muted-foreground mt-2">
          This website is a fan project and is not affiliated with or endorsed by Wizards of the Coast.

        </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Yisong-Lin-Coding"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group flex items-center rounded-md p-2 hover:bg-background/60 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground group-hover:text-foreground" fill="currentColor" aria-hidden>
                <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6.7 2 .9.1-.7.4-1.3.7-1.6-2.7-.3-5.6-1.4-5.6-6.1 0-1.4.5-2.6 1.2-3.5-.1-.3-.5-1.6.1-3.4 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0C17 5 18 5.3 18 5.3c.6 1.8.2 3.1.1 3.4.8.9 1.2 2.1 1.2 3.5 0 4.7-2.9 5.8-5.6 6.1.4.4.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0012 .5" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/yisong-lin-8605a3357/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group flex items-center rounded-md p-2 hover:bg-background/60 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground group-hover:text-foreground" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 11-.001 5.001A2.5 2.5 0 014.98 3.5zM3 8.99h4v12H3v-12zM9 8.99h3.8v1.6h.1c.5-.9 1.7-1.8 3.5-1.8 3.8 0 4.5 2.5 4.5 5.7v6.5h-4v-5.7c0-1.4 0-3.2-1.9-3.2-1.9 0-2.2 1.5-2.2 3v5.9H9v-12z" />
              </svg>
            </a>

            <a
              href="https://buymeacoffee.com/yisongl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support"
              className="group flex items-center rounded-md p-2 hover:bg-background/60 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground group-hover:text-foreground" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17.9V20h-2v-.1A8.01 8.01 0 014.1 13H4v-2h.1A8.01 8.01 0 0111 4.1V4h2v.1A8.01 8.01 0 0119.9 11H20v2h-.1A8.01 8.01 0 0113 19.9z" />
              </svg>
            </a>

            <Link href="/credits" className="ml-3 text-muted-foreground hover:text-primary transition">Credits</Link>
          </div>
        </div>
       
      </footer>
    )
}