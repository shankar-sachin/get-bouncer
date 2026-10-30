/*
 * The Bouncer account portal (account.html): sign in with a passkey, GitHub, Google or an emailed code; add and
 * remove passkeys; see and sign out devices; see sync and start it over; delete the account.
 *
 * Opened by the desktop app as `account?app=<loopback>&state=<random>`, it signs in with a passkey only and posts
 * the session to the app's loopback on this computer, then forgets it. Synced data is end-to-end encrypted, so
 * this page can count it but never read it.
 *
 * Supabase passkeys are experimental (supabase-js 2.105+), so the client opts in below.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/+esm'

const PROJECT = {
  url: 'https://cgpmoksrzomhiisggfhp.supabase.co',
  key: 'sb_publishable_80YQD221bv1isfJR2JoVrw_r6epXms-',
}

/* The app's sign-in ports (packages/core/src/account/loopback.ts). Nothing else gets a session from here. */
const APP_CALLBACK = /^http:\/\/127\.0\.0\.1:4781[5-7]\/auth\/callback$/
const STATE = /^[A-Za-z0-9_-]{43}$/

const params = new URLSearchParams(location.search)
const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

/* Only a copy of this page on this computer may point at another project (tests and local development). */
function project() {
  if (local && params.get('supabase')) {
    try {
      sessionStorage.setItem('portal-project', JSON.stringify({ url: params.get('supabase'), key: params.get('key') }))
    } catch (e) {
      /* storage blocked: the override lasts for this load */
    }
    return { url: params.get('supabase'), key: params.get('key') || 'local' }
  }
  if (local) {
    try {
      const saved = JSON.parse(sessionStorage.getItem('portal-project') || 'null')
      if (saved && saved.url) return saved
    } catch (e) {
      /* fall through */
    }
  }
  return PROJECT
}

const { url, key } = project()
const root = document.getElementById('portal')
const title = document.getElementById('portal-title')
const lede = document.getElementById('portal-lede')

/* ---------- small DOM helpers (text only, never HTML) ---------- */

function h(tag, props, ...children) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue
    if (k === 'class') el.className = v
    else if (k === 'text') el.textContent = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else el.setAttribute(k, v === true ? '' : v)
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c)
  return el
}

const icon = (path) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '16')
  svg.setAttribute('height', '16')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.8')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')
  for (const d of [].concat(path)) {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    p.setAttribute('d', d)
    svg.append(p)
  }
  return svg
}

const icons = {
  passkey: [
    'M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4',
    'M14 13.12c0 2.38 0 6.38-1 8.88',
    'M17.29 21.02c.12-.6.43-2.3.5-3.02',
    'M2 12a10 10 0 0 1 18-6',
    'M2 16h.01',
    'M21.8 16c.2-2 .131-5.354 0-6',
    'M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2',
    'M8.65 22c.21-.66.45-1.32.57-2',
    'M9 6.8a6 6 0 0 1 9 5.2v2',
  ],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 6-10 7L2 6'],
  check: 'M20 6 9 17l-5-5',
  github:
    'M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  google: ['M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.3c1.9-1.8 3-4.4 3-7.5z', 'M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6A10 10 0 0 0 12 22z', 'M6.4 14a6 6 0 0 1 0-3.9V7.5H3a10 10 0 0 0 0 9z', 'M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3 7.5l3.4 2.6C7.2 7.7 9.4 5.9 12 5.9z'],
}

function button(label, onclick, { kind = '', iconPath, testid, disabled, type = 'button' } = {}) {
  return h(
    'button',
    { type, class: `btn ${kind}`.trim(), onclick, 'data-testid': testid, disabled },
    iconPath ? icon(iconPath) : null,
    label,
  )
}

function card(heading, ...children) {
  return h('section', { class: 'card', 'aria-label': heading }, h('h2', { text: heading }), ...children)
}

function errorNote(message) {
  return h('p', { class: 'portal-error', role: 'alert', 'data-testid': 'portal-error', text: message })
}

