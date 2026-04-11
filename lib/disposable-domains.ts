/**
 * Known disposable / temporary email domains.
 * Gmail, Outlook, Hotmail, Live, Yahoo, iCloud, ProtonMail, business domains are allowed.
 * This list is checked server-side in /api/create-profile and /auth/callback.
 */
export const DISPOSABLE_DOMAINS = new Set([
  // ── Guerrilla Mail family ──
  'guerrillamail.com','guerrillamail.info','guerrillamail.net','guerrillamail.org','guerrillamail.de',
  'guerrillamailblock.com','sharklasers.com','grr.la','guerrillamail.biz','spam4.me',
  // ── Mailinator family ──
  'mailinator.com','mailinator.net','mailinator.org','mailinator2.com','mailinator2.net',
  'suremail.info','spamherelots.com','spamhereplease.com','sendspamhere.com','letthemeatspam.com',
  'inboxproxy.com','notmailinator.com','binkmail.com','bob.email','rcpt.at',
  // ── 10 Minute Mail family ──
  '10minutemail.com','10minutemail.net','10minutemail.org','10minutemail.de','10minutemail.info',
  '10minutemail.co.uk','10minutemail.us','10minutemail.be','10minutemail.co.za',
  'minutemail.com','10minemail.com',
  // ── Temp Mail family ──
  'tempmail.com','tempmail.net','tempmail.org','tempmail.eu','tempmail.io','tempmail.pro',
  'tempmail.us','tempmail.de','tempmail.it','tempr.email','tempinbox.com','tempinbox.co.uk',
  'temp-mail.org','temp-mail.ru','temp-mail.io','temp-mail.de','tmpmail.net','tmpmail.org',
  'tempalias.com','tempemail.com','tempemail.net','tempemail.org','tempemail.biz',
  'tempthink.com','tempsky.com','tempthe.net',
  // ── Trash Mail family ──
  'trashmail.com','trashmail.at','trashmail.io','trashmail.me','trashmail.net',
  'trashmail.org','trashmail.xyz','trash-mail.at','trash-mail.com','trash-mail.de',
  'trash-mail.io','trash-mail.me','trashemail.de','trashtigers.com',
  // ── Yopmail family ──
  'yopmail.com','yopmail.fr','yopmail.info','yopmail.net','yopmail.org','yopmail.pp.ua',
  'cool.fr.nf','jetable.fr.nf','nospam.ze.tc','nomail.xl.cx','mega.zik.dj',
  'speed.1s.fr','courriel.fr.nf','moncourrier.fr.nf','monemail.fr.nf',
  // ── SpamGourmet ──
  'spamgourmet.com','spamgourmet.net','spamgourmet.org',
  // ── Jetable ──
  'jetable.com','jetable.net','jetable.org','jetable.fr','nomail.fr','nospam.fr',
  // ── Throwaway / Discard ──
  'throwaway.email','throwam.com','discard.email','disposable.email','crap.ca',
  // ── Maildrop / Mailnull ──
  'maildrop.cc','mailnull.com','mailcatch.com','mailexpire.com','mailscrap.com',
  'mailmoat.com','mailshell.com','mailsiphon.com','mailin8r.com','mailtemp.info',
  'mailboxy.fun','mailzilla.com','mailzilla.org','mailtome.de','mailtoyou.top',
  // ── Fake Inbox ──
  'fakeinbox.com','fakemail.fr','fakedemail.com','filzmail.com',
  // ── Spam / generic temp ──
  'spambob.com','spambob.net','spambob.org','spamcorpse.com','spamday.com',
  'spamex.com','spamfree24.org','spamhole.com','spamify.com','spaminitor.de',
  'spamkill.info','spaml.com','spammhereplease.com','spammotel.com','spamslicer.com',
  'spamspot.com','spamstack.net','spamtroll.net','spamwc.de',
  // ── One-use / quick mail ──
  'quickinbox.com','getonemail.com','getnada.com','getairmail.com',
  'owlpic.com','pookmail.com','nowmail.me','nomail.pw',
  'meltmail.com','mohmal.com','mytrashmail.com','noclickemail.com',
  'nogmailspam.info','nospamfor.us','nospamthanks.info',
  // ── Harakiri / Self-destruct ──
  'harakirimail.com','selfdestructingmail.com','willselfdestruct.com',
  // ── German disposable providers ──
  'wegwerfadresse.de','wegwerfemail.de','wegwerfmail.de','wegwerfmail.info',
  'wegwerfmail.net','wegwerfmail.org','zehnminutenmail.de','sinnlos-mail.de',
  'scatmail.com','sandelf.de','secretemail.de','stuffmail.de','super-auswahl.de',
  'twinmail.de','trashbox.me','trash-amil.com',
  // ── Various other disposable ──
  'clrmail.com','fleckens.hu','imgv.de','inboxalias.com','internet-e-mail.de',
  'obobbo.com','odaymail.com','omail.pro','oneoffmail.com','onewaymail.com',
  'proxymail.eu','s0ny.net','slippery.email','slopsbox.com','snakemail.com',
  'sneakemail.com','snkmail.com','sogetthis.com','ssoia.com','toiea.com',
  'trmailbox.com','tyldd.com','uguuchantele.com','uroid.com','vomoto.com',
  'walala.org','walkmail.net','xagloo.com','xemaps.com','xoo.email',
  'yapped.net','zebins.com','zebins.eu','zetmail.com','zoemail.net','zoemail.org',
  'zomg.info','mt2014.com','mt2014.net','mt2015.com','mt2015.net',
  'tmail.com','tmail.io','tmail.ws','tmailinator.com',
  // ── .cf / .tk / .ml / .ga / .gq abuse TLDs often used for temp mail ──
  // (we check these by TLD below, not listed here)
  // ── More common spam traps ──
  'lol.ovh','lortemail.dk','lukemail.com','m4ilweb.info',
  'mierdamail.com','mohmal.com','noclickemail.com','now.im',
  'objectmail.com','ooo.oy.lc','rcpt.at','rklips.com',
  'smellfear.com','soioa.com','spitalar.com','tafmail.com',
  'topguse.com','tradermail.info','trbvm.com','trickymail.com',
  'tropicanemail.com','tyhe.com','ubam.com','uploadnolimit.com',
  'veryrealemail.com','vikingsonly.com','vubby.com','xsmail.com',
  'yuroks.com','zip.net','zippiex.com','zxcvbnm.com',
  'webemail.me','webm4il.info','webuser.in','wilemail.com',
  'willhackforfood.biz','wimsg.com','wmail.cf','wronghead.com',
  'wrongmail.org','wuzupmail.net','xents.com','xsmail.com',
  'xyzfree.net','z1p.biz','zik.dj',
  // ── Additional popular disposables ──
  'mailtemp.net','disposemail.com','spamthis.co.uk','emltmp.com',
  'anonmails.de','ctos.ch','discardmail.com','discardmail.de',
  'emailfake.com','fakemailz.com','fauxmail.com','fghmail.net',
  'throwablemail.com','tempail.com','emailtmp.com','einrot.com',
  'emz.net','explodemail.com','eyepaste.com','fastacura.com',
  'fastchevy.com','fastchrysler.com','fastkawasaki.com','fastmazda.com',
  'fastmitsubishi.com','fastnissan.com','fastsubaru.com','fastsuzuki.com',
  'fasttoyota.com','fastyamaha.com','fightallspam.com','fmailbox.com',
  'fmailbox.com','frapmail.com','friendlymail.net','frustrace.com',
  'goemailgo.com','great-host.in','greensloth.com','grn.cc',
  'gsrv.co.uk','gt.nl','gustr.com','hotpop.com',
  'ihateyoualot.info','ihazspam.ca','imails.info','inoutmail.eu',
  'insorg.org','ipoo.org','irish2me.com',
])

