import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const categories = [
    { title: "Text", href: "/" },
    { title: "Image", href: "/image" },
    { title: "Audio", href: "/audio" },
    { title: "Video", href: "/video" },
    { title: "File", href: "/file" },
    { title: "List", href: "/list" },
    { title: "Location", href: "/location" },
    { title: "Sticker", href: "/sticker" },
    { title: "OTP", href: "/otp" },
    { title: "Contact", href: "/contact" },
    { title: "Card", href: "/card" },
    { title: "Carousel", href: "/carousel" },
  ];

  const location = useLocation(); 

  return (
    <header className="bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            {categories.map((category) => {
              const isActive = location.pathname === category.href;
              return (
                <NavigationMenuItem key={category.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={category.href}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium 
                        transition-colors duration-200
                        ${
                          isActive
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                            : "text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                        }
                        no-underline
                      `}
                    >
                      {category.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
}
