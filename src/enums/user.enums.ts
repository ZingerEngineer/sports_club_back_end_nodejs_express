enum UserRoles {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user'
}

enum UserJobs {
  GUEST = 'guest',
  TEAMMEMBER = 'team_member',
  COACH = 'coach'
}

enum UserGenders {
  MALE = 'Male',
  FEMALE = 'Female'
}

enum UserLogStatus {
  LOGGEDIN = 'loggedIn',
  LOGGEDOUT = 'loggedOut',
  BANNED = 'banned'
}

export { UserRoles, UserJobs, UserGenders, UserLogStatus }
