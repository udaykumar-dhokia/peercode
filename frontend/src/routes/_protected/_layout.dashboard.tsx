import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Icons } from "../../assets/icons/icons";
import type { JSX } from "react";

export const Route = createFileRoute("/_protected/_layout/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useSelector((state: RootState) => state.user);

  const renderSocialIcon = (Icon: JSX.Element, link?: string) => {
    return link ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {Icon}
      </a>
    ) : (
      <div className="opacity-75">{Icon}</div>
    );
  };

  if (!user) return null;

  return (
    <div className="w-full mt-10">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 p-8 rounded-full bg-second/20">
            <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-second">
              {user.fullName?.[0] || "?"}
            </h1>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {renderSocialIcon(<Icons.GitHub />, user.social?.github)}
          {renderSocialIcon(<Icons.Linkedin />, user.social?.linkedin)}
          {renderSocialIcon(<Icons.X />, user.social?.x)}
          {renderSocialIcon(<Icons.Reddit />, user.social?.reddit)}
        </div>
      </div>
    </div>
  );
}
