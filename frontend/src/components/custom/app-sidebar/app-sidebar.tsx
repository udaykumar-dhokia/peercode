import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Icons } from "../../../assets/icons/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Button } from "../../ui/button";
import { logout } from "../../../store/slices/user.slice";
import axiosInstance from "../../../utils/axiosInstance";

type AppSidebarProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Icons.Home,
  },
  {
    title: "Challenges",
    url: "/challenges",
    icon: Icons.Code,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Icons.Mail,
  },
  {
    title: "Profile",
    url: "#",
    icon: Icons.Profile,
  },
  {
    title: "Settings",
    url: "#",
    icon: Icons.Setting,
  },
];

export function AppSidebar({ isDialogOpen, setIsDialogOpen }: AppSidebarProps) {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axiosInstance.post("/auth/logout");
    dispatch(logout());
    navigate({ to: "/login" });
  };
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <Sidebar className={` ${isDialogOpen ? "blur-xs" : ""}`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-4">
            <div className="logo text-2xl font-bold">
              <Link to="/">
                Peer<span className="text-second">Code</span>
              </Link>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Button
              onClick={() => setIsDialogOpen(!isDialogOpen)}
              className="w-full mb-4 hover:cursor-pointer rounded-xl bg-black/90 inset-shadow-sm inset-shadow-white/60"
            >
              <Icons.Plus /> Create Challenge
            </Button>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`${pathname == item.url ? "bg-second/20" : ""} rounded-xl`}
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="outline-none ring-0">
                  <Icons.Profile /> {user?.fullName}
                  <Icons.DiagonalArrow />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span onClick={handleLogout}>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
