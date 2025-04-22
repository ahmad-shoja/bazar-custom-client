import { useState } from "react";

import { addApp as addAppBase, getApps, removeApps as removeAppsBase } from "@/storage/apps";
import { useEffect } from "react";
import { App } from "@/storage/types";

export const useApps = () => {
    const [apps, setApps] = useState<App[]>([]);

    useEffect(() => {
        getApps().then(setApps);
    }, []);

    const addApp = (app: App) => {
        addAppBase(app);
        setApps([...apps, app]);
    }

    const removeApps = (appIds: string[]) => {
        removeAppsBase(appIds);
        setApps(apps.filter(app => !appIds.includes(app.id)));
    }

    return { apps, addApp, removeApps };

}