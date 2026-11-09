// ============================================================
//  Who's That Pokémon? — Twitch overlay settings
//  Edit the values below, save, then refresh the browser source in OBS.
// ============================================================
window.WTP_CONFIG = {
  // ---- Hosting online for friends (see README) ----
  // Client ID of your Twitch application. Used by the setup page (index.html) for the
  // "Connect with Twitch" button. A Client ID is not secret, so it's safe to upload.
  // When hosting online, leave oauthToken below EMPTY. Each streamer gets their own token from the setup page.
  twitchClientId: "xi5hg40edrfiipefciww2fzy71okzt",

  // ---- Running locally on your own PC ----
  // Your Twitch channel name (lowercase, no #)
  channel: "yourchannel",

  // The account that posts in chat (your own account or a bot account).
  // Leave oauthToken empty to run in read-only mode: the overlay still works,
  // but nothing gets announced in chat.
  botUsername: "",
  oauthToken: "", // looks like "oauth:abc123..." — KEEP THIS SECRET, never show it on stream

  // Who may start/stop rounds: any of "broadcaster", "moderator", "vip"
  allowedRoles: ["broadcaster", "moderator", "vip"],
  // Extra usernames allowed to start rounds (lowercase), e.g. ["somefriend"]
  allowedUsers: [],

  // Chat commands
  commands: {
    start: "!wtp",      // !wtp            -> uses default generations
                        // !wtp 1-3        -> Gen 1 to 3 for this round
                        // !wtp 1,4 kanto  -> mix numbers, ranges and region names
                        // !wtp all        -> every generation
    stop: "!wtpstop",   // cancel the current round
    setGens: "!wtpgen", // !wtpgen 1-2     -> change the default generations
  },

  // Generations used when no generation is given: e.g. [1], [1, 2, 3] or "all"
  defaultGenerations: "all",

  roundSeconds: 30,         // time chat has to guess
  revealSeconds: 8,         // how long the answer stays on screen
  chatDelaySeconds: 5,      // wait this long after the reveal before posting the answer/winner in chat (covers stream delay)
  endOnCorrectGuess: true,  // true = reveal as soon as someone gets it; false = always run the full timer
  lenientSpelling: false,   // true = accept small typos ("pikachoo", "charzard"); short names like Mew still need exact spelling
  hintAtSecondsLeft: 10,    // show first letter + blanks with this many seconds left (0 = no hint)
  cooldownSeconds: 0,       // wait time after a round before a new one can start
  noRepeats: true,          // true = every Pokémon in the chosen generations comes up once before any repeats (remembered between OBS restarts); false = pure random

  // Sound effects (files in the "sounds" folder). Each event picks one file at random from its list.
  soundVolume: 80,          // 0-100, 0 = no sound
  playAllSounds: false,     // true = play every file in the list one after another instead of picking one
  sounds: {
    start: ["sounds/whos-that-pokemon.mp3"],
    win: ["sounds/capture.mp3", "sounds/item-get.mp3"],
    nobody: ["sounds/run-away.mp3", "sounds/walk-into.mp3"],
  },

  // Chat messages. Placeholders: {user} {pokemon} {seconds} {gens} {time} {hint} {others} {count}
  // Set a message to "" to not send it.
  messages: {
    start: "Who's That Pokémon?! Type your guess in chat — you have {seconds} seconds! ({gens})",
    hint: "Hint: {hint}",
    win: "{user} got it in {time}s! It's {pokemon}!",
    // Used instead of "win" when endOnCorrectGuess is false and more than one person got it. Also has {others} and {count}.
    winMany: "It's {pokemon}! {user} got it first in {time}s. Also got it: {others}",
    nobody: "Time's up! Nobody guessed it — it was {pokemon}!",
    cancel: "Round cancelled — it was {pokemon}.",
    gensSet: "Who's That Pokémon will now use {gens}.",
    badGens: "@{user} I didn't understand that. Try !wtp 1-3, !wtp 1,4, !wtp kanto or !wtp all",
  },
};
