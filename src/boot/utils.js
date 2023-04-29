const IsAdministrator = true
const Client = 'BGB'

let URLMatch = 'https://script.google.com/macros/s/AKfycbykN8AZJ5V6fwH_BZ67riLGf8znBsxfLXzPWMOtr9Rwdor42jNcF7m1UM4XMvVoiF1rbQ/exec'
let URLParticipant = 'https://script.google.com/macros/s/AKfycbydoX9quJr-aOj7_v3gnt6Ku__u29EnmKIaT6rgyZ3Ow4qzZ9eyu-sMsijteqvZAQox4Q/exec'
let URLParticipantArchive = 'https://script.google.com/macros/s/AKfycbztkmFB9AKk5FaCH9fquMqFXx76pBp9b7ocNMHIcPAMcKcwH4hgOROHsK-1ApfL3APUuQ/exec'
let URLWhereIsMyCard = 'https://script.google.com/macros/s/AKfycbwi7JYV_w0u7KoYw-CUio5HWGrLPvIxRqHybNn4DdgQfOLeGfm3Ufb3IlunmgQq-zFV/exec'
let URLMember = 'https://script.google.com/macros/s/AKfycbxm8IYvc_BGeqsOMVqRtvis8GaKYxfZK_8CK4bLblF9TYVtk8C3P_-qKEpwfT6bZJk/exec'
const URLOrder = 'https://script.google.com/macros/s/AKfycbz0cWknDb0ACTYRUCqUE9cIOkU2GV460W8Mhz6VyDKELQc9cLbjnwGrP3wRwlRHJnYBEA/exec?sh=BGB'

URLMatch += '?sh=' + Client
URLParticipant += '?sh=' + Client
URLParticipantArchive += '?sh=' + Client
URLWhereIsMyCard += '?sh=' + Client
URLMember += '?sh=' + Client

const getAvatar = function (_avatar) {
  return 'statics/avatars/' + Client + '/' + _avatar + '.png'
}

const getImageHomeTeam = function (_matchName) {
  if (_matchName.toLowerCase().indexOf('fest') >= 0 ||
      _matchName.toLowerCase().indexOf('party') >= 0 ||
      _matchName.toLowerCase().indexOf('anlass') >= 0 ||
      _matchName.toLowerCase().indexOf('geburtstag') >= 0 ||
      _matchName.toLowerCase().indexOf('event') >= 0) return 'statics/teams/Event.png'
  if (_matchName.toLowerCase().indexOf('test') >= 0) return 'statics/teams/Test.png'
  return 'statics/teams/Freiburg.png'
}