function messageOf(error) {
  if (!error) return 'Something went wrong. Try again.'
  if (error.name === 'NotAllowedError' || /not allowed|cancel/i.test(error.message || '')) {
    return 'The passkey prompt was closed. Try again when you’re ready.'
  }
  if (error.code === 'passkey_disabled') return 'Passkeys aren’t turned on for Bouncer accounts yet.'
  if (error.code === 'webauthn_credential_not_found') {
    return 'That passkey isn’t on a Bouncer account. Sign in another way and add it first.'
  }
  if (error.code === 'webauthn_credential_exists') return 'This passkey is already on your account.'
  return error.message || String(error)
}

const relative = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
function ago(iso) {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return '—'
  const s = (t - Date.now()) / 1000
  const steps = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [30, 'day'],
    [12, 'month'],
    [Infinity, 'year'],
  ]
  let v = s
  for (const [n, unit] of steps) {
    if (Math.abs(v) < n) return relative.format(Math.round(v), unit)
    v /= n
  }
  return '—'
}

const dateOnly = (iso) => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
const platformName = { darwin: 'macOS', win32: 'Windows', linux: 'Linux' }
const providerName = { github: 'GitHub', google: 'Google', email: 'email' }

function show(...nodes) {
  root.replaceChildren(...nodes)
}

/* ---------- the app hand-off: passkey only, the session goes to the app ---------- */

function handoff(app, state) {
  title.textContent = 'Sign in to the Bouncer app'
  lede.textContent = 'Use your passkey to sign in to Bouncer on this computer.'
  // Its own client: the session is handed to the app and never kept in this browser.
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, experimental: { passkey: true } },
  })
  const status = h('div')
  const go = button('Use a passkey', run, { kind: 'btn-primary', iconPath: icons.passkey, testid: 'handoff-passkey' })

  async function run() {
    go.disabled = true
    status.replaceChildren(h('p', { class: 'portal-muted', role: 'status', text: 'Waiting for your passkey…' }))
    try {
      const { data, error } = await client.auth.signInWithPasskey()
      if (error || !data || !data.session) throw error || new Error('No session came back.')
      status.replaceChildren(h('p', { class: 'portal-muted', role: 'status', text: 'Signed in. Going back to Bouncer…' }))
      const form = h(
        'form',
        { method: 'POST', action: app, hidden: true },
        h('input', { type: 'hidden', name: 'refresh_token', value: data.session.refresh_token }),
        h('input', { type: 'hidden', name: 'state', value: state }),
      )
      document.body.append(form)
      form.submit()
    } catch (error) {
      go.disabled = false
      status.replaceChildren(errorNote(messageOf(error)))
    }
  }

  show(
    h(
      'div',
      { class: 'card handoff' },
      h('p', { class: 'portal-text', text: 'Your browser or password manager asks for the passkey. Bouncer gets a sign-in for this computer only.' }),
      h('div', { class: 'portal-actions' }, go),
      status,
      h(
        'p',
        { class: 'portal-muted' },
        'No passkey yet? ',
        h('a', { href: location.pathname, text: 'Sign in here another way' }),
        ', add one, then try again from Bouncer.',
      ),
    ),
  )
}

/* ---------- the portal ---------- */

const supabase = createClient(url, key, {
  auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, experimental: { passkey: true } },
})

function signedOut(error) {
  title.textContent = 'Your Bouncer account'
  lede.textContent = 'Passkeys, signed-in devices, sync, and deleting your account. Bouncer works fully without an account.'
  const status = h('div')
  const fail = (e) => status.replaceChildren(errorNote(messageOf(e)))
  const oauth = (provider) => async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: location.origin + location.pathname },
    })
    if (error) fail(error)
  }
  const passkey = async () => {
    status.replaceChildren(h('p', { class: 'portal-muted', role: 'status', text: 'Waiting for your passkey…' }))
    const { error } = await supabase.auth.signInWithPasskey()
    if (error) fail(error)
    else render()
  }
  show(
    card(
      'Sign in',
      h('p', { class: 'portal-text', text: 'Use the same account as in the Bouncer app.' }),
      error ? errorNote(error) : null,
      status,
      h(
        'div',
        { class: 'sign-in-choices' },
        button('Continue with a passkey', passkey, { iconPath: icons.passkey, testid: 'portal-sign-in-passkey' }),
        button('Continue with GitHub', oauth('github'), { iconPath: icons.github, testid: 'portal-sign-in-github' }),
        button('Continue with Google', oauth('google'), { iconPath: icons.google, testid: 'portal-sign-in-google' }),
        button('Continue with email', () => emailStep(), { iconPath: icons.mail, testid: 'portal-sign-in-email' }),
      ),
    ),
  )
}

