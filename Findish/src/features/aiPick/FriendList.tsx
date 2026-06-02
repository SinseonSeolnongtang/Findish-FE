import { useState } from 'react';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import {
  useFriendsQuery,
  useReceivedFriendRequestsQuery,
  useRequestFriendMutation,
  useRespondFriendRequestMutation,
  useDeleteFriendMutation,
} from '@/hooks/useAiPick';
import { useSearchMemberMutation } from '@/hooks/useAuth';

export default function FriendList() {
  const [loginId, setLoginId] = useState('');
  const [targetMemberId, setTargetMemberId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const { data, isLoading } = useFriendsQuery();
  const friends = data ?? [];

  const { data: receivedData, isLoading: receivedLoading } = useReceivedFriendRequestsQuery();
  const receivedRequests = receivedData ?? [];

  const searchMemberMutation = useSearchMemberMutation();
  const requestFriendMutation = useRequestFriendMutation();
  const respondFriendRequestMutation = useRespondFriendRequestMutation();
  const deleteFriendMutation = useDeleteFriendMutation();

  const isPending = searchMemberMutation.isPending || requestFriendMutation.isPending;

  const handleRespond = (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    respondFriendRequestMutation.mutate({ requestId, body: { action } });
  };

  const handleRequest = () => {
    const trimmed = loginId.trim();
    if (!trimmed) return;
    setSearchError(null);
    searchMemberMutation.mutate(trimmed, {
      onSuccess: (member) => {
        requestFriendMutation.mutate(
          { receiverId: member.memberId },
          { onSuccess: () => { setLoginId(''); alert('친구 요청을 성공적으로 보냈습니다.'); } },
        );
      },
      onError: () => {
        setSearchError('해당 아이디의 회원을 찾을 수 없습니다.');
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (targetMemberId === null) return;
    deleteFriendMutation.mutate(targetMemberId, {
      onSuccess: () => setTargetMemberId(null),
    });
  };

  return (
    <div className="relative flex flex-col h-full px-12 py-8">
      <div className="flex items-start justify-between mb-8">
        <h1 className="typo-h2 font-bold text-neutral-900">친구 목록</h1>
      </div>

      {/* 친구 추가 입력 */}
      <div className="flex flex-col gap-1.5 mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={loginId}
            onChange={(e) => { setLoginId(e.target.value); setSearchError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleRequest()}
            placeholder="친구 아이디를 입력하세요"
            className="flex-1 h-10 px-4 border border-neutral-200 rounded-lg typo-body-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary transition-colors"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleRequest}
            disabled={isPending || !loginId.trim()}
            className="typo-body-sm px-5"
          >
            {isPending ? '요청 중...' : '요청'}
          </Button>
        </div>
        {searchError && (
          <p className="typo-caption text-error px-1">{searchError}</p>
        )}
        {requestFriendMutation.isError && (
          <p className="typo-caption text-error px-1">친구 요청에 실패했습니다.</p>
        )}
      </div>

      {/* 받은 친구 요청 */}
      {receivedLoading ? (
        <div className="flex justify-center py-6">
          <span className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : receivedRequests.length > 0 ? (
        <div className="mb-8">
          <h2 className="typo-t1 font-bold text-neutral-900 mb-3">받은 친구 요청</h2>
          <ul className="flex flex-col">
            {receivedRequests.map((req, idx) => (
              <li key={req.requestId}>
                <div className="flex items-center justify-between py-4">
                  <span className="typo-body-sm text-neutral-700">
                    {req.senderName}님이 친구 요청을 보냈습니다.
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="typo-body-sm"
                      disabled={respondFriendRequestMutation.isPending}
                      onClick={() => handleRespond(req.requestId, 'ACCEPT')}
                    >
                      수락
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="typo-body-sm"
                      disabled={respondFriendRequestMutation.isPending}
                      onClick={() => handleRespond(req.requestId, 'REJECT')}
                    >
                      거절
                    </Button>
                  </div>
                </div>
                {idx < receivedRequests.length - 1 && <div className="h-px bg-neutral-100" />}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* 친구 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <span className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ul className="flex flex-col">
          {friends.map((friend, idx) => (
            <li key={friend.memberId}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="typo-body-lg text-neutral-900">{friend.name}</span>
                  <span className="typo-body-sm text-neutral-400 ml-2">@{friend.loginId}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="typo-body-md"
                  disabled={deleteFriendMutation.isPending}
                  onClick={() => {
                    setTargetMemberId(friend.memberId);
                    setTargetName(friend.name);
                  }}
                >
                  삭제
                </Button>
              </div>
              {idx < friends.length - 1 && <div className="h-px bg-neutral-100" />}
            </li>
          ))}

          {friends.length === 0 && (
            <li className="py-10 text-center typo-body-md text-neutral-400">
              친구 목록이 비어있습니다.
            </li>
          )}
        </ul>
      )}

      {targetMemberId !== null && (
        <ConfirmModal
          title="친구 삭제 요청"
          message={`"${targetName}"님을 친구 목록에서 삭제할까요?`}
          confirmLabel="삭제하기"
          cancelLabel="취소하기"
          onConfirm={handleDeleteConfirm}
          onClose={() => setTargetMemberId(null)}
        />
      )}
    </div>
  );
}
