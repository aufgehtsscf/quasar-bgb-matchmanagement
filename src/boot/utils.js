const IsAdministrator = false
const ApplicationCode = 'NGdoLbyd_330'

// emailjs
const serviceID = 'service_1z8boq8'
const templateID = 'template_uc9j4dn'
const userID = 'z6CsuBOLcuYCsxNiZ'
const FromName = 'Auf geht\'s SCF'

// Orders
const OrderId1 = 'd1f60978-f743-4b6e-88f1-ac7aa7885d2b'
const OrderId2 = '8f26f0ad-d9d3-4c33-b1c9-f0560ee3ea11'

// const URLMatchManagementAPI = 'https://planthegame.ch'
const URLMatchManagementAPI = 'https://localhost:5200'
const URLOrderBasis = 'https://script.google.com/macros/s/AKfycbxpYbKFzUC6iSSlE913vWGLuvRZ7TbT8eXVn54Un7rm0KJa9vVGzuvu7d-V-tSuWSDjOw/exec'
const URLProperties = 'https://script.google.com/macros/s/AKfycbxMU3wrrJ9m8Qcnpzu-0oC-APSA28i765lF_AHh6tVagXj1JpHz5glq8MY0GCPNbvdK/exec?sh=Properties'

const getCookie = function (_cookieName) {
  const name = _cookieName + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  if (_cookieName === 'isAdministrator') return IsAdministrator
  if (_cookieName === 'applicationCode') return ApplicationCode
}

const setCookie = function (_isAdministrator, _applicationCode) {
  const d = new Date()
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000))
  const _expires = 'expires=' + d.toUTCString()
  document.cookie = 'isAdministrator=' + _isAdministrator + ';' + _expires + '";path=/'
  document.cookie = 'applicationCode=' + _applicationCode + ';' + _expires + '";path=/'
}

const getAdminCode = function (_applicationCode) {
  let _adminCode = ''

  if (_applicationCode === 'HOME') {
    return '3Home2emoH9'
  }

  if (_applicationCode.length === 12) {
    if (_applicationCode.indexOf('_') > 0) {
      const _stringCode = _applicationCode.split('_')
      if (_stringCode[0].length === 8 && parseInt(_stringCode[1]) >= 329) {
        _adminCode = _stringCode[1].substring(0, 1) + _stringCode[0].substring(0, 4) + _stringCode[1].substring(1, 2) + _stringCode[0].substring(4, 8) + _stringCode[1].substring(2, _stringCode[1].length)
      }
    }
  } else if (_applicationCode.length === 11) {
    _adminCode = _applicationCode
  }

  return _adminCode
}

const getUserCode = function (_applicationCode) {
  let _userCode = ''

  if (_applicationCode.length === 12) {
    if (_applicationCode.indexOf('_') > 0) {
      const _stringCode = _applicationCode.split('_')
      if (_stringCode[0].length === 8 && parseInt(_stringCode[1]) >= 329) {
        _userCode = _applicationCode
      }
    }
  } else if (_applicationCode.length === 11) {
    _userCode = _applicationCode.substring(1, 5) + _applicationCode.substring(6, 10) + '_' + _applicationCode.substring(0, 1) + _applicationCode.substring(5, 6) + _applicationCode.substring(10, _applicationCode.length)
  }

  return _userCode
}

const getLogo = function (_adminCode) {
  return URLMatchManagementAPI + '/images/' + _adminCode + '/Logo.png'
}

const getAvatar = function (_avatar, _customized, _imageURL) {
  if (_avatar === '') return URLMatchManagementAPI + '/images/avatars/collection/Placeholder.png'
  else if (_customized) return URLMatchManagementAPI + _imageURL
  else return URLMatchManagementAPI + '/images/avatars/collection/' + _avatar + '.png'
}

const getTeamImage = function (_team) {
  let teamImage = this.teamImages.find(el => el.value === _team)?.image
  if (typeof teamImage === 'undefined') {
    teamImage = URLMatchManagementAPI + '/images/teams/QuestionMark.svg'
  }
  return teamImage
}

