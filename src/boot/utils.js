const IsAdministrator = false
const Client = 'BGB'

let URLMatch = 'https://script.google.com/macros/s/AKfycbwVxbhtoh4V78VL6GH-uhnpHzz0rpV215KeV8hEQ4Y_mvnE3PWHS6MBpPgBJcu2yaptSA/exec'
let URLParticipant = 'https://script.google.com/macros/s/AKfycbydoX9quJr-aOj7_v3gnt6Ku__u29EnmKIaT6rgyZ3Ow4qzZ9eyu-sMsijteqvZAQox4Q/exec'
let URLParticipantArchive = 'https://script.google.com/macros/s/AKfycbwIKgcrnEMe-sQ5WU1BETzRtJCk4odrTMBfNy5_RUv8ZBsN65H87ejNJKGUHX0f40n3eA/exec'
let URLWhereIsMyCard = 'https://script.google.com/macros/s/AKfycbwi7JYV_w0u7KoYw-CUio5HWGrLPvIxRqHybNn4DdgQfOLeGfm3Ufb3IlunmgQq-zFV/exec'
let URLMember = 'https://script.google.com/macros/s/AKfycbyj3smDP7m9csheRg0c6n00u0Rb2CczULz8C8lAibkv_gBjiqfkfOZdOP9etSVMDMtL/exec'
const URLOrder = 'https://script.google.com/macros/s/AKfycbz0cWknDb0ACTYRUCqUE9cIOkU2GV460W8Mhz6VyDKELQc9cLbjnwGrP3wRwlRHJnYBEA/exec?sh=BGB'

URLMatch += '?sh=' + Client
URLParticipant += '?sh=' + Client
URLParticipantArchive += '?sh=' + Client
URLWhereIsMyCard += '?sh=' + Client
URLMember += '?sh=' + Client

const getLogo = function () {
  return 'statics/images/' + Client + '/Logo.png'
}

const getAvatar = function (_avatar, _customized) {
  if (_avatar === '') return 'statics/avatars/collection/Placeholder.png'
  else if (_customized) return 'statics/avatars/' + Client + '/' + _avatar + '.png'
  else return 'statics/avatars/collection/' + _avatar + '.png'
}

