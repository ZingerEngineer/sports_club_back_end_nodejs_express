import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

export const saveNewUser = async () => {
  const userRepository = AppDataSource.getRepository(User)
  const user = new User()
  user.first_name = 'Ahmed'
  user.last_name = 'Ali'
  user.dob = '2002/05/12'
  await userRepository.save(user)
}
