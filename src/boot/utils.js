const IsAdministrator = true
const Client = 'TEST'
const HomeTeam = 'Freiburg'

let URLMatch = 'https://script.google.com/macros/s/AKfycbzekarajVCLH-xMBkO7_M0D-MHV1e-2bvXfN-N8BJMaHsc_RhnZNTw4Ctt_4OOVwMLkBA/exec'
let URLParticipant = 'https://script.google.com/macros/s/AKfycby5QLG3Ri_vpENUrwSNtyBR3L8j_AR9_ly4eRKwTHSLaCdgFfPmnEuvPEKX085oJEAwlg/exec'
let URLParticipantArchive = 'https://script.google.com/macros/s/AKfycbwDcHzzr6JqZoENUjRAe1OXY3YCOLsqYMwVbDfdOlYFIjqNJ6lTWuVcYWh_wc99gsv_8A/exec'
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
  let teamImage = this.teamOptions.find(el => el.value === _team)?.image
  if (typeof teamImage === 'undefined') {
    teamImage = 'statics/teams/QuestionMark.png'
  }
  return teamImage
}

const getEventImage = function (_matchName) {
  if (_matchName.toLowerCase().indexOf('test') >= 0) return 'statics/teams/Test.png'
  return 'statics/teams/Event.png'
}

const teamOptions = [
  { label: 'Arminia', value: 'Arminia_Bielefeld', image: 'statics/teams/Arminia_Bielefeld.png' },
  { label: 'Augsburg', value: 'Augsburg', image: 'statics/teams/Augsburg.png' },
  { label: 'Bayern', value: 'Bayern_München', image: 'statics/teams/Bayern_München.png' },
  { label: 'Bochum', value: 'Bochum', image: 'statics/teams/Bochum.png' },
  { label: 'Braunschweig', value: 'Eintracht_Braunschweig', image: 'statics/teams/Eintracht_Braunschweig.png' },
  { label: 'Darmstadt', value: 'Darmstadt', image: 'statics/teams/Darmstadt.png' },
  { label: 'DFB Pokal', value: 'DFB_Pokal', image: 'statics/teams/DFB_Pokal.png' },
  { label: 'Dortmund', value: 'Borussia_Dortmund', image: 'statics/teams/Borussia_Dortmund.png' },
  { label: 'Frankfurt', value: 'Eintracht_Frankfurt', image: 'statics/teams/Eintracht_Frankfurt.png' },
  { label: 'Fortuna Düsseldorf', value: 'Fortuna_Düsseldorf', image: 'statics/teams/Fortuna_Düsseldorf.png' },
  { label: 'Freiburg', value: 'Freiburg', image: 'statics/teams/Freiburg.png' },
  { label: 'Greuther Fürth', value: 'Greuther_Fürth', image: 'statics/teams/Greuther_Fürth.png' },
  { label: 'Hamburger SV', value: 'Hamburger_SV', image: 'statics/teams/Hamburger_SV.png' },
  { label: 'Hannover', value: 'Hannover', image: 'statics/teams/Hannover.png' },
  { label: 'Hansa Rostock', value: 'Hansa_Rostock', image: 'statics/teams/Hansa_Rostock.png' },
  { label: 'Heidenheim', value: 'Heidenheim', image: 'statics/teams/Heidenheim.png' },
  { label: 'Hertha', value: 'Hertha', image: 'statics/teams/Hertha.png' },
  { label: 'Hoffenheim', value: 'Hoffenheim', image: 'statics/teams/Hoffenheim.png' },
  { label: 'Holstein', value: 'Holstein', image: 'statics/teams/Holstein.png' },
  { label: 'Jahn Regensburg', value: 'Jahn_Regensburg', image: 'statics/teams/Jahn_Regensburg.png' },
  { label: 'Juventus Turin', value: 'Juventus_Turin', image: 'statics/teams/Juventus_Turin.png' },
  { label: 'Kaiserslautern', value: 'Kaiserslautern', image: 'statics/teams/Kaiserslautern.png' },
  { label: 'Karlsruher', value: 'Karlsruher', image: 'statics/teams/Karlsruher.png' },
  { label: 'Köln', value: 'Köln', image: 'statics/teams/Köln.png' },
  { label: 'Leipzig', value: 'Leipzig', image: 'statics/teams/Leipzig.png' },
  { label: 'Leverkusen', value: 'Bayer_Leverkusen', image: 'statics/teams/Bayer_Leverkusen.png' },
  { label: 'Magdeburg', value: 'Magdeburg', image: 'statics/teams/Magdeburg.png' },
  { label: 'Mainz', value: 'Mainz', image: 'statics/teams/Mainz.png' },
  { label: 'Mönchengladbach', value: 'Borussia_Mönchengladbach', image: 'statics/teams/Borussia_Mönchengladbach.png' },
  { label: 'Nürnberg', value: 'Nürnberg', image: 'statics/teams/Nürnberg.png' },
  { label: 'Olympiakos Piräus', value: 'Olympiakos_Piräus', image: 'statics/teams/Olympiakos_Piräus.png' },
  { label: 'Paderborn', value: 'Paderborn', image: 'statics/teams/Paderborn.png' },
  { label: 'Sandhausen', value: 'Sandhausen', image: 'statics/teams/Sandhausen.png' },
  { label: 'Schalke', value: 'Schalke', image: 'statics/teams/Schalke.png' },
  { label: 'St. Pauli', value: 'St._Pauli', image: 'statics/teams/St._Pauli.png' },
  { label: 'Stuttgart', value: 'Stuttgart', image: 'statics/teams/Stuttgart.png' },
  { label: 'Union Berlin', value: 'Union_Berlin', image: 'statics/teams/Union_Berlin.png' },
  { label: 'Werder Bremen', value: 'Werder_Bremen', image: 'statics/teams/Werder_Bremen.png' },
  { label: 'Wolfsburg', value: 'Wolfsburg', image: 'statics/teams/Wolfsburg.png' }
]

const avatarOptions = [
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
  { label: 'Woodstock', value: 'Woodstock', avatar: 'statics/avatars/collection/Woodstock.png' }
]

export { IsAdministrator }
export { Client }
export { HomeTeam }
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
export { teamOptions }
export { avatarOptions }
