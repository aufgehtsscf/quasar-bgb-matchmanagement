const IsAdministrator = false

const URLMatch = 'https://script.google.com/macros/s/AKfycbxgC2OKYp5RVBEr8lS3KPBoF1RY2CTCCkmdz14vhr5S-PNrmdsVqyFYGjsNiT-2Dwgwzw/exec?sh=BGB&'
const URLParticipant = 'https://script.google.com/macros/s/AKfycbyjRv5Adsc4tJg_OCCNByFlX48ULbmjXVtiD-q2HR3AeZ_w65hjzu-FVMqhUQvrJd19xA/exec?sh=BGB&'
const URLParticipantArchive = 'https://script.google.com/macros/s/AKfycbyZqIPBen9h7FrsNb89T6FZn5DB3-NS0c2AFc1Feiy8r0i5sgDDM2rdMTmYMDpUhlzBsg/exec?sh=BGB&'
const URLWhereIsMyCard = 'https://script.google.com/macros/s/AKfycbxh56k8Tl-fqkQY_EIje5f46YxN6957oNhHCz5MKT-RJ5JMFL_fVehDvyydhgovm5rP/exec?sh=BGB&'
const URLMember = 'https://script.google.com/macros/s/AKfycbxIcEksRlg7mOFG32Y9Ut2aqzJj64YKfOb49_FDgIH3hh5z4vE53jcDH5kzJ1fw_IEA/exec?sh=BGB&'
const URLOrder = 'https://script.google.com/macros/s/AKfycbz0cWknDb0ACTYRUCqUE9cIOkU2GV460W8Mhz6VyDKELQc9cLbjnwGrP3wRwlRHJnYBEA/exec?sh=BGB&'

const hasAvatar = function (_participant) {
  if (_participant === 'Bolze' ||
      _participant === 'Blado' ||
      _participant === 'Pawel' ||
      _participant === 'Rita') {
    return true
  }
  return false
}

const getAvatar = function (_participant) {
  if (_participant === 'Bolze') return 'statics/avatars/Bolze.png'
  if (_participant === 'Blado') return 'statics/avatars/Blado.png'
  if (_participant === 'Pawel') return 'statics/avatars/Pawel.png'
  if (_participant === 'Rita') return 'statics/avatars/Rita.png'
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

export { IsAdministrator }
export { URLMatch }
export { URLParticipant }
export { URLParticipantArchive }
export { URLWhereIsMyCard }
export { URLMember }
export { URLOrder }
export { hasAvatar }
export { getAvatar }
export { getImageHomeTeam }
export { getImageAwayTeam }
