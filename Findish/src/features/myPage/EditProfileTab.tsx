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
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 overflow-hidden">
      <h2 className="typo-t1-medium text-neutral-900 text-center mb-4">
        회원 정보 수정
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 */}
        <div className="border-t border-neutral-200 flex items-center py-3">
          <span className="w-24 typo-body-md text-neutral-900 text-center shrink-0">
            이름
          </span>
          <div className="w-px h-7 bg-neutral-300 mx-4 shrink-0" />
          <span className="typo-body-md text-neutral-900">{user.name}</span>
        </div>

        {/* 아이디 */}
        <div className="border-t border-neutral-200 py-3">
          <div className="flex items-center">
            <span className="w-24 typo-body-md text-neutral-900 text-center shrink-0">
              아이디
            </span>
            <div className="w-px h-7 bg-neutral-300 mx-4 shrink-0" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Input
                className="h-10! text-[15px]!"
                disabled={!user.isLoginIdEditable}
                {...register("loginId", {
                  required: true,
                  onChange: () => setIdCheckStatus("idle"),
                })}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-primary text-primary shrink-0 text-[13px] px-3 h-8! rounded-lg!"
                onClick={handleCheckId}
                disabled={isCheckingId || !user.isLoginIdEditable}
              >
                {isCheckingId ? "확인 중..." : "중복확인"}
              </Button>
            </div>
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
        <div className="border-t border-neutral-200 flex items-center py-3">
          <span className="w-24 typo-body-md text-neutral-900 text-center shrink-0">
            비밀번호
          </span>
          <div className="w-px h-7 bg-neutral-300 mx-4 shrink-0" />
          <Input className="h-10! text-[15px]!" type="password" {...register("password")} />
        </div>

        {/* 비밀번호 확인 */}
        <div className="border-t border-neutral-200 py-3">
          <div className="flex items-center">
            <span className="w-24 typo-body-md text-neutral-900 text-center shrink-0">
              비밀번호 확인
            </span>
            <div className="w-px h-7 bg-neutral-300 mx-4 shrink-0" />
            <Input
              className="h-10! text-[15px]!"
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
        <div className="border-t border-b border-neutral-200 flex items-center py-3 min-w-0">
          <span className="w-24 typo-body-md text-neutral-900 text-center shrink-0">
            이메일
          </span>
          <div className="w-px h-7 bg-neutral-300 mx-4 shrink-0" />
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <Input className="h-10! text-[15px]!" type="text" {...register("emailLocal")} />
            </div>
            <span className="typo-body-md text-neutral-900 shrink-0">@</span>
            {selectedDomain === "직접 입력" ? (
              <div className="flex-1 min-w-0">
                <Input className="h-10! text-[15px]!" type="text" {...register("emailDomain")} />
              </div>
            ) : (
              <div className="flex-1 min-w-0 h-10 border border-neutral-400 bg-white px-3 rounded-[10px] flex items-center typo-body-md text-neutral-800">
                {selectedDomain}
              </div>
            )}
            <select
              className="h-10 px-2 rounded-[10px] border border-neutral-400 bg-white typo-body-md text-neutral-600 outline-none cursor-pointer focus:border-primary transition-colors shrink-0"
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
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-28 border-primary text-primary hover:bg-orange-100"
            onClick={onBack}
          >
            돌아가기
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="w-28"
            disabled={isPending}
          >
            {isPending ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
