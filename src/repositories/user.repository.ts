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
import { Team } from '../entities/Team'
import { Repository, Entity, ObjectLiteral } from 'typeorm'
import { TeamMember } from '../entities/TeamMember'
import { Coach } from '../entities/Coach'

interface UserData {
  firstName: string
  lastName: string
  gender: number
  email: string
  phone: string
  password: string
  role: number
  dob: string
  age: number
}

const createJobUser = async (
  job: number,
  teamNameRelatingUserJob: string,
  repoRelatingUserCreation: Repository<unknown>,
  userData: UserData,
  salary?: number
): Promise<User> => {
  const {
    firstName,
    lastName,
    gender,
    email,
    phone,
    password,
    role,
    dob,
    age
  } = userData

  const checkedTeam = await teamRepository.findTeamByName(
    teamNameRelatingUserJob
  )
  console.log(checkedTeam)
  if (!checkedTeam) throw new Error('Invalid team name')
  if (!salary) salary = 0
  const newUser = userRepository.create({
    firstName,
    lastName,
    gender,
    email,
    phone,
    password,
    role,
    dob,
    age,
    job
  })

  const savedUser = await userRepository.save(newUser)

  if (job === UserJobs.COACH) {
    const newEntityRelatingUser = (
      repoRelatingUserCreation as typeof coachRepository
    ).create({
      user: savedUser,
      team: checkedTeam,
      salary
    })

    await repoRelatingUserCreation.save(newEntityRelatingUser)
  }
  if (job === UserJobs.TEAMMEMBER) {
    const newEntityRelatingUser = (
      repoRelatingUserCreation as typeof teamMemberRepository
    ).create({
      user: savedUser,
      team: checkedTeam,
      salary
    })
    await repoRelatingUserCreation.save(newEntityRelatingUser)
  }
  return savedUser
}

export const userRepository = AppDataSource.getRepository(User).extend({
  async findUsers() {
    try {
      return await userRepository.find({
        relations: {
          tokens: true,
          sessions: true,
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
          tokens: true,
          sessions: true,
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
        relations: {
          tokens: true,
          sessions: true,
          teamMembers: true,
          coach: true
        }
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
        relations: {
          tokens: true,
          sessions: true,
          teamMembers: true,
          coach: true
        }
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
        relations: {
          tokens: true,
          sessions: true,
          teamMembers: true,
          coach: true
        }
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
        relations: {
          tokens: true,
          sessions: true,
          teamMembers: true,
          coach: true
        }
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
          tokens: true,
          sessions: true,
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
  async createUser(
    firstName: string,
    lastName: string,
    gender: number,
    email: string,
    phone: string,
    password: string,
    role: number,
    dob: string,
    job?: number,
    salary?: number,
    teamNameRelatingUserJob?: string
  ) {
    let user: User
    const ageToUse = new Date().getFullYear() - parseInt(dob.split('-')[0])

    if (teamNameRelatingUserJob) {
      if (job === UserJobs.COACH)
        user = await createJobUser(
          job,
          teamNameRelatingUserJob,
          coachRepository,
          {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            email: email,
            phone: phone,
            password: password,
            role: role,
            dob: dob,
            age: ageToUse
          }
        )
      if (job === UserJobs.TEAMMEMBER) {
        user = await createJobUser(
          job,
          teamNameRelatingUserJob,
          teamMemberRepository,
          {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            email: email,
            phone: phone,
            password: password,
            role: role,
            dob: dob,
            age: ageToUse
          }
        )
      }
    } else {
      user = userRepository.create({
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
    }
    user = await userRepository.save(user)
    return user
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
