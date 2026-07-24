import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { bootstrapSession } from "../store/slices/auth.slice";
import { selectAuthStatus } from "../store/selectors/auth.selectors";

export const useAuthBootstrap = (): void => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(bootstrapSession());
    }
  }, [status, dispatch]);
};
