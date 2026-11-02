import { primeBannerHtml } from '@/lib/affiliate'

/** The landscape Prime banner for static article pages. */
export default function PrimeBanner({ sub }: { sub: string }) {
  return <div dangerouslySetInnerHTML={{ __html: primeBannerHtml(sub) }} />
}
