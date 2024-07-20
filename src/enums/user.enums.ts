enum UserRoles {
  ADMIN = 0,
  USER = 1
}

enum UserJobs {
  GUEST = 0,
  TEAMMEMBER = 1,
  COACH = 2
}

enum UserGenders {
  MALE = 0,
  FEMALE = 1
}

enum UserLogStatus {
  LOGGEDIN = 0,
  LOGGEDOUT = 1,
  BANNED = 2
}

enum UserEmailVerificationState {
  VERIFIED = 1,
  UNVERIFIED = 0
}

export {
  UserRoles,
  UserJobs,
  UserGenders,
  UserLogStatus,
  UserEmailVerificationState
}
