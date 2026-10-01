import { type ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SuperAdminSidebar } from "@/components/super-admin/SuperAdminSidebar";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { useAuth } from "@/lib/auth";
import { auth } from "@/firebase/firebase";
import { db } from "@/firebase/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

export function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth();

  if (import.meta.env.DEV && authReady && user) {
    (window as any).__superAdminDebug = {
      uid: user.id,
      email: user.email,
      role: user.role,
      projectId: "webtoolocean-builder",
      diagnose: async () => {
        const out: any = { uid: user.id, email: user.email, role: user.role, projectId: "webtoolocean-builder" };
        try {
          const userRef = doc(db, "users", user.id);
          const snap = await getDoc(userRef);
          out.usersRead = snap.exists() ? "PASS" : "FAIL";
          out.usersData = snap.exists() ? snap.data() : null;
        } catch (e: any) {
          out.usersRead = "FAIL";
          out.usersError = e?.message || String(e);
        }
        try {
          const snap = await getDocs(collection(db, "templates"));
          out.templatesList = "PASS";
          out.templatesCount = snap.size;
        } catch (e: any) {
          out.templatesList = "FAIL";
          out.templatesError = e?.message || String(e);
        }
        console.log("[SuperAdmin Debug]", out);
        return out;
      },
    } as any;
  }

  return (
    <MainLayout hideHeader hasSidebar>
      <SuperAdminSidebar>
        {children}
      </SuperAdminSidebar>
    </MainLayout>
  );
}