const getEventImage = function (_matchName) {
  if (_matchName.toLowerCase().indexOf('test') >= 0) return URLMatchManagementAPI + '/images/teams/Test.svg'
  return URLMatchManagementAPI + '/images/teams/Event.webp'
}

const isBGB = (ApplicationCode === '3NGdo3Lbyd0' || ApplicationCode === 'NGdoLbyd_330')

const teamImages = [
  { label: 'Arminia', value: 'Arminia_Bielefeld', image: URLMatchManagementAPI + '/images/teams/Arminia_Bielefeld.svg' },
  { label: 'Augsburg', value: 'Augsburg', image: URLMatchManagementAPI + '/images/teams/Augsburg.svg' },
  { label: 'Backa Topola', value: 'Backa_Topola', image: URLMatchManagementAPI + '/images/teams/Backa_Topola.svg' },
  { label: 'Bahlinger SC', value: 'Bahlinger_SC', image: URLMatchManagementAPI + '/images/teams/Bahlinger_SC.jpg' },
  { label: 'Basel', value: 'Basel', image: URLMatchManagementAPI + '/images/teams/Basel.png' },
  { label: 'Bayer Leverkusen', value: 'Bayer_Leverkusen', image: URLMatchManagementAPI + '/images/teams/Bayer_Leverkusen.svg' },
  { label: 'Bayern', value: 'Bayern_München', image: URLMatchManagementAPI + '/images/teams/Bayern_München.svg' },
  { label: 'Bayern Alzenau', value: 'Bayern_Alzenau', image: URLMatchManagementAPI + '/images/teams/Bayern_Alzenau.svg' },
  { label: 'Bochum', value: 'Bochum', image: URLMatchManagementAPI + '/images/teams/Bochum.svg' },
  { label: 'Bologna', value: 'Bologna', image: URLMatchManagementAPI + '/images/teams/Bologna.svg' },
  { label: 'Borussia Dortmund', value: 'Borussia_Dortmund', image: URLMatchManagementAPI + '/images/teams/Borussia_Dortmund.svg' },
  { label: 'Borussia Mönchengladbach', value: 'Borussia_Mönchengladbach', image: URLMatchManagementAPI + '/images/teams/Borussia_Mönchengladbach.svg' },
  { label: 'Celta Vigo', value: 'Celta_Vigo', image: URLMatchManagementAPI + '/images/teams/Celta_Vigo.svg' },
  { label: 'Champions League', value: 'Champions_League', image: URLMatchManagementAPI + '/images/teams/Champions_League.svg' },
  { label: 'Conference League', value: 'Conference_League', image: URLMatchManagementAPI + '/images/teams/Conference_League.svg' },
  { label: 'Darmstadt', value: 'Darmstadt', image: URLMatchManagementAPI + '/images/teams/Darmstadt.svg' },
  { label: 'DFB Pokal', value: 'DFB_Pokal', image: URLMatchManagementAPI + '/images/teams/DFB_Pokal.png' },
  { label: 'Eintracht Braunschweig', value: 'Eintracht_Braunschweig', image: URLMatchManagementAPI + '/images/teams/Eintracht_Braunschweig.svg' },
  { label: 'Eintracht Frankfurt', value: 'Eintracht_Frankfurt', image: URLMatchManagementAPI + '/images/teams/Eintracht_Frankfurt.svg' },
  { label: 'Eintracht Trier', value: 'Eintracht_Trier', image: URLMatchManagementAPI + '/images/teams/Eintracht_Trier.svg' },
  { label: 'Europa League', value: 'Europa_League', image: URLMatchManagementAPI + '/images/teams/Europa_League.svg' },
  { label: 'FCA Walldorf', value: 'FCA_Walldorf', image: URLMatchManagementAPI + '/images/teams/FCA_Walldorf.svg' },
  { label: 'FC Homburg', value: 'FC_Homburg', image: URLMatchManagementAPI + '/images/teams/FC_Homburg.svg' },
  { label: 'FC 08 Villingen', value: 'FC_08_Villingen', image: URLMatchManagementAPI + '/images/teams/FC_08_Villingen.svg' },
  { label: 'Fortuna Düsseldorf', value: 'Fortuna_Düsseldorf', image: URLMatchManagementAPI + '/images/teams/Fortuna_Düsseldorf.svg' },
  { label: 'Freiburg', value: 'Freiburg', image: URLMatchManagementAPI + '/images/teams/Freiburg.svg' },
  { label: 'FSV Frankfurt', value: 'FSV_Frankfurt', image: URLMatchManagementAPI + '/images/teams/FSV_Frankfurt.svg' },
  { label: 'Genk', value: 'KRC_Genk', image: URLMatchManagementAPI + '/images/teams/KRC_Genk.svg' },
  { label: 'Giessen', value: 'Giessen', image: URLMatchManagementAPI + '/images/teams/Giessen.svg' },
  { label: 'Göppinger', value: 'Göppinger', image: URLMatchManagementAPI + '/images/teams/Göppinger.svg' },
  { label: 'Greuther Fürth', value: 'Greuther_Fürth', image: URLMatchManagementAPI + '/images/teams/Greuther_Fürth.svg' },
  { label: 'Hamburger SV', value: 'Hamburger_SV', image: URLMatchManagementAPI + '/images/teams/Hamburger_SV.svg' },
  { label: 'Hannover', value: 'Hannover', image: URLMatchManagementAPI + '/images/teams/Hannover.svg' },
  { label: 'Hansa Rostock', value: 'Hansa_Rostock', image: URLMatchManagementAPI + '/images/teams/Hansa_Rostock.svg' },
  { label: 'Heidenheim', value: 'Heidenheim', image: URLMatchManagementAPI + '/images/teams/Heidenheim.svg' },
  { label: 'Hertha', value: 'Hertha', image: URLMatchManagementAPI + '/images/teams/Hertha.svg' },
  { label: 'Hoffenheim', value: 'Hoffenheim', image: URLMatchManagementAPI + '/images/teams/Hoffenheim.svg' },
  { label: 'Holstein', value: 'Holstein', image: URLMatchManagementAPI + '/images/teams/Holstein.svg' },
  { label: 'Jahn Regensburg', value: 'Jahn_Regensburg', image: URLMatchManagementAPI + '/images/teams/Jahn_Regensburg.svg' },
  { label: 'Juventus Turin', value: 'Juventus_Turin', image: URLMatchManagementAPI + '/images/teams/Juventus_Turin.svg' },
  { label: 'Kaiserslautern', value: 'Kaiserslautern', image: URLMatchManagementAPI + '/images/teams/Kaiserslautern.svg' },
  { label: 'Karlsruher', value: 'Karlsruher', image: URLMatchManagementAPI + '/images/teams/Karlsruher.svg' },
  { label: 'Köln', value: 'Köln', image: URLMatchManagementAPI + '/images/teams/Köln.svg' },
  { label: 'KSV Hessen', value: 'KSV_Hessen', image: URLMatchManagementAPI + '/images/teams/KSV_Hessen.svg' },
  { label: 'Leipzig', value: 'Leipzig', image: URLMatchManagementAPI + '/images/teams/Leipzig.svg' },
  { label: 'RC Lens', value: 'Lens', image: URLMatchManagementAPI + '/images/teams/Lens.svg' },
  { label: 'Lille', value: 'Lille', image: URLMatchManagementAPI + '/images/teams/Lille.svg' },
  { label: 'Lotte', value: 'Lotte', image: URLMatchManagementAPI + '/images/teams/Lotte.svg' },
  { label: 'Maccabi Tel Aviv', value: 'Maccabi_Tel_Aviv', image: URLMatchManagementAPI + '/images/teams/Maccabi_Tel_Aviv.png' },
  { label: 'Magdeburg', value: 'Magdeburg', image: URLMatchManagementAPI + '/images/teams/Magdeburg.svg' },
  { label: 'Mainz', value: 'Mainz', image: URLMatchManagementAPI + '/images/teams/Mainz.svg' },
  { label: 'Nice', value: 'Nice', image: URLMatchManagementAPI + '/images/teams/Nice.svg' },
  { label: 'Nürnberg', value: 'Nürnberg', image: URLMatchManagementAPI + '/images/teams/Nürnberg.svg' },
  { label: 'Oberachern', value: 'Oberachern', image: URLMatchManagementAPI + '/images/teams/Oberachern.svg' },
  { label: 'Offenbach', value: 'Offenbach', image: URLMatchManagementAPI + '/images/teams/Offenbach.svg' },
  { label: 'Olympiakos Piräus', value: 'Olympiakos_Piräus', image: URLMatchManagementAPI + '/images/teams/Olympiakos_Piräus.svg' },
  { label: 'Paderborn', value: 'Paderborn', image: URLMatchManagementAPI + '/images/teams/Paderborn.svg' },
  { label: 'Salzburg', value: 'Salzburg', image: URLMatchManagementAPI + '/images/teams/Salzburg.png' },
  { label: 'Sandhausen', value: 'Sandhausen', image: URLMatchManagementAPI + '/images/teams/Sandhausen.svg' },
  { label: 'Schalke', value: 'Schalke', image: URLMatchManagementAPI + '/images/teams/Schalke.svg' },
  { label: 'SG Barockstadt', value: 'SG_Barockstadt', image: URLMatchManagementAPI + '/images/teams/SG_Barockstadt.png' },
  { label: 'SG Sonnenhof Großaspach', value: 'SG_Sonnenhof_Großaspach', image: URLMatchManagementAPI + '/images/teams/SG_Sonnenhof_Großaspach.svg' },
  { label: 'SGV Freiberg', value: 'SGV_Freiberg', image: URLMatchManagementAPI + '/images/teams/SGV_Freiberg.svg' },
  { label: 'St. Pauli', value: 'St._Pauli', image: URLMatchManagementAPI + '/images/teams/St._Pauli.svg' },
  { label: 'Stuttgart', value: 'Stuttgart', image: isBGB ? URLMatchManagementAPI + '/images/teams/Stuttgart_Shit.png' : URLMatchManagementAPI + '/images/teams/Stuttgart.svg' },
  { label: 'Stuttgarter Kickers', value: 'Stuttgarter_Kickers', image: URLMatchManagementAPI + '/images/teams/Stuttgarter_Kickers.svg' },
  { label: 'TSG Balingen', value: 'TSG_Balingen', image: URLMatchManagementAPI + '/images/teams/TSG_Balingen.png' },
  { label: 'TSV Schott Mainz', value: 'TSV_Schott_Mainz', image: URLMatchManagementAPI + '/images/teams/TSV_Schott_Mainz.png' },
  { label: 'TSV Steinbach', value: 'TSV_Steinbach', image: URLMatchManagementAPI + '/images/teams/TSV_Steinbach.svg' },
  { label: 'Union Berlin', value: 'Union_Berlin', image: URLMatchManagementAPI + '/images/teams/Union_Berlin.svg' },
  { label: 'Utrecht', value: 'Utrecht', image: URLMatchManagementAPI + '/images/teams/Utrecht.svg' },
  { label: 'VfL Osnabrück', value: 'VfL_Osnabrück', image: URLMatchManagementAPI + '/images/teams/VfL_Osnabrück.svg' },
  { label: 'Viktoria Pilsen', value: 'Viktoria_Pilsen', image: URLMatchManagementAPI + '/images/teams/Viktoria_Pilsen.svg' },
  { label: 'Werder Bremen', value: 'Werder_Bremen', image: URLMatchManagementAPI + '/images/teams/Werder_Bremen.svg' },
  { label: 'West Ham', value: 'West_Ham', image: URLMatchManagementAPI + '/images/teams/West_Ham.svg' },
  { label: 'Wolfsburg', value: 'Wolfsburg', image: URLMatchManagementAPI + '/images/teams/Wolfsburg.svg' }
]

