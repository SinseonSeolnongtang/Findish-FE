import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import googleImg from "@/assets/images/google.png";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    navigate("/normal");
  };

  return (
    <div className="min-h-screen bg-gradient-brand">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-screen pt-17">
        <div className="w-full max-w-150 flex flex-col items-center gap-6 px-4">
          <h1 className="text-[64px] font-semibold text-neutral-800 text-center leading-tight">
            로그인
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <Input
              label="아이디"
              placeholder="아이디"
              {...register("username", { required: true })}
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

            <Button type="submit" size="lg" className="w-full mt-2">
              로그인
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full font-bold text-neutral-800 rounded-[10px] gap-3"
          >
            <img src={googleImg} alt="Google" className="w-8 h-8" />
            구글 로그인
          </Button>
        </div>
      </main>
    </div>
  );
}
