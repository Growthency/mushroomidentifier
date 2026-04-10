// Disposable/temporary email domain blocklist
const BLOCKED_DOMAINS = new Set([
  // Mailinator family
  'mailinator.com', 'mailinator.net', 'mailinator.org',
  // Guerrilla Mail
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info',
  'guerrillamailblock.com', 'grr.la', 'spam4.me',
  // 10 Minute Mail
  '10minutemail.com', '10minutemail.net', '10minutemail.org',
  '10minutemail.de', '10minutemail.com.br', '10minutemail.co.uk',
  // Yopmail family
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf',
  'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr',
  'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
  // Temp-mail / Throwaway
  'temp-mail.org', 'temp-mail.ru', 'tempmail.com', 'tempmail.net',
  'tempmail.org', 'tempr.email', 'dispostable.com', 'throwam.com',
  'throwaway.email', 'trashmail.com', 'trashmail.at', 'trashmail.io',
  'trashmail.me', 'trashmail.net', 'trashmail.org', 'trash-mail.at',
  'fakeinbox.com', 'mailnull.com', 'mailnesia.com',
  // Sharklasers / Guerrilla aliases
  'sharklasers.com', 'guerrillamail.net', 'spam4.me',
  // SpamGourmet
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  // Other common temp services
  'maildrop.cc', 'discard.email', 'spamfree24.org', 'deadaddress.com',
  'filzmail.com', 'spamherelots.com', 'spamhereplease.com',
  'pookmail.com', 'spamgob.com', 'spamhole.com', 'spamify.com',
  'binkmail.com', 'bobmail.info', 'inoutmail.de', 'inoutmail.eu',
  'inoutmail.info', 'inoutmail.net', 'mailexpire.com', 'mailfreeonline.com',
  'mailme.lv', 'mailme24.com', 'mailmetrash.com', 'mailmoat.com',
  'mailnew.com', 'mailnull.com', 'mailpick.biz', 'mailproxsy.com',
  'mailrock.biz', 'mailseal.de', 'mailshell.com', 'mailsiphon.com',
  'mailslite.com', 'mailtemp.info', 'mailtome.de', 'mailtothis.com',
  'mailzilla.com', 'mbx.cc', 'mt2009.com', 'mt2014.com',
  'mytempemail.com', 'mytrashmail.com', 'netzidiot.de', 'nobulk.com',
  'noclickemail.com', 'nogmailspam.info', 'nomail.pw', 'nomail.xl.cx',
  'nomail2me.com', 'nospamfor.us', 'nospamthanks.info',
  'obobbo.com', 'onewaymail.com', 'owlpic.com', 'pecinan.com',
  'pecinan.net', 'pecinan.org', 'pepbot.com', 'pfui.ru',
  'pookmail.com', 'put2.net', 'rcpt.at', 'rklips.com',
  'rmqkr.net', 'ro.lt', 'rppkn.com', 'rtrtr.com',
  'safetypost.de', 'sandelf.de', 'sdt.qq.com', 'sendspamhere.com',
  'shortmail.net', 'shredmail.com', 'skeefmail.com', 'slapsfromlastnight.com',
  'slaskpost.se', 'slipry.net', 'smellfear.com', 'snkmail.com',
  'sofort-mail.de', 'sogetthis.com', 'sohai.ml', 'spamavert.com',
  'spambob.com', 'spambob.net', 'spambob.org', 'spamcannon.com',
  'spamcannon.net', 'spamcero.com', 'spamcon.org', 'spamcorptastic.com',
  'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org', 'spamday.com',
  'spamdecoy.net', 'spamex.com', 'spamfree.eu', 'spamgoes.in',
  'spamspot.com', 'spamstack.net', 'spamthisplease.com', 'spamtrail.com',
  'spamtroll.net', 'speed.1s.fr', 'streetwisemail.com', 'stuffmail.de',
  'super-auswahl.de', 'supergreatmail.com', 'supermailer.jp',
  'suremail.info', 'sweetxxx.de', 'tafmail.com', 'tagyourself.com',
  'tapchicuoihoi.com', 'teewars.org', 'teleworm.com', 'teleworm.us',
  'tempalias.com', 'tempe-mail.com', 'tempemail.biz', 'tempemail.com',
  'tempemail.net', 'tempemail.org', 'tempinbox.co.uk', 'tempinbox.com',
  'tempmail.de', 'tempmail.eu', 'tempmail.it', 'tempmailo.com',
  'tempomail.fr', 'temporaryemail.net', 'temporaryemail.us',
  'temporaryforwarding.com', 'temporaryinbox.com', 'temporarymailaddress.com',
  'tempthe.net', 'thanksnospam.info', 'thisisnotmyrealemail.com',
  'throwam.com', 'throwam.net', 'throwamail.com', 'throwamail.com',
  'tilien.com', 'tittbit.in', 'tmail.com', 'tmail.io', 'tmail.ws',
  'tmailinator.com', 'toiea.com', 'tokuriders.club', 'toomail.biz',
  'topranklist.de', 'tradermail.info', 'trash-amil.com', 'trash2009.com',
  'trash2010.com', 'trash2011.com', 'trashdevil.com', 'trashdevil.de',
  'trashemail.de', 'trashmail.at', 'trashmail.com', 'trashmail.de',
  'trashmail.io', 'trashmail.me', 'trashmail.net', 'trashmail.org',
  'trashmailer.com', 'trashtiod.com', 'trbvm.com', 'trillianpro.com',
  'tryalert.com', 'turual.com', 'twinmail.de', 'tyldd.com',
  'uggsrock.com', 'umail.net', 'upliftnow.com', 'uplipht.com',
  'uroid.com', 'utiket.us', 'valemail.net', 'venompen.com',
  'veryrealemail.com', 'viditag.com', 'viewcastmedia.com',
  'viewcastmedia.net', 'viewcastmedia.org', 'vomoto.com',
  'vubby.com', 'walkmail.net', 'walkmail.ru', 'wetrainbayarea.com',
  'wetrainbayarea.org', 'wh4f.org', 'whyspam.me', 'wickmail.net',
  'willselfdestruct.com', 'winemaven.info', 'wir-haben-nachwuchs.de',
  'wronghead.com', 'wuzupmail.net', 'www.e4ward.com', 'wwwnew.eu',
  'xagloo.co', 'xagloo.com', 'xemaps.com', 'xents.com', 'xmaily.com',
  'xoxy.net', 'xsmail.com', 'xww.ro', 'xyz.am', 'yep.it',
  'yogamaven.com', 'yomail.info', 'yourdomain.com', 'yuurok.com',
  'z1p.biz', 'za.com', 'zebins.com', 'zebins.eu', 'zehnminuten.de',
  'zehnminutenmail.de', 'zippymail.info', 'zoemail.com', 'zoemail.net',
  'zoemail.org', 'zomg.info',
])

