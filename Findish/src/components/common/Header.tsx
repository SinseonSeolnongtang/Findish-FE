import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import CartIcon from "@/assets/icons/user/cart.svg?react";

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

export default function Header({
  isLoggedIn = false,
  username = "김민서",
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-17 bg-white shadow-sm flex items-center px-10">
      <Link to="/" className="typo-logo text-primary select-none mr-16">
        Findish
      </Link>

      <nav className="flex items-center gap-10 flex-1">
        <Link
          to="/normal"
          className="typo-body-lg text-neutral-800 hover:text-primary transition-colors"
        >
          맛집 검색
        </Link>
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
              {username}님
            </Link>
            <Link
              to="/cart"
              className="text-neutral-800 hover:text-primary transition-colors"
            >
              <CartIcon width={24} height={24} />
            </Link>
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
