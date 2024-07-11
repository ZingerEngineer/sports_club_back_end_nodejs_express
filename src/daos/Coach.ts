import { coachRepository } from '../repositories/Coach.repository'

export class CoachDaos {
  async findAllCoaches() {
    return await coachRepository.coaches()
  }

  async findCoachById(id: number | string) {
    return await coachRepository.findCoachById(id)
  }

  async findCoachByFirstName(firstName: string) {
    return await coachRepository.findCoachByFirstName(firstName)
  }

  async findCoachByLastName(lastName: string) {
    return await coachRepository.findCoachByLastName(lastName)
  }

  async findCoachByName(firstName: string, lastName: string) {
    return await coachRepository.findCoachByName(firstName, lastName)
  }

  async findCoachByTeamId(teamId: string | number) {
    return await coachRepository.findCoachByTeamId(teamId)
  }

  async findCoachByTeamName(teamName: string) {
    return await coachRepository.findCoachByTeamName(teamName)
  }
}
