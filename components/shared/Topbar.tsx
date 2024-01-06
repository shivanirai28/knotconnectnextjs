import { OrganizationSwitcher, SignedIn, SignOutButton  } from "@clerk/nextjs";
import Link from "next/link";

function Topbar() {
  const isUserLoggedIn = true;
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <img src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">
          KnotConnect
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <img
                  src="/assets/logout.svg" 
                  alt="logout"
                  width={24}
                  height={24}
                  />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
        appearance={{
          elements: {
            organizationSwitcherTrigger:
            "py-2 px-4"
          }
        }}
        />
      </div>
    </nav>
  );
}
export default Topbar;