function emailStep() {
  const status = h('div')
  const email = h('input', { id: 'portal-email', type: 'email', autocomplete: 'email', required: true, maxlength: '320', 'data-testid': 'portal-email' })
  const code = h('input', { id: 'portal-code', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '10', 'data-testid': 'portal-code' })
  const codeForm = h(
    'form',
    {
      hidden: true,
      onsubmit: async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.verifyOtp({ email: email.value.trim(), token: code.value.trim(), type: 'email' })
        if (error) status.replaceChildren(errorNote(messageOf(error)))
        else render()
      },
    },
    h('label', { for: 'portal-code', text: 'code from the email' }),
    code,
    h('div', { class: 'portal-actions' }, button('Sign in', null, { kind: 'btn-primary', type: 'submit', testid: 'portal-verify' })),
  )
  const emailForm = h(
    'form',
    {
      onsubmit: async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithOtp({ email: email.value.trim(), options: { shouldCreateUser: false } })
        if (error) return status.replaceChildren(errorNote(messageOf(error)))
        status.replaceChildren(h('p', { class: 'portal-note', role: 'status', text: `We sent a code to ${email.value.trim()}.` }))
        codeForm.hidden = false
        code.focus()
      },
    },
    h('label', { for: 'portal-email', text: 'email' }),
    email,
    h('div', { class: 'portal-actions' }, button('Send code', null, { type: 'submit', testid: 'portal-send' }), button('Back', () => signedOut(), { kind: 'btn-quiet' })),
  )
  show(card('Sign in with email', status, emailForm, codeForm))
  email.focus()
}

function initials(name, email) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return ((email || '?')[0] || '?').toUpperCase()
}

function profile(user) {
  const meta = user.user_metadata || {}
  const name = meta.bouncer_name || meta.full_name || meta.name || meta.user_name || user.email
  const photo = typeof meta.bouncer_avatar === 'string' ? meta.bouncer_avatar : meta.avatar_url || meta.picture
  const provider = providerName[(user.app_metadata || {}).provider] || 'email'
  const avatar = h('span', { class: 'avatar', 'aria-hidden': 'true' })
  if (photo && /^https:\/\//.test(photo)) {
    const img = h('img', { src: photo, alt: '' })
    img.onerror = () => avatar.replaceChildren(initials(name, user.email))
    avatar.append(img)
  } else avatar.append(initials(name, user.email))
  return card(
    'Profile',
    h(
      'div',
      { class: 'profile' },
      avatar,
      h(
        'div',
        { class: 'row-main' },
        h('span', { class: 'profile-name', 'data-testid': 'portal-name', text: name || 'Bouncer user' }),
        h('span', { class: 'row-sub', text: `${user.email || 'no email'} · signed in with ${provider}` }),
      ),
    ),
    h('p', { class: 'portal-muted', text: 'Change your name and photo in the app: Settings › Account.' }),
    h('div', { class: 'portal-actions' }, button('Sign out of this page', async () => { await supabase.auth.signOut({ scope: 'local' }); render() }, { kind: 'btn-quiet btn-small', testid: 'portal-sign-out' })),
  )
}

