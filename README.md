# Who's That Pokémon? — Twitch chat game overlay

A browser-source overlay for OBS. A mod, VIP or the broadcaster types `!wtp`, a random
Pokémon silhouette appears, and chat has 30 seconds to guess. The answer is revealed, and the
winner (or "nobody guessed it") is announced on the overlay and in chat.

## Files

| File | What it is |
|---|---|
| `overlay.html` | The overlay. Add this to OBS as a browser source. |
| `index.html` | Setup page for hosting online. Friends log in with Twitch and get their own overlay link. |
| `config.js` | Your settings: channel, bot login, commands, timer and chat messages. |
| `pokemon-data.js` | Names of all 1025 Pokémon (Gen 1–9). You don't need to edit it. |
| `sounds/` | Sound effects for round start, a correct guess, and nobody guessing. |

The artwork is loaded from the PokeAPI sprite repository on GitHub, so the PC running OBS needs internet access.

## Hosting it online for friends

Once the files are hosted, anyone can open the site and click **Connect with Twitch**. They choose their settings
and copy their own overlay link into OBS. Each link carries that streamer's channel, settings and chat login in the
part after `#`, which browsers never send to the web server. Nothing is stored on the server, and each
streamer's game runs separately.

The site is plain files with no server code, so any free static host works. These steps use GitHub Pages.

1. **Clear your token from `config.js` first.** Set `oauthToken: ""` and `botUsername: ""`.
   Anything in `config.js` is public once it's uploaded.
2. **Put the files on GitHub Pages.**
   - Create a free account at https://github.com, then create a new **public** repository (e.g. `whos-that-pokemon`).
   - Click **uploading an existing file** and drag in `index.html`, `overlay.html`, `config.js` and `pokemon-data.js`. Commit.
   - Go to **Settings → Pages**, set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**, then click Save.
   - After a minute the site is live at `https://YOURNAME.github.io/whos-that-pokemon/`.
3. **Register a Twitch app** so the "Connect with Twitch" button works.
   - Go to https://dev.twitch.tv/console/apps and click **Register Your Application**. Twitch requires
     two-factor authentication on your account for this.
   - Name: anything unique (e.g. `WhosThatPokemon-YOURNAME`).
   - OAuth Redirect URL: your site address exactly, with the trailing slash, e.g.
     `https://YOURNAME.github.io/whos-that-pokemon/`.
     The setup page shows the exact URL to use under "Site owner setup" until a Client ID is set.
   - Category: **Chat Bot**. Client type: **Public**.
   - Copy the **Client ID** into `twitchClientId` in `config.js` and upload `config.js` again.
     A Client ID is not secret. Don't create or upload a Client Secret, because the site doesn't use one.
4. Send your friends the site link. The setup page has OBS instructions and a **Test it** button.

**Things to tell your friends:**
- Their overlay link contains their chat login. They shouldn't show it on stream. If it leaks, they can
  remove your app under Twitch **Settings → Connections**, which disables the link immediately.
- The Twitch login expires after a while. The setup page shows roughly how long it lasts. When it expires,
  the game keeps working on screen without posting in chat, and a small red "Chat login expired" note
  appears on the overlay. They then open the site, connect again and paste the new link into OBS.
- **Changing settings changes the link.** All settings live inside the overlay link. After changing anything on
  the setup page, or reconnecting Twitch, they must copy the new link and paste it over the old URL in the OBS browser
  source properties. Otherwise OBS keeps using the old settings. The setup page warns them if they change a setting
  after copying.
