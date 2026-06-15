import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import googleImg from "@/assets/images/google.png";
import { useLoginMutation } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import type { LoginRequest } from "@/types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit } = useForm<LoginRequest>();
  const { mutate: loginMutate, isPending, isError } = useLoginMutation();
  const loginToStore = useAuthStore((s) => s.login);

  const onSubmit = (data: LoginRequest) => {
    loginMutate(data, {
      onSuccess: (res) => {
        loginToStore(res.accessToken, res.refreshToken);
        const from = searchParams.get("from");
        navigate(from === "onboarding" ? "/onboarding" : "/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-brand">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-screen pt-17">
        <div className="w-full max-w-150 flex flex-col items-center gap-6 px-4">
          <h1 className="typo-d1 font-semibold text-neutral-800 text-center leading-tight">
            로그인
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3.5"
          >
            <Input
              label="아이디"
              placeholder="아이디"
              {...register("loginId", { required: true })}
            />
            <div className="flex flex-col gap-1">
              <Input
                label="비밀번호"
                type="password"
                placeholder="비밀번호"
                {...register("password", { required: true })}
              />
              <div className="flex justify-end gap-4 mt-1">
                <button
                  type="button"
                  className="typo-body-sm text-neutral-400 hover:text-primary transition-colors cursor-pointer duration-400"
                >
                  아이디 찾기
                </button>
                <button
                  type="button"
                  className="typo-body-sm text-neutral-400 hover:text-primary transition-colors cursor-pointer duration-400"
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>

            {isError && (
              <p className="typo-body-sm text-red-500 text-center">
                아이디 또는 비밀번호가 올바르지 않습니다.
              </p>
            )}
            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            className="w-full font-bold text-neutral-800 rounded-[10px] gap-2"
          >
            <img src={googleImg} alt="Google" className="w-6 h-6" />
            구글 로그인
          </Button>
        </div>
      </main>
    </div>
  );
}
