import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokenStore } from "../../lib/tokenStore";
import { getProfileRequest } from "../../api/auth.api";
import { useAppDispatch } from "../../store/hooks";
import { setSession } from "../../store/slices/auth.slice";
import { getRoleLandingPath } from "../../utils/roleRedirect";
import { Spinner, Alert } from "../../components/ui";

export const OAuthSuccessPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      setError("Missing access token from Google sign-in.");
      return;
    }

    const finalize = async (): Promise<void> => {
      try {
        tokenStore.setAccessToken(accessToken);
        const profile = await getProfileRequest();
        dispatch(setSession(profile));
        navigate(getRoleLandingPath(profile.role), { replace: true });
      } catch {
        setError("Unable to complete Google sign-in. Please try again.");
      }
    };

    void finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken p-6">
      {error ? (
        <Alert variant="danger" title="Sign-in failed">
          {error}
        </Alert>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Spinner size={28} />
          <p className="text-sm text-ink-500">Completing sign-in…</p>
        </div>
      )}
    </div>
  );
};
