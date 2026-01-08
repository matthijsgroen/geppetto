import { useEffect, useState } from "react";

import {
  listenToDarkModeChanges,
  userPreferences,
} from "@/shared/utils/darkMode";

export const useLightModePreference = (): "dark" | "light" | "system" => {
  const [preference, setPreference] = useState<"dark" | "light" | "system">(
    userPreferences()
  );

  useEffect(() => {
    const handleChange = () => {
      setPreference(userPreferences());
    };
    const unsubscribe = listenToDarkModeChanges(handleChange);
    return unsubscribe;
  }, []);

  return preference;
};
