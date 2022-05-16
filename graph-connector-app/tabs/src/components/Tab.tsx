import React from "react";
import { Welcome } from "./sample/Welcome";
import { useTeamsFx } from "./sample/lib/useTeamsFx";

export default function Tab() {
  const { themeString } = useTeamsFx();
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <Welcome />
    </div>
  );
}