const avatarImages = [
  { label: 'Abraham Simpson', value: 'Abraham_Simpson', avatar: URLMatchManagementAPI + '/images/avatars/collection/Abraham_Simpson.png' },
  { label: 'Alien', value: 'Alien', avatar: URLMatchManagementAPI + '/images/avatars/collection/Alien.png' },
  { label: 'Ariel', value: 'Ariel', avatar: URLMatchManagementAPI + '/images/avatars/collection/Ariel.png' },
  { label: 'Barney Gumble', value: 'Barney_Gumble', avatar: URLMatchManagementAPI + '/images/avatars/collection/Barney_Gumble.png' },
  { label: 'Bart Simpson', value: 'Bart_Simpson', avatar: URLMatchManagementAPI + '/images/avatars/collection/Bart_Simpson.png' },
  { label: 'Charlie Brown', value: 'Charlie_Brown', avatar: URLMatchManagementAPI + '/images/avatars/collection/Charlie_Brown.png' },
  { label: 'Charlie Chaplin', value: 'Charlie_Chaplin', avatar: URLMatchManagementAPI + '/images/avatars/collection/Charlie_Chaplin.png' },
  { label: 'Clancy Wiggum', value: 'Clancy_Wiggum', avatar: URLMatchManagementAPI + '/images/avatars/collection/Clancy_Wiggum.png' },
  { label: 'Cupid', value: 'Cupid', avatar: URLMatchManagementAPI + '/images/avatars/collection/Cupid.png' },
  { label: 'Doctor Strange', value: 'Doctor_Strange', avatar: URLMatchManagementAPI + '/images/avatars/collection/Doctor_Strange.png' },
  { label: 'Ed Sheeran', value: 'Ed_Sheeran', avatar: URLMatchManagementAPI + '/images/avatars/collection/Ed_Sheeran.png' },
  { label: 'Eeyore', value: 'Eeyore', avatar: URLMatchManagementAPI + '/images/avatars/collection/Eeyore.png' },
  { label: 'Elon Musk', value: 'Elon_Musk', avatar: URLMatchManagementAPI + '/images/avatars/collection/Elon_Musk.png' },
  { label: 'Fat Cat', value: 'Fat_Cat', avatar: URLMatchManagementAPI + '/images/avatars/collection/Fat_Cat.png' },
  { label: 'Garfield', value: 'Garfield', avatar: URLMatchManagementAPI + '/images/avatars/collection/Garfield.png' },
  { label: 'Hello Kitty', value: 'Hello_Kitty', avatar: URLMatchManagementAPI + '/images/avatars/collection/Hello_Kitty.png' },
  { label: 'Homer Simpson', value: 'Homer_Simpson', avatar: URLMatchManagementAPI + '/images/avatars/collection/Homer_Simpson.png' },
  { label: 'Ironman', value: 'Ironman', avatar: URLMatchManagementAPI + '/images/avatars/collection/Ironman.png' },
  { label: 'Jerry', value: 'Jerry', avatar: URLMatchManagementAPI + '/images/avatars/collection/Jerry.png' },
  { label: 'John Lennon', value: 'John_Lennon', avatar: URLMatchManagementAPI + '/images/avatars/collection/John_Lennon.png' },
  { label: 'Joker', value: 'Joker', avatar: URLMatchManagementAPI + '/images/avatars/collection/Joker.png' },
  { label: 'Krusty The Clown', value: 'Krusty_The_Clown', avatar: URLMatchManagementAPI + '/images/avatars/collection/Krusty_The_Clown.png' },
  { label: 'Linus', value: 'Linus', avatar: URLMatchManagementAPI + '/images/avatars/collection/Linus.png' },
  { label: 'Lisa Simpson', value: 'Lisa_Simpson', avatar: URLMatchManagementAPI + '/images/avatars/collection/Lisa_Simpson.png' },
  { label: 'Lucy', value: 'Lucy', avatar: URLMatchManagementAPI + '/images/avatars/collection/Lucy.png' },
  { label: 'Maggie Simpson', value: 'Maggie_Simpson', avatar: URLMatchManagementAPI + '/images/avatars/collection/Maggie_Simpson.png' },
  { label: 'Marcie', value: 'Marcie', avatar: URLMatchManagementAPI + '/images/avatars/collection/Marcie.png' },
  { label: 'Marge Simpson', value: 'Marge_Simpson', avatar: URLMatchManagementAPI + '/images/avatars/collection/Marge_Simpson.png' },
  { label: 'Marie', value: 'Marie', avatar: URLMatchManagementAPI + '/images/avatars/collection/Marie.png' },
  { label: 'Marilyn Monroe', value: 'Marilyn_Monroe', avatar: URLMatchManagementAPI + '/images/avatars/collection/Marilyn_Monroe.png' },
  { label: 'Messi', value: 'Messi', avatar: URLMatchManagementAPI + '/images/avatars/collection/Messi.png' },
  { label: 'Michael Jackson', value: 'Michael_Jackson', avatar: URLMatchManagementAPI + '/images/avatars/collection/Michael_Jackson.png' },
  { label: 'Mondtor01', value: 'Mondtor01', avatar: URLMatchManagementAPI + '/images/avatars/collection/Mondtor01.png' },
  { label: 'Mondtor02', value: 'Mondtor02', avatar: URLMatchManagementAPI + '/images/avatars/collection/Mondtor02.png' },
  { label: 'Mr Beans Teddy', value: 'Mr_Beans_Teddy', avatar: URLMatchManagementAPI + '/images/avatars/collection/Mr_Beans_Teddy.png' },
  { label: 'Mr Burns', value: 'Mr_Burns', avatar: URLMatchManagementAPI + '/images/avatars/collection/Mr_Burns.png' },
  { label: 'Ms Wicket', value: 'Ms_Wicket', avatar: URLMatchManagementAPI + '/images/avatars/collection/Ms_Wicket.png' },
  { label: 'Pelé', value: 'Pelé', avatar: URLMatchManagementAPI + '/images/avatars/collection/Pelé.png' },
  { label: 'Peppermint Patty', value: 'Peppermint_Patty', avatar: URLMatchManagementAPI + '/images/avatars/collection/Peppermint_Patty.png' },
  { label: 'Pile Of Poo', value: 'Pile_Of_Poo', avatar: URLMatchManagementAPI + '/images/avatars/collection/Pile_Of_Poo.png' },
  { label: 'Sally', value: 'Sally', avatar: URLMatchManagementAPI + '/images/avatars/collection/Sally.png' },
  { label: 'Santa', value: 'Santa', avatar: URLMatchManagementAPI + '/images/avatars/collection/Santa.png' },
  { label: 'Sea Calf', value: 'Sea_Calf', avatar: URLMatchManagementAPI + '/images/avatars/collection/Sea_Calf.png' },
  { label: 'Snoop Dogg', value: 'Snoop_Dogg', avatar: URLMatchManagementAPI + '/images/avatars/collection/Snoop_Dogg.png' },
  { label: 'Stan Marsh', value: 'Stan_Marsh', avatar: URLMatchManagementAPI + '/images/avatars/collection/Stan_Marsh.png' },
  { label: 'Sumo', value: 'Sumo', avatar: URLMatchManagementAPI + '/images/avatars/collection/Sumo.png' },
  { label: 'Super Mario', value: 'Super_Mario', avatar: URLMatchManagementAPI + '/images/avatars/collection/Super_Mario.png' },
  { label: 'Tom', value: 'Tom', avatar: URLMatchManagementAPI + '/images/avatars/collection/Tom.png' },
  { label: 'Tom Kid', value: 'Tom_Kid', avatar: URLMatchManagementAPI + '/images/avatars/collection/Tom_Kid.png' },
  { label: 'Tweety', value: 'Tweety', avatar: URLMatchManagementAPI + '/images/avatars/collection/Tweety.png' },
  { label: 'Woodstock', value: 'Woodstock', avatar: URLMatchManagementAPI + '/images/avatars/collection/Woodstock.png' }
]

export { serviceID }
export { templateID }
export { userID }
export { FromName }
export { OrderId1 }
export { OrderId2 }
export { URLMatchManagementAPI }
export { URLProperties }
export { URLOrderBasis }
export { getCookie }
export { setCookie }
export { getAdminCode }
export { getUserCode }
export { getLogo }
export { getAvatar }
export { getTeamImage }
export { getEventImage }
export { teamImages }
export { avatarImages }
