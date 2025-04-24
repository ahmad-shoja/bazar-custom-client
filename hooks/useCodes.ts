import { useState } from "react";
import { useEffect } from "react";
import { Code } from "@/storage/types";
import { getCodes, addCode as addCodeBase, removeCodes as removeCodesBase } from "@/storage/codes";

export const useCodes = (appId: string) => {
    const [codes, setCodes] = useState<Code[]>([]);

    useEffect(() => {
        getCodes().then(codes => setCodes(codes.filter(code => code.appId === appId)));
    }, []);

    const addCode = async (code: Omit<Code, "id">) => {
        const newCode = await addCodeBase(code);
        setCodes([...codes, newCode]);
    }

    const removeCodes = (codeIds: string[]) => {
        removeCodesBase(codeIds);
        setCodes(codes.filter(code => !codeIds.includes(code.id)));
    }

    return { codes, addCode, removeCodes };
}