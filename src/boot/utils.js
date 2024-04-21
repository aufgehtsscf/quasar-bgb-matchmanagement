const IsAdministrator = true
const ApplicationCode = 'NGdoLbyd_330'
const ClientName = 'BGB'

const Email = 'aufgehtsscf@gmail.com'
const HomeTeam = 'Freiburg'
const HomeTeamAlias = 'SCF'
const StandardText = 'Wer reserviert Plätze (<HH>:<MM>): <WHO_RESERVES_PLACES>'
const TitleUrl1 = 'Homepage'
const CaptionUrl1 = ''
const LinkUrl1 = ''
const TitleUrl2 = 'Email'
const CaptionUrl2 = 'aufgehtsscf@gmail.com'
const LinkUrl2 = 'mailto:aufgehtsscf@gmail.com'
const TitleUrl3 = 'Facebook'
const CaptionUrl3 = 'facebook.com/aufgehtsscf'
const LinkUrl3 = 'https://www.facebook.com/profile.php?id=100094586599908'
const TitleUrl4 = 'Twitter'
const CaptionUrl4 = ''
const LinkUrl4 = ''
const TitleUrl5 = 'Instagram'
const CaptionUrl5 = 'instagram.com/aufgehtsscf'
const LinkUrl5 = 'https://www.instagram.com/aufgehtsscf/'

// emailjs
const serviceID = 'service_1z8boq8'
const templateID = 'template_uc9j4dn'
const userID = 'z6CsuBOLcuYCsxNiZ'
const FromName = 'Auf geht\'s SCF'

// Orders
const OrderId1 = 'd1f60978-f743-4b6e-88f1-ac7aa7885d2b'
const OrderId2 = '8f26f0ad-d9d3-4c33-b1c9-f0560ee3ea11'

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
  if (_cookieName === 'clientName') return ClientName
  if (_cookieName === 'email') return Email
  if (_cookieName === 'homeTeam') return HomeTeam
  if (_cookieName === 'homeTeamAlias') return HomeTeamAlias
  if (_cookieName === 'standardText') return StandardText
  if (_cookieName === 'titleUrl1') return TitleUrl1
  if (_cookieName === 'captionUrl1') return CaptionUrl1
  if (_cookieName === 'linkUrl1') return LinkUrl1
  if (_cookieName === 'titleUrl2') return TitleUrl2
  if (_cookieName === 'captionUrl2') return CaptionUrl2
  if (_cookieName === 'linkUrl2') return LinkUrl2
  if (_cookieName === 'titleUrl3') return TitleUrl3
  if (_cookieName === 'captionUrl3') return CaptionUrl3
  if (_cookieName === 'linkUrl3') return LinkUrl3
  if (_cookieName === 'titleUrl4') return TitleUrl4
  if (_cookieName === 'captionUrl4') return CaptionUrl4
  if (_cookieName === 'linkUrl4') return LinkUrl4
  if (_cookieName === 'titleUrl5') return TitleUrl5
  if (_cookieName === 'captionUrl5') return CaptionUrl5
  if (_cookieName === 'linkUrl5') return LinkUrl5
}

const setCookie = function (_isAdministrator, _applicationCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5, _updatedOn) {
  const d = new Date()
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000))
  const _expires = 'expires=' + d.toUTCString()
  document.cookie = 'isAdministrator=' + _isAdministrator + ';' + _expires + '";path=/'
  document.cookie = 'applicationCode=' + _applicationCode + ';' + _expires + '";path=/'
  document.cookie = 'clientName=' + _clientName + ';' + _expires + '";path=/'
  document.cookie = 'email=' + _email + ';' + _expires + '";path=/'
  document.cookie = 'homeTeam=' + _homeTeam + ';' + _expires + '";path=/'
  document.cookie = 'homeTeamAlias=' + _homeTeamAlias + ';' + _expires + '";path=/'
  document.cookie = 'standardText=' + _standardText + ';' + _expires + '";path=/'
  document.cookie = 'titleUrl1=' + _titleUrl1 + ';' + _expires + '";path=/'
  document.cookie = 'captionUrl1=' + _captionUrl1 + ';' + _expires + '";path=/'
  document.cookie = 'linkUrl1=' + _linkUrl1 + ';' + _expires + '";path=/'
  document.cookie = 'titleUrl2=' + _titleUrl2 + ';' + _expires + '";path=/'
  document.cookie = 'captionUrl2=' + _captionUrl2 + ';' + _expires + '";path=/'
  document.cookie = 'linkUrl2=' + _linkUrl2 + ';' + _expires + '";path=/'
  document.cookie = 'titleUrl3=' + _titleUrl3 + ';' + _expires + '";path=/'
  document.cookie = 'captionUrl3=' + _captionUrl3 + ';' + _expires + '";path=/'
  document.cookie = 'linkUrl3=' + _linkUrl3 + ';' + _expires + '";path=/'
  document.cookie = 'titleUrl4=' + _titleUrl4 + ';' + _expires + '";path=/'
  document.cookie = 'captionUrl4=' + _captionUrl4 + ';' + _expires + '";path=/'
  document.cookie = 'linkUrl4=' + _linkUrl4 + ';' + _expires + '";path=/'
  document.cookie = 'titleUrl5=' + _titleUrl5 + ';' + _expires + '";path=/'
  document.cookie = 'captionUrl5=' + _captionUrl5 + ';' + _expires + '";path=/'
  document.cookie = 'linkUrl5=' + _linkUrl5 + ';' + _expires + '";path=/'
  document.cookie = 'updatedOn=' + _updatedOn + ';' + _expires + '";path=/'
}

