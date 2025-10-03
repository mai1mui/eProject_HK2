import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";

/** Kiểm tra user có quyền vào khóa (dựa enrollments/course_accesses). */
export default function useOwnership(courseId) {
    const { user } = useAuth();
    const [own, setOwn] = useState(false);
    const [loading, setLoading] = useState(!!user);

    useEffect(() => {
        if (!user || !courseId) { setOwn(false); setLoading(false); return; }
        let live = true;
        setLoading(true);
        api.get(`/me/owns/${courseId}`)
            .then(r => live && setOwn(Boolean(r.data?.owns)))
            .catch(() => live && setOwn(false))
            .finally(() => live && setLoading(false));
        return () => { live = false; };
    }, [user, courseId]);

    return { own, loading };
}
