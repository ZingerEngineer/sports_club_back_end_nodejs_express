import { userRepository } from '../repositories/user.repository'
import { UserJobs, UserRoles } from '../entities/User'
import { IsDeleted } from '../enums/globalEnums'

export class UserDaos {
  async findAllUsers() {
    return await userRepository.users()
  }

  async findAvailableUsers(isDeleted: IsDeleted.EXISTS) {
    return await userRepository.users(isDeleted)
  }

  async findDeletedUsers(isDeleted: IsDeleted.DELETED) {
    return await userRepository.users(isDeleted)
  }

  async findUserById(id: string | number, role: UserRoles.USER) {
    return await userRepository.findById(id, role)
  }
  async findEditorById(id: string | number, role: UserRoles.EDITOR) {
    return await userRepository.findById(id, role)
  }
  async findAdminById(id: string | number, role: UserRoles.ADMIN) {
    return await userRepository.findById(id, role)
  }

  async findUsersByFirstName(firstName: string) {
    return userRepository.findUsersByFirstName(firstName)
  }

  async findUsersByLastName(lastName: string) {
    return userRepository.findUsersByLastName(lastName)
  }

  async findUsersByFullName(firstName: string, lastName: string) {
    return userRepository.findUsersByFullName(firstName, lastName)
  }

  async softDeleteUserById(id: string | number) {
    return await userRepository.softDeleteUserById(id)
  }

  async hardDeleteUserById(id: string | number) {
    return await userRepository.hardDeleteUserById(id)
  }

  async createUser(
    firstName: string,
    lastName: string,
    role: string,
    dob: string
  ) {
    return await userRepository.createUser(firstName, lastName, role, dob)
  }

  async createUserCoach(
    firstName: string,
    lastName: string,
    role: string,
    dob: string,
    job: UserJobs.COACH,
    salary: string,
    teamToCoach: string,
    teamToJoin: undefined
  ) {
    return await userRepository.createUser(
      firstName,
      lastName,
      role,
      dob,
      job,
      salary,
      teamToCoach,
      teamToJoin
    )
  }

  async createUserTeamMember(
    firstName: string,
    lastName: string,
    role: string,
    dob: string,
    job: UserJobs.COACH,
    salary: string,
    teamToCoach: undefined,
    teamToJoin: string
  ) {
    return await userRepository.createUser(
      firstName,
      lastName,
      role,
      dob,
      job,
      salary,
      teamToCoach,
      teamToJoin
    )
  }
}
