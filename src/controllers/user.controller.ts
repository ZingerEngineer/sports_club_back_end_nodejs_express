import { userRepository } from '../repositories/user.repository'
import { User, UserJobs, UserRoles } from '../entities/User'
import { checkIdValidity } from '../utils/checkIdValidity'
import { IsDeleted } from '../enums/globalEnums'
import { validateName } from '../utils/validateName'
import { validateDate } from '../utils/validateDate'
import { coachRepository } from '../repositories/Coach.repository'

export class UserController {
  async users(isDeleted: null | number) {
    let users: User[] = []
    if (isDeleted !== IsDeleted.NULL) {
      users = await userRepository.find({
        where: {
          is_deleted: isDeleted
        },
        relations: {
          Team_member: true,
          coach: true
        }
      })
    }
    users = await userRepository.find({
      relations: {
        Team_member: true,
        coach: true
      }
    })
    if (users.length === 0) return 0
    return users
  }

  async findUserById(id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    const user = await userRepository.find({
      where: { user_id: checkedId },
      relations: { Team_member: true, coach: true }
    })
    if (!user) return 0
    return user
  }

  async findAdminById(role: string, id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    if (null === role || undefined === role || role !== UserRoles.ADMIN)
      return 0
    const user = await userRepository.findOne({
      where: {
        user_id: checkedId,
        role: UserRoles.ADMIN
      },
      relations: {
        Team_member: true,
        coach: true
      }
    })
    if (!user) return 0
    return user
  }

  async findEditorById(role: string, id: number | string) {
    const checkRes = checkIdValidity(id)
    if (checkRes === 0) return 0
    const checkedId = checkRes.id
    if (null === role || undefined === role || role !== UserRoles.EDITOR)
      return 0
    const user = await userRepository.findOne({
      where: {
        user_id: checkedId,
        role: UserRoles.EDITOR
      },
      relations: { Team_member: true, coach: true }
    })
    if (!user) return 0
    return user
  }

  //Finding users with names.
  async findUsersByFirstName(first_name: string) {
    let users: User[] = []
    if (null === first_name || undefined === first_name) return 0
    users = await userRepository.find({
      where: { first_name: first_name },
      relations: { Team_member: true, coach: true }
    })
    if (users.length === 0) return 0
    return users
  }

  async findUsersByLastName(last_name: string) {
    let users: User[] = []
    if (null === last_name || undefined === last_name) return 0
    users = await userRepository.find({
      where: { last_name: last_name },
      relations: { Team_member: true, coach: true }
    })
    if (users.length === 0) return 0
    return users
  }
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
        Team_member: true,
        coach: true
      }
    })
    if (users.length === 0) return 0
    return users
  }
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
  }

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
  }
  async createUser(
    first_name: string,
    last_name: string,
    role: string,
    dob: string,
    job: string
  ) {
    let firstName = ''
    let lastName = ''
    let roleToUse = ''
    let dobToUse = ''
    let jobToUse = ''
    let ageToUse = 0
    if (typeof first_name !== 'string' || (!first_name && first_name !== ''))
      return 0
    if (first_name !== '') {
      if (!validateName(first_name)) return 0
      firstName = first_name
    }

    if (typeof last_name !== 'string' || (!last_name && last_name !== ''))
      return 0
    if (last_name !== '') {
      if (!validateName(last_name)) return 0
      lastName = last_name
    }
    if (typeof role !== 'string' || (!role && role !== '')) return 0
    if (role !== '') {
      if (!(role in UserRoles)) return 0
      roleToUse = role
    }
    if (typeof dob !== 'string' || (!dob && dob !== '')) return 0
    if (dob !== '') {
      if (!validateDate(dob)) return 0
      dobToUse = dob
      ageToUse = new Date().getFullYear() - parseInt(dob.split('-')[0])
    }
    if (typeof job !== 'string' || (!job && job !== '')) return 0
    if (job !== '') {
      if (!(job in UserJobs)) return 0
      jobToUse = job
    }
    const newUser = userRepository.create({
      first_name: firstName,
      last_name: lastName,
      role: roleToUse,
      dob: dobToUse,
      age: ageToUse,
      job: jobToUse,
      is_deleted: IsDeleted.EXISTS
    })
    if(job === UserJobs.COACH){
      coachRepository.
     let newUserId = newUser.user_id
     await userRepository.createQueryBuilder('user').relation(User,'coach_user').of(newUser.user_id).add()
    }
  }
}
