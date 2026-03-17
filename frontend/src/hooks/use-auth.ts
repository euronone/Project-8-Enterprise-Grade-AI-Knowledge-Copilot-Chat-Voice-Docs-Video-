import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { ROUTES } from "@/lib/constants";

export function useAuth() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { user, setUser } = useUserStore();

	const isLoading = status === "loading";
	const isAuthenticated = status === "authenticated";

	async function login(email: string, password: string) {
		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});
		if (result?.error) throw new Error("Invalid credentials");
		router.push(ROUTES.DASHBOARD);
	}

	async function loginWithGoogle() {
		await signIn("google", { callbackUrl: ROUTES.DASHBOARD });
	}

	async function loginWithMicrosoft() {
		await signIn("azure-ad", { callbackUrl: ROUTES.DASHBOARD });
	}

	async function logout() {
		setUser(null);
		await signOut({ callbackUrl: ROUTES.LOGIN });
	}

	return {
		session,
		user: session?.user ?? user,
		isLoading,
		isAuthenticated,
		login,
		loginWithGoogle,
		loginWithMicrosoft,
		logout,
	};
}