/** Trusted free email provider domains (always allowed) */
const TRUSTED_DOMAINS = new Set([
  'gmail.com','googlemail.com',
  'outlook.com','hotmail.com','hotmail.co.uk','hotmail.fr','hotmail.de',
  'live.com','live.co.uk','live.fr','msn.com','passport.com',
  'yahoo.com','yahoo.co.uk','yahoo.fr','yahoo.de','yahoo.es',
  'yahoo.com.au','yahoo.ca','yahoo.co.in','yahoo.co.jp',
  'icloud.com','me.com','mac.com',
  'proton.me','protonmail.com','pm.me',
  'aol.com','aim.com',
  'zoho.com','zohocorp.com',
  'fastmail.com','fastmail.fm',
  'tutanota.com','tuta.io',
  'hey.com',
  'mail.com','email.com',
])

/** Known abuse-heavy free TLDs that are also red flags */
const ABUSE_TLDS = new Set(['.cf','.tk','.ml','.ga','.gq'])

export function isDisposableEmail(email: string): boolean {
  const parts = email.toLowerCase().split('@')
  if (parts.length !== 2) return true

  const domain = parts[1].trim()
  if (!domain) return true

  // Trusted providers are always OK
  if (TRUSTED_DOMAINS.has(domain)) return false

  // Check known disposable list
  if (DISPOSABLE_DOMAINS.has(domain)) return true

  // Check abuse TLDs
  for (const tld of ABUSE_TLDS) {
    if (domain.endsWith(tld)) return true
  }

  // Heuristic: domains shorter than 4 chars are likely fake
  if (domain.replace(/\.[^.]+$/, '').length < 4) return true

  return false
}

export function getEmailProvider(email: string): 'gmail' | 'outlook' | 'yahoo' | 'icloud' | 'proton' | 'other' {
  const domain = email.toLowerCase().split('@')[1] || ''
  if (['gmail.com','googlemail.com'].includes(domain)) return 'gmail'
  if (['outlook.com','hotmail.com','hotmail.co.uk','hotmail.fr','hotmail.de','live.com','live.co.uk','live.fr','msn.com'].includes(domain)) return 'outlook'
  if (domain.startsWith('yahoo.')) return 'yahoo'
  if (['icloud.com','me.com','mac.com'].includes(domain)) return 'icloud'
  if (['proton.me','protonmail.com','pm.me'].includes(domain)) return 'proton'
  return 'other'
}
