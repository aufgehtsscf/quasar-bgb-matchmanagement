const URLMatch = 'https://script.google.com/macros/s/AKfycbysBv-GIg2N_vpj7n1L3pWiK1WC0EC1bUfJCmv7kBXHfdPKxtbJg8bQyNJKFDkekGEDeA/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match'
const URLParticipant = 'https://script.google.com/macros/s/AKfycbxyY9YZjWtnDPLQCWrO_j7YmfPFRRu6VHmqMgN1oS5bHL1nXoPyc3LrRBMDH0V-tDszuA/exec?ID=1HCZKuGO-dmNJwrEsFyN2acvnE-WMHabBW8jWdhO4ggI&SH=BGB-Participant'
const URLParticipantArchive = 'https://script.google.com/macros/s/AKfycbwNroj1OzLNOOHRWFdNmaiN8bpKnJqBf3Lbm6firEaWPJo1wstm7Nsh9J3oAJox1lSt7w/exec?ID=1fjnXO0Fsrj03Da8CDaBSClheSrE9Qr6VMNWzL-JQR7s&SH=BGB-ParticipantArchive'
const URLWhereIsMyCard = 'https://script.google.com/macros/s/AKfycbzlc-2httq6jMOsqbGIQmE6oAXNcWpLRZmGckDWQ6DqFoGQgHD-C1BkennQGntzAkJj/exec?ID=1AA2nnIb886xaBjpSaxwf2JNtujKnJc4xSVR-ChRGs2U&SH=BGB-WhereIsMyCard'
const URLMember = 'https://script.google.com/macros/s/AKfycbwHy4AqpKn_mqkBmHumQ5xqa1JqeFLVmGb9KeoG4uzbBETGu6mPQpH4OfOW9kDgCkwM/exec?ID=198Khh4kc4jyL77VSYtFZ2JNjbv_OW7B4Q5Kfq7QH6wc&SH=BGB-Member'

const hasAvatar = function (_participant) {
  if (_participant === 'Bolze' ||
      _participant === 'Blado') {
    return true
  }
  return false
}

const getAvatar = function (_participant) {
  if (_participant === 'Bolze') return 'statics/avatars/Bolze.png'
  if (_participant === 'Blado') return 'statics/avatars/Blado.png'
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

export { URLMatch }
export { URLParticipant }
export { URLParticipantArchive }
export { URLWhereIsMyCard }
export { URLMember }
export { hasAvatar }
export { getAvatar }
export { getImageHomeTeam }
export { getImageAwayTeam }
