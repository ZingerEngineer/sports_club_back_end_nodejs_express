import { AppDataSource } from '../services/data-source'
import { User } from '../entities/User'
import { IsDeleted } from '../enums/globalEnums'
import { coachRepository } from './coach.repository'
import { teamRepository } from './team.repository'
import { teamMemberRepository } from './teamMember.repository'
import { UserJobs, UserEmailVerificationState } from '../enums/user.enums'
import { EntityManager, Repository } from 'typeorm'
import { getUserAge } from '../utils/getUserAge'
import { DatabaseError } from '../classes/Errors'

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
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      throw new DatabaseError('Find users failed.')
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
      throw new DatabaseError('Find user by id failed.')
    }
  },

  async findUsersByFirstName(firstName: string) {
    try {
      return await userRepository.find({
        where: { firstName: firstName },
        relations: {
          tokens: true,
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.trace(error)
    }
  },
  async findUserByEmail(email: string) {
    try {
      return await userRepository.findOne({
        where: { email },
        relations: {
          tokens: true,
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.trace(error)
    }
  },

  async findUserByPhone(phone: string) {
    try {
      return await userRepository.findOne({
        where: { phone },
        relations: {
          tokens: true,
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.trace(error)
    }
  },

  async findUsersByLastName(lastName: string) {
    try {
      return await userRepository.find({
        where: { lastName: lastName },
        relations: {
          tokens: true,
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.trace(error)
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
          teamMembers: true,
          coach: true
        }
      })
    } catch (error) {
      console.trace(error)
    }
  },
  async softDeleteUserById(id: number) {
    try {
      const user = await userRepository.find({
        where: { userId: id }
      })
      if (!user) throw new Error("User doesn't exist")
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
      console.trace(error)
    }
  },

  async hardDeleteUserById(id: number) {
    try {
      const user = await userRepository.find({
        where: { userId: id }
      })
      if (!user) throw new Error("User doesn't exist")
      return await userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('user.userId = :checkedId', { checkedId: id })
        .execute()
    } catch (error) {
      console.trace(error)
    }
  },
  async makeUserEmailVertified(userId: string, userEmail: string) {
    userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({
        emailVerified: UserEmailVerificationState.VERIFIED,
        emailVerifiedAt: () => 'GETUTCDATE()'
      })
      .where('user.userEmail = :userEmail', { userEmail })
      .andWhere('user.userId = :userId', { userId })
      .execute()
  }
})