const getTeamImage = function (_team) {
  if (_team.toLowerCase().indexOf('arminia') >= 0 || _team.toLowerCase().indexOf('bielefeld') >= 0) return 'statics/teams/Arminia_Bielefeld.png'
  if (_team.toLowerCase().indexOf('augsburg') >= 0) return 'statics/teams/Augsburg.png'
  if (_team.toLowerCase().indexOf('leverkusen') >= 0) return 'statics/teams/Bayer_Leverkusen.png'
  if (_team.toLowerCase().indexOf('bayern') >= 0 || _team.toLowerCase().indexOf('münchen') >= 0) return 'statics/teams/Bayern_München.png'
  if (_team.toLowerCase().indexOf('bochum') >= 0) return 'statics/teams/Bochum.png'
  if (_team.toLowerCase().indexOf('dortmund') >= 0) return 'statics/teams/Borussia_Dortmund.png'
  if (_team.toLowerCase().indexOf('gladbach') >= 0) return 'statics/teams/Borussia_Mönchengladbach.png'
  if (_team.toLowerCase().indexOf('darmstadt') >= 0) return 'statics/teams/Darmstadt.png'
  if (_team.toLowerCase().indexOf('braunschweig') >= 0) return 'statics/teams/Eintracht_Braunschweig.png'
  if (_team.toLowerCase().indexOf('frankfurt') >= 0) return 'statics/teams/Eintracht_Frankfurt.png'
  if (_team.toLowerCase().indexOf('fortuna') >= 0 || _team.toLowerCase().indexOf('düsseldorf') >= 0) return 'statics/teams/Fortuna_Düsseldorf.png'
  if (_team.toLowerCase().indexOf('greuther') >= 0 || _team.toLowerCase().indexOf('fürth') >= 0) return 'statics/teams/Greuther_Fürth.png'
  if (_team.toLowerCase().indexOf('hamburg') >= 0 || _team.toLowerCase().indexOf('hsv') >= 0) return 'statics/teams/Hamburger_SV.png'
  if (_team.toLowerCase().indexOf('hannover') >= 0) return 'statics/teams/Hannover.png'
  if (_team.toLowerCase().indexOf('hansa') >= 0 || _team.toLowerCase().indexOf('rostock') >= 0) return 'statics/teams/Hansa_Rostock.png'
  if (_team.toLowerCase().indexOf('heidenheim') >= 0) return 'statics/teams/Heidenheim.png'
  if (_team.toLowerCase().indexOf('hertha') >= 0) return 'statics/teams/Hertha.png'
  if (_team.toLowerCase().indexOf('hoffenheim') >= 0) return 'statics/teams/Hoffenheim.png'
  if (_team.toLowerCase().indexOf('holstein') >= 0) return 'statics/teams/Holstein.png'
  if (_team.toLowerCase().indexOf('jahn') >= 0 || _team.toLowerCase().indexOf('regensburg') >= 0) return 'statics/teams/Jahn_Regensburg.png'
  if (_team.toLowerCase().indexOf('juve') >= 0 || _team.toLowerCase().indexOf('turin') >= 0) return 'statics/teams/Juventus_Turin.png'
  if (_team.toLowerCase().indexOf('fck') >= 0 || _team.toLowerCase().indexOf('kaiserslautern') >= 0) return 'statics/teams/Kaiserslautern.png'
  if (_team.toLowerCase().indexOf('ksc') >= 0 || _team.toLowerCase().indexOf('karlsruher') >= 0) return 'statics/teams/Karlsruher.png'
  if (_team.toLowerCase().indexOf('köln') >= 0) return 'statics/teams/Köln.png'
  if (_team.toLowerCase().indexOf('leipzig') >= 0) return 'statics/teams/Leipzig.png'
  if (_team.toLowerCase().indexOf('magdeburg') >= 0) return 'statics/teams/Magdeburg.png'
  if (_team.toLowerCase().indexOf('mainz') >= 0) return 'statics/teams/Mainz.png'
  if (_team.toLowerCase().indexOf('nürnberg') >= 0) return 'statics/teams/Nürnberg.png'
  if (_team.toLowerCase().indexOf('olympiakos') >= 0 || _team.toLowerCase().indexOf('piräus') >= 0) return 'statics/teams/Olympiakos_Piräus.png'
  if (_team.toLowerCase().indexOf('paderborn') >= 0) return 'statics/teams/Paderborn.png'
  if (_team.toLowerCase().indexOf('sandhausen') >= 0) return 'statics/teams/Sandhausen.png'
  if (_team.toLowerCase().indexOf('schalke') >= 0) return 'statics/teams/Schalke.png'
  if (_team.toLowerCase().indexOf('scf') >= 0 || _team.toLowerCase().indexOf('freiburg') >= 0) return 'statics/teams/Freiburg.png'
  if (_team.toLowerCase().indexOf('pauli') >= 0) return 'statics/teams/St._Pauli.png'
  if (_team.toLowerCase().indexOf('pokal') >= 0) return 'statics/teams/DFB_Pokal.png'
  if (_team.toLowerCase().indexOf('vfb') >= 0 || _team.toLowerCase().indexOf('stuttgart') >= 0) return 'statics/teams/Stuttgart.png'
  if (_team.toLowerCase().indexOf('union') >= 0) return 'statics/teams/Union_Berlin.png'
  if (_team.toLowerCase().indexOf('werder') >= 0 || _team.toLowerCase().indexOf('bremen') >= 0) return 'statics/teams/Werder_Bremen.png'
  if (_team.toLowerCase().indexOf('wolfsburg') >= 0) return 'statics/teams/Wolfsburg.png'
  return 'statics/teams/QuestionMark.png'
}

const getEventImage = function (_matchName) {
  if (_matchName.toLowerCase().indexOf('test') >= 0) return 'statics/teams/Test.png'
  return 'statics/teams/Event.png'
}

