import { useLocale } from 'next-intl';

/**
 * 現在のロケール設定を返すフック。
 * - `locale`: 現在の言語コード ("ja" | "en")
 * - `use24h`: 24時間表示かどうか（ja のみ true）
 * - `localePath`: URLプレフィックス（ja は "/ja"、en は ""）
 */
export function useLocaleConfig() {
  const locale = useLocale();
  return {
    locale,
    use24h: locale === 'ja',
    localePath: locale === 'ja' ? '/ja' : '',
  };
}