const getImageAwayTeam = function (_matchName) {
  if (_matchName.toLowerCase().indexOf('arminia') >= 0) return 'statics/teams/Arminia.png'
  if (_matchName.toLowerCase().indexOf('augsburg') >= 0) return 'statics/teams/Augsburg.png'
  if (_matchName.toLowerCase().indexOf('leverkusen') >= 0) return 'statics/teams/Bayer_Leverkusen.png'
  if (_matchName.toLowerCase().indexOf('bayern') >= 0 || _matchName.toLowerCase().indexOf('münchen') >= 0) return 'statics/teams/Bayern_München.png'
  if (_matchName.toLowerCase().indexOf('bochum') >= 0) return 'statics/teams/Bochum.png'
  if (_matchName.toLowerCase().indexOf('dortmund') >= 0) return 'statics/teams/Borussia_Dortmund.png'
  if (_matchName.toLowerCase().indexOf('gladbach') >= 0) return 'statics/teams/Borussia_Mönchengladbach.png'
  if (_matchName.toLowerCase().indexOf('darmstadt') >= 0) return 'statics/teams/Darmstadt.png'
  if (_matchName.toLowerCase().indexOf('braunschweig') >= 0) return 'statics/teams/Eintracht_Braunschweig.png'
  if (_matchName.toLowerCase().indexOf('frankfurt') >= 0) return 'statics/teams/Eintracht_Frankfurt.png'
  if (_matchName.toLowerCase().indexOf('fortuna') >= 0 || _matchName.toLowerCase().indexOf('düsseldorf') >= 0) return 'statics/teams/Fortuna_Düsseldorf.png'
  if (_matchName.toLowerCase().indexOf('greuther') >= 0 || _matchName.toLowerCase().indexOf('fürth') >= 0) return 'statics/teams/Greuther_Fürth.png'
  if (_matchName.toLowerCase().indexOf('hamburg') >= 0 || _matchName.toLowerCase().indexOf('hsv') >= 0) return 'statics/teams/Hamburger_SV.png'
  if (_matchName.toLowerCase().indexOf('hannover') >= 0) return 'statics/teams/Hannover.png'
  if (_matchName.toLowerCase().indexOf('hansa') >= 0 || _matchName.toLowerCase().indexOf('rostock') >= 0) return 'statics/teams/Hansa_Rostock.png'
  if (_matchName.toLowerCase().indexOf('heidenheim') >= 0) return 'statics/teams/Heidenheim.png'
  if (_matchName.toLowerCase().indexOf('hertha') >= 0) return 'statics/teams/Hertha.png'
  if (_matchName.toLowerCase().indexOf('hoffenheim') >= 0) return 'statics/teams/Hoffenheim.png'
  if (_matchName.toLowerCase().indexOf('holstein') >= 0) return 'statics/teams/Holstein.png'
  if (_matchName.toLowerCase().indexOf('jahn') >= 0 || _matchName.toLowerCase().indexOf('regensburg') >= 0) return 'statics/teams/Jahn_Regensburg.png'
  if (_matchName.toLowerCase().indexOf('fck') >= 0 || _matchName.toLowerCase().indexOf('kaiserslautern') >= 0) return 'statics/teams/Kaiserslautern.png'
  if (_matchName.toLowerCase().indexOf('ksc') >= 0 || _matchName.toLowerCase().indexOf('karlsruher') >= 0) return 'statics/teams/Karlsruher.png'
  if (_matchName.toLowerCase().indexOf('köln') >= 0) return 'statics/teams/Köln.png'
  if (_matchName.toLowerCase().indexOf('leipzig') >= 0) return 'statics/teams/Leipzig.png'
  if (_matchName.toLowerCase().indexOf('magdeburg') >= 0) return 'statics/teams/Magdeburg.png'
  if (_matchName.toLowerCase().indexOf('mainz') >= 0) return 'statics/teams/Mainz.png'
  if (_matchName.toLowerCase().indexOf('nürnberg') >= 0) return 'statics/teams/Nürnberg.png'
  if (_matchName.toLowerCase().indexOf('paderborn') >= 0) return 'statics/teams/Paderborn.png'
  if (_matchName.toLowerCase().indexOf('sandhausen') >= 0) return 'statics/teams/Sandhausen.png'
  if (_matchName.toLowerCase().indexOf('schalke') >= 0) return 'statics/teams/Schalke.png'
  if (_matchName.toLowerCase().indexOf('pauli') >= 0) return 'statics/teams/St._Pauli.png'
  if (_matchName.toLowerCase().indexOf('pokal') >= 0) return 'statics/teams/DFB_Pokal.png'
  if (_matchName.toLowerCase().indexOf('vfb') >= 0 || _matchName.toLowerCase().indexOf('stuttgart') >= 0) return 'statics/teams/Stuttgart.png'
  if (_matchName.toLowerCase().indexOf('union') >= 0) return 'statics/teams/Union_Berlin.png'
  if (_matchName.toLowerCase().indexOf('werder') >= 0 || _matchName.toLowerCase().indexOf('bremen') >= 0) return 'statics/teams/Werder_Bremen.png'
  if (_matchName.toLowerCase().indexOf('wolfsburg') >= 0) return 'statics/teams/Wolfsburg.png'

  if (_matchName.toLowerCase().indexOf('fest') >= 0 ||
      _matchName.toLowerCase().indexOf('party') >= 0 ||
      _matchName.toLowerCase().indexOf('anlass') >= 0 ||
      _matchName.toLowerCase().indexOf('geburtstag') >= 0 ||
      _matchName.toLowerCase().indexOf('event') >= 0) return 'statics/teams/Event.png'
  if (_matchName.toLowerCase().indexOf('test') >= 0) return 'statics/teams/Test.png'
  return 'statics/teams/QuestionMark.png'
}