function passkeys() {
  const body = h('div', { class: 'card-body' }, h('p', { class: 'portal-muted', text: 'Loading…' }))
  const section = card(
    'Passkeys',
    h('p', { class: 'portal-text', text: 'Sign in with Touch ID, Windows Hello, your phone or a security key instead of GitHub, Google or email. In the app, choose Continue with a passkey.' }),
    body,
  )
  async function load(note) {
    const { data, error } = await supabase.auth.passkey.list()
    const add = button('Add a passkey', async () => {
      add.disabled = true
      const res = await supabase.auth.registerPasskey()
      if (res.error) load(errorNote(messageOf(res.error)))
      else load(h('p', { class: 'portal-note', role: 'status', text: 'Passkey added.' }))
    }, { kind: 'btn-primary', iconPath: icons.passkey, testid: 'portal-add-passkey' })
    if (error) return body.replaceChildren(errorNote(messageOf(error)), h('div', { class: 'portal-actions' }, add))
    const list = data || []
    body.replaceChildren(
      note || '',
      list.length
        ? h(
            'ul',
            { class: 'rows', 'data-testid': 'portal-passkeys' },
            list.map((p) =>
              h(
                'li',
                { 'data-testid': 'portal-passkey' },
                icon(icons.passkey),
                h(
                  'div',
                  { class: 'row-main' },
                  h('span', { class: 'row-title', text: p.friendly_name || 'Passkey' }),
                  h('span', { class: 'row-sub', text: `added ${dateOnly(p.created_at)}${p.last_used_at ? ` · used ${ago(p.last_used_at)}` : ''}` }),
                ),
                button('Remove', async () => {
                  const res = await supabase.auth.passkey.delete({ passkeyId: p.id })
                  load(res.error ? errorNote(messageOf(res.error)) : null)
                }, { kind: 'btn-quiet btn-small', testid: 'portal-remove-passkey' }),
              ),
            ),
          )
        : h('p', { class: 'portal-muted', text: 'No passkeys yet.' }),
      h('div', { class: 'portal-actions' }, add),
    )
  }
  if (!window.PublicKeyCredential) {
    body.replaceChildren(h('p', { class: 'portal-muted', text: 'This browser can’t use passkeys. Try Safari, Chrome, Edge or Firefox.' }))
  } else load()
  return section
}

function devices(user) {
  const body = h('div', { class: 'card-body' }, h('p', { class: 'portal-muted', text: 'Loading…' }))
  const section = card('Devices', h('p', { class: 'portal-text', text: 'Computers signed in to your account. Signing one out ends its session there.' }), body)
  async function load(note) {
    const { data, error } = await supabase
      .from('devices')
      .select('id,name,platform,app_version,last_seen_at')
      .order('last_seen_at', { ascending: false })
    if (error) return body.replaceChildren(errorNote(messageOf(error)))
    const everywhere = button('Sign out everywhere', async () => {
      await supabase.rpc('forget_all_devices')
      await supabase.auth.signOut({ scope: 'global' })
      render()
    }, { kind: 'btn-small', testid: 'portal-sign-out-everywhere' })
    body.replaceChildren(
      note || '',
      data.length
        ? h(
            'ul',
            { class: 'rows', 'data-testid': 'portal-devices' },
            data.map((d) =>
              h(
                'li',
                { 'data-testid': 'portal-device' },
                h(
                  'div',
                  { class: 'row-main' },
                  h('span', { class: 'row-title', text: d.name }),
                  h('span', { class: 'row-sub', text: `${platformName[d.platform] || d.platform} · Bouncer ${d.app_version} · seen ${ago(d.last_seen_at)}` }),
                ),
                button('Sign out', async () => {
                  const res = await supabase.rpc('forget_device', { p_id: d.id })
                  load(res.error ? errorNote(messageOf(res.error)) : null)
                }, { kind: 'btn-quiet btn-small', testid: 'portal-device-sign-out' }),
              ),
            ),
          )
        : h('p', { class: 'portal-muted', text: 'No devices are signed in.' }),
      h('div', { class: 'portal-actions' }, everywhere),
    )
  }
  load()
  return section
}