// Allowed quality email providers (free + business domains pass through)
const ALLOWED_FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.co.jp', 'yahoo.com.au',
  'yahoo.com.br', 'yahoo.com.mx', 'yahoo.ca', 'yahoo.fr', 'yahoo.de',
  'yahoo.es', 'yahoo.it', 'yahoo.co.id', 'yahoo.com.ar', 'yahoo.com.sg',
  'yahoo.com.ph', 'yahoo.com.hk', 'ymail.com', 'rocketmail.com',
  'outlook.com', 'outlook.co.uk', 'outlook.in', 'outlook.de', 'outlook.fr',
  'outlook.es', 'outlook.it', 'outlook.jp', 'outlook.com.br',
  'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de', 'hotmail.es',
  'hotmail.it', 'hotmail.com.br', 'hotmail.com.mx', 'hotmail.com.ar',
  'live.com', 'live.co.uk', 'live.fr', 'live.de', 'live.it', 'live.com.br',
  'msn.com', 'passport.com',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'protonmail.ch', 'proton.me',
  'tutanota.com', 'tutanota.de', 'tutamail.com', 'tuta.io',
  'pm.me',
  'zoho.com', 'zohomail.com',
  'aol.com', 'aim.com',
  'mail.com', 'email.com', 'usa.com', 'myself.com', 'consultant.com',
  'contractor.net', 'dr.com', 'engineer.com', 'worker.com',
  'gmx.com', 'gmx.de', 'gmx.net', 'gmx.at', 'gmx.ch',
  'web.de', 'freenet.de',
  'yandex.com', 'yandex.ru', 'yandex.ua', 'ya.ru',
  'qq.com', '163.com', '126.com', 'sina.com',
  'rediffmail.com', 'indiatimes.com',
  'naver.com', 'daum.net', 'hanmail.net',
  'btinternet.com', 'virginmedia.com', 'sky.com', 'talktalk.net',
  'ntlworld.com', 'o2.co.uk', 'blueyonder.co.uk',
  'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net',
  'bellsouth.net', 'charter.net', 'cox.net', 'earthlink.net',
  'rogers.com', 'shaw.ca', 'telus.net', 'videotron.ca',
  'bigpond.com', 'bigpond.net.au', 'optusnet.com.au',
])

export function validateEmailQuality(email: string): { valid: boolean; reason?: string } {
  const lower = email.toLowerCase().trim()
  const atIdx = lower.lastIndexOf('@')
  if (atIdx === -1) return { valid: false, reason: 'Invalid email address.' }

  const domain = lower.slice(atIdx + 1)

  // Block known disposable/temp email domains
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: 'Temporary or disposable email addresses are not allowed. Please use a real email (Gmail, Outlook, Yahoo, or your work/business email).',
    }
  }

  return { valid: true }
}
