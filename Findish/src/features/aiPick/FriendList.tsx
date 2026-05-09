import { useState } from "react";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";

const INITIAL_FRIENDS = ["다원", "성재", "성환", "석우"];

export default function FriendList() {
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [targetFriend, setTargetFriend] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (targetFriend) {
      setFriends((prev) => prev.filter((f) => f !== targetFriend));
    }
    setTargetFriend(null);
  };

  return (
    <div className="relative flex flex-col h-full px-12 py-8">
      <div className="flex items-start justify-between mb-8">
        <h1 className="typo-h2 font-bold text-neutral-900">
          친구 목록
        </h1>
        <button className="typo-body-lg font-bold text-neutral-900 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">
          친구 추가하기
        </button>
      </div>

      <ul className="flex flex-col">
        {friends.map((name, idx) => (
          <li key={name}>
            <div className="flex items-center justify-between py-4">
              <span className="typo-t1 text-neutral-900">{name}</span>
              <Button
                variant="primary"
                size="sm"
                className="typo-body-lg"
                onClick={() => setTargetFriend(name)}
              >
                삭제
              </Button>
            </div>
            {idx < friends.length - 1 && (
              <div className="h-px bg-neutral-100" />
            )}
          </li>
        ))}
      </ul>

      {targetFriend && (
        <ConfirmModal
          title="친구 삭제 요청"
          message={`"${targetFriend}"님을 친구 목록에서 삭제할까요?`}
          confirmLabel="삭제하기"
          cancelLabel="취소하기"
          onConfirm={handleDeleteConfirm}
          onClose={() => setTargetFriend(null)}
        />
      )}
    </div>
  );
}
