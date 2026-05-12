import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { checkId } from "@/api/auth";
import { useUpdateMeMutation } from "@/hooks/useAuth";
import type { GetMeResponse } from "@/types/auth";

interface EditProfileFormFields {
  loginId: string;
  password: string;
  passwordCheck: string;
  emailLocal: string;
  emailDomain: string;
}

type IdCheckStatus = "idle" | "available" | "duplicated";

const EMAIL_DOMAINS = [
  "직접 입력",
  "gmail.com",
  "naver.com",
  "kakao.com",
  "hansung.ac.kr",
];

interface EditProfileTabProps {
  user: GetMeResponse;
  onBack: () => void;
}

export default function EditProfileTab({ user, onBack }: EditProfileTabProps) {
  const queryClient = useQueryClient();
  const { mutate: updateMe, isPending } = useUpdateMeMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EditProfileFormFields>({
    defaultValues: {
      loginId: user.loginId,
      emailLocal: user.email.split("@")[0] ?? "",
      emailDomain: user.email.split("@")[1] ?? "",
    },
  });

  const [selectedDomain, setSelectedDomain] = useState("직접 입력");
  const [idCheckStatus, setIdCheckStatus] = useState<IdCheckStatus>("idle");
  const [isCheckingId, setIsCheckingId] = useState(false);

  const handleCheckId = async () => {
    const loginId = getValues("loginId");
    if (!loginId) return;
    setIsCheckingId(true);
    try {
      const result = await checkId(loginId);
      setIdCheckStatus(result.isDuplicated ? "duplicated" : "available");
    } finally {
      setIsCheckingId(false);
    }
  };

  const onSubmit = (data: EditProfileFormFields) => {
    updateMe(
      { loginId: data.loginId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["me"] });
          onBack();
        },
      },
    );
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-8">
      <h2 className="typo-h1-medium text-neutral-900 text-center mb-6">
        회원 정보 수정
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 */}
        <div className="border-t border-neutral-200 flex items-center py-5">
          <span className="w-36 typo-t1 text-neutral-900 text-center shrink-0">
            이름
          </span>
          <div className="w-px h-11 bg-neutral-300 mx-6 shrink-0" />
          <span className="typo-t1 text-neutral-900">{user.name}</span>
        </div>

        {/* 아이디 */}
        <div className="border-t border-neutral-200 py-5">
          <div className="flex items-center">
            <span className="w-36 typo-t1 text-neutral-900 text-center shrink-0">
              아이디
            </span>
            <div className="w-px h-11 bg-neutral-300 mx-6 shrink-0" />
            <Input
              disabled={!user.isLoginIdEditable}
              rightElement={
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-primary text-primary px-3 text-[15px]"
                  onClick={handleCheckId}
                  disabled={isCheckingId || !user.isLoginIdEditable}
                >
                  {isCheckingId ? "확인 중..." : "중복확인"}
                </Button>
              }
              {...register("loginId", {
                required: true,
                onChange: () => setIdCheckStatus("idle"),
              })}
            />
          </div>
          {idCheckStatus === "available" && (
            <p className="typo-body-sm text-green-500 mt-1">
              사용 가능한 아이디입니다.
            </p>
          )}
          {idCheckStatus === "duplicated" && (
            <p className="typo-body-sm text-red-500 mt-1">
              이미 사용 중인 아이디입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="border-t border-neutral-200 flex items-center py-5">
          <span className="w-36 typo-t1 text-neutral-900 text-center shrink-0">
            비밀번호
          </span>
          <div className="w-px h-11 bg-neutral-300 mx-6 shrink-0" />
          <Input type="password" {...register("password")} />
        </div>

        {/* 비밀번호 확인 */}
        <div className="border-t border-neutral-200 py-5">
          <div className="flex items-center">
            <span className="w-36 typo-t1 text-neutral-900 text-center shrink-0">
              비밀번호 확인
            </span>
            <div className="w-px h-11 bg-neutral-300 mx-6 shrink-0" />
            <Input
              type="password"
              {...register("passwordCheck", {
                validate: (v) =>
                  !v ||
                  v === getValues("password") ||
                  "비밀번호가 일치하지 않습니다.",
              })}
            />
          </div>
          {errors.passwordCheck && (
            <p className="typo-body-sm text-[#E60000] mt-1">
              {errors.passwordCheck.message}
            </p>
          )}
        </div>

        {/* 이메일 */}
        <div className="border-t border-b border-neutral-200 flex items-center py-5 gap-2">
          <span className="w-36 typo-t1 text-neutral-900 text-center shrink-0">
            이메일
          </span>
          <div className="w-px h-11 bg-neutral-300 mx-6 shrink-0" />
          <div className="w-53.75 shrink-0">
            <Input type="text" {...register("emailLocal")} />
          </div>
          <span className="typo-t1 text-neutral-900">@</span>
          {selectedDomain === "직접 입력" ? (
            <div className="w-41.25 shrink-0">
              <Input type="text" {...register("emailDomain")} />
            </div>
          ) : (
            <div className="w-41.25 h-14 border border-neutral-400 bg-white px-4 rounded-[10px] flex items-center typo-body-lg text-neutral-800 shrink-0">
              {selectedDomain}
            </div>
          )}
          <select
            className="h-14 px-2 rounded-[10px] border border-neutral-400 bg-white typo-body-md text-neutral-600 outline-none cursor-pointer focus:border-primary transition-colors"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            {EMAIL_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-33.75 border-primary text-primary hover:bg-orange-100"
            onClick={onBack}
          >
            돌아가기
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-33.75"
            disabled={isPending}
          >
            {isPending ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
