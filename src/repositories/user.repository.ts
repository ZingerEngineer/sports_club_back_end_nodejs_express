import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'
import { coachRepository } from './coach.repository'
import { teamRepository } from './team.repository'
import { teamMemberRepository } from './teamMember.repository'
import { UserRoles, UserJobs, UserGenders } from '../enums/user.enums'
import { Session } from '../entities/Session'

export const userRepository = AppDataSource.getRepository(User).extend({
  async findUsers(isDeleted?: IsDeleted) {
    let users: User[]
    if (isDeleted in IsDeleted) {
      users = await userRepository.find({
        where: {
          isDeleted: isDeleted
        },
        relations: {
          teamMembers: true,
          coach: true
        }
      })
    }
    users = await userRepository.find({
      relations: {
        teamMembers: true,
        coach: true
      }
    })
    if (users.length === 0) return null
    return users
  },

  async findById(id: number) {
    let user: User
    user = await userRepository.findOne({
      where: {
        userId: id
      }
    })
    if (!user) return null
    return user
  },

  async findUsersByFirstName(firstName: string) {
    let users: User[] = []
    if (null === firstName || undefined === firstName) return []
    users = await userRepository.find({
      where: { firstName: firstName },
      relations: { teamMembers: true, coach: true }
    })
    if (users.length === 0) return []
    return users
  },
  async findUserByEmail(email: string) {
    let user: User
    user = await userRepository.findOne({
      where: { email },
      relations: { teamMembers: true, coach: true }
    })
    if (!user) return null
    return user
  },

  async findUserByPhone(phone: string) {
    let user: User
    user = await userRepository.findOne({
      where: { phone },
      relations: { teamMembers: true, coach: true }
    })
    if (!user) return null
    return user
  },

  async findUsersByLastName(lastName: string) {
    let users: User[] = []
    if (null === lastName || undefined === lastName) return 0
    users = await userRepository.find({
      where: { lastName: lastName },
      relations: { teamMembers: true, coach: true }
    })
    if (users.length === 0) return 0
    return users
  },
  async findUsersByFullName(firstName: string, lastName: string) {
    let users: User[] = []
    if (
      null === firstName ||
      undefined === firstName ||
      null === lastName ||
      undefined === lastName
    )
      return 0
    users = await userRepository.find({
      where: {
        firstName: firstName,
        lastName: lastName
      },
      relations: {
        teamMembers: true,
        coach: true
      }
    })
    if (users.length === 0) return 0
    return users
  },
  async softDeleteUserById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const checkedId = checkRes.id
      const user = await userRepository.find({
        where: { userId: checkedId }
      })
      if (!user) return 0
      return await userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETDATE()'
        })
        .where('user.userId = :checkedId', { checkedId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },

  async hardDeleteUserById(id: string | number) {
    try {
      const checkRes = checkIdValidity(id)
      if (checkRes === 0) return 0
      const checkedId = checkRes.id
      const user = await userRepository.find({
        where: { userId: checkedId }
      })
      if (!user) return 0
      return await userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('user.userId = :checkedId', { checkedId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },
  async updateUserSessionId(id: number, session: Session) {
    try {
      const user = await userRepository.find({
        where: { userId: id }
      })
      if (!user) return null
      return await userRepository
        .createQueryBuilder('user')
        .update()
        .set({ session: session })
        .where('user.userId = :id', { id })
        .execute()
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async createUser(
    firstName: string,
    lastName: string,
    gender: UserGenders,
    email: string,
    phone: string,
    password: string,
    role: UserRoles,
    dob: string,
    job?: UserJobs,
    salary?: number,
    teamToCoach?: string,
    teamToJoin?: string
  ) {
    const ageToUse = new Date().getFullYear() - parseInt(dob.split('-')[0])
    if (salary) {
      if (job === UserJobs.COACH) {
        let checkedTeamToCoach = await teamRepository.findTeamByName(
          teamToCoach
        )
        if (!checkedTeamToCoach) return null

        const newUser = userRepository.create({
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          email: email,
          phone: phone,
          password: password,
          role: role,
          dob: dob,
          age: ageToUse,
          job: job
        })

        const savedUser = await userRepository.save(newUser)

        const newCoach = coachRepository.create({
          user: savedUser,
          team: checkedTeamToCoach,
          salary: salary
        })
        await coachRepository.save(newCoach)
      }
      if (job === UserJobs.TEAMMEMBER) {
        let checkedTeamToJoin = await teamRepository.findTeamByName(teamToJoin)
        if (!checkedTeamToJoin) return null

        const newUser = userRepository.create({
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          email: email,
          phone: phone,
          password: password,
          role: role,
          dob: dob,
          age: ageToUse,
          job: job
        })
        const savedUser = await userRepository.save(newUser)
        const newTeamMember = teamMemberRepository.create({
          user: savedUser,
          salary: salary,
          team: checkedTeamToJoin
        })
        await teamMemberRepository.save(newTeamMember)
      }
    }
    const newUser = userRepository.create({
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      email: email,
      phone: phone,
      password: password,
      role: role,
      dob: dob,
      age: ageToUse,
      job: UserJobs.GUEST
    })
    return await userRepository.save(newUser)
  }
})