const avatarOptions = [
  { label: 'AbrahamSimpson', value: 'AbrahamSimpson', avatar: 'statics/avatars/collection/AbrahamSimpson.png' },
  { label: 'Barbara', value: 'Barbara', avatar: 'statics/avatars/collection/Barbara.png' },
  { label: 'BarneyGumble', value: 'BarneyGumble', avatar: 'statics/avatars/collection/BarneyGumble.png' },
  { label: 'BartSimpson', value: 'BartSimpson', avatar: 'statics/avatars/collection/BartSimpson.png' },
  { label: 'Betty', value: 'Betty', avatar: 'statics/avatars/collection/Betty.png' },
  { label: 'Boy', value: 'Boy', avatar: 'statics/avatars/collection/Boy.png' },
  { label: 'Charles', value: 'Charles', avatar: 'statics/avatars/collection/Charles.png' },
  { label: 'CharlesMontgomeryBurns', value: 'CharlesMontgomeryBurns', avatar: 'statics/avatars/collection/CharlesMontgomeryBurns.png' },
  { label: 'Christopher', value: 'Christopher', avatar: 'statics/avatars/collection/Christopher.png' },
  { label: 'clancyWiggum', value: 'clancyWiggum', avatar: 'statics/avatars/collection/clancyWiggum.png' },
  { label: 'Daniel', value: 'Daniel', avatar: 'statics/avatars/collection/Daniel.png' },
  { label: 'David', value: 'David', avatar: 'statics/avatars/collection/David.png' },
  { label: 'Donald', value: 'Donald', avatar: 'statics/avatars/collection/Donald.png' },
  { label: 'Dorothy', value: 'Dorothy', avatar: 'statics/avatars/collection/Dorothy.png' },
  { label: 'Elizabeth', value: 'Elizabeth', avatar: 'statics/avatars/collection/Elizabeth.png' },
  { label: 'George', value: 'George', avatar: 'statics/avatars/collection/George.png' },
  { label: 'Girl', value: 'Girl', avatar: 'statics/avatars/collection/Girl.png' },
  { label: 'Helen', value: 'Helen', avatar: 'statics/avatars/collection/Helen.png' },
  { label: 'HelloKitty', value: 'HelloKitty', avatar: 'statics/avatars/collection/HelloKitty.png' },
  { label: 'HomerSimpson', value: 'HomerSimpson', avatar: 'statics/avatars/collection/HomerSimpson.png' },
  { label: 'Ironman', value: 'Ironman', avatar: 'statics/avatars/collection/Ironman.png' },
  { label: 'James', value: 'James', avatar: 'statics/avatars/collection/James.png' },
  { label: 'Jennifer', value: 'Jennifer', avatar: 'statics/avatars/collection/Jennifer.png' },
  { label: 'John', value: 'John', avatar: 'statics/avatars/collection/John.png' },
  { label: 'Joseph', value: 'Joseph', avatar: 'statics/avatars/collection/Joseph.png' },
  { label: 'Karen', value: 'Karen', avatar: 'statics/avatars/collection/Karen.png' },
  { label: 'Kenneth', value: 'Kenneth', avatar: 'statics/avatars/collection/Kenneth.png' },
  { label: 'KrustyTheClown', value: 'KrustyTheClown', avatar: 'statics/avatars/collection/KrustyTheClown.png' },
  { label: 'Linda', value: 'Linda', avatar: 'statics/avatars/collection/Linda.png' },
  { label: 'Lisa', value: 'Lisa', avatar: 'statics/avatars/collection/Lisa.png' },
  { label: 'LisaSimpson', value: 'LisaSimpson', avatar: 'statics/avatars/collection/LisaSimpson.png' },
  { label: 'MaggieSimpson', value: 'MaggieSimpson', avatar: 'statics/avatars/collection/MaggieSimpson.png' },
  { label: 'Margaret', value: 'Margaret', avatar: 'statics/avatars/collection/Margaret.png' },
  { label: 'MargeSimpson', value: 'MargeSimpson', avatar: 'statics/avatars/collection/MargeSimpson.png' },
  { label: 'Maria', value: 'Maria', avatar: 'statics/avatars/collection/Maria.png' },
  { label: 'Mark', value: 'Mark', avatar: 'statics/avatars/collection/Mark.png' },
  { label: 'Mary', value: 'Mary', avatar: 'statics/avatars/collection/Mary.png' },
  { label: 'Michael', value: 'Michael', avatar: 'statics/avatars/collection/Michael.png' },
  { label: 'Nancy', value: 'Nancy', avatar: 'statics/avatars/collection/Nancy.png' },
  { label: 'Patricia', value: 'Patricia', avatar: 'statics/avatars/collection/Patricia.png' },
  { label: 'Paul', value: 'Paul', avatar: 'statics/avatars/collection/Paul.png' },
  { label: 'PileOfPoo', value: 'PileOfPoo', avatar: 'statics/avatars/collection/PileOfPoo.png' },
  { label: 'Quasar', value: 'Quasar', avatar: 'statics/avatars/collection/Quasar.png' },
  { label: 'Richard', value: 'Richard', avatar: 'statics/avatars/collection/Richard.png' },
  { label: 'Robert', value: 'Robert', avatar: 'statics/avatars/collection/Robert.png' },
  { label: 'StanMarsh', value: 'StanMarsh', avatar: 'statics/avatars/collection/StanMarsh.png' },
  { label: 'Steven', value: 'Steven', avatar: 'statics/avatars/collection/Steven.png' },
  { label: 'SuperMario', value: 'SuperMario', avatar: 'statics/avatars/collection/SuperMario.png' },
  { label: 'Susan', value: 'Susan', avatar: 'statics/avatars/collection/Susan.png' },
  { label: 'Thomas', value: 'Thomas', avatar: 'statics/avatars/collection/Thomas.png' },
  { label: 'William', value: 'William', avatar: 'statics/avatars/collection/William.png' }
]

export { IsAdministrator }
export { Client }
export { URLMatch }
export { URLParticipant }
export { URLParticipantArchive }
export { URLWhereIsMyCard }
export { URLMember }
export { URLOrder }
export { getAvatar }
export { getImageHomeTeam }
export { getImageAwayTeam }
export { avatarOptions }
