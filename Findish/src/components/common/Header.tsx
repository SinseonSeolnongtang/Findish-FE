import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import CartIcon from "@/assets/icons/user/cart.svg?react";
import { useAuthStore } from "@/stores/authStore";
import { useGetMeQuery, useLogoutMutation } from "@/hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { data } = useGetMeQuery();
  const { mutate: logout } = useLogoutMutation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-17 bg-white shadow-sm flex items-center px-10">
      <Link to="/" className="typo-logo text-primary select-none mr-16">
        Findish
      </Link>

      <nav className="flex items-center gap-10 flex-1">
        <div className="relative group">
          <span className="typo-body-lg text-neutral-800 group-hover:text-primary transition-colors cursor-pointer">
            맛집 검색
          </span>
          <div className="absolute top-full -left-4 hidden group-hover:block pt-2 z-10">
            <div className="bg-white shadow-md rounded-md overflow-hidden min-w-26">
              <Link
                to="/normal"
                state={{ initialMode: "normal" }}
                className="block px-5 py-2 typo-body-sm text-neutral-800 hover:bg-neutral-50 hover:text-primary transition-colors"
              >
                일반 모드
              </Link>
              <Link
                to="/normal"
                state={{ initialMode: "pick" }}
                className="block px-5 py-2 typo-body-sm text-neutral-800 hover:bg-neutral-50 hover:text-primary transition-colors"
              >
                선택 모드
              </Link>
            </div>
          </div>
        </div>
        <Link
          to="/ai-pick"
          className="typo-body-lg text-neutral-800 hover:text-primary transition-colors"
        >
          AI Pick
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/mypage"
              className="typo-body-md text-neutral-800 hover:text-primary transition-colors"
            >
              {data?.name}님
            </Link>
            <Link
              to="/cart"
              className="text-neutral-800 hover:text-primary transition-colors"
            >
              <CartIcon width={24} height={24} />
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                logout(undefined, { onSuccess: () => navigate("/") })
              }
            >
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="typo-body-md text-neutral-800 hover:text-primary transition-colors"
            >
              회원가입
            </Link>
            <Button size="sm" onClick={() => navigate("/login")}>
              로그인
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