const avatarOptions = [
  { label: 'AbrahamSimpson', value: 'AbrahamSimpson', avatar: 'statics/avatars/collection/AbrahamSimpson.png' },
  { label: 'Alien', value: 'Alien', avatar: 'statics/avatars/collection/Alien.png' },
  { label: 'Ariel', value: 'Ariel', avatar: 'statics/avatars/collection/Ariel.png' },
  { label: 'BarneyGumble', value: 'BarneyGumble', avatar: 'statics/avatars/collection/BarneyGumble.png' },
  { label: 'BartSimpson', value: 'BartSimpson', avatar: 'statics/avatars/collection/BartSimpson.png' },
  { label: 'CharlieBrown', value: 'CharlieBrown', avatar: 'statics/avatars/collection/CharlieBrown.png' },
  { label: 'CharlieChaplin', value: 'CharlieChaplin', avatar: 'statics/avatars/collection/CharlieChaplin.png' },
  { label: 'ClancyWiggum', value: 'ClancyWiggum', avatar: 'statics/avatars/collection/ClancyWiggum.png' },
  { label: 'Cupid', value: 'Cupid', avatar: 'statics/avatars/collection/Cupid.png' },
  { label: 'DoctorStrange', value: 'DoctorStrange', avatar: 'statics/avatars/collection/DoctorStrange.png' },
  { label: 'EdSheeran', value: 'EdSheeran', avatar: 'statics/avatars/collection/EdSheeran.png' },
  { label: 'Eeyore', value: 'Eeyore', avatar: 'statics/avatars/collection/Eeyore.png' },
  { label: 'ElonMusk', value: 'ElonMusk', avatar: 'statics/avatars/collection/ElonMusk.png' },
  { label: 'FatCat', value: 'FatCat', avatar: 'statics/avatars/collection/FatCat.png' },
  { label: 'HelloKitty', value: 'HelloKitty', avatar: 'statics/avatars/collection/HelloKitty.png' },
  { label: 'HomerSimpson', value: 'HomerSimpson', avatar: 'statics/avatars/collection/HomerSimpson.png' },
  { label: 'Ironman', value: 'Ironman', avatar: 'statics/avatars/collection/Ironman.png' },
  { label: 'Jerry', value: 'Jerry', avatar: 'statics/avatars/collection/Jerry.png' },
  { label: 'JohnLennon', value: 'JohnLennon', avatar: 'statics/avatars/collection/JohnLennon.png' },
  { label: 'Joker', value: 'Joker', avatar: 'statics/avatars/collection/Joker.png' },
  { label: 'KrustyTheClown', value: 'KrustyTheClown', avatar: 'statics/avatars/collection/KrustyTheClown.png' },
  { label: 'Linus', value: 'Linus', avatar: 'statics/avatars/collection/Linus.png' },
  { label: 'LisaSimpson', value: 'LisaSimpson', avatar: 'statics/avatars/collection/LisaSimpson.png' },
  { label: 'Lucy', value: 'Lucy', avatar: 'statics/avatars/collection/Lucy.png' },
  { label: 'MaggieSimpson', value: 'MaggieSimpson', avatar: 'statics/avatars/collection/MaggieSimpson.png' },
  { label: 'Marcie', value: 'Marcie', avatar: 'statics/avatars/collection/Marcie.png' },
  { label: 'MargeSimpson', value: 'MargeSimpson', avatar: 'statics/avatars/collection/MargeSimpson.png' },
  { label: 'Marie', value: 'Marie', avatar: 'statics/avatars/collection/Marie.png' },
  { label: 'MarilynMonroe', value: 'MarilynMonroe', avatar: 'statics/avatars/collection/MarilynMonroe.png' },
  { label: 'Messi', value: 'Messi', avatar: 'statics/avatars/collection/Messi.png' },
  { label: 'MichaelJackson', value: 'MichaelJackson', avatar: 'statics/avatars/collection/MichaelJackson.png' },
  { label: 'Mondtor01', value: 'Mondtor01', avatar: 'statics/avatars/collection/Mondtor01.png' },
  { label: 'Mondtor02', value: 'Mondtor02', avatar: 'statics/avatars/collection/Mondtor02.png' },
  { label: 'MrBeansTeddy', value: 'MrBeansTeddy', avatar: 'statics/avatars/collection/MrBeansTeddy.png' },
  { label: 'MrBurns', value: 'MrBurns', avatar: 'statics/avatars/collection/MrBurns.png' },
  { label: 'MsWicket', value: 'MsWicket', avatar: 'statics/avatars/collection/MsWicket.png' },
  { label: 'Pelé', value: 'Pelé', avatar: 'statics/avatars/collection/Pelé.png' },
  { label: 'PeppermintPatty', value: 'PeppermintPatty', avatar: 'statics/avatars/collection/PeppermintPatty.png' },
  { label: 'PileOfPoo', value: 'PileOfPoo', avatar: 'statics/avatars/collection/PileOfPoo.png' },
  { label: 'Sally', value: 'Sally', avatar: 'statics/avatars/collection/Sally.png' },
  { label: 'Santa', value: 'Santa', avatar: 'statics/avatars/collection/Santa.png' },
  { label: 'SeaCalf', value: 'SeaCalf', avatar: 'statics/avatars/collection/SeaCalf.png' },
  { label: 'SnoopDogg', value: 'SnoopDogg', avatar: 'statics/avatars/collection/SnoopDogg.png' },
  { label: 'StanMarsh', value: 'StanMarsh', avatar: 'statics/avatars/collection/StanMarsh.png' },
  { label: 'Sumo', value: 'Sumo', avatar: 'statics/avatars/collection/Sumo.png' },
  { label: 'SuperMario', value: 'SuperMario', avatar: 'statics/avatars/collection/SuperMario.png' },
  { label: 'Tom', value: 'Tom', avatar: 'statics/avatars/collection/Tom.png' },
  { label: 'TomKid', value: 'TomKid', avatar: 'statics/avatars/collection/TomKid.png' },
  { label: 'Woodstock', value: 'Woodstock', avatar: 'statics/avatars/collection/Woodstock.png' }
]

export { IsAdministrator }
export { Client }
export { URLMatch }
export { URLParticipant }
export { URLParticipantArchive }
export { URLWhereIsMyCard }
export { URLMember }
export { URLOrder }
export { getLogo }
export { getAvatar }
export { getTeamImage }
export { getEventImage }
export { avatarOptions }