function sync() {
  const body = h('div', { class: 'card-body' }, h('p', { class: 'portal-muted', text: 'Loading…' }))
  const section = card(
    'Sync',
    h('p', { class: 'portal-text', text: 'Settings, presets and the chats you choose, end-to-end encrypted. Only your computers and your recovery code can read them, so this page shows counts, not contents.' }),
    body,
  )
  async function load(note) {
    const key = await supabase.from('sync_keys').select('created_at').maybeSingle()
    if (key.error) return body.replaceChildren(errorNote(messageOf(key.error)))
    if (!key.data) {
      return body.replaceChildren(note || '', h('p', { class: 'portal-muted', 'data-testid': 'portal-sync-off', text: 'Sync is off. Turn it on in the app: Settings › Account › sync.' }))
    }
    const records = await supabase.from('sync_records').select('kind', { count: 'exact', head: true }).not('ciphertext', 'is', null)
    const latest = await supabase.from('sync_records').select('updated_at').order('updated_at', { ascending: false }).limit(1)
    const count = records.count || 0
    const last = latest.data && latest.data[0] ? ` · last change ${ago(latest.data[0].updated_at)}` : ''
    const confirm = h(
      'div',
      { class: 'confirm', role: 'alertdialog', 'aria-label': 'Start sync over?', hidden: true },
      h('p', { text: 'This deletes every synced item from the server and the key. Each computer keeps its own copy, and you turn sync on again from one of them.' }),
      h(
        'div',
        { class: 'portal-actions' },
        button('Start over', async () => {
          const res = await supabase.rpc('reset_sync')
          load(res.error ? errorNote(messageOf(res.error)) : h('p', { class: 'portal-note', role: 'status', text: 'Sync was started over.' }))
        }, { kind: 'btn-danger btn-small', testid: 'portal-reset-confirm' }),
        button('Cancel', () => (confirm.hidden = true), { kind: 'btn-quiet btn-small' }),
      ),
    )
    body.replaceChildren(
      note || '',
      h('p', { class: 'portal-text', 'data-testid': 'portal-sync-on', text: `On since ${dateOnly(key.data.created_at)} · ${count} ${count === 1 ? 'item' : 'items'}${last}` }),
      h('div', { class: 'portal-actions' }, button('Start sync over…', () => (confirm.hidden = false), { kind: 'btn-small', testid: 'portal-reset' })),
      confirm,
    )
  }
  load()
  return section
}

function deleteAccount(user) {
  const typed = h('input', { id: 'portal-delete-word', autocomplete: 'off', 'data-testid': 'portal-delete-word' })
  const status = h('div')
  const go = button('Delete my account', async () => {
    go.disabled = true
    await supabase.storage.from('avatars').remove([`${user.id}/avatar`]).catch(() => undefined)
    const { error } = await supabase.rpc('delete_account')
    if (error) {
      go.disabled = false
      return status.replaceChildren(errorNote(messageOf(error)))
    }
    await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined)
    title.textContent = 'Account deleted'
    lede.textContent = 'Your account, its devices and its synced data are gone. Bouncer keeps working on your computers, signed out.'
    show()
  }, { kind: 'btn-danger', testid: 'portal-delete', disabled: true })
  typed.addEventListener('input', () => (go.disabled = typed.value.trim().toLowerCase() !== 'delete'))
  const section = card(
    'Delete account',
    h('p', { class: 'portal-text', text: 'Deletes your account, its passkeys, its devices and everything synced. Chats, models and settings on your computers stay. This can’t be undone.' }),
    h('form', { onsubmit: (e) => e.preventDefault() }, h('label', { for: 'portal-delete-word', text: 'type delete to confirm' }), typed),
    status,
    h('div', { class: 'portal-actions' }, go),
  )
  section.classList.add('danger-zone')
  return section
}

async function render() {
  const { data } = await supabase.auth.getUser()
  const user = data && data.user
  if (!user) return signedOut(new URLSearchParams(location.hash.slice(1)).get('error_description'))
  title.textContent = 'Your Bouncer account'
  lede.textContent = 'Passkeys, signed-in devices, sync, and deleting your account.'
  show(profile(user), passkeys(), devices(user), sync(), deleteAccount(user))
}

/* ---------- boot ---------- */

const app = params.get('app')
const state = params.get('state')
if (app || state) {
  if (APP_CALLBACK.test(app || '') && STATE.test(state || '')) handoff(app, state)
  else {
    title.textContent = 'This sign-in link isn’t from Bouncer'
    lede.textContent = 'Start signing in from the Bouncer app on your computer.'
    show()
  }
} else {
  render().catch((e) => signedOut(messageOf(e)))
}