- **Using a bot account** (so messages come from e.g. *TheirNameBot* instead of them):
  1. Create the bot account on Twitch and verify its email.
  2. In their own chat, type `/mod botname` so chat restrictions don't block it.
  3. Open the setup page in a private/incognito window so Twitch doesn't log them in as themselves.
  4. Click **Connect with Twitch** and log in as the bot.
  5. Change **Your channel** to their own channel name (it fills in the bot's name), then copy the link.

  The setup page has these steps under "Use a bot account instead of your own". If Connect doesn't work for them,
  they can get a token from https://twitchtokengenerator.com instead ("Bot Chat Token", logged in as the bot) and paste it
  under "Paste a chat token instead".

## Setup on your own PC (without hosting)

1. **Edit `config.js`**
   - `channel`: your Twitch channel name.
   - `botUsername` + `oauthToken`: the account that posts the announcements in chat. It can be
     your own account or a separate bot account. If it's a separate account, run `/mod botname`
     in your chat so slow mode and follower-only mode don't block it.
   - To get a token, use a chat token generator such as https://twitchtokengenerator.com
     (choose **Bot Chat Token**, log in as the bot account, and copy the *Access Token*).
     It needs the `chat:read` and `chat:edit` scopes. Paste it as `"oauth:yourtoken"`.
   - **Never show `config.js` on stream.** Anyone with the token can post as that account.
   - If you leave the token empty, the game still works on the overlay but nothing is posted in chat.

2. **Add it to OBS**
   - Sources → **+** → **Browser** → tick **Local file** → pick `overlay.html`.
   - Width **800**, height **600**. Any size works; the overlay scales to fit.
   - **Untick** "Shutdown source when not visible", or the game stops listening to chat
     when you switch scenes.
   - To show it in several scenes, use **Paste (Reference)**, not Paste (Duplicate).
     Two copies would each run their own game and post every message twice.

3. When you change `config.js`, click **Refresh** in the browser source properties.

The overlay is invisible until a round starts.

## Chat commands

Only the broadcaster, mods and VIPs can use these (change `allowedRoles` / `allowedUsers` in `config.js`).

| Command | What it does |
|---|---|
| `!wtp` | Start a round with the default generations |
| `!wtp 1` | Start a round with Gen 1 only |
| `!wtp 1-3` | Gen 1 to 3 |
| `!wtp 1,4,9` | Gens 1, 4 and 9 |
| `!wtp kanto johto` | Region names work too (kanto, johto, hoenn, sinnoh, unova, kalos, alola, galar, paldea) |
| `!wtp all` | All generations |
| `!wtpgen 1-2` | Change the default generations used by plain `!wtp` (remembered between streams) |
| `!wtpstop` | Cancel the current round and show the answer |

**Guessing:** anyone in chat types the Pokémon's name. Capitals, spaces, punctuation and accents
don't matter: `mr mime`, `Mr. Mime` and `MRMIME` all count, and `flabebe` matches Flabébé. For Nidoran, `nidoran`, `nidoranf` and
`nidoran female` all work. The message has to be just the name (or `!guess name`).
The first correct guess wins.

## Settings worth knowing (in `config.js`)

- `roundSeconds`: guessing time (default 30).
- `endOnCorrectGuess`: `true` reveals as soon as someone gets it. `false` always runs the full timer
  (the first correct guesser still wins).
- `lenientSpelling`: `true` accepts small typos. Names of 5–6 letters allow one mistake (`evee`, `gengr`),
  and names of 7+ letters allow two (`pikachoo`, `charzard`). A swapped pair of letters counts as one mistake (`bulbasuar`). Names of 4 letters or fewer, like Mew or Muk, still need exact spelling,
  so everyday words like "new" don't win by accident. A guess that is exactly another Pokémon's name never
  counts (e.g. `porygon2` when the answer is Porygon-Z). Hosted users set this with a tickbox on the setup page.
- `hintAtSecondsLeft`: with this many seconds left, shows the first letter and blanks (e.g. `P _ _ _ _ _ _`).
  Set to `0` for no hints.
- `defaultGenerations`: e.g. `[1]`, `[1, 2, 3]` or `"all"`.
- `chatDelaySeconds`: how long to wait after the overlay reveals the answer before posting the winner or answer
  in chat (default 5). Your stream reaches viewers a few seconds late, so without this, chat would see the answer
  before the reveal shows on stream. Match it roughly to your stream delay, or set `0` to post straight away.
- `cooldownSeconds`: minimum gap between rounds.
- `soundVolume` / `sounds`: sound effects from the `sounds` folder. One plays when a round starts, and one when the answer
  is revealed (a different set for a winner and for nobody). When an event has more than one file, one is picked at
  random. Set `playAllSounds: true` to play them all in order instead. `soundVolume: 0` turns sound off.
  In OBS, tick **Control audio via OBS** on the browser source so the sounds appear in the audio mixer.
- `messages`: everything the bot says in chat. Set any message to `""` to turn it off.

You can also set the channel or the default generations in the browser source URL. Untick
"Local file" and use a URL like
`file:///D:/path/to/overlay.html?channel=yourchannel&gens=1-3`.

## Testing without going live

Open `overlay.html?debug` in a browser, or add `?debug` to the browser source URL in OBS.
A panel appears where you can type fake chat messages as a broadcaster, mod, VIP or viewer.
The **answer** button fills in the current Pokémon's name. In debug mode the bot's
messages are shown in the panel instead of being sent to Twitch, and the top line shows whether
the Twitch login worked.

## Troubleshooting

- **Nothing happens on `!wtp`**: check that `channel` is right and that the person typing is a mod,
  VIP or the broadcaster. Open the overlay with `?debug` and check the status line.
- **"Twitch login failed"**: the token is wrong or has expired. Generate a new one. Make sure
  `botUsername` is the account the token was made for.
- **The bot's messages don't show up in chat**: make the bot account a mod, or check whether the
  channel has chat restrictions (followers-only, verified phone, etc.).
