import { AppDataSource } from '../data-source'
import { Team } from '../entities/Team'
import { User, UserJobs, UserRoles } from '../entities/User'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'
import { validateDate } from '../utils/validateDate'
import { validateName } from '../utils/validateName'
import { validateTruthyNotEmptyString } from '../utils/validateTruthyNotEmptyString'
import { coachRepository } from './coach.repository'
import { teamRepository } from './team.repository'
import { teamMemberRepository } from './teamMember.repository'

export const userRepository = AppDataSource.getRepository(User).extend({
  async users(isDeleted?: number) {
    let users: User[] = []
    if (isDeleted in IsDeleted) {
      users = await userRepository.find({
        where: {
          is_deleted: isDeleted
        },
        relations: {
          team_member: true,
          coach: true
        }
      })
    }
    users = await userRepository.find({
      relations: {
        team_member: true,
        coach: true
      }
    })
    if (users.length === 0) return 0
    return users
  },

  async findById(id: number | string, role: string) {
    let foundUser: User
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    if (!validateTruthyNotEmptyString(role)) return 0
    if (role === UserRoles.USER) {
      foundUser = await userRepository.findOne({
        where: {
          user_id: checkedId,
          role: UserRoles.USER
        },
        relations: {
          team_member: true,
          coach: true
        }
      })
    }
    if (role === UserRoles.EDITOR) {
      foundUser = await userRepository.findOne({
        where: {
          user_id: checkedId,
          role: UserRoles.EDITOR
        },
        relations: {
          team_member: true,
          coach: true
        }
      })
    }
    if (role === UserRoles.ADMIN) {
      foundUser = await userRepository.findOne({
        where: {
          user_id: checkedId,
          role: UserRoles.ADMIN
        },
        relations: {
          team_member: true,
          coach: true
        }
      })
    }

    if (!foundUser) return 0
    return foundUser
  },

  async findUsersByFirstName(first_name: string) {
    let users: User[] = []
    if (null === first_name || undefined === first_name) return []
    users = await userRepository.find({
      where: { first_name: first_name },
      relations: { team_member: true, coach: true }
    })
    if (users.length === 0) return []
    return users
  },

  async findUsersByLastName(last_name: string) {
    let users: User[] = []
    if (null === last_name || undefined === last_name) return 0
    users = await userRepository.find({
      where: { last_name: last_name },
      relations: { team_member: true, coach: true }
    })
    if (users.length === 0) return 0
    return users
  },
  async findUsersByFullName(first_name: string, last_name: string) {
    let users: User[] = []
    if (
      null === first_name ||
      undefined === first_name ||
      null === last_name ||
      undefined === last_name
    )
      return 0
    users = await userRepository.find({
      where: {
        first_name: first_name,
        last_name: last_name
      },
      relations: {
        team_member: true,
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
        where: { user_id: checkedId }
      })
      if (!user) return 0
      return await userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({
          is_deleted: IsDeleted.DELETED,
          delete_date: () => 'GETDATE()'
        })
        .where('user.user_id = :checkedId', { checkedId })
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
        where: { user_id: checkedId }
      })
      if (!user) return 0
      return await userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('user.user_id = :checkedId', { checkedId })
        .execute()
    } catch (error) {
      console.log(error)
    }
  },
  async createUser(
    first_name: string,
    last_name: string,
    role: string,
    dob: string,
    job?: string,
    salary?: string,
    teamToCoach?: string,
    teamToJoin?: string
  ) {
    let firstName = ''
    let lastName = ''
    let roleToUse = ''
    let dobToUse = ''
    let jobToUse = ''
    let ageToUse = 0
    if (!validateTruthyNotEmptyString(firstName)) return 0
    if (first_name !== '') {
      if (!validateName(first_name)) return 0
      firstName = first_name
    }

    if (!validateTruthyNotEmptyString(lastName)) return 0
    if (last_name !== '') {
      if (!validateName(last_name)) return 0
      lastName = last_name
    }
    if (!validateTruthyNotEmptyString(role)) return 0
    if (role !== '') {
      if (!(role in UserRoles)) return 0
      roleToUse = role
    }
    if (!validateTruthyNotEmptyString(dob)) return 0
    if (dob !== '') {
      if (!validateDate(dob)) return 0
      dobToUse = dob
      ageToUse = new Date().getFullYear() - parseInt(dob.split('-')[0])
    }
    if (!validateTruthyNotEmptyString(job)) return 0
    if (job !== '') {
      if (!(job in UserJobs)) return 0
      if (!validateTruthyNotEmptyString(salary) || !salary || salary === '')
        return 0
      let salaryToUse = parseFloat(salary)
      if (job === UserJobs.COACH) {
        if (
          !teamToCoach ||
          !validateTruthyNotEmptyString(teamToCoach) ||
          teamToCoach === ''
        )
          return 0
        let checkedTeamToCoach = await teamRepository.findTeamByName(
          teamToCoach
        )
        if (checkedTeamToCoach === 0) return 0

        const newUser = userRepository.create({
          first_name: firstName,
          last_name: lastName,
          role: roleToUse,
          dob: dobToUse,
          age: ageToUse,
          job: jobToUse
        })

        await userRepository.save(newUser)

        const newCoach = coachRepository.create({
          user: newUser,
          salary: salaryToUse,
          team: checkedTeamToCoach as Team
        })
        await coachRepository.save(newCoach)
      }
      if (job === UserJobs.TEAMMEMBER) {
        if (
          !teamToJoin ||
          !validateTruthyNotEmptyString(teamToJoin) ||
          teamToJoin === ''
        )
          return 0
        let checkedTeamToJoin = await teamRepository.findTeamByName(teamToJoin)
        if (checkedTeamToJoin === 0) return 0

        const newUser = userRepository.create({
          first_name: firstName,
          last_name: lastName,
          role: roleToUse,
          dob: dobToUse,
          age: ageToUse,
          job: jobToUse
        })
        await userRepository.save(newUser)
        const newTeamMember = teamMemberRepository.create({
          user: newUser,
          salary: salaryToUse,
          team: checkedTeamToJoin as Team
        })
        await teamMemberRepository.save(newTeamMember)
      }
    }
    jobToUse = UserJobs.GUEST
    const newUser = userRepository.create({
      first_name: firstName,
      last_name: lastName,
      role: roleToUse,
      dob: dobToUse,
      age: ageToUse,
      job: jobToUse
    })
    return await userRepository.save(newUser)
  }
})
