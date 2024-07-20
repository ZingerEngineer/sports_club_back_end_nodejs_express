import { AppDataSource } from '../services/data-source'
import { User } from '../entities/User'
import { IsDeleted } from '../enums/globalEnums'
import { checkIdValidity } from '../utils/checkIdValidity'
import { coachRepository } from './coach.repository'
import { teamRepository } from './team.repository'
import { teamMemberRepository } from './teamMember.repository'
import {
  UserRoles,
  UserJobs,
  UserGenders,
  UserEmailVerificationState
} from '../enums/user.enums'
import { Session } from '../entities/Session'

export const userRepository = AppDataSource.getRepository(User).extend({
  async findUsers() {
    try {
      return await userRepository.find({
        relations: {
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async findUserById(id: number) {
    try {
      return await userRepository.findOne({
        where: {
          userId: id
        },
        relations: {
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async findUsersByFirstName(firstName: string) {
    try {
      return await userRepository.find({
        where: { firstName: firstName },
        relations: { teamMembers: true, coach: true }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async findUserByEmail(email: string) {
    try {
      return await userRepository.findOne({
        where: { email },
        relations: { teamMembers: true, coach: true }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async findUserByPhone(phone: string) {
    try {
      return await userRepository.findOne({
        where: { phone },
        relations: { teamMembers: true, coach: true }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async findUsersByLastName(lastName: string) {
    try {
      return await userRepository.find({
        where: { lastName: lastName },
        relations: { teamMembers: true, coach: true }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async findUsersByFullName(firstName: string, lastName: string) {
    try {
      return await userRepository.find({
        where: {
          firstName: firstName,
          lastName: lastName
        },
        relations: {
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async softDeleteUserById(id: number) {
    try {
      const user = await userRepository.find({
        where: { userId: id }
      })
      if (!user) return null
      return await userRepository
        .createQueryBuilder('user')
        .update(User)
        .set({
          isDeleted: IsDeleted.DELETED,
          deletedAt: () => 'GETDATE()'
        })
        .where('user.userId = :checkedId', { id })
        .execute()
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async hardDeleteUserById(id: number) {
    try {
      const user = await userRepository.find({
        where: { userId: id }
      })
      if (!user) return null
      return await userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('user.userId = :checkedId', { checkedId: id })
        .execute()
    } catch (error) {
      console.log(error)
      return null
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
  },
  async makeUserEmailVertified(userId: string, userEmail: string) {
    userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({
        emailVerified: UserEmailVerificationState.VERIFIED
      })
      .where('user.userEmail = :userEmail', { userEmail })
      .andWhere('user.userId = :userId', { userId })
      .execute()
  }
})
