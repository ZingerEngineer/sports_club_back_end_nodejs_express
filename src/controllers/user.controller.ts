import { userRepository } from '../repositories/user.repository'
import { UserRoles } from '../entities/User'
import { checkIdValidity } from '../utils/checkIdValidity'

export class UserController {
  //Find all users.
  async users() {
    return userRepository.find()
  }
  //Finding users by ID.

  async findUserById(id: number | string) {
    const checkedId = checkIdValidity(id)
    if (checkedId) {
      return userRepository.findOneBy({ user_id: checkedId })
    }
  }

  async findAdminById(role: string, id: number | string) {
    const checkedId = checkIdValidity(id)
    if (checkedId) {
      if (null === role || undefined === role || role !== UserRoles.ADMIN)
        return 0
      return userRepository.findOneBy({
        user_id: checkedId,
        role: role
      })
    }
  }

  async findEditorById(role: string, id: number | string) {
    const checkedId = checkIdValidity(id)
    if (checkedId) {
      if (null === role || undefined === role || role !== UserRoles.EDITOR)
        return 0
      return userRepository.findOneBy({
        user_id: checkedId,
        role: role
      })
    }
  }

  //Finding users with names.
  async findUsersByFirstName(first_name: string) {
    if (null === first_name || undefined === first_name) return 0
    return userRepository.findOneBy({ first_name: first_name })
  }

  async findUsersByLastName(last_name: string) {
    if (null === last_name || undefined === last_name) return 0
    return userRepository.findOneBy({ last_name: last_name })
  }
  async findUsersByFullName(first_name: string, last_name: string) {
    if (
      null === first_name ||
      undefined === first_name ||
      null === last_name ||
      undefined === last_name
    )
      return 0
    return userRepository.findOneBy({
      first_name: first_name,
      last_name: last_name
    })
  }
}