const getAdminCode = function (_applicationCode) {
  let _adminCode = ''

  if (_applicationCode === 'TEST') {
    return '3Test2tseT9'
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
  return 'statics/images/' + _adminCode + '/Logo.png'
}

const getAvatar = function (_adminCode, _avatar, _customized) {
  if (_avatar === '') return 'statics/avatars/collection/Placeholder.png'
  else if (_customized) return 'statics/avatars/' + _adminCode + '/' + _avatar + '.png'
  else return 'statics/avatars/collection/' + _avatar + '.png'
}

const getTeamImage = function (_team) {
  let teamImage = this.teamImages.find(el => el.value === _team)?.image
  if (typeof teamImage === 'undefined') {
    teamImage = 'statics/teams/QuestionMark.png'
  }
  return teamImage
}

const getEventImage = function (_matchName) {
  if (_matchName.toLowerCase().indexOf('test') >= 0) return 'statics/teams/Test.png'
  return 'statics/teams/Event.png'
}

const teamImages = [
  { label: 'Arminia', value: 'Arminia_Bielefeld', image: 'statics/teams/Arminia_Bielefeld.png' },
  { label: 'Augsburg', value: 'Augsburg', image: 'statics/teams/Augsburg.png' },
  { label: 'Backa Topola', value: 'Backa_Topola', image: 'statics/teams/Backa_Topola.png' },
  { label: 'Bayern', value: 'Bayern_München', image: 'statics/teams/Bayern_München.png' },
  { label: 'Bochum', value: 'Bochum', image: 'statics/teams/Bochum.png' },
  { label: 'Braunschweig', value: 'Eintracht_Braunschweig', image: 'statics/teams/Eintracht_Braunschweig.png' },
  { label: 'Darmstadt', value: 'Darmstadt', image: 'statics/teams/Darmstadt.png' },
  { label: 'DFB Pokal', value: 'DFB_Pokal', image: 'statics/teams/DFB_Pokal.png' },
  { label: 'Dortmund', value: 'Borussia_Dortmund', image: 'statics/teams/Borussia_Dortmund.png' },
  { label: 'Europa League', value: 'Europa_League', image: 'statics/teams/Europa_League.png' },
  { label: 'Frankfurt', value: 'Eintracht_Frankfurt', image: 'statics/teams/Eintracht_Frankfurt.png' },
  { label: 'Fortuna Düsseldorf', value: 'Fortuna_Düsseldorf', image: 'statics/teams/Fortuna_Düsseldorf.png' },
  { label: 'Freiburg', value: 'Freiburg', image: 'statics/teams/Freiburg.svg' },
  { label: 'Greuther Fürth', value: 'Greuther_Fürth', image: 'statics/teams/Greuther_Fürth.png' },
  { label: 'Hamburger SV', value: 'Hamburger_SV', image: 'statics/teams/Hamburger_SV.png' },
  { label: 'Hannover', value: 'Hannover', image: 'statics/teams/Hannover.png' },
  { label: 'Hansa Rostock', value: 'Hansa_Rostock', image: 'statics/teams/Hansa_Rostock.png' },
  { label: 'Heidenheim', value: 'Heidenheim', image: 'statics/teams/Heidenheim.png' },
  { label: 'Hertha', value: 'Hertha', image: 'statics/teams/Hertha.png' },
  { label: 'Hoffenheim', value: 'Hoffenheim', image: 'statics/teams/Hoffenheim.svg' },
  { label: 'Holstein', value: 'Holstein', image: 'statics/teams/Holstein.png' },
  { label: 'Jahn Regensburg', value: 'Jahn_Regensburg', image: 'statics/teams/Jahn_Regensburg.png' },
  { label: 'Juventus Turin', value: 'Juventus_Turin', image: 'statics/teams/Juventus_Turin.png' },
  { label: 'Kaiserslautern', value: 'Kaiserslautern', image: 'statics/teams/Kaiserslautern.png' },
  { label: 'Karlsruher', value: 'Karlsruher', image: 'statics/teams/Karlsruher.png' },
  { label: 'Köln', value: 'Köln', image: 'statics/teams/Köln.svg' },
  { label: 'Leipzig', value: 'Leipzig', image: 'statics/teams/Leipzig.png' },
  { label: 'RC Lens', value: 'Lens', image: 'statics/teams/Lens.svg' },
  { label: 'Leverkusen', value: 'Bayer_Leverkusen', image: 'statics/teams/Bayer_Leverkusen.png' },
  { label: 'Magdeburg', value: 'Magdeburg', image: 'statics/teams/Magdeburg.png' },
  { label: 'Mainz', value: 'Mainz', image: 'statics/teams/Mainz.png' },
  { label: 'Mönchengladbach', value: 'Borussia_Mönchengladbach', image: 'statics/teams/Borussia_Mönchengladbach.png' },
  { label: 'Nürnberg', value: 'Nürnberg', image: 'statics/teams/Nürnberg.png' },
  { label: 'Oberachern', value: 'Oberachern', image: 'statics/teams/Oberachern.png' },
  { label: 'Olympiakos Piräus', value: 'Olympiakos_Piräus', image: 'statics/teams/Olympiakos_Piräus.png' },
  { label: 'Paderborn', value: 'Paderborn', image: 'statics/teams/Paderborn.png' },
  { label: 'Sandhausen', value: 'Sandhausen', image: 'statics/teams/Sandhausen.png' },
  { label: 'Schalke', value: 'Schalke', image: 'statics/teams/Schalke.png' },
  { label: 'St. Pauli', value: 'St._Pauli', image: 'statics/teams/St._Pauli.png' },
  { label: 'Stuttgart', value: 'Stuttgart', image: 'statics/teams/Stuttgart.png' },
  { label: 'Union Berlin', value: 'Union_Berlin', image: 'statics/teams/Union_Berlin.svg' },
  { label: 'Werder Bremen', value: 'Werder_Bremen', image: 'statics/teams/Werder_Bremen.png' },
  { label: 'West Ham', value: 'West_Ham', image: 'statics/teams/West_Ham.png' },
  { label: 'Wolfsburg', value: 'Wolfsburg', image: 'statics/teams/Wolfsburg.png' }
]

const avatarImages = [
  { label: 'Abraham Simpson', value: 'Abraham_Simpson', avatar: 'statics/avatars/collection/Abraham_Simpson.png' },
  { label: 'Alien', value: 'Alien', avatar: 'statics/avatars/collection/Alien.png' },
  { label: 'Ariel', value: 'Ariel', avatar: 'statics/avatars/collection/Ariel.png' },
  { label: 'Barney Gumble', value: 'Barney_Gumble', avatar: 'statics/avatars/collection/Barney_Gumble.png' },
  { label: 'Bart Simpson', value: 'Bart_Simpson', avatar: 'statics/avatars/collection/Bart_Simpson.png' },
  { label: 'Charlie Brown', value: 'Charlie_Brown', avatar: 'statics/avatars/collection/Charlie_Brown.png' },
  { label: 'Charlie Chaplin', value: 'Charlie_Chaplin', avatar: 'statics/avatars/collection/Charlie_Chaplin.png' },
  { label: 'Clancy Wiggum', value: 'Clancy_Wiggum', avatar: 'statics/avatars/collection/Clancy_Wiggum.png' },
  { label: 'Cupid', value: 'Cupid', avatar: 'statics/avatars/collection/Cupid.png' },
  { label: 'Doctor Strange', value: 'Doctor_Strange', avatar: 'statics/avatars/collection/Doctor_Strange.png' },
  { label: 'Ed Sheeran', value: 'Ed_Sheeran', avatar: 'statics/avatars/collection/Ed_Sheeran.png' },
  { label: 'Eeyore', value: 'Eeyore', avatar: 'statics/avatars/collection/Eeyore.png' },
  { label: 'Elon Musk', value: 'Elon_Musk', avatar: 'statics/avatars/collection/Elon_Musk.png' },
  { label: 'Fat Cat', value: 'Fat_Cat', avatar: 'statics/avatars/collection/Fat_Cat.png' },
  { label: 'Garfield', value: 'Garfield', avatar: 'statics/avatars/collection/Garfield.png' },
  { label: 'Hello Kitty', value: 'Hello_Kitty', avatar: 'statics/avatars/collection/Hello_Kitty.png' },
  { label: 'Homer Simpson', value: 'Homer_Simpson', avatar: 'statics/avatars/collection/Homer_Simpson.png' },
  { label: 'Ironman', value: 'Ironman', avatar: 'statics/avatars/collection/Ironman.png' },
  { label: 'Jerry', value: 'Jerry', avatar: 'statics/avatars/collection/Jerry.png' },
  { label: 'John Lennon', value: 'John_Lennon', avatar: 'statics/avatars/collection/John_Lennon.png' },
  { label: 'Joker', value: 'Joker', avatar: 'statics/avatars/collection/Joker.png' },
  { label: 'Krusty The Clown', value: 'Krusty_The_Clown', avatar: 'statics/avatars/collection/Krusty_The_Clown.png' },
  { label: 'Linus', value: 'Linus', avatar: 'statics/avatars/collection/Linus.png' },
  { label: 'Lisa Simpson', value: 'Lisa_Simpson', avatar: 'statics/avatars/collection/Lisa_Simpson.png' },
  { label: 'Lucy', value: 'Lucy', avatar: 'statics/avatars/collection/Lucy.png' },
  { label: 'Maggie Simpson', value: 'Maggie_Simpson', avatar: 'statics/avatars/collection/Maggie_Simpson.png' },
  { label: 'Marcie', value: 'Marcie', avatar: 'statics/avatars/collection/Marcie.png' },
  { label: 'Marge Simpson', value: 'Marge_Simpson', avatar: 'statics/avatars/collection/Marge_Simpson.png' },
  { label: 'Marie', value: 'Marie', avatar: 'statics/avatars/collection/Marie.png' },
  { label: 'Marilyn Monroe', value: 'Marilyn_Monroe', avatar: 'statics/avatars/collection/Marilyn_Monroe.png' },
  { label: 'Messi', value: 'Messi', avatar: 'statics/avatars/collection/Messi.png' },
  { label: 'Michael Jackson', value: 'Michael_Jackson', avatar: 'statics/avatars/collection/Michael_Jackson.png' },
  { label: 'Mondtor01', value: 'Mondtor01', avatar: 'statics/avatars/collection/Mondtor01.png' },
  { label: 'Mondtor02', value: 'Mondtor02', avatar: 'statics/avatars/collection/Mondtor02.png' },
  { label: 'Mr Beans Teddy', value: 'Mr_Beans_Teddy', avatar: 'statics/avatars/collection/Mr_Beans_Teddy.png' },
  { label: 'Mr Burns', value: 'Mr_Burns', avatar: 'statics/avatars/collection/Mr_Burns.png' },
  { label: 'Ms Wicket', value: 'Ms_Wicket', avatar: 'statics/avatars/collection/Ms_Wicket.png' },
  { label: 'Pelé', value: 'Pelé', avatar: 'statics/avatars/collection/Pelé.png' },
  { label: 'Peppermint Patty', value: 'Peppermint_Patty', avatar: 'statics/avatars/collection/Peppermint_Patty.png' },
  { label: 'Pile Of Poo', value: 'Pile_Of_Poo', avatar: 'statics/avatars/collection/Pile_Of_Poo.png' },
  { label: 'Sally', value: 'Sally', avatar: 'statics/avatars/collection/Sally.png' },
  { label: 'Santa', value: 'Santa', avatar: 'statics/avatars/collection/Santa.png' },
  { label: 'Sea Calf', value: 'Sea_Calf', avatar: 'statics/avatars/collection/Sea_Calf.png' },
  { label: 'Snoop Dogg', value: 'Snoop_Dogg', avatar: 'statics/avatars/collection/Snoop_Dogg.png' },
  { label: 'Stan Marsh', value: 'Stan_Marsh', avatar: 'statics/avatars/collection/Stan_Marsh.png' },
  { label: 'Sumo', value: 'Sumo', avatar: 'statics/avatars/collection/Sumo.png' },
  { label: 'Super Mario', value: 'Super_Mario', avatar: 'statics/avatars/collection/Super_Mario.png' },
  { label: 'Tom', value: 'Tom', avatar: 'statics/avatars/collection/Tom.png' },
  { label: 'Tom Kid', value: 'Tom_Kid', avatar: 'statics/avatars/collection/Tom_Kid.png' },
  { label: 'Tweety', value: 'Tweety', avatar: 'statics/avatars/collection/Tweety.png' },
  { label: 'Woodstock', value: 'Woodstock', avatar: 'statics/avatars/collection/Woodstock.png' }
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
