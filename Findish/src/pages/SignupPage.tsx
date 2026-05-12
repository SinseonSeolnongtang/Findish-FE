import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';
import { useSignupMutation } from '@/hooks/useAuth';
import { checkId } from '@/api/auth';

interface SignupFormFields {
  loginId: string;
  password: string;
  passwordCheck: string;
  name: string;
  emailLocal: string;
  emailDomain: string;
}

interface TermsState {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
  aiPick: boolean;
}

type IdCheckStatus = 'idle' | 'available' | 'duplicated';

const EMAIL_DOMAINS = ['직접 입력', 'gmail.com', 'naver.com', 'kakao.com', 'hansung.ac.kr'];

export default function SignupPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormFields>();
  const { mutate: signupMutate, isPending } = useSignupMutation();

  const [terms, setTerms] = useState<TermsState>({
    all: false, terms: false, privacy: false, marketing: false, aiPick: false,
  });
  const [selectedDomain, setSelectedDomain] = useState('직접 입력');
  const [idCheckStatus, setIdCheckStatus] = useState<IdCheckStatus>('idle');
  const [isCheckingId, setIsCheckingId] = useState(false);

  const toggleAll = () => {
    const next = !terms.all;
    setTerms({ all: next, terms: next, privacy: next, marketing: next, aiPick: next });
  };
  const toggleTerm = (key: keyof Omit<TermsState, 'all'>) => {
    const next = { ...terms, [key]: !terms[key] };
    next.all = next.terms && next.privacy && next.marketing && next.aiPick;
    setTerms(next);
  };

  const handleCheckId = async () => {
    const loginId = getValues('loginId');
    if (!loginId) return;
    setIsCheckingId(true);
    try {
      const result = await checkId(loginId);
      setIdCheckStatus(result.isDuplicated ? 'duplicated' : 'available');
    } finally {
      setIsCheckingId(false);
    }
  };

  const onSubmit = (data: SignupFormFields) => {
    const resolvedDomain =
      selectedDomain === '직접 입력' ? data.emailDomain : selectedDomain;
    const email = `${data.emailLocal}@${resolvedDomain}`;

    signupMutate(
      {
        loginId: data.loginId,
        password: data.password,
        passwordCheck: data.passwordCheck,
        name: data.name,
        email,
        agreements: {
          termsOfService: terms.terms,
          privacyPolicy: terms.privacy,
          aiService: terms.aiPick,
          marketingConsent: terms.marketing,
        },
      },
      {
        onSuccess: () => navigate('/login'),
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-brand">
      <Header />

      <main className="flex flex-col items-center pt-25 pb-16">
        <div className="w-full max-w-175 px-4 flex flex-col gap-6">
          <h1 className="text-[52px] font-semibold text-neutral-800">회원가입</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* 아이디 */}
            <div className="flex flex-col gap-1">
              <Input
                label="아이디"
                required
                placeholder="아이디 입력"
                rightElement={
                  <Button
                    size="sm"
                    type="button"
                    className="text-[14px] h-11.5 px-4"
                    onClick={handleCheckId}
                    disabled={isCheckingId}
                  >
                    {isCheckingId ? '확인 중...' : '중복 확인'}
                  </Button>
                }
                {...register('loginId', {
                  required: true,
                  onChange: () => setIdCheckStatus('idle'),
                })}
              />
              {idCheckStatus === 'available' && (
                <p className="typo-body-sm text-green-500">사용 가능한 아이디입니다.</p>
              )}
              {idCheckStatus === 'duplicated' && (
                <p className="typo-body-sm text-red-500">이미 사용 중인 아이디입니다.</p>
              )}
            </div>

            {/* 비밀번호 */}
            <Input
              label="비밀번호"
              required
              type="password"
              placeholder="문자, 숫자, 특수문자 포함 8~20자"
              {...register('password', { required: true })}
            />

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-1">
              <Input
                label="비밀번호 확인"
                required
                type="password"
                placeholder="비밀번호 입력"
                {...register('passwordCheck', {
                  required: true,
                  validate: (v) =>
                    v === getValues('password') || '비밀번호가 일치하지 않습니다.',
                })}
              />
              {errors.passwordCheck && (
                <p className="typo-body-sm text-red-500">{errors.passwordCheck.message}</p>
              )}
            </div>

            {/* 이름 */}
            <Input
              label="이름"
              required
              placeholder="이름 입력"
              {...register('name', { required: true })}
            />

            {/* 이메일 */}
            <div className="flex flex-col gap-1">
              <label className="text-[16px] text-neutral-800 font-medium flex gap-0.5">
                <span className="text-primary">*</span>이메일
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="이메일 주소"
                  className="flex-1 h-16.25 px-5 rounded-[10px] border border-neutral-400 bg-white typo-body-lg placeholder:text-neutral-400 outline-none focus:border-primary transition-colors"
                  {...register('emailLocal', { required: true })}
                />
                <span className="text-[20px] text-neutral-600 font-medium">@</span>
                {selectedDomain === '직접 입력' ? (
                  <input
                    type="text"
                    placeholder="직접 입력"
                    className="flex-1 h-16.25 px-5 rounded-[10px] border border-neutral-400 bg-white typo-body-lg placeholder:text-neutral-400 outline-none focus:border-primary transition-colors"
                    {...register('emailDomain')}
                  />
                ) : (
                  <div className="flex-1 h-16.25 px-5 rounded-[10px] border border-neutral-400 bg-white flex items-center typo-body-lg text-neutral-800">
                    {selectedDomain}
                  </div>
                )}
                <select
                  className="h-16.25 px-4 rounded-[10px] border border-neutral-400 bg-white typo-body-md text-neutral-600 outline-none focus:border-primary transition-colors cursor-pointer"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  {EMAIL_DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="flex flex-col gap-2">
              <p className="text-[18px] font-semibold text-neutral-800">약관 동의</p>
              <div className="border border-neutral-400 rounded-[10px] overflow-hidden">
                <label className="flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-[#E5E7EB]">
                  <Checkbox checked={terms.all} onChange={toggleAll} />
                  <span className="text-[16px] font-medium text-neutral-800">전체 약관 동의</span>
                </label>

                {[
                  { key: 'terms' as const, label: '(필수) 이용 약관' },
                  { key: 'privacy' as const, label: '(필수) 개인정보 수집 및 이용 동의' },
                  { key: 'marketing' as const, label: '(선택) 맞춤 마케팅을 위한 개인정보 수집 동의' },
                  { key: 'aiPick' as const, label: '(필수) AI 픽 서비스를 위한 개인정보 이용 동의' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center justify-between px-5 py-3 cursor-pointer border-b border-[#F3F4F6] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={terms[key]} onChange={() => toggleTerm(key)} />
                      <span className="typo-body-sm text-neutral-600">{label}</span>
                    </div>
                    <button
                      type="button"
                      className="typo-caption text-neutral-400 border border-neutral-400 rounded-md px-3 py-1 hover:border-primary hover:text-primary transition-colors"
                    >
                      내용 보기
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={isPending}>
              {isPending ? '가입 중...' : '회원 가입 하기'}
            </Button>
          </form>

          <p className="text-center typo-body-md text-neutral-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'w-6 h-6 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-colors',
        checked ? 'bg-primary border-primary' : 'bg-white border-neutral-400',
      )}
    >
      {checked && (
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}
