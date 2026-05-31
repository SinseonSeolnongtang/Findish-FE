import { useCardSummaryQuery } from '@/hooks/useExplore';
import StoreCard, { type StoreCardData } from '@/components/common/StoreCard';
import type { ComponentProps } from 'react';

type StoreCardProps = ComponentProps<typeof StoreCard>;

interface Props extends Omit<StoreCardProps, 'store'> {
  store: StoreCardData;
}

export default function StoreCardWithSummary({ store, ...rest }: Props) {
  const { data } = useCardSummaryQuery(store.id);
  const summary = data?.data?.atmosphere?.summary;
  return <StoreCard store={{ ...store, summary }} {...rest} />;
}
